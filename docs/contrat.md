# Contrat d’API (Gateway + Services)
Tous les échanges sont HTTP/JSON. Erreurs normalisées : `{"error":{"code","message","details"}}`.

## Règles globales
- Auth côté gateway par JWT `Authorization: Bearer <token>`.
- Rôle utilisateur : `client` ou `manager`.
- Appels internes (gateway -> services) exigent `X-Internal-Token`.
- Codes courants : `400` validation, `401` auth manquante/incorrecte, `403` rôle ou accès interne, `404` non trouvé, `409` conflit (ex : `NO_SEATS`), `503` service HS.

## Gateway — Routes exposées au front
- **POST /auth/register**  
  - Pourquoi : créer un compte.  
  - Entrée : `{email, password, role:"client"|"manager"}`.  
  - Sortie : `{token, user:{id,email,role}}`.  
  - Exigences : mot de passe ≥ 8, email unique.
- **POST /auth/login**  
  - Pourquoi : obtenir un JWT.  
  - Entrée : `{email, password}`.  
  - Sortie : `{token, user}`.  
  - Si mauvais mot de passe → `401 UNAUTHORIZED`.
- **GET /auth/me** (JWT)  
  - Pourquoi : connaître l’utilisateur courant.  
  - Sortie : `{user}`.

- **GET /trips**  
  - Pourquoi : chercher des trajets.  
  - Entrée (query) : `from?, to?, date?, page?, pageSize?`.  
  - Sortie : `{items, page, pageSize, total}`.
- **GET /trips/:id**  
  - Pourquoi : détails d’un trajet.  
  - Sortie : `trip`.

- **POST /reservations** (JWT client/manager)  
  - Pourquoi : réserver des places.  
  - Entrée : `{tripId, seats}`.  
  - Logique : hold atomique des places, puis création réservation confirmée.  
  - Sortie : `reservation`.  
  - Si plus de places → `409 NO_SEATS`.
- **GET /reservations/me** (JWT)  
  - Pourquoi : lister mes réservations.  
  - Sortie : `{items:[reservation]}`.
- **POST /reservations/:id/cancel** (JWT)  
  - Pourquoi : annuler et libérer les places.  
  - Autorisation : propriétaire ou rôle `manager`.  
  - Sortie : `reservation` avec `status:"canceled"`.

- **POST /manager/trips** (JWT rôle `manager`)  
  - Pourquoi : créer un trajet.  
  - Entrée : `{from,to,dateTime,totalSeats}`.  
  - Sortie : `trip`.
- **PUT /manager/trips/:id** (JWT rôle `manager`)  
  - Pourquoi : modifier un trajet.  
  - Entrée : champs optionnels `{from,to,dateTime,totalSeats}`.  
  - Règle : on ne réduit pas en dessous des places déjà réservées.  
  - Sortie : `trip`.
- **GET /manager/trips/:id/reservations** (JWT rôle `manager`)  
  - Pourquoi : voir les réservations d’un trajet.  
  - Sortie : `{items:[reservation]}`.

## Services internes (appelés par le gateway)
### Users-service
- **POST /users** (header interne) : crée `{email,passwordHash,role}` → `{id,email,role}`.
- **GET /users/:id** (interne) : lecture simple.  
- **GET /internal/users/by-email** (interne) : pour login, retourne `passwordHash`.

### Trips-service
- **GET /trips** (interne) : filtres `from,to,date,page,pageSize` → liste paginée.
- **GET /trips/:id** (interne) : détail.  
- **POST /trips** (interne) : crée un trajet avec `availableSeats = totalSeats`.  
- **PUT /trips/:id** (interne) : met à jour, garde cohérence réservations.  
- **POST /internal/trips/:id/hold-seats** (interne) : décrémente de façon atomique si stock suffisant, sinon `409 NO_SEATS`.  
- **POST /internal/trips/:id/release-seats** (interne) : rend des places (max totalSeats).

### Reservations-service
- **POST /reservations** (interne) : crée `{userId,tripId,seats,status}` → reservation.  
- **GET /reservations** (interne) : filtre `userId` ou `tripId`.  
- **POST /reservations/:id/cancel** (interne) : passe `status` à `canceled`, retourne la réservation.

## Résultats attendus (user stories démo)
- Register/Login → recevoir un token et accéder aux routes protégées.
- Manager crée un trajet → visible via `GET /trips`.
- Client réserve des places → status `confirmed`, `availableSeats` diminue.  
- Réserver trop de places → erreur `409 NO_SEATS`.  
- Annuler → status `canceled`, `availableSeats` remonte.
