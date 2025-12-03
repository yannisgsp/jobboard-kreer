CREATE TABLE IF NOT EXISTS Conversations (
    conversation_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    user_id INT not null,
    application_id INT not null,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (application_id) REFERENCES Applications(application_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)