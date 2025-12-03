import React, { useState } from "react";
import "../style/createModal.css";

type TableRow = Record<string, any>;
type TableName = "users" | "jobs" | "companies";

type ModalProps = {
  onClose: () => void;
  onCreate: (newRow: TableRow) => void;
};

const CreateUserModal: React.FC<ModalProps> = ({ onClose, onCreate }) => {
  const initialData = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    description: "",
    avatar: "",
  };

  const [formData, setFormData] = useState<TableRow>(initialData);

  const createRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const newRow = await res.json();

      if (!res.ok) {
        // Si le serveur renvoie une erreur (404, 500, etc.)
        alert(newRow.message);
        return; // ⚠️ stoppe l'exécution ici
      }

      onCreate(newRow); // Pour mettre à jour la table côté front
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h3>Ajouter un utilisateur</h3>
        <form onSubmit={createRecord}>
          {Object.keys(formData).map(
            (key) =>
              !key.includes("id") && (
                <div className="form-group" key={key}>
                  <label>{key}</label>
                  <input
                    value={formData[key] ?? ""}
                    onChange={(e) =>
                      setFormData(function (prev) {
                        const copy = { ...prev };
                        copy[key] = e.target.value;
                        return copy;
                      })
                    }
                  />
                </div>
              ),
          )}
          <div className="form-buttons">
            <button type="submit">Enregistrer</button>
            <button type="button" onClick={onClose}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
