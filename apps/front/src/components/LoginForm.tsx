import { ChangeEvent, FormEvent, useState } from "react";
import "../style/login.css";
import { useAuth } from "./AuthContext";
import jobBoardLogo2 from "../assets/images/jobboard-logo-2.png";

interface LoginFormProps {
  setState: (state: boolean) => void;
}

export const LoginForm = ({ setState }: LoginFormProps) => {
  const { refreshAuth } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const login_route = "/api/users/login";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(login_route, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      setFormData({ email: "", password: "" });
      setState(false);
      await refreshAuth();
    } catch (error) {
      console.error("Request error:", error);
    }
  };

  return (
    <div className="popup login-form">
      <div className="popup-content">
        <h2>Hi &#128075; nice to see you again!</h2>
        <button
          className="close-btn"
          type="button"
          onClick={() => setState(false)}
        >
          X
        </button>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email"></label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Entrez votre email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password"></label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Entrez votre mot de passe"
            />
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn-login">
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
