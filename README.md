# Bookingroom Backend

Backend Node.js/Express pour une application de reservation de chambres.  
Le projet expose une API REST avec authentification JWT, gestion des utilisateurs, chambres, types de chambres, reservations et paiements simules.

## Stack technique

- Node.js
- Express
- PostgreSQL
- Sequelize / Sequelize CLI
- Passport JWT
- bcrypt
- dotenv
- CORS

## Prerequis

- Node.js 18+
- npm
- Une base PostgreSQL accessible localement ou via un fournisseur comme Neon

## Installation

```bash
npm install
```

## Configuration

Creer un fichier `.env` a la racine du projet avec les variables suivantes :

```env
PORT=3000
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=change_me
```

Le projet accepte aussi `NEON_DATABASE_URL`. Si cette variable est presente, elle est utilisee en priorite sur `DATABASE_URL`.

La connexion PostgreSQL est configuree avec SSL, ce qui convient aux bases hebergees comme Neon.

## Base de donnees

Les migrations Sequelize sont dans le dossier `migrations/`.

Executer les migrations :

```bash
npx sequelize-cli db:migrate
```

Annuler la derniere migration :

```bash
npx sequelize-cli db:migrate:undo
```

## Demarrage

Mode developpement avec `nodemon` :

```bash
npm run dev
```

Par defaut, l'API demarre sur :

```text
http://localhost:3000
```

Toutes les routes principales sont prefixees par `/api`.

## Scripts npm

```bash
npm run dev
```

Demarre le serveur avec `nodemon`.

```bash
npm test
```

Script de test non configure pour le moment.

## Authentification

L'API utilise un token JWT envoye dans l'en-tete HTTP :

```http
Authorization: Bearer <token>
```

Certaines routes sont reservees aux administrateurs. Le middleware verifie que l'utilisateur authentifie possede le role `admin`.

## Endpoints

### Authentification

| Methode | Route | Acces | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/signup` | Public | Cree un utilisateur |
| POST | `/api/auth/signin` | Public | Connecte un utilisateur et retourne un JWT |
| GET | `/api/auth/profile` | Authentifie | Retourne le profil utilisateur |

Exemple de creation d'utilisateur :

```json
{
  "username": "jdoe",
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "secret"
}
```

Exemple de connexion :

```json
{
  "username": "jdoe",
  "password": "secret"
}
```

### Chambres

| Methode | Route | Acces | Description |
| --- | --- | --- | --- |
| GET | `/api/rooms` | Public | Liste les chambres avec leur type |
| GET | `/api/rooms/:id` | Public | Detail d'une chambre |
| POST | `/api/rooms` | Admin | Cree une chambre |
| PUT | `/api/rooms/:id` | Admin | Modifie une chambre |
| DELETE | `/api/rooms/:id` | Admin | Supprime une chambre |

Exemple de chambre :

```json
{
  "roomNumber": "101",
  "roomTypeId": 1,
  "floor": 1,
  "status": "available"
}
```

Statuts possibles : `available`, `occupied`, `maintenance`.

### Types de chambres

| Methode | Route | Acces | Description |
| --- | --- | --- | --- |
| GET | `/api/room-types` | Public | Liste les types de chambres |
| POST | `/api/room-types` | Admin | Cree un type de chambre |

Exemple :

```json
{
  "name": "Suite",
  "description": "Grande chambre avec salon",
  "basePrice": 75000,
  "capacity": 2,
  "amenities": ["wifi", "climatisation", "tv"]
}
```

### Reservations

| Methode | Route | Acces | Description |
| --- | --- | --- | --- |
| POST | `/api/bookings` | Authentifie | Cree une reservation |
| GET | `/api/available` | Public | Liste les chambres disponibles sur une periode |
| GET | `/api/mine` | Authentifie | Liste les reservations de l'utilisateur connecte |
| PATCH | `/api/bookings/:id/cancel` | Authentifie | Annule une reservation de l'utilisateur |
| GET | `/api/bookings` | Admin | Liste toutes les reservations |

Exemple de creation de reservation :

```json
{
  "roomId": 1,
  "checkInDate": "2026-06-01",
  "checkOutDate": "2026-06-05"
}
```

Recherche de disponibilite :

```text
GET /api/available?checkInDate=2026-06-01&checkOutDate=2026-06-05
```

Statuts de reservation : `pending`, `confirmed`, `cancelled`.

### Paiements

| Methode | Route | Acces | Description |
| --- | --- | --- | --- |
| POST | `/api/bookings/:id/pay` | Authentifie | Cree un paiement simule pour une reservation |

Le paiement genere :

- `paymentMethod`: `simulation`
- `paymentStatus`: `completed`
- `transactionId`: identifiant simule base sur la date courante

### Test technique

| Methode | Route | Acces | Description |
| --- | --- | --- | --- |
| GET | `/api/association-test` | Public | Verifie les associations Sequelize Booking/User/Room |

## Modeles principaux

- `User` : compte utilisateur avec role `user` ou `admin`
- `RoomType` : categorie de chambre, prix de base, capacite et equipements
- `Room` : chambre physique rattachee a un type
- `RoomImage` : image rattachee a un type de chambre
- `Booking` : reservation entre un utilisateur et une chambre
- `Payment` : paiement rattache a une reservation

## Structure du projet

```text
.
├── app.js
├── config/
│   ├── config.json
│   ├── database.cjs
│   └── passport.js
├── controllers/
├── migrations/
├── models/
├── routes/
├── seeders/
└── utils/
```

## Notes de developpement

- Les mots de passe sont hashes avec bcrypt avant enregistrement.
- Les tokens JWT expirent apres 1 heure.
- Le calcul du prix d'une reservation utilise le nombre de jours multiplie par `RoomType.basePrice`.
- La verification de disponibilite ignore les reservations annulees et bloque les reservations confirmees qui se chevauchent.
