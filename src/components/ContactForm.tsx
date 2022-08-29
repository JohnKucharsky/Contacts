import { useState } from "react";
import { useImmer, Updater } from "use-immer";
import { userProps } from "../App";
import { contactProps } from "../pages/Home";
interface ContactFormProps {
  setContacts: Updater<contactProps[] | null>;
  user: userProps | null;
}

function ContactForm(props: ContactFormProps) {
  const { setContacts, user } = props;
  const [form, setForm] = useImmer({
    name: "",
    second_name: "",
    email: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [emptyFields, setEmptyFields] = useState<string[]>([]);

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
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
      console.log(json);
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
  }
  return (
    <form className="wf" onSubmit={handleSubmit}>
      <h3>Add a New contact</h3>
      <label>Name:</label>
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
      <label>Second Name:</label>
      <input
        type="number"
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
        type="number"
        value={form.email}
        onChange={(e) =>
          setForm((draft) => {
            draft.email = e.target.value;
          })
        }
        className={emptyFields?.includes("email") ? "error" : ""}
      />
      <button type="submit">Add Contact</button>
      {error && <div className="wf__error">{error}</div>}
    </form>
  );
}

export default ContactForm;
