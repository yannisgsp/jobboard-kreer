# 🚀 JOBBOARD :: T-WEB-501-TLS_6

---

## 🏁 Table des matières

1. [Structure des routes](#structure-des-routes)
2. [Authentification et rôles](#authentification-et-rôles)
3. [Documentation détaillée des endpoints](#documentation-détaillée-des-endpoints)
   - [Utilisateurs](#utilisateurs-users)
   - [Emplois](#emplois-jobs)
   - [Entreprises](#entreprises-companies)
   - [Candidatures](#candidatures-applications)
   - [Conversations](#conversations-conversations)
   - [Messages](#messages-messages)
   - [Favoris](#favoris-favorites)
4. [Middlewares](#middlewares-utilisés)
6. [Workflow typique](#exemple-de-workflow-typique)
7. [Crédits](#-crédits)

## ⚙️ Installation & Démarrage

### 1. Cloner le dépôt
```bash
git clone https://github.com/EpitechMscProPromo2028/T-WEB-501-TLS_6.git
cd T-WEB-501-TLS_6
npm install
```

### 2. Configure env variables

⚠️ `L'application back nécessite l'accès au port 3000 disponible, veuillez prendre les mesures nécessaires.`<br>

Editer le fichier apps/back/.env en fonction de votre environnement et de l'example disponible dans apps/back/.env.example

```bash
# .env.example

DB_HOST=localhost
DB_USER=myuser
DB_PASSWORD=mypassword
DB_DATABASE=mydatabase
```
### 3. Run du projet

- Development version:

`npm run dev:back`<br>
`npm run dev:front`

- Final preview version

`npm start`


---

## 🧑‍💻 Utilisateurs et entreprises de test

Pour faciliter les tests et les essais de l’application, la base de données contient déjà plusieurs utilisateurs et entreprises avec leurs rôles et emails.

Vous pouvez aussi utiliser le système intégrer de création d'utilisateur.

---

### Utilisateurs (Users)

| ID | Prénom | Nom | Email | Rôle | Password |
|----|--------|-----|-------|------|----------|
| 1 | Admin | Root | admin@admin.eu | admin | admin
| 7 | Yannis | Gaspard | yannis.gaspard@epitech.eu | user | yannis
| 8 | Alexandre | Leroy | alexandre.leroy@epitech.eu | user | alexandre
| 9 | Jérémy | Boubée | jeremy.boubee@epitech.eu | user | jeremy

---

### Entreprises (company role)

| ID | Nom | Email du contact | Ville | Taille | Secteur | Password |
|----|-----|-----------------|-------|--------|---------|----------|
| 2 | Aurora | aurora@company.eu | Paris | [500 - 1000 pers.] | Immobilier | aurora
| 3 | Leon | leon@company.eu | Lyon | [500 - 1000 pers.] | Informatique | leon
| 4 | Maya | maya@company.eu | Marseille | [1000 - 2500 pers.] | Transport | maya
| 5 | Ethan | ethan@company.eu | Lille | [1000 - 2500 pers.] | Finance | ethan
| 6 | Sophie | sophie@company.eu | Toulouse | [50 - 250 pers.] | Santé | sophe

---

## 🧩 Structure des routes

| Ressource | URL | Description |
|------------|------|-------------|
| 👤 Utilisateurs | `/users` | Gestion des utilisateurs et authentification |
| 💼 Emplois | `/jobs` | Gestion des offres d’emploi |
| 🏢 Entreprises | `/companies` | Gestion des entreprises |
| 📝 Candidatures | `/applications` | Gestion des candidatures |
| 💬 Conversations | `/conversations` | Gestion des conversations |
| ✉️ Messages | `/messages` | Gestion des messages |
| ⭐ Favoris | `/favorites` | Gestion des favoris |

---

## 🔒 Authentification et rôles

Rôles disponibles :
- `user` — Candidat ou chercheur d’emploi  
- `company` — Entreprise recruteuse  
- `admin` — Administrateur global

---

### 👤 Utilisateurs (`/users`)

#### 🔐 Authentification
| Méthode | Endpoint | Accès | Description |
|----------|-----------|--------|-------------|
| `POST` | `/login` | Public | Connexion d’un utilisateur |
| `POST` | `/logout` | Authentifié | Déconnexion |
| `POST` | `/register` | Public | Création d’un compte utilisateur |

#### 👤 Gestion des utilisateurs
| Méthode | Endpoint | Accès | Description |
|----------|-----------|--------|-------------|
| `GET` | `/profile` | Utilisateur / Admin | Récupérer le profil connecté |
| `PUT` | `/:id` | Authentifié | Mettre à jour un utilisateur |
| `DELETE` | `/:id` | Authentifié | Supprimer un utilisateur |
| `GET` | `/` | Admin | Lister tous les utilisateurs |

---

### 💼 Emplois (`/jobs`)

#### 🔓 Public
| Méthode | Endpoint | Accès | Description |
|----------|-----------|--------|-------------|
| `GET` | `/` | Public | Lister toutes les offres d’emploi |
| `GET` | `/:id` | Public | Détails d’un emploi spécifique |

#### 🔐 Authentifié
| Méthode | Endpoint | Accès | Description |
|----------|-----------|--------|-------------|
| `GET` | `/company` | Entreprise / Admin | Lister les offres créées par l’entreprise |
| `POST` | `/` | Entreprise / Admin | Créer une offre |
| `PUT` | `/:id` | Entreprise / Admin | Modifier une offre |
| `DELETE` | `/:id` | Entreprise / Admin | Supprimer une offre |
| `GET` | `/:id/applicants` | Entreprise / Admin | Lister les candidats d’une offre |

---
### 🏢 Entreprises (`/companies`)

#### 🔓 Public
| Méthode | Endpoint | Description |
|----------|-----------|-------------|
| `GET` | `/` | Lister toutes les entreprises |
| `GET` | `/profile` | Voir le profil d’une entreprise |

#### 🔐 Authentifié
| Méthode | Endpoint | Accès | Description |
|----------|-----------|--------|-------------|
| `POST` | `/new` | Entreprise / Admin | Créer une nouvelle entreprise (avec logo) |
| `PUT` | `/:id` | Entreprise / Admin | Mettre à jour une entreprise (avec logo) |
| `DELETE` | `/:id` | Entreprise / Admin | Supprimer une entreprise |

---
### 📝 Candidatures (`/applications`)

#### 🔐 Authentifié
| Méthode | Endpoint | Accès | Description |
|----------|-----------|--------|-------------|
| `GET` | `/` | Entreprise / Admin | Lister toutes les candidatures |
| `GET` | `/:id` | Tous | Afficher une candidature |
| `GET` | `/jobs/:jobId` | Entreprise / Admin | Lister les candidatures d’une offre |
| `GET` | `/users/:id` | Utilisateur | Lister les candidatures d’un utilisateur |
| `POST` | `/jobs/:jobId` | Utilisateur / Admin | Créer une candidature pour une offre |
| `PUT` | `/:id` | Entreprise / Admin | Mettre à jour une candidature |
| `DELETE` | `/:id` | Entreprise / Admin | Supprimer une candidature |

---

### 💬 Conversations (`/conversations`)

#### 🔐 Authentifié
| Méthode | Endpoint | Accès | Description |
|----------|-----------|--------|-------------|
| `GET` | `/` | Tous | Lister les conversations selon le rôle |
| `GET` | `/:id` | Utilisateur / Admin | Voir une conversation spécifique |

*(Les endpoints de création/suppression sont prévus mais désactivés.)*

---
### ✉️ Messages (`/messages`)

#### 🔐 Authentifié
| Méthode | Endpoint | Accès | Description |
|----------|-----------|--------|-------------|
| `GET` | `/conversation/:convId` | Tous | Voir les messages d’une conversation |
| `GET` | `/user/:userId` | Tous | Voir les messages d’un utilisateur |
| `POST` | `/conversation/:convId` | Utilisateur / Entreprise | Envoyer un message |
| `GET` | `/:id` | Propriétaire / Admin | Voir un message |
| `PUT` | `/:id` | Propriétaire / Admin | Modifier un message |
| `DELETE` | `/:id` | Propriétaire / Admin | Supprimer un message |

---

### ⭐ Favoris (`/favorites`)

#### 🔐 Authentifié
| Méthode | Endpoint | Accès | Description |
|----------|-----------|--------|-------------|
| `POST` | `/` | Utilisateur | Ajouter un emploi aux favoris |
| `GET` | `/user/:id` | Utilisateur / Admin | Lister les favoris d’un utilisateur |
| `DELETE` | `/:id` | Utilisateur / Admin | Supprimer un favori |
| `GET` | `/` | Admin | Lister tous les favoris du système |

---

## 🧠 Middlewares utilisés

| Middleware | Description |
|-------------|-------------|
| `requireAuth` | Vérifie que la requête contient un utilisateur authentifié |
| `hasRole([...])` | Vérifie que l’utilisateur possède un rôle autorisé |
| `upload.single("logo")` | Gère le téléchargement du logo d’entreprise |
