import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useEffect, useReducer, useState } from "react";

interface initStateProps {
  user: userProps | null;
}
export interface actionProps {
  type: "login" | "logout";
  payload: userProps | null;
}

export interface userProps {
  email: string;
  token: string;
}
function App() {
  const [inputTerm, setInputTerm] = useState("");
  const initialState = {
    user: null,
  };

  function authReducer(state: initStateProps, action: actionProps) {
    switch (action.type) {
      case "login":
        return {
          user: action.payload,
        };
      case "logout":
        return {
          user: null,
        };
      default:
        return state;
    }
  }
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    let user = null;
    const storage = localStorage.getItem("user");
    if (storage) {
      user = JSON.parse(localStorage.getItem("user") || "{}");
    }

    if (user) {
      dispatch({ type: "login", payload: user });
    }
  }, []);

  return (
    <div className="app">
      <Navbar
        user={state.user}
        setInputTerm={setInputTerm}
        dispatch={dispatch}
      />
      <div className="app__pages">
        <Routes>
          <Route
            path="/"
            element={<Home user={state.user} inputTerm={inputTerm} />}
          />
          <Route
            path="/login"
            element={<Login dispatch={dispatch} user={state.user} />}
          />
          <Route
            path="/signup"
            element={<Signup user={state.user} dispatch={dispatch} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
