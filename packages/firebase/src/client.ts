import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export type FirebaseClientRuntime = "web" | "expo";

export interface PantryLoopFirebaseClient {
  app: FirebaseApp;
  auth: ReturnType<typeof getAuth>;
  db: ReturnType<typeof getFirestore>;
  storage: ReturnType<typeof getStorage>;
}

function readEnv(name: string): string | undefined {
  const runtime = globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } };

  return runtime.process?.env?.[name];
}

function getFirebaseClientConfig(runtime: FirebaseClientRuntime): FirebaseOptions {
  const prefix = runtime === "expo" ? "EXPO_PUBLIC" : "NEXT_PUBLIC";

  return {
    apiKey: readEnv(`${prefix}_FIREBASE_API_KEY`),
    authDomain: readEnv(`${prefix}_FIREBASE_AUTH_DOMAIN`),
    projectId: readEnv(`${prefix}_FIREBASE_PROJECT_ID`),
    storageBucket: readEnv(`${prefix}_FIREBASE_STORAGE_BUCKET`),
    messagingSenderId: readEnv(`${prefix}_FIREBASE_MESSAGING_SENDER_ID`),
    appId: readEnv(`${prefix}_FIREBASE_APP_ID`),
  };
}

function assertFirebaseClientConfig(config: FirebaseOptions): void {
  const missingKeys = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    throw new Error(`Missing Firebase client environment values: ${missingKeys.join(", ")}`);
  }
}

export function initializePantryLoopFirebaseClient(
  runtime: FirebaseClientRuntime = "web",
): PantryLoopFirebaseClient {
  const config = getFirebaseClientConfig(runtime);
  assertFirebaseClientConfig(config);

  const app = getApps().length > 0 ? getApp() : initializeApp(config);

  return {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
    storage: getStorage(app),
  };
}
