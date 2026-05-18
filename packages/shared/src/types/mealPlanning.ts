import type { Allergy, CulturalFoodPreference, DietaryRestriction } from "./profile.js";
import type { QuantityUnit } from "./pantry.js";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface PlannedMeal {
  mealId: string;
  dayNumber: number;
  mealType: MealType;
  name: string;
  servings: number;
  cuisineTags: string[];
  pantryItemIdsUsed: string[];
  missingIngredients: GroceryListItem[];
  allergenWarnings: Allergy[];
  substitutionSuggestions: string[];
  prepNotes?: string;
  leftoversStrategy?: string;
}

export interface MealPlan {
  mealPlanId: string;
  userId: string;
  days: number;
  peopleCookedFor: number;
  mealsPerDay: number;
  snacksPerDay: number;
  dietaryRestrictions: DietaryRestriction[];
  culturalFoodPreferences: CulturalFoodPreference[];
  useFirstItemIds: string[];
  meals: PlannedMeal[];
  groceryList: GroceryListItem[];
  createdAt: string;
  updatedAt: string;
}

export interface GroceryListItem {
  groceryItemId: string;
  name: string;
  quantity?: number;
  unit?: QuantityUnit;
  section?: GrocerySection;
  neededForMealIds: string[];
  alreadyInPantry: boolean;
  allergenFlags: Allergy[];
  substitutionOptions?: string[];
  budgetNote?: string;
}

export type GrocerySection =
  | "produce"
  | "dairy"
  | "meat-seafood"
  | "plant-protein"
  | "grains-bakery"
  | "canned-dry-goods"
  | "spices-condiments"
  | "frozen"
  | "household"
  | "other";
