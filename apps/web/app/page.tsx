"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { normalizeUserProfile, validateUserProfile, type UserProfile, type UserProfileUpdate } from "@pantryloop/shared";
import { createUserProfile, getUserProfile, updateUserProfile } from "@pantryloop/firebase/profile";
import { auth, db, missingFirebaseClientConfigKeys } from "../src/lib/firebaseClient";
import { ProfileForm } from "../src/components/ProfileForm";

interface AuthFormState {
  email: string;
  password: string;
}

function toPublicErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}

const firebaseClientEnvNames: Record<string, string> = {
  apiKey: "NEXT_PUBLIC_FIREBASE_API_KEY",
  authDomain: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  projectId: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  storageBucket: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  appId: "NEXT_PUBLIC_FIREBASE_APP_ID",
};

function FirebaseSetupMessage() {
  const missingEnvNames = missingFirebaseClientConfigKeys.map(
    (key: string) => firebaseClientEnvNames[key] ?? `NEXT_PUBLIC_FIREBASE_${key.toUpperCase()}`,
  );

  return (
    <main style={{ display: "grid", gap: "1rem", maxWidth: 720 }}>
      <h1>PantryLoop</h1>
      <h2>Firebase setup needed</h2>
      <p>
        Add your Firebase web app config to a local environment file, then restart the Next.js dev server.
      </p>
      <p>Missing values:</p>
      <ul>
        {missingEnvNames.map((name: string) => (
          <li key={name}>
            <code>{name}</code>
          </li>
        ))}
      </ul>
      <p>
        Copy <code>.env.example</code> to <code>.env.local</code> at the repository root and fill in the
        <code> NEXT_PUBLIC_FIREBASE_*</code> placeholders from your Firebase project settings.
      </p>
    </main>
  );
}

export default function HomePage() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authForm, setAuthForm] = useState<AuthFormState>({ email: "", password: "" });

  useEffect(() => {
    if (!auth) {
      setInitializing(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function loadOrCreateProfile(user: User) {
      setProfileLoading(true);
      setProfileError("");

      if (!db) {
        setProfileError("Firebase is not configured for this browser session.");
        setProfileLoading(false);
        return;
      }

      try {
        const existing = await getUserProfile(db, user.uid);

        if (existing) {
          setProfile(normalizeUserProfile(existing));
          return;
        }

        const created = await createUserProfile(db, {
          userId: user.uid,
          email: user.email ?? undefined,
          displayName: user.displayName ?? undefined,
        });
        setProfile(created);
      } catch (error) {
        setProfileError(`Failed to load profile: ${toPublicErrorMessage(error)}`);
      } finally {
        setProfileLoading(false);
      }
    }

    if (!authUser) {
      setProfile(null);
      return;
    }

    void loadOrCreateProfile(authUser);
  }, [authUser]);

  const canSubmitAuth = useMemo(
    () => authForm.email.trim().length > 0 && authForm.password.trim().length >= 6,
    [authForm],
  );

  async function handleSignIn() {
    setAuthLoading(true);
    setAuthError("");

    if (!auth) {
      setAuthError("Firebase is not configured. Add the required NEXT_PUBLIC_FIREBASE_* values and restart dev.");
      setAuthLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, authForm.email.trim(), authForm.password);
    } catch (error) {
      setAuthError(toPublicErrorMessage(error));
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleRegister() {
    setAuthLoading(true);
    setAuthError("");

    if (!auth) {
      setAuthError("Firebase is not configured. Add the required NEXT_PUBLIC_FIREBASE_* values and restart dev.");
      setAuthLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, authForm.email.trim(), authForm.password);
    } catch (error) {
      setAuthError(toPublicErrorMessage(error));
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleSaveProfile(update: UserProfileUpdate) {
    if (!profile || !db) {
      throw new Error("No profile loaded or Firebase is not configured.");
    }

    setSavingProfile(true);
    setProfileError("");

    try {
      const updatedProfile = await updateUserProfile(db, profile, update);
      const normalized = normalizeUserProfile(updatedProfile);
      const result = validateUserProfile(normalized);

      if (!result.valid) {
        throw new Error(result.errors.join(" "));
      }

      setProfile(normalized);
    } catch (error) {
      setProfileError(`Failed to save profile: ${toPublicErrorMessage(error)}`);
      throw error;
    } finally {
      setSavingProfile(false);
    }
  }

  if (missingFirebaseClientConfigKeys.length > 0) {
    return <FirebaseSetupMessage />;
  }

  if (initializing) {
    return <main><h1>PantryLoop</h1><p>Checking authentication...</p></main>;
  }

  if (!authUser) {
    return (
      <main style={{ display: "grid", gap: "1rem", maxWidth: 420 }}>
        <h1>PantryLoop</h1>
        <p>Sign in to create and manage your food identity profile.</p>
        <label>
          Email
          <input
            type="email"
            value={authForm.email}
            onChange={(event) => setAuthForm((prev) => ({ ...prev, email: event.target.value }))}
          />
        </label>
        <label>
          Password (minimum 6 characters)
          <input
            type="password"
            value={authForm.password}
            onChange={(event) => setAuthForm((prev) => ({ ...prev, password: event.target.value }))}
          />
        </label>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button type="button" onClick={handleSignIn} disabled={!canSubmitAuth || authLoading}>
            {authLoading ? "Signing in..." : "Sign in"}
          </button>
          <button type="button" onClick={handleRegister} disabled={!canSubmitAuth || authLoading}>
            {authLoading ? "Registering..." : "Create account"}
          </button>
        </div>
        {authError ? <p style={{ color: "crimson" }}>{authError}</p> : null}
      </main>
    );
  }

  if (profileLoading) {
    return <main><h1>PantryLoop</h1><p>Loading profile...</p></main>;
  }

  if (!profile) {
    return (
      <main style={{ display: "grid", gap: "1rem" }}>
        <h1>PantryLoop</h1>
        <p>Profile could not be loaded.</p>
        {profileError ? <p style={{ color: "crimson" }}>{profileError}</p> : null}
        <button type="button" onClick={() => auth && signOut(auth)}>Sign out</button>
      </main>
    );
  }

  return (
    <main style={{ display: "grid", gap: "1rem" }}>
      <h1>PantryLoop</h1>
      <p>Signed in as {authUser.email ?? authUser.uid}</p>
      <button type="button" onClick={() => auth && signOut(auth)} style={{ width: "fit-content" }}>
        Sign out
      </button>

      {profileError ? <p style={{ color: "crimson" }}>{profileError}</p> : null}

      <ProfileForm formData={profile} onSave={handleSaveProfile} saving={savingProfile} />
      <small>Profile path: /users/{authUser.uid}/profile/main</small>
    </main>
  );
}
