import type {
  Allergy,
  BudgetLevel,
  CookingStyle,
  CulturalFoodPreference,
  DietaryRestriction,
  PreferredCuisine,
  SpiceLevel,
  UserProfile,
  UserProfileInput,
  UserProfileUpdate,
} from "../types/index.js";

export const dietaryRestrictions = [
  "vegetarian",
  "vegan",
  "pescatarian",
  "ovo-vegetarian",
  "gluten-free",
  "dairy-free",
  "keto",
  "high-protein",
  "balanced",
  "budget-focused",
] as const satisfies readonly DietaryRestriction[];

export const allergies = ["nuts", "dairy", "eggs", "shellfish", "sesame", "gluten", "soy", "custom"] as const satisfies readonly Allergy[];

export const culturalFoodPreferences = [
  "hindu-vegetarian",
  "telugu-hindu-meals",
  "jain-friendly",
  "halal",
  "kosher-style",
  "no-beef",
  "no-pork",
  "egg-free",
  "onion-garlic-free",
  "custom",
] as const satisfies readonly CulturalFoodPreference[];

export const preferredCuisines = [
  "telugu",
  "south-indian",
  "north-indian",
  "asian",
  "western-english",
  "italian",
  "mexican",
  "mediterranean",
  "custom",
] as const satisfies readonly PreferredCuisine[];

export const spiceLevels = ["mild", "medium", "spicy"] as const satisfies readonly SpiceLevel[];

export const cookingStyles = [
  "quick-meals",
  "batch-cooking",
  "traditional-meals",
  "student-meals",
  "family-meals",
] as const satisfies readonly CookingStyle[];

export const budgetLevels = ["low", "moderate", "flexible"] as const satisfies readonly BudgetLevel[];

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const defaultProfileNumbers = {
  householdSize: 1,
  peopleCookedFor: 1,
  mealsPerDay: 3,
  snacksPerDay: 0,
  groceryPlanLengthDays: 7,
} as const;

function includesValue<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === "string" && values.includes(value as T);
}

function normalizeOptionalText(value: string | undefined): string | undefined {
  const trimmed = value?.trim();

  return trimmed ? trimmed : undefined;
}

function normalizeTextArray(values: readonly string[] | undefined): string[] {
  return [...new Set((values ?? []).map((value) => value.trim()).filter(Boolean))];
}

function normalizeEnumArray<T extends string>(values: readonly T[], selected: readonly T[] | undefined): T[] {
  return [...new Set((selected ?? []).filter((value) => includesValue(values, value)))];
}

function normalizePositiveInteger(value: number | undefined, fallback: number, maximum: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(Math.max(Math.trunc(value), 1), maximum);
}

function normalizeNonNegativeInteger(value: number | undefined, fallback: number, maximum: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(Math.max(Math.trunc(value), 0), maximum);
}

export function createDefaultUserProfile(input: UserProfileInput, now: Date = new Date()): UserProfile {
  const timestamp = now.toISOString();

  return normalizeUserProfile({
    userId: input.userId,
    displayName: input.displayName,
    email: input.email,
    dietaryRestrictions: input.dietaryRestrictions ?? [],
    allergies: input.allergies ?? [],
    customAllergies: input.customAllergies ?? [],
    culturalFoodPreferences: input.culturalFoodPreferences ?? [],
    customCulturalRules: input.customCulturalRules ?? [],
    preferredCuisines: input.preferredCuisines ?? [],
    customCuisines: input.customCuisines ?? [],
    spiceLevel: input.spiceLevel ?? "medium",
    cookingStyles: input.cookingStyles ?? ["quick-meals"],
    householdSize: input.householdSize ?? defaultProfileNumbers.householdSize,
    peopleCookedFor: input.peopleCookedFor ?? input.householdSize ?? defaultProfileNumbers.peopleCookedFor,
    mealsPerDay: input.mealsPerDay ?? defaultProfileNumbers.mealsPerDay,
    snacksPerDay: input.snacksPerDay ?? defaultProfileNumbers.snacksPerDay,
    groceryPlanLengthDays: input.groceryPlanLengthDays ?? defaultProfileNumbers.groceryPlanLengthDays,
    budgetLevel: input.budgetLevel ?? "moderate",
    disposalRegionId: input.disposalRegionId,
    createdAt: input.createdAt ?? timestamp,
    updatedAt: input.updatedAt ?? timestamp,
  });
}

