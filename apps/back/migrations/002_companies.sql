CREATE TABLE IF NOT EXISTS Companies (
    company_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    name varchar(255) NOT NULL,
    description LONGTEXT NOT NULL,
    location varchar(255) NOT NULL,
    logo VARCHAR(255),
    size set("[0 - 50 pers.]", "[50 - 250 pers.]", "[250 - 500 pers.]", "[500 - 1000 pers.]", "[1000 - 2500 pers.]", "[+2000 pers.]"),
    secteur set("Technologie", "Santé", "Énergie", "Finance", "Immobilier", "Transport", "Tourisme", "Éducation", "Commerce de détail", "Développement logiciel", "Informatique", "IA"),
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)