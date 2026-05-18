# PantryLoop Agent Instructions

PantryLoop is a privacy-conscious grocery, meal planning, pantry tracking, and responsible disposal assistant. Treat this as a serious startup/portfolio codebase.

## Product principles
- Build small, maintainable increments; do not implement the whole product in one pass.
- Prefer structured data models and workflows over generic chatbot-only experiences.
- Keep culturally aware food preferences, allergies, diet, budget, and local disposal context first-class.

## Security and privacy requirements
- Never commit real secrets, API keys, Firebase service account JSON, private keys, or user data exports.
- Use `.env.example` only for placeholders.
- Load public Firebase client config from `NEXT_PUBLIC_*` or `EXPO_PUBLIC_*` variables.
- Load backend secrets from environment variables or managed secrets only.
- Firebase Admin SDK code must stay in backend/server-only modules and must never be imported by frontend code.
- Do not log secrets or full sensitive user profiles.
- Keep user data scoped by Firebase Auth UID under `/users/{userId}` unless a future migration explicitly changes the rule model.

## Code style
- Use TypeScript for app, shared, Firebase, and function code.
- Keep modules focused and names explicit.
- Add comments only when they explain non-obvious security, privacy, or product behavior.
- Do not add unnecessary dependencies.
