import React, { useState, ChangeEvent, FormEvent } from "react";

type Company = {
  name: string;
  description: string;
  location: string;
};

type CreateCompanyModalProps = {
  onClose: () => void;
  onCreate: (newCompany: Company) => void;
};

const CreateCompanyModal: React.FC<CreateCompanyModalProps> = ({
  onClose,
  onCreate,
}) => {
  const [formData, setFormData] = useState<Company>({
    name: "",
    description: "",
    location: "",
  });

  // ✅ gestion générique des champs simples
  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value, type } = e.target;

    // si c'est une checkbox
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
      const res = await fetch(`/api/companies/new`, {
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
    <div className="popup-overlay">
      <div className="popup">
        <h3>Créer une offre d’emploi</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nom</label>
            <input
              type="text"
              name="name"
              value={formData.name}
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
            <label>Location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="actions">
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

export default CreateCompanyModal;
