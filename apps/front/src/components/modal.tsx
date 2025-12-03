// Modal.tsx
import React, { useState } from "react";
import "../style/modal.css";

type TableRow = Record<string, any>;
type TableName = "users" | "jobs" | "companies";

type ModalProps = {
  row: TableRow;
  tableName: TableName;
  onClose: () => void;
  onUpdate: (updatedRow: TableRow) => void;
};

const UpdateModal: React.FC<ModalProps> = ({
  row,
  tableName,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({ ...row });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const idKey = Object.values(row)[0];
      const res = await fetch(`/api/${tableName}/${idKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Erreur API");
      const updatedRow = await res.json();
      onUpdate(updatedRow);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-modal">
        <h3>Modifier {tableName.slice(0, -1)}</h3>
        <form onSubmit={handleUpdate}>
          {Object.keys(formData).map(
            (key) =>
              !key.includes("id") &&
              !key.includes("created") &&
              !key.includes("updated") && (
                <div key={key}>
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
          <button type="submit">Enregistrer</button>
          <button type="button" onClick={onClose}>
            Annuler
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;
