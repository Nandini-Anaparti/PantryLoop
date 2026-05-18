"use client";

import { initializePantryLoopFirebaseClient } from "@pantryloop/firebase/client";

const firebaseClient = initializePantryLoopFirebaseClient("web");

export const auth = firebaseClient.auth;
export const db = firebaseClient.db;
