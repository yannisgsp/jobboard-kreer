CREATE TABLE IF NOT EXISTS Applications (
    application_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    job_id INT NOT NULL,
    application_status SET('rejetée','en attente de retour','embauché','entretien','screening','postulé',"en cours d'examen") NOT NULL DEFAULT '',
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES Jobs(job_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)