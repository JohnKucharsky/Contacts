import { SyntheticEvent, useEffect, useState } from "react";
import { useImmer, Updater } from "use-immer";
import { userProps } from "../App";
import { contactProps } from "../pages/Home";
interface ContactFormProps {
  setContacts: Updater<contactProps[] | null>;
  user: userProps | null;
  editMod: boolean;
  contacts: contactProps[] | null;
  id: string;
  setEditMod: React.Dispatch<React.SetStateAction<boolean>>;
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
}

function ContactForm(props: ContactFormProps) {
  const { setContacts, user, editMod, setEditMod, contacts, id, setTrigger } =
    props;
  const [form, setForm] = useImmer({
    name: "",
    second_name: "",
    email: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [emptyFields, setEmptyFields] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmitCreate(e: SyntheticEvent) {
    e.preventDefault();
    setLoading(true);
    if (!user) {
      setError("You must be logged in");
      return;
    }
    const response = await fetch(
      `${process.env.REACT_APP_ADDRESS}api/contacts`,
      {
        method: "POST",
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      },
    );
    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setError(null);
      setContacts((draft) => {
        draft?.unshift(json);
      });
      setEmptyFields([]);
    }
    setForm({
      name: "",
      second_name: "",
      email: "",
    });
    setLoading(false);
  }

  useEffect(() => {
    const contact = contacts?.filter((v) => v._id === id)[0];
    if (!contact) return;
    if (editMod) {
      setForm({
        name: contact?.name,
        second_name: contact.second_name,
        email: contact.email,
      });
    } else {
      setForm({
        name: "",
        second_name: "",
        email: "",
      });
    }
  }, [contacts, editMod, id, setForm]);

  async function handleSubmitEdit(e: SyntheticEvent) {
    e.preventDefault();
    setLoading(true);
    const contact = contacts?.filter((v) => v._id === id)[0];
    if (!contact) return;
    if (!user) {
      setError("You must be logged in");
      return;
    }
    const response = await fetch(
      `${process.env.REACT_APP_ADDRESS}api/contacts/${contact._id}`,
      {
        method: "PATCH",
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      },
    );
    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setError(null);
      console.log(json);
      setContacts((draft) => {
        const exist = draft?.filter((v) => v._id === json._id);
        if (exist) {
          draft = { ...json };
        }
      });
      setEmptyFields([]);
    }

    setEditMod(false);
    setLoading(false);
  }
  return (
    <form
      className="wf"
      onSubmit={editMod ? handleSubmitEdit : handleSubmitCreate}>
      <h3>{editMod ? "Изменить" : "Добавить"} Контакт</h3>
      <label>Имя:</label>
      <input
        type="text"
        value={form.name}
        onChange={(e) =>
          setForm((draft) => {
            draft.name = e.target.value;
          })
        }
        className={emptyFields?.includes("name") ? "error" : ""}
      />
      <label>Фамилия:</label>
      <input
        type="text"
        value={form.second_name}
        onChange={(e) =>
          setForm((draft) => {
            draft.second_name = e.target.value;
          })
        }
        className={emptyFields?.includes("second_name") ? "error" : ""}
      />
      <label>Email:</label>
      <input
        type="email"
        value={form.email}
        onChange={(e) =>
          setForm((draft) => {
            draft.email = e.target.value;
          })
        }
        className={emptyFields?.includes("email") ? "error" : ""}
      />
      {loading ? (
        "Ждем..."
      ) : (
        <button type="submit">{editMod ? "Изменить" : "Добавить"}</button>
      )}
      {error && <div className="wf__error">{error}</div>}
    </form>
  );
}

export default ContactForm;
