import React from "react";
import { useState, useEffect } from "react";
// import { Blob } from "buffer";
import "../style/jobs_index.css";
import ApplicationFormModal from "./applicationFormModal";
import sopraLogo from "../assets/images/sopra-logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "./AuthContext";

type contract = "CDI" | "CDD" | "Alternance" | "Stage" | "Temps partiel";
type remote = "Présentiel" | "Full-remote" | "Hybride";

type Job = {
  job_id?: number;
  company_id?: number;
  title: string;
  description: string;
  salary: number;
  location: string;
  remote: remote;
  skills: string[];
  contract: contract;
  number_candidates?: number;
  job_photo?: Blob;
};

type Company = {
  company_id?: number;
  name: string;
  description: string;
  location: string;
  logo: string;
};

interface JobsIndexProps {
  requete: string;
}

const Jobs_index: React.FC<JobsIndexProps> = ({ requete }) => {
  const { isLoggedIn } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [contratsFiltres, setContratsFiltre] = useState<contract[]>([]);
  const [skillsFiltres, setSkillsFiltres] = useState<string[]>([]);
  const [remoteJobs, setRemoteJobs] = useState<remote[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [appliedJobId, setAppliedJobId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setJobs(data);
      });
  }, []);

  useEffect(() => {
    fetch("/api/companies")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCompanies(data);
      });
  }, []);

  const [isExtendedJobId, setExtendedJobId] = useState<number | null>(null);
  const extendedJobId = (jobId: number) => {
    setExtendedJobId(isExtendedJobId === jobId ? -1 : jobId);
  };

  const filterContrat = (contrat: contract) => {
    setContratsFiltre((prev) =>
      prev.includes(contrat)
        ? prev.filter((c) => c !== contrat)
        : [...prev, contrat],
    );
  };

  const filterRemote = (remote: remote) => {
    setRemoteJobs((prev) =>
      prev.includes(remote)
        ? prev.filter((r) => r !== remote)
        : [...prev, remote],
    );
  };

  const filterSkills = (skill: string) => {
    setSkillsFiltres((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const jobsFiltres = jobs.filter((job) => {
    const matchContrat =
      contratsFiltres.length === 0 || contratsFiltres.includes(job.contract);

    const matchSkills =
      skillsFiltres.length === 0 ||
      skillsFiltres.some((skill) =>
        job.skills
          .split(",")
          .map((s: any) => s.trim())
          .includes(skill),
      );

    const company = companies.find((c) => c.company_id === job.company_id);
    const companyName = company ? company.name : "";

    const matchRemote =
      remoteJobs.length === 0 || remoteJobs.includes(job.remote);

    const matchRequete =
      requete === "" ||
      job.title.toLowerCase().includes(requete.toLowerCase()) ||
      companyName.toLowerCase().includes(requete.toLowerCase()) ||
      job.location.toLowerCase().includes(requete.toLowerCase()) ||
      job.skills
        .split(",")
        .join("")
        .toLowerCase()
        .includes(requete.toLowerCase());

    return matchContrat && matchSkills && matchRequete && matchRemote;
  });

  return (
    <div className="jobs-index">
      <div className="search-filter">
        <h3 className="filter-title">Skills</h3>
        <div className="filter-div">
          {[
            "Python",
            "HTML",
            "CSS",
            "Javascript",
            "PHP",
            "SQL",
            "Java",
            "ReactJS",
            "Vue.JS",
            "Rust",
            "NodeJS",
            "NextJS",
            "Ruby",
            "C",
            "C++",
            "C#",
            "Go",
            "Swift",
            "Kotlin",
            "Typescript",
          ].map((skill) => (
            <label className="filter-label" key={skill}>
              <input
                className="filter-input"
                type="checkbox"
                checked={skillsFiltres.includes(skill)}
                onChange={() => filterSkills(skill)}
              />
              {skill}
            </label>
          ))}
        </div>
        <h3 className="filter-title">Contrat</h3>
        <div className="filter-div">
          {["CDI", "CDD", "Alternance", "Stage", "Temps partiel"].map(
            (contract) => (
              <label className="filter-label" key={contract}>
                <input
                  className="filter-input"
                  type="checkbox"
                  checked={contratsFiltres.includes(contract as contract)}
                  onChange={() => filterContrat(contract as contract)}
                />
                {contract}
              </label>
            ),
          )}
        </div>
        <h3 className="filter-title">Remote</h3>
        <div className="filter-div">
          {["Présentiel", "Full-remote", "Hybride"].map((remote) => (
            <label className="filter-label" key={remote}>
              <input
                className="filter-input"
                type="checkbox"
                checked={remoteJobs.includes(remote as remote)}
                onChange={() => filterRemote(remote as remote)}
              />
              {remote}
            </label>
          ))}
        </div>
      </div>

      <div className="jobs-list">
        {jobsFiltres.length === 0 && (
          <p className="no-job-message">
            Aucun job ne correspond à votre sélection.
          </p>
        )}
        {jobsFiltres.map((job) => {
          const company = companies.find(
            (c) => c.company_id === job.company_id,
          );

          return (
            <div
              key={job.job_id}
              className={`job-offer ${isExtendedJobId === job.job_id ? "extended" : ""}`}
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
                  className="logo-job-offer"
                  alt={company ? company.name : "company sopra"}
                />
              </div>
              <div
                className={`job-infos ${isExtendedJobId === job.job_id ? "extended" : ""}`}
              >
                <h4>{job.title}</h4>
                <p className="job-description">{job.description}</p>
                <p className="no-remote">{job.remote}</p>
                <div className="job-details">
                  <p>
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> {job.location}
                  </p>
                  <p>{job.contract}</p>
                  <p className="job-skills">
                    [ {job.skills.split(",").join(", ")} ]
                  </p>
                </div>
              </div>
              <div className="job-button">
                <button className="favourite-button">
                  <FontAwesomeIcon icon={faHeart} size="xl" />
                </button>
                <div className="apply-learn-button">
                  <button
                    onClick={() => extendedJobId(job.job_id!)}
                    id="learn-more-button"
                  >
                    {isExtendedJobId === job.job_id ? "Close" : "Learn more"}
                  </button>
                  <button
                    id="apply-button"
                    onClick={() => {
                      if (!isLoggedIn) {
                        setErrorMessage(
                          "Veuillez vous connecter pour candidater à une offre.",
                        );
                        setTimeout(() => setErrorMessage(null), 3000);
                        return;
                      }
                      setErrorMessage(null);
                      setAppliedJobId(job.job_id!);
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {errorMessage && (
        <div className="apply-error-message-div">
          <div className="apply-error-message">
            <p>{errorMessage}</p>
          </div>
        </div>
      )}
      {appliedJobId && (
        <ApplicationFormModal
          jobId={appliedJobId}
          onClose={() => setAppliedJobId(null)}
        />
      )}
    </div>
  );
};

export default Jobs_index;
