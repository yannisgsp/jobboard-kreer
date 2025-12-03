CREATE TABLE IF NOT EXISTS Jobs (
    job_id int AUTO_INCREMENT NOT NULL,
    title varchar(255) NOT NULL,
    number_candidates int(4),
    description longtext NOT NULL, 
    salary int(5) NOT NULL,
    location varchar(255) NOT NULL, 
    remote ENUM("Présentiel", "Full-remote", "Hybride") NOT NULL DEFAULT "Présentiel", 
    skills set("Python", "HTML", "CSS", "Javascript", "PHP", "SQL", "Java", "ReactJS", "Vue.JS", "Rust", "NodeJS", "NextJS", "Ruby", "C", "C++", "C#", "Go", "Swift", "Kotlin", "Typescript") NOT NULL,
    contract set("CDI", "CDD", "Alternance", "Stage", "Temps partiel") NOT NULL,
    job_photo varchar(255),
    company_id int NOT NULL,
    PRIMARY KEY (job_id),
    FOREIGN KEY (company_id) REFERENCES Companies(company_id)
        ON UPDATE CASCADE 
        ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP
)