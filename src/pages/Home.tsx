import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { AiOutlineDelete } from "react-icons/ai";
import ContactForm from "../components/ContactForm";
import { userProps } from "../App";
import { useImmer, Updater } from "use-immer";
import { useNavigate } from "react-router-dom";
import { RiPencilLine } from "react-icons/ri";
import { ru } from "date-fns/esm/locale";
import { ImSpinner } from "react-icons/im";

interface HomeProps {
  user: userProps | null;
  inputTerm: string;
}

export interface contactProps {
  _id: string;
  name: string;
  second_name: string;
  email: string;
  user_id: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

function Home(props: HomeProps) {
  const { user, inputTerm } = props;
  const [contacts, setContacts] = useImmer<contactProps[] | null>(null);
  const [editMod, setEditMod] = useState(false);
  const [id, setId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchContacts() {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_ADDRESS}api/contacts`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        },
      );
      const json = await response.json();

      if (response.ok) {
        setContacts(json);
      }
      setIsLoading(false);
    }
    if (user) {
      fetchContacts();
    }
  }, [setContacts, user, editMod]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [navigate, user]);

  const filteredContacts = contacts?.filter((v) => {
    if (
      v.email.includes(inputTerm) ||
      v.name.includes(inputTerm) ||
      v.second_name.includes(inputTerm)
    ) {
      return v;
    }
    return null;
  });

  if (isLoading) return <div>Ждем...</div>;
  return (
    <div className="home">
      <div className="home__contacts">
        {filteredContacts?.map((v: contactProps) => (
          <ContactDetails
            key={v._id}
            contact={v}
            user={user}
            setContacts={setContacts}
            setEditMod={setEditMod}
            setId={setId}
          />
        ))}
      </div>
      <ContactForm
        user={user}
        setContacts={setContacts}
        contacts={contacts}
        editMod={editMod}
        setEditMod={setEditMod}
        id={id}
      />
    </div>
  );
}

export default Home;

interface ContactDetailsProps {
  contact: contactProps;
  user: userProps | null;
  setContacts: Updater<contactProps[] | null>;
  setEditMod: React.Dispatch<React.SetStateAction<boolean>>;
  setId: React.Dispatch<React.SetStateAction<string>>;
}

function ContactDetails(props: ContactDetailsProps) {
  const { contact, user, setContacts, setEditMod, setId } = props;
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    const res = await fetch(
      `${process.env.REACT_APP_ADDRESS}api/contacts/${contact._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      },
    );
    const json = await res.json();
    if (res.ok) {
      setContacts((draft) => {
        return draft?.filter((v) => v._id !== json._id);
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="wd">
      <div className="wd__item">
        <h5 className="terms__strong">Имя:</h5>
        {contact.name}
      </div>
      <div className="wd__item">
        <h5 className="terms__strong">Фамилия:</h5>
        {contact.second_name}
      </div>
      <div className="wd__item">
        <h5 className="terms__strong">Email:</h5>
        {contact.email}
      </div>
      <p>
        Добавлен{" "}
        {formatDistanceToNow(new Date(contact.createdAt), {
          addSuffix: true,
          locale: ru,
        })}
      </p>
      <span onClick={() => handleClick()}>
        {isLoading ? <ImSpinner /> : <AiOutlineDelete color="#06815e" />}
      </span>
      <span
        onClick={() => {
          setId(contact._id);
          setEditMod(true);
        }}>
        <RiPencilLine color="#06815e" />
      </span>
    </div>
  );
}
