# PantryLoop

PantryLoop is an AI-powered grocery, food waste, meal planning, and responsible disposal assistant that helps households plan meals around what they already own, reduce unnecessary grocery spending, respect allergies and cultural food preferences, and dispose of food scraps and packaging responsibly using local recycling and composting guidance.

**Tagline:** “Plan meals around your real pantry, your real diet, your real culture, and your real local waste rules.”

**One-sentence pitch:** PantryLoop helps users turn what they already have into personalized meals, smart grocery lists, and responsible disposal instructions based on their diet, culture, budget, location, and household needs.

## Current repository assessment

- The repository previously contained only this root `README.md` and no application, package, Firebase, or security-rules structure.
- There was no existing `.gitignore`, package manager configuration, `AGENTS.md`, Firestore rules, Storage rules, or committed app code to preserve.
- Milestone 1 therefore establishes a clean monorepo foundation rather than migrating an existing implementation.

## Recommended final folder structure

```text
PantryLoop/
  apps/
    web/                 # Future Next.js web app
    mobile/              # Future Expo React Native app
  packages/
    shared/              # Shared TypeScript types, utilities, validation
    firebase/            # Firebase client and server-only admin initialization
  functions/             # Firebase Cloud Functions for backend-only AI and workflows
    src/
      ai/
      disposal/
      mealPlanning/
  scripts/               # Repo maintenance checks
  .env.example           # Placeholder environment variables only
  firebase.json
  firestore.rules
  storage.rules
  AGENTS.md
  README.md
```

## Firebase data model

Initial user-owned data should be scoped under Firebase Auth UID:

```text
/users/{userId}
  profile/main            # UserProfile food identity, household, budget, region settings
  pantryItems/{itemId}    # PantryItem records for manual entry first
  mealPlans/{mealPlanId}  # MealPlan records and generated grocery list snapshots
  groceryLists/{listId}   # Future standalone grocery list workflow
  disposalItems/{itemId}  # DisposalItem records tied to food or packaging decisions
```

Public or admin-managed disposal references should be modeled separately from private user data:

```text
/publicDisposalRegions/{regionId}
  materialRules/{ruleId}
  depots/{depotId}
```

This keeps location-aware disposal rules reusable while preserving user privacy.

## Environment variable plan

Copy `.env.example` to a local, untracked environment file for development. Never commit real values.

### Web / Next.js Firebase client config

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### Expo / mobile Firebase client config

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`

### Backend/server secrets

- `FIREBASE_SERVICE_ACCOUNT_JSON`
- `OPENAI_API_KEY`
- `GOOGLE_MAPS_API_KEY`
- `FOOD_API_KEY`
- `BARCODE_API_KEY`

Backend secrets should be configured through Firebase Functions secrets or deployment environment variables, not checked into source control.

## Security/rules plan

- Frontend code uses Firebase client SDK with public environment variables only.
- Server/backend code uses Firebase Admin SDK only through server-only modules that read `FIREBASE_SERVICE_ACCOUNT_JSON`.
- Firestore and Storage rules deny by default.
- Private profile data is scoped to `/users/{userId}/profile/main` and can only be read or written by the matching authenticated UID; future user-owned collections should add equally scoped rules before launch.
- Public disposal region documents are readable by anyone and not writable by clients.
- Future AI integrations must run backend-side so API keys never reach browser or mobile clients.
- Sensitive profile details such as allergies, religion/cultural food rules, household size, and diet should not be logged wholesale.

## First 5 implementation milestones

1. **Project foundation:** monorepo layout, shared TypeScript types, Firebase client/admin boundaries, environment template, security rules, setup docs.
2. **Manual pantry MVP:** authenticated profile and pantry CRUD flows, use-first list calculations, and minimal web UI.
3. **Food identity profile:** structured onboarding for diet, allergies, culture/religion, cuisines, household size, budget, and disposal region.
4. **Meal planning stub to workflow:** non-AI meal plan request/response shape, grocery list generation shell, and backend-only AI integration seam.
5. **Disposal pilot:** British Columbia / Recycle BC-style region model, generic material guidance, compostability warnings, and depot-finder API interface.

## Concerns and assumptions

- The repository starts nearly empty, so Milestone 1 intentionally avoids adding full Next.js or Expo scaffolds until UI work begins.
- The Firebase client config is public by design, but actual project identifiers should still live in environment files rather than source files.
- Disposal rules vary by municipality and program; the app must avoid universal claims about compostable packaging or recycling acceptance.
- Allergy substitution logic must stay conservative and avoid suggesting unsafe alternatives without explicit compatibility checks.

## Setup

Install dependencies:

```bash
npm install
```

Run TypeScript project checks for the foundation packages:

```bash
npm run typecheck
```

Run the lightweight secret-pattern check:

```bash
npm run lint:secrets
```

Firebase rule entrypoints are configured in `firebase.json`:

- Firestore rules: `firestore.rules`
- Storage rules: `storage.rules`
- Functions source: `functions`

## Milestone 1 status

Milestone 1 establishes the architecture and security foundation only. It includes shared data contracts for user profiles, pantry items, meal plans, grocery list items, disposal items, disposal instructions, and use-first scoring. UI-heavy work, AI generation, barcode scanning, receipt scanning, maps, and full disposal-region content are intentionally deferred.

## Milestone 2 status

Milestone 2 adds the Firebase Auth-ready user profile foundation without adding pantry tracking, disposal logic, recipe generation, AI features, or heavy UI scaffolding.

### User profile document path

PantryLoop stores each user's primary profile at:

```text
/users/{userId}/profile/main
```

This shape keeps profile data clearly scoped beneath the Firebase Auth UID while leaving room for future profile-adjacent documents if needed. A flatter `/users/{userId}` profile document would be simpler, but it can become crowded once user-owned subcollections grow. The nested `profile/main` document keeps the root user document available for minimal metadata if a future milestone needs it.

### Profile utilities

The shared package now owns lightweight helpers for profile defaults, normalization, validation, and timestamp updates. These helpers are intentionally dependency-free so web, mobile, and backend code can share the same expectations.

### Frontend-safe Firebase profile helpers

The Firebase package includes client SDK helpers for reading, creating, and updating `/users/{userId}/profile/main`. These helpers are frontend-safe and do not import Firebase Admin SDK code.
