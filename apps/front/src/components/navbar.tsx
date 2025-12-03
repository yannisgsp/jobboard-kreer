import React, { useEffect, useState } from "react";
import jobBoardLogo from "../assets/images/jobboard-logo.png";
import jobBoardLogo2 from "../assets/images/jobboard-logo-2.png";
import "../style/navbar.css";
import { useNavigate } from "react-router-dom";
import profile from "../assets/images/user.png";

import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { useAuth } from "./AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, user, refreshAuth } = useAuth();
  const navigate = useNavigate();
  const [isLoginOpen, setLoginIsOpen] = useState(false);
  const [isRegisterIsOpen, setRegisterIsOpen] = useState(false);

  const logout = async () => {
    try {
      const response = await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      await refreshAuth();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img
          src={jobBoardLogo2}
          className="logo-jobboard"
          alt="logo jobboard"
        />
      </div>
      <ul className="navbar-links">
        <li>
          <a href="/">Jobs</a>
        </li>
        <li>
          <a href="/companies">Entreprises</a>
        </li>
        {isLoggedIn && user?.role === "admin" && (
          <li>
            <a href="/admin">Dashboard</a>
          </li>
        )}
      </ul>
      <div className="navbar-button-div">
        {isLoggedIn ? (
          <>
            <a
              href={
                user?.role === "admin"
                  ? "/admin"
                  : user?.role === "company"
                    ? "/company/profile"
                    : "/profile"
              }
            >
              <img src={profile} alt="" className="profil" />
            </a>
            <button className="logout-button" onClick={() => logout()}>
              Log out
            </button>
          </>
        ) : (
          <>
            <button
              className="login-button"
              onClick={() => setLoginIsOpen(true)}
            >
              Log in
            </button>
            <button
              className="logout-button"
              onClick={() => setRegisterIsOpen(true)}
            >
              Register
            </button>
          </>
        )}
        {isLoginOpen && !isRegisterIsOpen ? (
          <LoginForm setState={setLoginIsOpen} />
        ) : null}

        {!isLoginOpen && isRegisterIsOpen ? (
          <RegisterForm setState={setRegisterIsOpen} />
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
