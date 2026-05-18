export type DisposalPath =
  | "eat"
  | "use-soon"
  | "freeze"
  | "preserve"
  | "donate"
  | "compost"
  | "recycle-curbside"
  | "depot-drop-off"
  | "trash";

export type DisposalMaterialType =
  | "food-scrap"
  | "paper-cardboard"
  | "plastic-rigid"
  | "plastic-film"
  | "glass"
  | "metal"
  | "carton"
  | "compostable-packaging"
  | "mixed-material"
  | "other";

export interface DisposalItem {
  disposalItemId: string;
  userId: string;
  pantryItemId?: string;
  name: string;
  materialType: DisposalMaterialType;
  packagingType?: string;
  regionId?: string;
  isFoodSafeToDonate?: boolean;
  sealedOrUnopened?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DisposalInstruction {
  instructionId: string;
  regionId: string;
  itemName: string;
  materialType: DisposalMaterialType;
  recommendedPath: DisposalPath;
  acceptedLocally: boolean | "check-local-rules";
  preparationSteps: string[];
  warnings: string[];
  depotRequired: boolean;
  mapSearchQuery?: string;
  sourceLabel?: string;
  sourceUrl?: string;
  updatedAt: string;
}
