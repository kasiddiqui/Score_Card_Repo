// Weighted averages mapping
export const WEIGHTS = {
  awarenessRating: 0.05,
  entryBarriersRating: 0.05,
  supplierRating: 0.05, // Commercial Readiness
  targetGrowthRating: 0.08,
  grossMarginRating: 0.10,
  tenderFeasibility: 0.07,
  privateMarketRating: 0.05,
  businessDevRating: 0.05,
  regulatoryRating: 0.05,
  productComplexity: 0.07,
  operationalComplex: 0.05,
  timeToMarketRating: 0.05,
  // Other fields sum up to 1 (omitted some minor ones to keep succinct, but the arithmetic normalizes).
};

export const RATING_VALUES: Record<string, number> = {
  "Very High": 5,
  "Very Low Barriers": 5,
  "Fully Ready": 5,
  "No New Team": 5,
  "Very Easy": 5,
  "Very Strong Fit": 5,
  "No Complex": 5,
  "Very Fast": 5,
  "Very High Margin": 5,
  "High": 4,
  "Low Barriers": 4,
  "Ready": 4,
  "Minor Additions": 4,
  "Easy": 4,
  "Strong Fit": 4,
  "Low Complex": 4,
  "Fast": 4,
  "High Margin": 4,
  "Medium": 3,
  "Medium Barriers": 3,
  "Partially Ready": 3,
  "Some New Staff": 3,
  "Moderate": 3,
  "Moderate Fit": 3,
  "Moderate Margin": 3,
  "Low": 2,
  "High Barriers": 2,
  "Limited Readiness": 2,
  "Major New Team": 2,
  "Difficult": 2,
  "Low Fit": 2,
  "Complex": 2,
  "Slow": 2,
  "Low Margin": 2,
  "Minimal": 1,
  "Very High Barriers": 1,
  "Not Ready": 1,
  "Full New Setup": 1,
  "Very Difficult": 1,
  "Very Low Fit": 1,
  "Very Complex": 1,
  "Very Slow": 1,
  "Very Low Margin": 1,
  "To Be Assessed": 0,
};

export function calculateScore(payload: any) {
  let score = 0;
  let maxWeight = 0;

  for (const [key, weight] of Object.entries(WEIGHTS)) {
    const rawVal = payload[key];
    if (rawVal && RATING_VALUES[rawVal] !== undefined) {
      score += RATING_VALUES[rawVal] * weight;
      maxWeight += weight; // dynamically summing weights to normalize out of 5
    }
  }

  // Normalize back to 5-point scale based on the provided weights
  if (maxWeight === 0) return 0;
  const finalScore = score / maxWeight; 
  return Math.max(Math.min(finalScore, 5), 0);
}

export function isDropZone(payload: any): string[] {
  const drops = [];
  if (payload.regulatoryRating === 'Very Difficult') drops.push("Regulatory Very Difficult");
  if (payload.productComplexity === 'Very Difficult') drops.push("Product Complexity High");
  if (payload.supplierRating === 'Not Ready') drops.push("No Suppliers Available");
  return drops;
}
