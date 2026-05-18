"use client";

import {
  getMissingFirebaseClientConfigKeysFromOptions,
  initializePantryLoopFirebaseClientFromConfig,
} from "@pantryloop/firebase/client";

const firebaseClientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const missingFirebaseClientConfigKeys = getMissingFirebaseClientConfigKeysFromOptions(firebaseClientConfig);
export const isFirebaseClientConfigured = missingFirebaseClientConfigKeys.length === 0;

const firebaseClient = isFirebaseClientConfigured ? initializePantryLoopFirebaseClientFromConfig(firebaseClientConfig) : null;

export const auth = firebaseClient?.auth ?? null;
export const db = firebaseClient?.db ?? null;
