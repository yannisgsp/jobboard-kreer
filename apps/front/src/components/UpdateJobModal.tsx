import React, { useState, ChangeEvent, FormEvent } from "react";

type TableRow = Record<string, any>;
type TableName = "users" | "jobs" | "companies";

type ModalProps = {
  row: TableRow;
  tableName: TableName;
  onClose: () => void;
  onUpdate: (updatedRow: TableRow) => void;
};

const UpdateJobModal: React.FC<ModalProps> = ({
  row,
  tableName,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({ ...row });

  function handleMultiSelectChange(e: ChangeEvent<HTMLSelectElement>) {
    const { name, selectedOptions } = e.target;
    const values = Array.from(selectedOptions, (opt) => opt.value);

    setFormData((prev) => ({
      ...prev,
      [name]: values,
    }));
  }

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) || "" : value,
    }));
  }

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
      <div className="popup">
        <h3>Modifier {tableName.slice(0, -1)}</h3>
        <form onSubmit={handleUpdate}>
          <div>
            <label>Titre</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Salaire (€)</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Lieu</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Télétravail</label>
            <select
              name="remote"
              value={formData.remote}
              onChange={handleChange}
            >
              <option value="Présentiel">Présentiel</option>
              <option value="Hybride">Hybride</option>
              <option value="Full-remote">Full-remote</option>
            </select>
          </div>

          <div>
            <label>Compétences requises</label>
            <select
              name="skills"
              multiple
              value={formData.skills}
              onChange={handleMultiSelectChange}
            >
              <option value="Python">Python</option>
              <option value="HTML">HTML</option>
              <option value="CSS">CSS</option>
              <option value="JavaScript">JavaScript</option>
              <option value="ReactJS">ReactJS</option>
              <option value="NodeJS">NodeJS</option>
              <option value="SQL">SQL</option>
              <option value="PHP">PHP</option>
            </select>
          </div>

          <div>
            <label>Type de contrat</label>
            <select
              name="contract"
              multiple
              value={formData.contract}
              onChange={handleMultiSelectChange}
            >
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
              <option value="Alternance">Alternance</option>
              <option value="Stage">Stage</option>
              <option value="Temps partiel">Temps partiel</option>
            </select>
          </div>

          <button type="submit">Enregistrer</button>
          <button type="button" onClick={onClose}>
            Annuler
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateJobModal;
