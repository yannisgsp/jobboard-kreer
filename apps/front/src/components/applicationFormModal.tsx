import React from "react";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "../style/applicationFormModal.css";
import { useAuth } from "./AuthContext";

interface applicationFormModalProps {
  jobId: number;
  onClose: () => void;
}

const ApplicationFormModal: React.FC<applicationFormModalProps> = ({
  jobId,
  onClose,
}) => {
  const { user, isLoggedIn } = useAuth();
  const [applicationMessage, setApplicationMessage] = useState("");
  const [formUser, setFormUser] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
    description: user?.description || "",
  });

  useEffect(() => {
    if (user) {
      setFormUser({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        description: user.description,
      });
    }
  }, [user]);

  const soumission = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      return;
    }

    try {
      const res = await fetch(`/api/applications/jobs/${jobId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          application_status: "postulé",
          firstname: formUser.firstname,
          lastname: formUser.lastname,
          email: formUser.email,
          description: formUser.description,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setApplicationMessage("Candidature envoyée !");
        setTimeout(onClose, 3000);
      } else {
        setApplicationMessage(
          "Il y a une erreur, échec d'envoi de la candidature.",
        );
      }
    } catch (err) {
      console.error("Erreur:", err);
      alert("Une erreur est survenue.");
    }
  };

  return (
    <div className="application-form">
      <div className="application-form-content">
        <button
          type="button"
          className="close-application-button"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <div>
          <h3 className="application-form-title">Candidater à cette offre</h3>

          <form onSubmit={soumission}>
            <div className="application-form-input-div">
              <label>First name : </label>
              <input
                type="text"
                value={formUser.firstname}
                onChange={(e) =>
                  setFormUser({ ...formUser, firstname: e.target.value })
                }
                required
              />
            </div>
            <div className="application-form-input-div">
              <label>Last name : </label>
              <input
                type="text"
                value={formUser.lastname}
                onChange={(e) =>
                  setFormUser({ ...formUser, lastname: e.target.value })
                }
                required
              />
            </div>
            <div className="application-form-input-div">
              <label>Email : </label>
              <input
                type="text"
                value={formUser.email}
                onChange={(e) =>
                  setFormUser({ ...formUser, email: e.target.value })
                }
                required
              />
            </div>
            <div className="application-form-input-div">
              <label>Description : </label>
              <input
                type="text"
                value={formUser.description}
                onChange={(e) =>
                  setFormUser({ ...formUser, description: e.target.value })
                }
                required
              />
            </div>
            <div className="application-form-input-div">
              <button className="submit-button" type="submit">
                Apply
              </button>
            </div>
          </form>
          {applicationMessage && (
            <p className="application-return-message">{applicationMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationFormModal;
