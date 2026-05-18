export type StorageLocation = "pantry" | "fridge" | "freezer" | "counter";

export type PantryCategory =
  | "produce"
  | "dairy"
  | "protein"
  | "grain"
  | "legume"
  | "spice"
  | "condiment"
  | "snack"
  | "beverage"
  | "frozen"
  | "leftover"
  | "other";

export type QuantityUnit =
  | "g"
  | "kg"
  | "ml"
  | "l"
  | "oz"
  | "lb"
  | "each"
  | "package"
  | "cup"
  | "tbsp"
  | "tsp"
  | "serving";

export type FreshnessRisk = "low" | "medium" | "high";

export interface PantryItem {
  itemId: string;
  userId: string;
  name: string;
  category: PantryCategory;
  quantity: number;
  unit: QuantityUnit;
  purchaseDate?: string;
  openedDate?: string;
  storageLocation: StorageLocation;
  estimatedExpiryDate?: string;
  actualExpiryDate?: string;
  opened: boolean;
  notes?: string;
  packagingType?: string;
  disposalCategory?: string;
  freshnessRisk?: FreshnessRisk;
  createdAt: string;
  updatedAt: string;
}

export type UseFirstBand = "use-today" | "use-this-week" | "monitor" | "low-priority";

export interface UseFirstScore {
  itemId: string;
  score: number;
  band: UseFirstBand;
  reasons: string[];
  daysUntilEstimatedExpiry?: number;
  canFreeze?: boolean;
  canDonate?: boolean;
  compostSoon?: boolean;
  recyclePackaging?: boolean;
  needsDepotDropOff?: boolean;
  calculatedAt: string;
}
