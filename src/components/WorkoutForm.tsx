import { useState } from "react";
import { useImmer, Updater } from "use-immer";
import { userProps } from "../App";
import { workoutProps } from "../pages/Home";
interface WorkoutFormProps {
  setWorkouts: Updater<workoutProps[] | null>;
  user: userProps | null;
}

function WorkoutForm(props: WorkoutFormProps) {
  const { setWorkouts, user } = props;
  const [form, setForm] = useImmer({
    title: "",
    load: "",
    reps: "",
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
      `${process.env.REACT_APP_ADDRESS}api/workouts`,
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
      setWorkouts((draft) => {
        draft?.unshift(json);
      });
      setEmptyFields([]);
    }
    setForm({
      title: "",
      load: "",
      reps: "",
    });
  }
  return (
    <form className="wf" onSubmit={handleSubmit}>
      <h3>Add a New Workout</h3>
      <label>Excercise Title:</label>
      <input
        type="text"
        value={form.title}
        onChange={(e) =>
          setForm((draft) => {
            draft.title = e.target.value;
          })
        }
        className={emptyFields?.includes("title") ? "error" : ""}
      />
      <label>Load (in Kg):</label>
      <input
        type="number"
        value={form.load}
        onChange={(e) =>
          setForm((draft) => {
            draft.load = e.target.value;
          })
        }
        className={emptyFields?.includes("load") ? "error" : ""}
      />
      <label>Reps:</label>
      <input
        type="number"
        value={form.reps}
        onChange={(e) =>
          setForm((draft) => {
            draft.reps = e.target.value;
          })
        }
        className={emptyFields?.includes("reps") ? "error" : ""}
      />
      <button type="submit">Add Workout</button>
      {error && <div className="wf__error">{error}</div>}
    </form>
  );
}

export default WorkoutForm;
