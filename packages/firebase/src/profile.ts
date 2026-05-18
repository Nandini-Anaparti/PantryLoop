import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  type DocumentReference,
  type Firestore,
} from "firebase/firestore";
import {
  applyUserProfileUpdate,
  createDefaultUserProfile,
  normalizeUserProfile,
  validateUserProfile,
  type UserProfile,
  type UserProfileInput,
  type UserProfileUpdate,
} from "@pantryloop/shared";

export const userProfileCollectionName = "profile";
export const userProfileDocumentId = "main";

export function getUserProfilePath(userId: string): string {
  return `users/${userId}/${userProfileCollectionName}/${userProfileDocumentId}`;
}

export function getUserProfileRef(db: Firestore, userId: string): DocumentReference<UserProfile> {
  return doc(db, getUserProfilePath(userId)) as DocumentReference<UserProfile>;
}

export async function getUserProfile(db: Firestore, userId: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(getUserProfileRef(db, userId));

  if (!snapshot.exists()) {
    return null;
  }

  return normalizeUserProfile(snapshot.data());
}

export async function createUserProfile(
  db: Firestore,
  input: UserProfileInput,
  now: Date = new Date(),
): Promise<UserProfile> {
  const profile = createDefaultUserProfile(input, now);
  assertValidUserProfile(profile);

  await setDoc(getUserProfileRef(db, profile.userId), profile, { merge: false });

  return profile;
}

export async function updateUserProfile(
  db: Firestore,
  existingProfile: UserProfile,
  update: UserProfileUpdate,
  now: Date = new Date(),
): Promise<UserProfile> {
  const nextProfile = applyUserProfileUpdate(existingProfile, update, now);
  assertValidUserProfile(nextProfile);

  await updateDoc(getUserProfileRef(db, nextProfile.userId), { ...nextProfile });

  return nextProfile;
}

function assertValidUserProfile(profile: UserProfile): void {
  const result = validateUserProfile(profile);

  if (!result.valid) {
    throw new Error(`Invalid user profile: ${result.errors.join(" ")}`);
  }
}
