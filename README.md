# Factureo

Application mobile de gestion de factures (React Native, Expo, TypeScript). Factureo centralise la gestion comptable et prépare à la facture électronique (réforme 2026).

---

## Prérequis

- Node.js 22.14.0 (LTS recommandé)
- npm ou yarn
- Expo Go sur appareil ou émulateur Android / iOS pour tester

---

## Exécution en local

Première fois :

```bash
npm install
```

Lancer l’application :

```bash
npm start
```

ou :

```bash
npx expo start
```

Ensuite, flasher le QR code avec Expo Go (même réseau Wi‑Fi) ou lancer un émulateur (a pour Android, i pour iOS dans le terminal).

---

## Docker

Première fois (build des images et démarrage) :

```bash
docker compose up --build
```

Les fois suivantes (démarrage sans rebuild) :

```bash
docker compose up
```

Arrêter les conteneurs :

```bash
docker compose down
```

Reconstruire après modification du Dockerfile ou des dépendances :

```bash
docker compose up --build
```

Le serveur Expo tourne en mode tunnel ; le QR code s’affiche dans le terminal après le démarrage de Metro.

---

## Tests unitaires

Commande pour exécuter tous les tests :

```bash
npm test
```

Mode watch (relance à chaque modification) :

```bash
npm run test:watch
```

Couverture :

```bash
npm run test:coverage
```

Nombre de fichiers de tests : 7.

Fichiers de tests présents :

- `src/domain/valueObjects/__tests__/Email.test.ts` - validation et format de l’objet valeur Email
- `src/domain/valueObjects/__tests__/Password.test.ts` - règles de force et validation du mot de passe
- `src/domain/entities/__tests__/DocumentCommercial.test.ts` - calcul des totaux et gestion des lignes (DocumentCommercial)
- `src/domain/entities/__tests__/Facture.test.ts` - calculs HT/TVA/TTC, marquer payée, retard, annulation (Facture)
- `src/application/usecases/auth/__tests__/LoginUseCase.test.ts` - cas d’usage de connexion
- `src/application/usecases/client/__tests__/ClientUseCases.test.ts` - CRUD et recherche clients
- `src/application/usecases/facture/__tests__/FactureUseCases.test.ts` - création, liste, marquer payée (FactureUseCases)

---

## Formules de calcul des factures

Par ligne :

- Montant HT : `montant_HT = quantite * prix_unitaire_HT` (Hors Taxe)
- Montant TVA : `montant_TVA = montant_HT * (taux_TVA / 100)` (Taxe sur la valeur ajoutée)
- Montant TTC : `montant_TTC = montant_HT + montant_TVA` (Tout taxes comprises)

Au niveau du document (facture) :

- Total HT : somme des `montant_HT` de toutes les lignes
- Total TVA : somme des `montant_TVA` de toutes les lignes
- Total TTC : somme des `montant_TTC` de toutes les lignes

Les totaux sont recalculés à la création et à chaque modification des lignes (entité DocumentCommercial / Facture et repository).

---

## Fonctionnalités et logiques métier (src)

Le projet suit une architecture hexagonale. Résumé des rôles et logiques métier par couche.

**Domaine (entities)**  
DocumentCommercial : calcul des totaux HT/TVA/TTC à partir des lignes ; ajout/suppression de lignes. Facture : calcul des montants par ligne ; marquer payée (statut + date) ; détection retard (échéance dépassée et non payée) ; annulation interdite si déjà payée. User, Client : entités de données avec getters utiles (ex. nom complet).

**Domaine (valueObjects)**  
Email : format et validation d’adresse email. Password : règles de complexité (longueur, caractères) et validation.

**Domaine (ports)**  
AuthRepository, ClientRepository, FactureRepository : interfaces des opérations de persistance (login, CRUD, changement de statut) sans détail d’implémentation.

**Application (usecases)**  
LoginUseCase : authentification par email/mot de passe via AuthRepository. RegisterUseCase : création de compte avec validation (email, mot de passe). ClientUseCases : liste, recherche par nom/prénom, getById, création (validation prénom, nom, téléphone, adresse), mise à jour, suppression. FactureUseCases : liste, liste par client, getById, création (client existant, date échéance > émission, au moins une ligne, quantités et prix valides), mise à jour (interdite si contenu modifié sur facture payée), suppression, marquer payée, marquer envoyée, updateStatus (changement de statut réversible).

**Infrastructure (inMemory)**  
InMemoryDB : stockage en Map (users, clients, factures) et données de seed. AuthRepositoryMemory : login par email + vérification mot de passe. ClientRepositoryMemory : CRUD clients avec validation email. FactureRepositoryMemory : CRUD factures, génération numéro, calcul des montants à la création/mise à jour, interdiction de modifier le contenu d’une facture payée, updateStatus avec remise à zéro de date_payee si passage à non payé.

**UI (context, queries)**  
AuthContext : état utilisateur connecté, login, register, logout. Hooks TanStack Query : chargement liste/détail clients et factures, mutations create/update/delete et updateStatus, invalidation du cache après succès.

---

## Utilisateur de test

Pour se connecter à l’application (données de seed en mémoire) :

- Email : `test@factureo.com`
- Mot de passe : `Test1234!`

---

Voir `StructureFichier.md` pour la description des dossiers et de l’architecture du projet. Voir `INSTALLATION.txt` et `DOCKER_SETUP.txt` pour des instructions détaillées d’installation et Docker.
