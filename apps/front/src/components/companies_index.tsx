import React from "react";
import { useState, useEffect } from "react";
// import { Blob } from "buffer";
import "../style/companies_index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

type size =
  | "[0 - 50 pers.]"
  | "[50 - 250 pers.]"
  | "[250 - 500 pers.]"
  | "[500 - 1000 pers.]"
  | "[1000 - 2500 pers.]"
  | "[+2000 pers.]";
type secteur =
  | "Technologie"
  | "Santé"
  | "Énergie"
  | "Finance"
  | "Immobilier"
  | "Transport"
  | "Tourisme"
  | "Éducation"
  | "Commerce de détail"
  | "Développement logiciel"
  | "Informatique"
  | "IA";

type Company = {
  company_id?: number;
  name: string;
  description: string;
  location: string;
  size: size;
  secteur: secteur;
  logo: string;
};

interface CompaniesIndexProps {
  requete: string;
}

const Companies_index: React.FC<CompaniesIndexProps> = ({ requete }) => {
  const [sizeFiltres, setSizeFiltres] = useState<size[]>([]);
  const [secteurFiltres, setSecteurFiltres] = useState<secteur[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    fetch("/api/companies")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCompanies(data);
      });
  }, []);

  const [isExtendedCompanyId, setExtendedCompanyId] = useState<number | null>(
    null,
  );
  const extendedCompanyId = (jobId: number) => {
    setExtendedCompanyId(isExtendedCompanyId === jobId ? -1 : jobId);
  };

  const filterSize = (size: size) => {
    setSizeFiltres((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const filterSecteur = (secteur: secteur) => {
    setSecteurFiltres((prev) =>
      prev.includes(secteur)
        ? prev.filter((se) => se !== secteur)
        : [...prev, secteur],
    );
  };

  const companiesFiltres = companies.filter((company) => {
    const matchSize =
      sizeFiltres.length === 0 || sizeFiltres.includes(company.size);
    const matchSecteur =
      secteurFiltres.length === 0 || secteurFiltres.includes(company.secteur);

    const matchRequete =
      requete === "" ||
      company.secteur.toLowerCase().includes(requete.toLowerCase()) ||
      company.name.toLowerCase().includes(requete.toLowerCase()) ||
      company.location.toLowerCase().includes(requete.toLowerCase());

    return matchRequete && matchSize && matchSecteur;
  });

  return (
    <div className="companies-index">
      <div className="search-filter">
        <h3 className="filter-title">Secteur</h3>
        <div className="filter-div">
          {[
            "Technologie",
            "Santé",
            "Énergie",
            "Finance",
            "Immobilier",
            "Transport",
            "Tourisme",
            "Éducation",
            "Commerce de détail",
            "Développement logiciel",
            "Informatique",
            "IA",
          ].map((secteur) => (
            <label className="filter-label" key={secteur}>
              <input
                className="filter-input"
                type="checkbox"
                checked={secteurFiltres.includes(secteur as secteur)}
                onChange={() => filterSecteur(secteur as secteur)}
              />
              {secteur}
            </label>
          ))}
        </div>
        <h3 className="filter-title">Size</h3>
        <div className="filter-div">
          {[
            "[0 - 50 pers.]",
            "[50 - 250 pers.]",
            "[250 - 500 pers.]",
            "[500 - 1000 pers.]",
            "[1000 - 2500 pers.]",
            "[+2000 pers.]",
          ].map((size) => (
            <label className="filter-label" key={size}>
              <input
                className="filter-input"
                type="checkbox"
                checked={sizeFiltres.includes(size as size)}
                onChange={() => filterSize(size as size)}
              />
              {size}
            </label>
          ))}
        </div>
      </div>

      <div className="companies-list">
        {companiesFiltres.length === 0 && (
          <p className="no-company-message">
            Aucune entreprise ne correspond à votre sélection.
          </p>
        )}
        {companiesFiltres.map((company) => (
          <div
            key={company.company_id}
            className={`company-card ${isExtendedCompanyId === company.company_id ? "extended" : ""}`}
          >
            <div>
              <img
                src={
                  company?.logo
                    ? company.logo.startsWith("http")
                      ? company.logo
                      : `http://localhost:3000${company.logo}`
                    : "http://localhost:3000/uploads/logos/user.png"
                }
                className="logo-company-card"
                alt="logo orange"
              />
            </div>
            <div
              className={`company-infos ${isExtendedCompanyId === company.company_id ? "extended" : ""}`}
            >
              <h4>{company.name}</h4>
              <p className="company-description">{company.description}</p>
              <p className="company-size">{company.size}</p>
              <div className="company-details">
                <p>
                  <FontAwesomeIcon icon={faMapMarkerAlt} /> {company.location}
                </p>
                <p>{company.secteur}</p>
              </div>
            </div>
            <div className="company-button">
              <button className="favourite-button">
                <FontAwesomeIcon icon={faHeart} size="xl" />
              </button>
              <div className="learn-button-div">
                <button
                  onClick={() => extendedCompanyId(company.company_id!)}
                  id="learn-more-button"
                >
                  {isExtendedCompanyId === company.company_id
                    ? "Close"
                    : "Learn more"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Companies_index;
