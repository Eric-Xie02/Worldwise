import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import PageNav from "../components/PageNav";
import { useAuth } from "../contexts/FakeAuthContext";
import Button from "../components/Button";
import { NavLink, useNavigate } from "react-router-dom";
import { useSignup } from "../hooks/useSignup";

export default function Signup() {
  // PRE-FILL FOR DEV PURPOSES
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const {
    signup,
    isLoading: isLoadingSignup,
    error: signupError,
  } = useSignup();

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    signup({ email, password, fullName });
  }

  return (
    <main className={styles.login}>
      <PageNav />

      <form className={styles.form}>
        <div className={styles.row}>
          <label>Full Name</label>
          <input
            type="fullame"
            id="fullName"
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
          />
        </div>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="passwordRepeat">Confirm Your Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPasswordRepeat(e.target.value)}
            value={passwordRepeat}
          />
        </div>

        <div>
          <Button
            type="primary"
            onClick={handleSubmit}
            disable={isLoadingSignup}
          >
            Register
          </Button>
        </div>
      </form>
    </main>
  );
}
