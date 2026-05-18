import { cert, getApps, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

interface RawFirebaseServiceAccount {
  project_id?: string;
  projectId?: string;
  client_email?: string;
  clientEmail?: string;
  private_key?: string;
  privateKey?: string;
}

function readServerEnv(name: string): string | undefined {
  const runtime = globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } };

  return runtime.process?.env?.[name];
}

function parseServiceAccount(): ServiceAccount {
  const serviceAccountJson = readServerEnv("FIREBASE_SERVICE_ACCOUNT_JSON");

  if (!serviceAccountJson) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_JSON");
  }

  try {
    const raw = JSON.parse(serviceAccountJson) as RawFirebaseServiceAccount;

    return {
      projectId: raw.projectId ?? raw.project_id,
      clientEmail: raw.clientEmail ?? raw.client_email,
      privateKey: raw.privateKey ?? raw.private_key,
    };
  } catch (error) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON must be valid JSON", { cause: error });
  }
}

export function initializePantryLoopFirebaseAdmin() {
  const app = getApps()[0] ?? initializeApp({ credential: cert(parseServiceAccount()) });

  return {
    app,
    adminAuth: getAuth(app),
    adminDb: getFirestore(app),
    adminStorage: getStorage(app),
  };
}
