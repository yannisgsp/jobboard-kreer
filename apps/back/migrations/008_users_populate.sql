-- ================================================
-- USERS SEED DATA
-- ================================================
-- Ensure this runs AFTER the Users table has been created.
-- Encoding: UTF-8

INSERT INTO Users (firstname, lastname, email, password, role, description)
VALUES
-- Admin user (ID = 1)
('Admin', 'Root', 'admin@admin.eu', '$2b$10$1nBgpk11NMKLI9.ej2z2xepNwNb.RjfMIjnwhjvmQEVLsHwaXdDcq', 'admin',
'System administrator with full privileges. Responsible for managing platform configurations, user permissions, and data integrity across all environments. Ensures security, reliability, and uptime of the jobboard system.'),

-- User 2 - Aurora
('Aurora', 'ECorp', 'aurora@company.eu', '$2b$10$zylrUNJlOEkdOKI1aqdfgOFGpNIjho1K4q2KccOX.DAKkiSr3scza', 'company',
'Hello, I am Aurora, the HR manager at Aurora. I am passionate about building teams and creating an inspiring workplace. 
My focus is to ensure our employees thrive and grow professionally while maintaining a healthy work-life balance. 
I value transparent communication, innovation, and continuous learning. 
I work closely with our leadership team to align recruitment strategies with company goals. 
I enjoy fostering diversity and inclusion across all departments. 
At Aurora, we believe our people are our greatest strength. 
I also organize internal workshops and career development programs. 
My background in psychology and management helps me understand human potential. 
I believe empathy is key to effective HR. 
My goal is to make Aurora one of the best places to work in Paris.'),

-- User 3 - Leon
('Leon', 'ECorp', 'leon@company.eu', '$2b$10$JFX0NozKmdCGXdv7pr75GuxnPwr.vknW4Bo9Y1nU7Kz7zOb/1COZO', 'company',
'Hello, I am Leon, HR manager at Leon. My role is to attract and retain top talent while promoting a strong company culture. 
I am deeply committed to professional development and mentorship. 
I collaborate with department heads to ensure recruitment processes are fair and efficient. 
At Leon, we invest heavily in employee satisfaction. 
We host monthly team-building activities and leadership training. 
My job also involves strategic workforce planning to anticipate company needs. 
I believe HR should be proactive, not reactive. 
We use data-driven approaches to understand engagement levels. 
I strive to make Leon a benchmark for positive workplace culture. 
Located in Lyon, our company stands for collaboration and excellence.'),

-- User 4 - Maya
('Maya', 'ECorp', 'maya@company.eu', '$2b$10$i8O7ZI0CkM.picrenpRbAexikKCWifJE56uUivHIokOHuMQmKP.G6', 'company',
'Hello, I am Maya, head of HR at Maya. My daily mission is to ensure our teams are motivated and aligned with company values. 
We encourage creativity, curiosity, and accountability in everything we do. 
Our recruitment focuses on finding passionate individuals who want to make an impact. 
At Maya, every employee has a voice in shaping our future. 
I also oversee employee wellbeing programs and mental health initiatives. 
We believe that happy employees drive innovation. 
Through continuous feedback and transparent communication, we foster trust. 
Our HR team uses modern digital tools to enhance employee experience. 
I am always exploring new HR trends to implement. 
Based in Marseille, Maya is a forward-thinking company built around people.'),

-- User 5 - Ethan
('Ethan', 'ECorp', 'ethan@company.eu', '$2b$10$BeoToZkRu0w3u5zCLMMOeOR4zr/RUdBfu4T79WLQLrzYYwG8NqeVy', 'company',
'Hi, I am Ethan, HR manager at Ethan. I joined the company five years ago and have been leading our human resources strategy since then. 
Our philosophy is simple: empower, support, and grow together. 
We have built a strong culture of collaboration and respect. 
My main responsibility is to create pathways for professional growth. 
I also handle recruitment for key technical positions. 
We are constantly improving our onboarding process for new hires. 
Ethan encourages open discussions and transparency in decision-making. 
I believe that recognition is one of the most powerful motivators. 
We regularly review our benefits and training programs. 
Located in Lille, Ethan stands out for its dynamic and people-first HR approach.'),

-- User 6 - Sophie
('Sophie', 'ECorp', 'sophie@company.eu', '$2b$10$iY7mNArCxm3JUprMUA9Sxe4mMxR1DpfWDAR4H3tOyEMN62swj7d.m', 'company',
'Hi, I am Sophie, HR director at Sophie. I oversee all aspects of talent management and organizational development. 
I focus on aligning HR practices with business objectives. 
We encourage innovation and flexibility at every level of our organization. 
My team is dedicated to ensuring equal opportunities and continuous growth. 
We provide tailored learning paths for our employees. 
At Sophie, feedback is seen as a tool for improvement, not criticism. 
We also emphasize sustainability and social responsibility. 
I regularly collaborate with universities to attract emerging talent. 
Our HR policies are designed to be inclusive and transparent. 
Based in Toulouse, Sophie’s HR philosophy is centered on empathy, respect, and excellence.'),

-- User 7 - Yannis
('Yannis', 'Gaspard', 'yannis.gaspard@epitech.eu', '$2b$10$Ho8sg.UhE0/MCM.xQDfh5ugy1K9zBQiCtjGLk3xJdv5jI7rhDKuzS', 'user', "Hi, I'm Yannis an Pre MSc Epitech student..."),

-- User 8 - Yannis
('Alexandre', 'Leroy', 'alexandre.leroy@epitech.eu', '$2b$10$ArJoyG/hWVnUqB6is1Y.2uZIgUkJSAqdwpPoFOpBBVUo5euv0/Zr6', 'user', "Hi, I'm Alexandre an Pre MSc Epitech student..."),

-- User 9 - Yannis
('Jérémy', 'Boubée', 'jeremy.boubee@epitech.eu', '$2b$10$Pi9eX2YZXAedvxRuE1r6R.OMRVr/nkSaxYVj6ANSKiKkHo/VeiY2.', 'user', "Hi, I'm Jérémy an Pre MSc Epitech student...");
