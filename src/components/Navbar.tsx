import { Link } from "react-router-dom";
import { actionProps, userProps } from "../App";
interface NavbarProps {
  user: userProps | null;
  dispatch: React.Dispatch<actionProps>;
  setInputTerm: React.Dispatch<React.SetStateAction<string>>;
}

function Navbar(props: NavbarProps) {
  const { user, dispatch, setInputTerm } = props;

  function handleClick() {
    localStorage.removeItem("user");
    dispatch({ type: "logout", payload: null });
  }
  return (
    <div className="header">
      <div className="header__container">
        <Link to="/">
          <h1>Контакты</h1>
        </Link>
        <input
          style={{ width: 150 }}
          type="text"
          placeholder="Поиск..."
          onChange={(e) => setInputTerm(e.target.value)}
        />
        <nav>
          {user ? (
            <div>
              <span>{user?.email}</span>
              <button onClick={handleClick}>Выйти</button>
            </div>
          ) : (
            <div>
              <Link to="/login">Войти</Link>
              <Link to="/signup">Зарегистрироваться</Link>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
