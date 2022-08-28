import { Link } from "react-router-dom";
import { actionProps, userProps } from "../App";
interface NavbarProps {
  user: userProps | null;
  dispatch: React.Dispatch<actionProps>;
}

function Navbar(props: NavbarProps) {
  const { user, dispatch } = props;

  function handleClick() {
    localStorage.removeItem("user");
    dispatch({ type: "logout", payload: null });
  }
  return (
    <div className="header">
      <div className="header__container">
        <Link to="/">
          <h1>Workout Body</h1>
        </Link>
        <nav>
          {user ? (
            <div>
              <span>{user?.email}</span>
              <button onClick={handleClick}>Log out</button>
            </div>
          ) : (
            <div>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
