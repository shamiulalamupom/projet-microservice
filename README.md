# Projet microservice – backend + gateway
Niveau langue : français simple (A2/B1). Objectif : lancer le gateway et les 3 microservices (users, trips, reservations) en local.

## Prérequis
- Node.js 18+ et npm
- MongoDB accessible (local ou distant)
- Ports libres : 3000 (gateway), 3001 (users), 3002 (trips), 3003 (reservations)

## Installation
```bash
npm install
```

## Configuration des environnements
Chaque service utilise un fichier `.env` à la racine du dossier du service.

### Gateway (`apps/gateway/.env`)
```
PORT=3000
JWT_SECRET=change_me
INTERNAL_TOKEN=change_me
USERS_SERVICE_URL=http://localhost:3001
TRIPS_SERVICE_URL=http://localhost:3002
RESERVATIONS_SERVICE_URL=http://localhost:3003
HTTP_TIMEOUT_MS=5000
```

### Users service (`apps/users-service/.env`)
```
PORT=3001
MONGO_URL=mongodb://localhost:27017/users
INTERNAL_TOKEN=change_me
```

### Trips service (`apps/trips-service/.env`)
```
PORT=3002
MONGO_URL=mongodb://localhost:27017/trips
INTERNAL_TOKEN=change_me
```

### Reservations service (`apps/reservations-service/.env`)
```
PORT=3003
MONGO_URL=mongodb://localhost:27017/reservations
INTERNAL_TOKEN=change_me
```

> Conseil : utiliser la même valeur pour `INTERNAL_TOKEN` dans tous les services et le gateway.

## Lancer en développement
Toutes les apps :
```bash
npm run dev:backend
```

Seulement les services (sans gateway) :
```bash
npm run dev:services
```

Les logs affichent `[gateway] listening on 3000`, `[users] listening on 3001`, etc.

## Points d’entrée principaux
- Gateway : `http://localhost:3000`
- Healthchecks : `/health` sur chaque service et sur le gateway
- Contrat d’API : `docs/contracts.md`

## Tests manuels rapides
- Register/login via `/auth/register` puis `/auth/login`
- Créer un trajet (manager) : `POST /manager/trips`
- Lister trajets : `GET /trips`
- Réserver : `POST /reservations`
- Annuler : `POST /reservations/:id/cancel`