export function normalizeUserProfile(profile: UserProfile): UserProfile {
  return {
    ...profile,
    displayName: normalizeOptionalText(profile.displayName),
    email: normalizeOptionalText(profile.email),
    dietaryRestrictions: normalizeEnumArray(dietaryRestrictions, profile.dietaryRestrictions),
    allergies: normalizeEnumArray(allergies, profile.allergies),
    customAllergies: normalizeTextArray(profile.customAllergies),
    culturalFoodPreferences: normalizeEnumArray(culturalFoodPreferences, profile.culturalFoodPreferences),
    customCulturalRules: normalizeTextArray(profile.customCulturalRules),
    preferredCuisines: normalizeEnumArray(preferredCuisines, profile.preferredCuisines),
    customCuisines: normalizeTextArray(profile.customCuisines),
    spiceLevel: includesValue(spiceLevels, profile.spiceLevel) ? profile.spiceLevel : "medium",
    cookingStyles: normalizeEnumArray(cookingStyles, profile.cookingStyles),
    householdSize: normalizePositiveInteger(profile.householdSize, defaultProfileNumbers.householdSize, 20),
    peopleCookedFor: normalizePositiveInteger(profile.peopleCookedFor, defaultProfileNumbers.peopleCookedFor, 20),
    mealsPerDay: normalizePositiveInteger(profile.mealsPerDay, defaultProfileNumbers.mealsPerDay, 6),
    snacksPerDay: normalizeNonNegativeInteger(profile.snacksPerDay, defaultProfileNumbers.snacksPerDay, 6),
    groceryPlanLengthDays: normalizePositiveInteger(
      profile.groceryPlanLengthDays,
      defaultProfileNumbers.groceryPlanLengthDays,
      31,
    ),
    budgetLevel: includesValue(budgetLevels, profile.budgetLevel) ? profile.budgetLevel : "moderate",
    disposalRegionId: normalizeOptionalText(profile.disposalRegionId),
  };
}

export function updateUserProfileTimestamp(profile: UserProfile, now: Date = new Date()): UserProfile {
  return {
    ...profile,
    updatedAt: now.toISOString(),
  };
}

export function applyUserProfileUpdate(
  profile: UserProfile,
  update: UserProfileUpdate,
  now: Date = new Date(),
): UserProfile {
  return updateUserProfileTimestamp(normalizeUserProfile({ ...profile, ...update }), now);
}

export function validateUserProfile(profile: UserProfile): ValidationResult {
  const errors: string[] = [];

  if (!profile.userId.trim()) {
    errors.push("User profile requires a userId.");
  }

  if (profile.email && !profile.email.includes("@")) {
    errors.push("Email must look like a valid email address when provided.");
  }

  validateEnumArray("dietaryRestrictions", profile.dietaryRestrictions, dietaryRestrictions, errors);
  validateEnumArray("allergies", profile.allergies, allergies, errors);
  validateEnumArray("culturalFoodPreferences", profile.culturalFoodPreferences, culturalFoodPreferences, errors);
  validateEnumArray("preferredCuisines", profile.preferredCuisines, preferredCuisines, errors);
  validateEnumArray("cookingStyles", profile.cookingStyles, cookingStyles, errors);

  if (!includesValue(spiceLevels, profile.spiceLevel)) {
    errors.push("Spice level is not supported.");
  }

  if (!includesValue(budgetLevels, profile.budgetLevel)) {
    errors.push("Budget level is not supported.");
  }

  validateIntegerRange("householdSize", profile.householdSize, 1, 20, errors);
  validateIntegerRange("peopleCookedFor", profile.peopleCookedFor, 1, 20, errors);
  validateIntegerRange("mealsPerDay", profile.mealsPerDay, 1, 6, errors);
  validateIntegerRange("snacksPerDay", profile.snacksPerDay, 0, 6, errors);
  validateIntegerRange("groceryPlanLengthDays", profile.groceryPlanLengthDays, 1, 31, errors);

  if (Number.isNaN(Date.parse(profile.createdAt))) {
    errors.push("createdAt must be an ISO-compatible date string.");
  }

  if (Number.isNaN(Date.parse(profile.updatedAt))) {
    errors.push("updatedAt must be an ISO-compatible date string.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function validateEnumArray<T extends string>(
  fieldName: string,
  selected: readonly T[],
  allowedValues: readonly T[],
  errors: string[],
): void {
  const invalidValues = selected.filter((value) => !includesValue(allowedValues, value));

  if (invalidValues.length > 0) {
    errors.push(`${fieldName} contains unsupported values: ${invalidValues.join(", ")}.`);
  }
}

function validateIntegerRange(
  fieldName: string,
  value: number,
  minimum: number,
  maximum: number,
  errors: string[],
): void {
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    errors.push(`${fieldName} must be an integer between ${minimum} and ${maximum}.`);
  }
}
