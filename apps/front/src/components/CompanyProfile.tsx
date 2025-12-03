import { useState, useEffect } from "react";
import userPlaceholder from "../assets/images/user.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import "../style/company_profile.css";

type contract = "CDI" | "CDD" | "Alternance" | "Stage" | "Temps partiel";
type mySqlBool = 0 | 1;

type Job = {
  job_id?: number;
  company_id?: number;
  title: string;
  description: string;
  salary: number;
  location: string;
  remote: mySqlBool;
  skills: string[];
  contract: contract;
  number_candidates?: number;
  job_photo?: Blob;
};

type Company = {
  id?: number;
  name: string;
  logo: string;
  description: string;
  location: string;
  user_id?: number;
  created_at?: Date;
  updated_at?: Date;
};

type Status =
  | "rejetée"
  | "en attente de retour"
  | "embauché"
  | "entretien"
  | "screening"
  | "postulé"
  | "en cours d'examen";

type Application = {
  application_id?: number;
  job_id: number;
  application_status: Status;
};

type Message = {
  message_id?: number;
  user_id: number;
  conversation_id: number;
  content: string;
};

const CompanyProfile = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [companyJobs, setCompanyJobs] = useState<Job[] | null>(null);
  const [applications, setApplications] = useState<Application[] | null>(null);
  const [messagesByApp, setMessagesByApp] = useState<Record<number, Message[]>>(
    {},
  );

  async function fetchProfile() {
    try {
      const company: Company = await fetch("/api/companies/profile").then(
        (res) => res.json(),
      );
      setCompany(company);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchJobs() {
    try {
      const jobs: Job[] = await fetch("/api/jobs/company").then((res) =>
        res.json(),
      );
      setCompanyJobs(jobs);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchApplications() {
    try {
      const res = await fetch("/api/applications", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch applications");
      const apps: Application[] = await res.json();
      setApplications(apps);
      /* apps.forEach(app => {
        if (app.application_id) {
          fetchMessagesByApplication(app.application_id);
        }
      }); */
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchMessagesByApplication(applicationId: number) {
    try {
      const res = await fetch(`/api/messages/${applicationId}`, {
        credentials: "include",
      });
      if (!res.ok)
        throw new Error(
          `Failed to fetch messages for application ${applicationId}`,
        );
      const msgs: Message[] = await res.json();
      setMessagesByApp((prev) => ({ ...prev, [applicationId]: msgs }));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchProfile();
    fetchJobs();
    fetchApplications();
  }, []);

  return (
    <>
      <div className="user-profile">
        <div className="avatar">
          {company?.logo ? (
            <img src={company.logo} alt="Avatar" className="img-responsive" />
          ) : (
            <img
              src={userPlaceholder}
              alt="Avatar par défaut"
              className="img-responsive"
            />
          )}
        </div>
        <div className="user-details">
          <div className="user-name">
            <p className="company-name">{company?.name}</p>
          </div>
          <div className="role">
            <p>Company</p>
          </div>
        </div>
        <div className="company-description">
          <p>{company?.description}</p>
        </div>
      </div>

      <div>
        <div className="jobs-list">
          {companyJobs?.map((job) => (
            <div
              key={job.job_id}
              className={`job-offer job-offer-company-profile`}
            >
              <div className={`job-infos`}>
                <h4>{job.title}</h4>
                <p className="job-description">{job.description}</p>
                {job.remote === 0 ? (
                  <p className="no-remote">No remote</p>
                ) : (
                  <p className="remote">Remote</p>
                )}
                <div className="job-details">
                  <p>
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> {job.location}
                  </p>
                  <p>{job.contract}</p>
                </div>
                <div>
                  <h5>Applications:</h5>
                  <ul>
                    {applications
                      ?.filter((app) => app.job_id === job!.job_id)
                      .map((app) => (
                        <li
                          className="application-state"
                          key={app.application_id}
                        >
                          <p>
                            <strong>Statut :</strong> {app.application_status}
                          </p>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CompanyProfile;
