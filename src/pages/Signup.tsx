import { useEffect, useState } from "react";
import { actionProps, userProps } from "../App";
import { useNavigate } from "react-router-dom";

interface SignupProps {
  dispatch: React.Dispatch<actionProps>;
  user: userProps | null;
}

function Signup(props: SignupProps) {
  const { dispatch, user } = props;
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean | null>(null);

  const navigate = useNavigate();

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    async function signup(email: string, password: string) {
      setIsLoading(true);
      setError(null);
      const res = await fetch(
        `${process.env.REACT_APP_ADDRESS}api/user/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );
      const json = await res.json();
      if (!res.ok) {
        setIsLoading(false);
        setError(json.error);
      }

      if (res.ok) {
        // save the user to local storage
        localStorage.setItem("user", JSON.stringify(json));
        // update auth context
        dispatch({ type: "login", payload: json });
        setIsLoading(false);
      }
    }
    signup(form.email, form.password);
  }
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Sign Up</h3>
      <label>Email:</label>
      <input
        type="email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        value={form.email}
      />
      <label>Password:</label>
      <input
        type="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        value={form.password}
      />
      <button disabled={!!isLoading}>SignUp</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}

export default Signup;
