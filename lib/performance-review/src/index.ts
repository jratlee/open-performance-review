export type ReviewResult = "lower" | "in_line" | "higher" | "no_reliable_read";
export type EvidenceSource = { id: string; url: string; platform: string };
export type RepeatableMoment = { slug: string };
export type PerformanceRecordDetail = {
  slug: string;
  moments: Array<{
    moment: RepeatableMoment;
    result: ReviewResult;
    observations: unknown[];
    sources: EvidenceSource[];
  }>;
};
export type ComparisonRecord = {
  record: PerformanceRecordDetail;
  result: ReviewResult;
  observations: unknown[];
  sources: EvidenceSource[];
};
export type MomentComparison = {
  moment: RepeatableMoment;
  baselineRule: string;
  baselineCoverage: number;
  records: ComparisonRecord[];
};

const comparableResults = new Set<ReviewResult>(["lower", "in_line", "higher"]);

/**
 * Compare one locked moment across records without treating an incomplete
 * record as evidence. The engine is deliberately conservative: fewer than
 * two comparable records yields no_reliable_read.
 */
export function compareMoment(
  moment: RepeatableMoment,
  records: PerformanceRecordDetail[],
): MomentComparison {
  const comparisonRecords: ComparisonRecord[] = records.map((record) => {
    const entry = record.moments.find((item) => item.moment.slug === moment.slug);
    return {
      record,
      result: entry?.result ?? "no_reliable_read",
      observations: entry?.observations ?? [],
      sources: entry?.sources ?? [],
    };
  });

  const comparableCount = comparisonRecords.filter((item) =>
    comparableResults.has(item.result),
  ).length;

  return {
    moment,
    baselineCoverage: comparableCount,
    baselineRule:
      "Compare the same repeatable moment across published records with usable evidence. Fewer than two comparable records means not enough to tell.",
    records: comparisonRecords,
  };
}

/**
 * Derive a record-level result only after each repeatable moment has been
 * labelled independently. Mixed or incomplete moments never become a
 * definitive overall read.
 */
export function deriveRecordResult(results: ReviewResult[]): ReviewResult {
  const comparable = results.filter((result) => comparableResults.has(result));
  if (comparable.length < 2) return "no_reliable_read";
  if (comparable.every((result) => result === comparable[0])) return comparable[0];
  return "no_reliable_read";
}