# PantryLoop Mobile

Placeholder for the future Expo React Native app. Milestone 2 intentionally does not scaffold UI-heavy mobile code yet.

## Intended profile flow

1. Authenticate with Firebase Auth.
2. Read `/users/{uid}/profile/main` through `getUserProfile` from `@pantryloop/firebase/profile`.
3. If the profile does not exist, create it with `createDefaultUserProfile`/`createUserProfile` using the Firebase Auth UID, display name, and email when available.
4. Reuse the shared profile validation helpers so mobile and web collect the same food identity fields.

Do not import Firebase Admin SDK modules in the mobile app.
