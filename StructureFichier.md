# Structure du projet Factureo

Ce document décrit l'architecture et la structure des dossiers du projet. Chaque dossier est présenté en arborescence avec une brève indication de son rôle.

---

## Arborescence à la racine

```
factureo/
|
+-- assets/                    Ressources statiques : images, logos (SVG/PNG), icônes, polices
|   +-- logo/
|
+-- components/               Composants UI réutilisables (boutons, champs, logo, menu, pagination, etc.)
|
+-- constants/                Constantes et valeurs globales (config, listes de référence)
|
+-- examples/                 Écrans ou composants d'exemple / démo (hors flux principal)
|
+-- routes/                   Configuration de la navigation : routes, stack, paramètres
|
+-- screens/                  Écrans (pages) de l'application, un sous-dossier par zone
|   +-- Factures/             Liste, détail et formulaire des factures
|   +-- Clients/              Liste et formulaire des clients
|   +-- RegisterForms/        Étapes d'inscription
|
+-- src/                      Logique métier et architecture hexagonale (détail ci-dessous)
|
+-- theme/                    Design system : couleurs, typo, espacements, layout, animations
|
+-- types/                    Déclarations TypeScript globales (modules sans types, extensions)
```

---

## Dossier src (architecture hexagonale)

Le dossier `src` suit une architecture hexagonale : domaine au centre, cas d'usage qui orchestrent, infrastructure qui implémente la persistance, couche UI qui relie l'interface aux cas d'usage

```
src/
|
+-- domain/                   Cœur métier : entités, objets valeur, ports (aucune dépendance infra/UI)
|   +-- entities/             Classes d'entités métier (User, Client, Facture, DocumentCommercial)
|   +-- valueObjects/         Objets valeur immuables avec validation (Email, Password)
|   +-- ports/
|       +-- out/              Interfaces des sorties (AuthRepository, ClientRepository, FactureRepository)
|
+-- application/              Cas d'utilisation : orchestration du domaine et des ports
|   +-- usecases/
|       +-- auth/             Login, register (délèguent à AuthRepository)
|       +-- client/           Liste, CRUD, recherche clients (ClientRepository)
|       +-- facture/          Liste, CRUD, changement de statut factures (FactureRepository, ClientRepository)
|
+-- infrastructure/           Implémentations des ports (adaptateurs)
|   +-- inMemory/             Repositories en mémoire : InMemoryDB (seed), Auth, Client, Facture
|
+-- ui/                       Adaptation entre écrans/composants et cas d'usage
|   +-- app/                  Container d'injection, fournisseurs globaux (QueryClient, auth)
|   +-- context/              Contexte React métier (ex. AuthContext)
|   +-- queries/              Hooks TanStack Query (clients, factures, auth), clés et mutations
```
