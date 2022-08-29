import { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { AiOutlineDelete } from "react-icons/ai";
import WorkoutForm from "../components/ContactForm";
import { userProps } from "../App";
import { useImmer, Updater } from "use-immer";
import { useNavigate } from "react-router-dom";

interface HomeProps {
  user: userProps | null;
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
  const { user } = props;
  const [contacts, setContacts] = useImmer<contactProps[] | null>(null);

  const navigate = useNavigate();

  console.log(contacts);
  useEffect(() => {
    async function fetchContacts() {
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
    }
    if (user) {
      fetchContacts();
    }
  }, [setContacts, user]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <div className="home">
      <div className="home__workouts">
        {contacts?.map((v: contactProps) => (
          <WorkoutDetails
            key={v._id}
            workout={v}
            user={user}
            setContacts={setContacts}
          />
        ))}
      </div>
      <WorkoutForm user={user} setContacts={setContacts} />
    </div>
  );
}

export default Home;

interface wdP {
  workout: contactProps;
  user: userProps | null;
  setContacts: Updater<contactProps[] | null>;
}

function WorkoutDetails(props: wdP) {
  const { workout, user, setContacts } = props;

  async function handleClick() {
    const res = await fetch(
      `${process.env.REACT_APP_ADDRESS}api/contacts/${workout._id}`,
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
  }

  return (
    <div className="wd">
      <h4> {workout.name}</h4>
      <p>
        <strong>Second Name:</strong> {workout.second_name}
      </p>
      <p>
        <strong>Email:</strong> {workout.email}
      </p>
      <p>
        {formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}
      </p>
      <span onClick={() => handleClick()}>
        <AiOutlineDelete color="#06815e" />
      </span>
    </div>
  );
}
