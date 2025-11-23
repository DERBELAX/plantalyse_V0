# Plantélys (plantalyse_V0)

Plateforme e-commerce de vente de plantes avec accompagnement post-achat (rappels d’arrosage) et espace communautaire.

---

## ✨ Fonctionnalités principales

### Côté utilisateur
- **Catalogue de plantes** : recherche + filtres (type, entretien, prix, etc.)
- **Fiche produit détaillée** : images, description, stock, conseils d’entretien
- **Panier & commande** : calcul total, contrôle stock, création commande
- **Authentification** : inscription/connexion **JWT** + connexion **Google OAuth2**
- **Rappels d’arrosage** : e-mails planifiés selon la fréquence de la plante
- **Communauté** : posts, commentaires, likes
- **Blog / conseils** : lecture d’articles

### Côté administrateur
- **Back-office** : CRUD Plantes / Catégories / Blogs
- **Gestion des commandes** : suivi statut, validation, expédition
- **Modération communauté** : suppression posts/commentaires

---

## 🧱 Stack & Architecture

- **Front-end** : React.js + Tailwind CSS  
- **Back-end** : Spring Boot 3 (Java 21) + Spring Security (JWT/OAuth2)  
- **Base de données** : MySQL (JPA/Hibernate)  
- **Déploiement** : Docker & Docker-Compose  
- **Notifications** : Spring Scheduler (`@Scheduled`) + Email SMTP  

---

## 📁 Arborescence (simplifiée)
plantalyse_V0/
├─ backend/ # Spring Boot
│ ├─ src/main/java/com/example/plantalysBackend
│ │ ├─ controller/
│ │ ├─ service/
│ │ ├─ repository/
│ │ ├─ model/
│ │ └─ security/
│ ├─ src/main/resources/
│ │ ├─ application.yml
│ │ └─ application-test.yml
│ └─ Dockerfile
├─ frontend/ # React
│ ├─ src/
│ │ ├─ pages/
│ │ ├─ components/
│ │ ├─ services/
│ │ └─ assets/
│ └─ Dockerfile
├─ docker-compose.yml
└─ README.md


---

## ✅ Prérequis

- Node.js ≥ 18
- Java 21
- Maven 3.9+
- Docker + Docker-Compose
- MySQL (si exécution hors Docker)

---

## 🚀 Lancer le projet en local (Docker recommandé)

### 1) Cloner le dépôt
```bash
git clone https://github.com/DERBELAX/plantalyse_V0.git
cd plantalyse_V0

2) Variables d’environnement

Créer un fichier .env à la racine (non versionné) :

# MySQL
MYSQL_DATABASE=plantalys
MYSQL_USER=plantalys_user
MYSQL_PASSWORD=plantalys_pwd
MYSQL_ROOT_PASSWORD=rootpwd

# Backend
SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/plantalys
SPRING_DATASOURCE_USERNAME=plantalys_user
SPRING_DATASOURCE_PASSWORD=plantalys_pwd
JWT_SECRET=change_me_very_long_secret

# Mail (SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=yourmail@gmail.com
MAIL_PASSWORD=app_password

3) Démarrer les services
docker-compose up --build -d


Services :

Front : http://localhost:3001

Back : http://localhost:8085

phpMyAdmin : http://localhost:8081

🧪 Tests
Backend (JUnit / Mockito)
cd backend
mvn test

Couverture JaCoCo
mvn test jacoco:report
# rapport : backend/target/site/jacoco/index.html

Frontend
cd frontend
npm test

🔐 Sécurité

API stateless avec JWT :

header Authorization: Bearer <token>

Spring Security : rôles USER / ADMIN

BCrypt pour hachage mots de passe

Protection XSS/SQLi via :

React (échappement par défaut)

JPA requêtes paramétrées

Validation @Valid côté back

CSRF désactivé pour l’API JWT (pas de cookies de session)

⏰ Rappels d’arrosage (Scheduler)

Planification via :

@Scheduled(cron = "0 0 8 * * *", zone = "Europe/Paris")


Les rappels échus sont envoyés par mail, puis replanifiés selon la fréquence :

intervalle ≈ 7 / frequencyPerWeek jours

Envoi e-mail : EmailService (SMTP)

📡 Endpoints principaux (exemples)
Auth

POST /api/auth/register

POST /api/auth/login

GET /oauth2/authorization/google

Catalogue

GET /api/plants

GET /api/plants/{id}

POST /api/plants (admin)

Commandes

POST /api/orders/from-cart

GET /api/orders/me

PUT /api/orders/{id} (admin)

Communauté

GET /api/posts

POST /api/posts

POST /api/posts/{id}/comments

POST /api/posts/{id}/likes

🔁 CI/CD (GitHub Actions)

À chaque push sur develop ou main :

Build backend + frontend

Tests JUnit / lint

Build images Docker

Push images (optionnel)

Déploiement Docker (staging / prod)

🛣️ Roadmap

Notifications push (web/mobile)

Recommandations personnalisées

Paiement complet + historique factures

Gamification communauté (badges)

👩‍💻 Auteur

Marwa Derbel – CDA 2025
GitHub : DERBELAX
