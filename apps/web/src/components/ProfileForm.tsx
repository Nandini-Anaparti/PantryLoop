"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import {
  allergies,
  budgetLevels,
  cookingStyles,
  culturalFoodPreferences,
  dietaryRestrictions,
  preferredCuisines,
  spiceLevels,
  type UserProfile,
  type UserProfileUpdate,
} from "@pantryloop/shared";

interface ProfileFormProps {
  formData: UserProfile;
  onSave: (update: UserProfileUpdate) => Promise<void>;
  saving: boolean;
}

function parseCommaSeparatedInput(value: string): string[] {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function toggleInArray<T extends string>(current: readonly T[], value: T): T[] {
  return current.includes(value) ? current.filter((entry) => entry !== value) : [...current, value];
}

export function ProfileForm({ formData, onSave, saving }: ProfileFormProps) {
  const [draft, setDraft] = useState<UserProfile>(formData);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setDraft(formData);
  }, [formData]);

  function updateField<K extends keyof UserProfile>(field: K, value: UserProfile[K]) {
    setDraft((previous) => ({ ...previous, [field]: value }));
  }

  function handleNumberChange(field: keyof UserProfile) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const parsed = Number.parseInt(event.target.value, 10);
      const safeValue = Number.isNaN(parsed) ? 0 : parsed;
      setDraft((previous) => ({ ...previous, [field]: safeValue }));
    };
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setError("");

    try {
      const update: UserProfileUpdate = {
        displayName: draft.displayName,
        dietaryRestrictions: draft.dietaryRestrictions,
        allergies: draft.allergies,
        customAllergies: draft.customAllergies,
        culturalFoodPreferences: draft.culturalFoodPreferences,
        customCulturalRules: draft.customCulturalRules,
        preferredCuisines: draft.preferredCuisines,
        customCuisines: draft.customCuisines,
        spiceLevel: draft.spiceLevel,
        cookingStyles: draft.cookingStyles,
        householdSize: draft.householdSize,
        peopleCookedFor: draft.peopleCookedFor,
        mealsPerDay: draft.mealsPerDay,
        snacksPerDay: draft.snacksPerDay,
        groceryPlanLengthDays: draft.groceryPlanLengthDays,
        budgetLevel: draft.budgetLevel,
        disposalRegionId: draft.disposalRegionId,
      };

      await onSave(update);
      setStatus("Profile saved successfully.");
    } catch {
      setError("Could not save profile. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem", maxWidth: 760 }}>
      <h2>Profile onboarding</h2>

      <label>
        Display name
        <input value={draft.displayName ?? ""} onChange={(event) => updateField("displayName", event.target.value)} />
      </label>

      <fieldset>
        <legend>Dietary restrictions</legend>
        {dietaryRestrictions.map((restriction) => (
          <label key={restriction} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={draft.dietaryRestrictions.includes(restriction)}
              onChange={() => updateField("dietaryRestrictions", toggleInArray(draft.dietaryRestrictions, restriction))}
            />
            {restriction}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Allergies</legend>
        {allergies.map((allergy) => (
          <label key={allergy} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={draft.allergies.includes(allergy)}
              onChange={() => updateField("allergies", toggleInArray(draft.allergies, allergy))}
            />
            {allergy}
          </label>
        ))}
      </fieldset>

      <label>
        Custom allergies (comma-separated)
        <input
          value={draft.customAllergies.join(", ")}
          onChange={(event) => updateField("customAllergies", parseCommaSeparatedInput(event.target.value))}
        />
      </label>

      <fieldset>
        <legend>Cultural / religious preferences</legend>
        {culturalFoodPreferences.map((preference) => (
          <label key={preference} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={draft.culturalFoodPreferences.includes(preference)}
              onChange={() =>
                updateField("culturalFoodPreferences", toggleInArray(draft.culturalFoodPreferences, preference))
              }
            />
            {preference}
          </label>
        ))}
      </fieldset>

      <label>
        Preferred cuisines (comma-separated or use checkboxes below)
        <input
          value={draft.customCuisines.join(", ")}
          onChange={(event) => updateField("customCuisines", parseCommaSeparatedInput(event.target.value))}
        />
      </label>

      <fieldset>
        <legend>Common cuisines</legend>
        {preferredCuisines.map((cuisine) => (
          <label key={cuisine} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={draft.preferredCuisines.includes(cuisine)}
              onChange={() => updateField("preferredCuisines", toggleInArray(draft.preferredCuisines, cuisine))}
            />
            {cuisine}
          </label>
        ))}
      </fieldset>

      <label>
        Spice level
        <select value={draft.spiceLevel} onChange={(event) => updateField("spiceLevel", event.target.value as UserProfile["spiceLevel"])}>
          {spiceLevels.map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </label>

      <fieldset>
        <legend>Cooking styles</legend>
        {cookingStyles.map((style) => (
          <label key={style} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={draft.cookingStyles.includes(style)}
              onChange={() => updateField("cookingStyles", toggleInArray(draft.cookingStyles, style))}
            />
            {style}
          </label>
        ))}
      </fieldset>

      <label>Household size<input type="number" min={1} value={draft.householdSize} onChange={handleNumberChange("householdSize")} /></label>
      <label>People cooked for<input type="number" min={1} value={draft.peopleCookedFor} onChange={handleNumberChange("peopleCookedFor")} /></label>
      <label>Meals per day<input type="number" min={1} value={draft.mealsPerDay} onChange={handleNumberChange("mealsPerDay")} /></label>
      <label>Snacks per day<input type="number" min={0} value={draft.snacksPerDay} onChange={handleNumberChange("snacksPerDay")} /></label>
      <label>Grocery plan days<input type="number" min={1} value={draft.groceryPlanLengthDays} onChange={handleNumberChange("groceryPlanLengthDays")} /></label>

      <label>
        Budget level
        <select value={draft.budgetLevel} onChange={(event) => updateField("budgetLevel", event.target.value as UserProfile["budgetLevel"])}>
          {budgetLevels.map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </label>

      <label>
        Disposal region/location (pilot)
        <input value={draft.disposalRegionId ?? ""} onChange={(event) => updateField("disposalRegionId", event.target.value)} />
      </label>

      <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save profile"}</button>
      {status ? <p>{status}</p> : null}
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
    </form>
  );
}
