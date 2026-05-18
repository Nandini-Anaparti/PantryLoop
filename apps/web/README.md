# PantryLoop Web

Placeholder for the future Next.js web application. Milestone 2 intentionally does not scaffold UI-heavy web code yet.

## Intended profile flow

1. Authenticate with Firebase Auth.
2. Read `/users/{uid}/profile/main` through `getUserProfile` from `@pantryloop/firebase/profile`.
3. If the profile does not exist, create it with `createDefaultUserProfile`/`createUserProfile` using the Firebase Auth UID, display name, and email when available.
4. Let the user edit food identity fields in a small onboarding flow before pantry tracking is introduced.

Do not import Firebase Admin SDK modules in the web app.
