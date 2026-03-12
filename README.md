# 🛡️ AutorisPro — Plateforme OFPPT de Gestion des Autorisations

Projet fullstack :  **Laravel 10 (API REST)** + **React 18 (Vite)**

---

## 📁 Structure du projet

```
autorispro/
├── backend/
│   └── laravel/
│       ├── app/
│       │   ├── Http/
│       │   │   ├── Controllers/
│       │   │   │   ├── AuthController.php
│       │   │   │   ├── DemandeController.php
│       │   │   │   ├── UserController.php
│       │   │   │   └── StatController.php
│       │   │   └── Middleware/
│       │   │       └── RoleMiddleware.php
│       │   └── Models/
│       │       ├── User.php
│       │       └── Demande.php
│       ├── database/
│       │   ├── migrations/
│       │   └── seeders/
│       │       └── DatabaseSeeder.php
│       ├── routes/
│       │   └── api.php
│       └── .env.example
│
└── frontend/
    └── react/
        ├── src/
        │   ├── services/
        │   │   └── api.js          ← Tous les appels HTTP
        │   ├── context/
        │   │   └── AuthContext.jsx ← Gestion auth globale
        │   ├── hooks/
        │   │   └── useFetch.js     ← Hooks réutilisables
        │   └── App.jsx             ← App complète
        └── .env
```

---

## 🚀 Installation — Backend Laravel

```bash
# 1. Créer le projet Laravel
composer create-project laravel/laravel autorispro-api
cd autorispro-api

# 2. Installer Sanctum (auth token)
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# 3. Copier les fichiers du dossier backend/laravel/ dans le projet

# 4. Configurer .env
cp .env.example .env
php artisan key:generate
# Remplir DB_DATABASE, DB_USERNAME, DB_PASSWORD

# 5. Créer la base de données MySQL
mysql -u root -p -e "CREATE DATABASE autorispro;"

# 6. Migrations + Seeder
php artisan migrate
php artisan db:seed

# 7. Enregistrer le middleware RoleMiddleware dans bootstrap/app.php :
# $middleware->alias(['role' => \App\Http\Middleware\RoleMiddleware::class]);

# 8. Configurer CORS dans config/cors.php :
# 'allowed_origins' => ['http://localhost:5173'],
# 'supports_credentials' => true,

# 9. Démarrer le serveur
php artisan serve
# → http://localhost:8000
```

---

## 🚀 Installation — Frontend React

```bash
# 1. Créer le projet Vite + React
npm create vite@latest autorispro-front -- --template react
cd autorispro-front

# 2. Copier src/ et .env depuis frontend/react/

# 3. Installer les dépendances
npm install

# 4. Démarrer
npm run dev
# → http://localhost:5173
```

---

## 🔑 Comptes de démonstration

| Rôle          | Email                    | Mot de passe  |
|---------------|--------------------------|---------------|
| Utilisateur   | y.benali@ofppt.ma        | user123       |
| Manager       | k.mansouri@ofppt.ma      | manager123    |
| Administrateur| n.elamrani@ofppt.ma      | admin123      |

---

## 🌐 Endpoints API

### Auth
| Méthode | Route         | Description              |
|---------|---------------|--------------------------|
| POST    | /api/login    | Connexion → token        |
| POST    | /api/logout   | Déconnexion              |
| GET     | /api/me       | Profil connecté          |

### Utilisateur
| Méthode | Route              | Description              |
|---------|--------------------|--------------------------|
| GET     | /api/mes-demandes  | Mes demandes             |
| POST    | /api/demandes      | Créer une demande        |

### Manager
| Méthode | Route                          | Description              |
|---------|-------------------------------|--------------------------|
| GET     | /api/demandes                  | Demandes de l'équipe     |
| GET     | /api/demandes/en-attente       | Demandes en attente      |
| GET     | /api/demandes/historique       | Historique traité        |
| GET     | /api/demandes/{id}             | Détail d'une demande     |
| PUT     | /api/demandes/{id}/accepter    | Accepter                 |
| PUT     | /api/demandes/{id}/refuser     | Refuser                  |
| POST    | /api/demandes/action-groupee   | Action sur plusieurs     |
| GET     | /api/equipe                    | Mon équipe               |

### Admin
| Méthode | Route                 | Description              |
|---------|-----------------------|--------------------------|
| GET     | /api/toutes-demandes  | Toutes les demandes      |
| GET/POST| /api/users            | Lister/Créer users       |
| PUT/DEL | /api/users/{id}       | Modifier/Supprimer       |
| GET     | /api/stats            | Statistiques globales    |

---

## 🏗️ Architecture technique

```
React (Vite)
│
├── AuthContext   → token dans localStorage, user en state global
├── useFetch()   → GET avec loading/error/refetch
├── useMutation()→ POST/PUT/DELETE avec loading/error
└── api.js       → fetch() centralisé avec Bearer token
                        ↕ HTTP/JSON
Laravel (Sanctum)
│
├── RoleMiddleware → vérifie user.role sur chaque route
├── AuthController → login/logout/me
├── DemandeController → CRUD demandes selon rôle
├── UserController → CRUD users (admin) + equipe (manager)
└── StatController → agrégats SQL pour dashboard admin
```

---

## 🔐 Sécurité

- **Authentification** : Laravel Sanctum (token Bearer)
- **Autorisation** : Middleware `role:manager`, `role:admin`
- **Isolation des données** : Manager voit seulement son équipe (`manager_id`)
- **Validation** : Laravel `$request->validate()` sur chaque entrée
- **CORS** : configuré pour accepter uniquement `localhost:5173`
