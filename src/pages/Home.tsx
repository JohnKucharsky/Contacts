import { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { AiOutlineDelete } from "react-icons/ai";
import WorkoutForm from "../components/WorkoutForm";
import { userProps } from "../App";
import { useImmer, Updater } from "use-immer";
import { useNavigate } from "react-router-dom";

interface HomeProps {
  user: userProps | null;
}

export interface workoutProps {
  _id: string;
  title: string;
  reps: number;
  load: number;
  user_id: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

function Home(props: HomeProps) {
  const { user } = props;
  const [workouts, setWorkouts] = useImmer<workoutProps[] | null>(null);

  const navigate = useNavigate();

  console.log(workouts);
  useEffect(() => {
    async function fetchWorkouts() {
      const response = await fetch(
        `${process.env.REACT_APP_ADDRESS}api/workouts`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        },
      );
      const json = await response.json();

      if (response.ok) {
        setWorkouts(json);
      }
    }
    if (user) {
      fetchWorkouts();
    }
  }, [setWorkouts, user]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <div className="home">
      <div className="home__workouts">
        {workouts?.map((v: workoutProps) => (
          <WorkoutDetails
            key={v._id}
            workout={v}
            user={user}
            setWorkouts={setWorkouts}
          />
        ))}
      </div>
      <WorkoutForm user={user} setWorkouts={setWorkouts} />
    </div>
  );
}

export default Home;

interface wdP {
  workout: workoutProps;
  user: userProps | null;
  setWorkouts: Updater<workoutProps[] | null>;
}

function WorkoutDetails(props: wdP) {
  const { workout, user, setWorkouts } = props;

  async function handleClick() {
    const res = await fetch(
      `${process.env.REACT_APP_ADDRESS}api/workouts/${workout._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      },
    );
    const json = await res.json();
    if (res.ok) {
      setWorkouts((draft) => {
        return draft?.filter((v) => v._id !== json._id);
      });
    }
  }

  return (
    <div className="wd">
      <h4> {workout.title}</h4>
      <p>
        <strong>Load(kg):</strong> {workout.load}
      </p>
      <p>
        <strong>Reps:</strong> {workout.reps}
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
