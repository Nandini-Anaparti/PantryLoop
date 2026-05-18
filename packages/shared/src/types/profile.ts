export type DietaryRestriction =
  | "vegetarian"
  | "vegan"
  | "pescatarian"
  | "ovo-vegetarian"
  | "gluten-free"
  | "dairy-free"
  | "keto"
  | "high-protein"
  | "balanced"
  | "budget-focused";

export type Allergy =
  | "nuts"
  | "dairy"
  | "eggs"
  | "shellfish"
  | "sesame"
  | "gluten"
  | "soy"
  | "custom";

export type CulturalFoodPreference =
  | "hindu-vegetarian"
  | "telugu-hindu-meals"
  | "jain-friendly"
  | "halal"
  | "kosher-style"
  | "no-beef"
  | "no-pork"
  | "egg-free"
  | "onion-garlic-free"
  | "custom";

export type PreferredCuisine =
  | "telugu"
  | "south-indian"
  | "north-indian"
  | "asian"
  | "western-english"
  | "italian"
  | "mexican"
  | "mediterranean"
  | "custom";

export type SpiceLevel = "mild" | "medium" | "spicy";

export type CookingStyle =
  | "quick-meals"
  | "batch-cooking"
  | "traditional-meals"
  | "student-meals"
  | "family-meals";

export type BudgetLevel = "low" | "moderate" | "flexible";

export interface UserProfile {
  userId: string;
  displayName?: string;
  email?: string;
  dietaryRestrictions: DietaryRestriction[];
  allergies: Allergy[];
  customAllergies: string[];
  culturalFoodPreferences: CulturalFoodPreference[];
  customCulturalRules: string[];
  preferredCuisines: PreferredCuisine[];
  customCuisines: string[];
  spiceLevel: SpiceLevel;
  cookingStyles: CookingStyle[];
  householdSize: number;
  peopleCookedFor: number;
  mealsPerDay: number;
  snacksPerDay: number;
  groceryPlanLengthDays: number;
  budgetLevel: BudgetLevel;
  disposalRegionId?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserProfileInput = Partial<Omit<UserProfile, "userId" | "createdAt" | "updatedAt">> & {
  userId: string;
  createdAt?: string;
  updatedAt?: string;
};

export type UserProfileUpdate = Partial<Omit<UserProfile, "userId" | "createdAt" | "updatedAt">>;
