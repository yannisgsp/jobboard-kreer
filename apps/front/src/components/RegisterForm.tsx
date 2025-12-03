import { ChangeEvent, FormEvent, useState } from "react";
import "../style/login.css";
import jobBoardLogo2 from "../assets/images/jobboard-logo-2.png";

interface RegisterFormProps {
  setState: (state: boolean) => void;
}

export const RegisterForm = ({ setState }: RegisterFormProps) => {
  // const {refreshAuth} = useAuth()
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const register_route = "/api/users/register";

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
      const response = await fetch(register_route, {
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

      setFormData({ firstname: "", lastname: "", email: "", password: "" });
      setState(false);
      // await refreshAuth()
    } catch (error) {
      console.error("Request error:", error);
    }
  };

  return (
    <div className="popup login-form">
      <div className="popup-content">
        <h2>Welcome! &#127881;</h2>
        <button
          className="close-btn"
          type="button"
          onClick={() => setState(false)}
        >
          X
        </button>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstname"></label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
              placeholder="Enter your firstname"
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastname"></label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
              placeholder="Enter your lastname"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email"></label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
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
              placeholder="Enter your password"
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
