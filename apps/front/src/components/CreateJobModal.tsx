import React, { useState, ChangeEvent, FormEvent } from "react";

type Job = {
  title: string;
  description: string;
  salary: number | "";
  location: string;
  remote: string;
  skills: string[];
  contract: string[];
  company_id: number | "";
};

type CreateJobModalProps = {
  onClose: () => void;
  onCreate: (newJob: Job) => void;
};

const CreateJobModal: React.FC<CreateJobModalProps> = ({
  onClose,
  onCreate,
}) => {
  const [formData, setFormData] = useState<Job>({
    title: "",
    description: "",
    salary: "",
    location: "",
    remote: "Présentiel",
    skills: [],
    contract: [],
    company_id: "",
  });

  // ✅ gestion générique des champs simples
  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) || "" : value,
    }));
  }

  // ✅ gestion des <select multiple>
  function handleMultiSelectChange(e: ChangeEvent<HTMLSelectElement>) {
    const { name, selectedOptions } = e.target;
    const values = Array.from(selectedOptions, (opt) => opt.value);

    setFormData((prev) => ({
      ...prev,
      [name]: values,
    }));
  }

  // ✅ soumission du formulaire
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Erreur lors de la création du job");
        return;
      }

      onCreate(data);
      onClose();
    } catch (err) {
      console.error("Erreur:", err);
      alert("Une erreur est survenue.");
    }
  }

  return (
    <div className="popup">
      <div className="popup-content">
        <h3>Créer une offre d’emploi</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Titre</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Salaire (€)</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Lieu</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
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

          <div className="form-group">
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

          <div className="form-group">
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

          <div className="form-buttons">
            <button type="submit">Créer</button>
            <button type="button" onClick={onClose}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobModal;
