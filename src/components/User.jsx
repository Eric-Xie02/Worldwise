import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuthContext";
import styles from "./User.module.css";
import { useUser } from "../hooks/useUser";
import { useLogout } from "../hooks/useLogout";

function User() {
  const { user, isLoading: isLoadingUser } = useUser();
  const { logout, isLoading: isLoggingOut } = useLogout();
  const navigate = useNavigate();
  const name = user?.user_metadata.fullName;

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className={styles.user}>
      {/* <img src={user?.avatar} alt={name} /> */}
      <span>Welcome, {name}</span>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default User;

/*
CHALLENGE

1) Add `AuthProvider` to `App.jsx` DONE
2) In the `Login.jsx` page, call `login()` from context
3) Inside an effect, check whether `isAuthenticated === true`. If so, programatically navigate to `/app`
4) In `User.js`, read and display logged in user from context (`user` object). Then include this component in `AppLayout.js`
5) Handle logout button by calling `logout()` and navigating back to `/`
*/
