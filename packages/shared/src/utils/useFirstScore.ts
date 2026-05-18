import type { PantryItem, UseFirstScore } from "../types/index.js";

const millisecondsPerDay = 24 * 60 * 60 * 1000;

export function calculateBasicUseFirstScore(
  item: PantryItem,
  now: Date = new Date(),
): UseFirstScore {
  const reasons: string[] = [];
  let score = 0;
  let daysUntilEstimatedExpiry: number | undefined;

  if (item.estimatedExpiryDate) {
    const expiryDate = new Date(item.estimatedExpiryDate);
    daysUntilEstimatedExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / millisecondsPerDay);

    if (daysUntilEstimatedExpiry <= 0) {
      score += 100;
      reasons.push("Estimated expiry date has passed or is today.");
    } else if (daysUntilEstimatedExpiry <= 2) {
      score += 80;
      reasons.push("Estimated expiry date is within two days.");
    } else if (daysUntilEstimatedExpiry <= 7) {
      score += 50;
      reasons.push("Estimated expiry date is within one week.");
    } else {
      score += 10;
      reasons.push("Estimated expiry date is not urgent yet.");
    }
  }

  if (item.opened) {
    score += 15;
    reasons.push("Item is opened.");
  }

  if (item.storageLocation === "fridge" || item.category === "produce" || item.category === "leftover") {
    score += 10;
    reasons.push("Item is likely freshness-sensitive.");
  }

  const cappedScore = Math.min(score, 100);

  return {
    itemId: item.itemId,
    score: cappedScore,
    band:
      cappedScore >= 85
        ? "use-today"
        : cappedScore >= 50
          ? "use-this-week"
          : cappedScore >= 20
            ? "monitor"
            : "low-priority",
    reasons,
    daysUntilEstimatedExpiry,
    calculatedAt: now.toISOString(),
  };
}
