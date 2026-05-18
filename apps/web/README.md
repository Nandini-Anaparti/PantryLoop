# PantryLoop Web

Milestone 3 adds a minimal Next.js + Firebase Auth + profile onboarding shell.

## Implemented flow

1. Sign in or register using Firebase email/password auth.
2. On auth, load `/users/{uid}/profile/main`.
3. If profile does not exist, create it from shared defaults.
4. Edit profile fields in a simple onboarding form.
5. Save profile with shared normalization/validation and reload state.

## Commands

```bash
npm install
npm run dev
```

`npm run dev` runs the web workspace and rebuilds local shared packages first.

## Environment

The web app needs Firebase browser config values before Auth, Firestore, or Storage can initialize. These are public Firebase client identifiers, but keep real project values in local or deployed environment configuration instead of committing them.

1. Copy the root template:

   ```bash
   cp .env.example .env.local
   ```

2. Fill in the `NEXT_PUBLIC_FIREBASE_*` values from Firebase Console → Project settings → General → Your apps → Web app config:

   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

3. Restart `npm run dev` after changing `.env.local` so Next.js picks up the new values.

If values are missing, the app displays a Firebase setup page instead of throwing a client-side import error.
