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
npm run dev --workspace @pantryloop/web
```

## Environment

Use root `.env.example` values with `NEXT_PUBLIC_FIREBASE_*` for web Firebase client SDK setup.
