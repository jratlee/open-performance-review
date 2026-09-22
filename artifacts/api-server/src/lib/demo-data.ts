import type {
  ComparisonRecord,
  EvidenceSource,
  MomentComparison,
  PerformanceRecordDetail,
  PerformanceRecordSummary,
  ProjectDetail,
  ProjectSummary,
  RepeatableMoment,
  SourceIndexItem,
} from "@workspace/api-zod";
import { compareMoment } from "@workspace/performance-review";

type ReviewResult = "lower" | "in_line" | "higher" | "no_reliable_read";
type Confidence = "low" | "medium" | "high" | null;

const reviewedAt = new Date("2026-09-18T13:05:00.000Z");
const sourcePolicy =
  "Use public links you have permission to reference. Keep creator, platform, provenance, and licence notes with every record. This tool does not download or host source media.";
const baselineNote =
  "Each record is read against the same production-phase baseline. Repeatable moments are labelled independently first; the record-level result is only reported when the evidence points consistently in one direction.";

export const moments: RepeatableMoment[] = [
  {
    slug: "sushi-dance-break",
    name: "Sushi Dance Break",
    version: 1,
    focus: "movement",
    description:
      "The first chorus drop through the dance break. We watch how much stage is covered and whether movement continues through the defined segment.",
    segmentLabel: "Music for a Sushi Restaurant · 20–60 sec",
  },
  {
    slug: "sign-of-the-times-final-chorus",
    name: "Sign of the Times — Final Chorus",
    version: 1,
    focus: "vocal_interaction",
    description:
      "The final chorus and singalong. We watch the vocal hold, crowd response, and how the moment lands without inferring why.",
    segmentLabel: "Sign of the Times · 30–60 sec",
  },
];

const sourcePlatforms = [
  { platform: "YouTube", creator: "@msgnightly-archive (illustrative)" },
  { platform: "TikTok", creator: "@sushi-cam (illustrative)" },
  { platform: "X", creator: "@fanrec.nyc (illustrative)" },
  { platform: "Instagram", creator: "@togetheragain_clips (illustrative)" },
  { platform: "Tumblr", creator: "@gardenfloor (illustrative)" },
] as const;

function sourceUrl(showDate: string, anchor: "a" | "b", index: number, platform: string) {
  const numericId = `${showDate.replaceAll("-", "").slice(-4)}${anchor}${index}`;
  if (platform === "YouTube") return `https://www.youtube.com/watch?v=DEMO${numericId}`;
  if (platform === "TikTok") return `https://www.tiktok.com/@demo_archive/video/74000000${numericId.replaceAll(/[a-z]/g, "0")}`;
  if (platform === "X") return `https://x.com/demo_archive/status/19000000${numericId.replaceAll(/[a-z]/g, "0")}`;
  if (platform === "Instagram") return `https://www.instagram.com/reel/DEMO${numericId}/`;
  return `https://demo-archive.tumblr.com/post/77000000${numericId.replaceAll(/[a-z]/g, "0")}`;
}

function makeSources(
  showDate: string,
  anchor: "a" | "b",
  count: number,
  selective = false,
): EvidenceSource[] {
  return Array.from({ length: count }, (_, sourceIndex) => {
    const source = sourcePlatforms[sourceIndex % sourcePlatforms.length];
    return {
      id: `src_${showDate.replaceAll("-", "")}_${anchor}${sourceIndex + 1}`,
      url: sourceUrl(showDate, anchor, sourceIndex + 1, source.platform),
      platform: source.platform,
      creator: source.creator,
      provenance: {
        relation: sourceIndex % 4 === 2 ? "repost" : "unknown",
        note: sourceIndex % 4 === 2 ? "Counted once as a possible repost lineage." : null,
      },
      availability: "available",
      quality: sourceIndex % 4 === 2 ? "usable" : "good",
      selective: selective && sourceIndex === 0,
    };
  });
}

function observationsFor(
  anchor: "a" | "b",
  result: ReviewResult,
) {
  if (anchor === "a") {
    return [
      {
        signalType: "movement" as const,
        label: result === "lower" ? "low" : result === "higher" ? "high" : "medium",
        note:
          result === "lower"
            ? "Mostly still through the dance break, with a little movement at the top of the chorus."
            : result === "higher"
              ? "Movement and traversal are sustained across the defined dance section."
              : "Intermittent movement with some active traversal across the chorus.",
      },
      {
        signalType: "stage_coverage" as const,
        label: result === "lower" ? "moderate" : "wide",
        note:
          result === "lower"
            ? "Mostly in one area instead of covering the whole stage."
            : "Moves clearly across the stage during the dance break.",
      },
    ];
  }
  return [
    {
      signalType: "vocal_variation" as const,
      label: result === "lower" ? "shortened" : result === "higher" ? "sustained" : "typical",
      note:
        result === "lower"
          ? "The final vocal hold is shorter in the available angle."
          : result === "higher"
            ? "A sustained final vocal hold is clearly audible."
            : "The vocal hold and phrasing sit within the set's usual range.",
    },
    {
      signalType: "crowd_interaction" as const,
      label: result === "lower" ? "limited" : "present",
      note:
        result === "lower"
          ? "The crowd response is present but the exchange is brief in the clearest clip."
          : "The exchange with the crowd is visible and audible in the linked clips.",
    },
  ];
}

type SeedRecord = {
  date: string;
  venue: string;
  result: ReviewResult;
  confidence: Confidence;
  summary: string;
  coverageNote: string;
  momentEvidenceNote: string;
  sourceCount: number;
  selective?: boolean;
};

const seedRecords: SeedRecord[] = [
  {
    date: "2026-09-02",
    venue: "Madison Square Garden, New York",
    result: "higher",
    confidence: "medium",
    summary: "Both repeatable moments show more visible movement or response than the early baseline records.",
    coverageNote: "Two moments represented, but the clearest movement view is a selective frame.",
    momentEvidenceNote: "A useful early comparison with partial framing; keep the read modest.",
    sourceCount: 4,
    selective: true,
  },
  {
    date: "2026-09-04",
    venue: "Madison Square Garden, New York",
    result: "in_line",
    confidence: "medium",
    summary: "The same moments sit broadly within the range established by the run so far.",
    coverageNote: "Both moments represented across several independent-looking links.",
    momentEvidenceNote: "The clips support an in-line read, with some limits on audio context.",
    sourceCount: 4,
  },
  {
    date: "2026-09-05",
    venue: "Madison Square Garden, New York",
    result: "in_line",
    confidence: "low",
    summary: "The available records look close to the developing baseline, but the source set is smaller.",
    coverageNote: "Some useful clips are available; not every view is independently attributable.",
    momentEvidenceNote: "Not enough independent context for a strong direction.",
    sourceCount: 3,
  },
  {
    date: "2026-09-09",
    venue: "Madison Square Garden, New York",
    result: "higher",
    confidence: "medium",
    summary: "Movement and crowd response are more visible than in the comparable records.",
    coverageNote: "The dance break is well represented; the final chorus has a narrower frame.",
    momentEvidenceNote: "Both moments point upward, with different source quality.",
    sourceCount: 5,
  },
  {
    date: "2026-09-12",
    venue: "Madison Square Garden, New York",
    result: "no_reliable_read",
    confidence: null,
    summary: "There are clips, but not enough comparable coverage to call the record either way.",
    coverageNote: "Fewer than two usable baseline records are available for the clearest comparison.",
    momentEvidenceNote: "The evidence is too incomplete for a responsible comparison.",
    sourceCount: 2,
  },
  {
    date: "2026-09-16",
    venue: "Madison Square Garden, New York",
    result: "lower",
    confidence: "high",
    summary: "Both repeatable moments point below the run's frozen baseline, with the strongest coverage in this example set.",
    coverageNote: "Both moments represented across independent-looking sources with good framing and audio.",
    momentEvidenceNote: "Both observations point below the baseline; this remains a stage-observation read only.",
    sourceCount: 6,
  },
];

function makeRecordSummary(seed: SeedRecord): PerformanceRecordSummary {
  return {
    slug: seed.date,
    date: new Date(`${seed.date}T00:00:00.000Z`),
    venue: seed.venue,
    publicationStatus: "published",
    evidenceStatus: seed.result === "no_reliable_read" ? "insufficient" : seed.sourceCount < 4 ? "partial" : "complete",
    result: seed.result,
    confidence: seed.confidence,
    summary: seed.summary,
    coverageNote: seed.coverageNote,
    momentCount: moments.length,
    usableSourceCount: seed.sourceCount * 2,
    lastReviewedAt: reviewedAt,
  };
}

export const recordSummaries = [...seedRecords].reverse().map(makeRecordSummary);

export const recordDetails: PerformanceRecordDetail[] = seedRecords
  .map((seed) => {
    const momentResult: ReviewResult =
      seed.result === "no_reliable_read" ? "no_reliable_read" : seed.result;
    return {
      ...makeRecordSummary(seed),
      moments: moments.map((moment, index) => ({
        moment,
        result: momentResult,
        observations: observationsFor(index === 0 ? "a" : "b", momentResult),
        sources: makeSources(seed.date, index === 0 ? "a" : "b", seed.sourceCount, seed.selective),
        evidenceNote: seed.momentEvidenceNote,
      })),
      baselineNote,
    };
  })
  .reverse();

export const projectSummary: ProjectSummary = {
  slug: "is-harry-tired-msg",
  name: "Is Harry Tired? / MSG example",
  artist: { slug: "harry-styles", name: "Harry Styles" },
  description: "An illustrative six-show project showing how a fan community can compare repeatable public performance moments.",
  runLabel: "Illustrative example / MSG run",
  status: "illustrative",
  showCount: recordSummaries.length,
  momentCount: moments.length,
  sourceCount: recordSummaries.reduce((total, record) => total + record.usableSourceCount, 0),
  coverageStatus: "complete",
  lastReviewedAt: reviewedAt,
};

export const projectDetail: ProjectDetail = {
  ...projectSummary,
  moments,
  records: recordSummaries,
  sourcePolicy,
};

export const projects: ProjectSummary[] = [projectSummary];

export function getProject(slug: string) {
  return slug === projectSummary.slug ? projectDetail : null;
}

export function getRecord(projectSlug: string, recordSlug: string) {
  if (projectSlug !== projectSummary.slug) return null;
  return recordDetails.find((record) => record.slug === recordSlug) ?? null;
}

export function getMomentComparison(projectSlug: string, momentSlug: string): MomentComparison | null {
  if (projectSlug !== projectSummary.slug) return null;
  const moment = moments.find((candidate) => candidate.slug === momentSlug);
  if (!moment) return null;
  return compareMoment(moment, recordDetails) as unknown as MomentComparison;
}

export function getSourceIndex(query: string, limit: number): SourceIndexItem[] {
  const normalized = query.trim().toLowerCase();
  const results: SourceIndexItem[] = [];
  for (const record of recordDetails) {
    for (const item of record.moments.flatMap((entry) => entry.sources)) {
      const haystack = `${item.platform} ${item.creator ?? ""} ${record.venue} ${record.date.toISOString()}`.toLowerCase();
      if (haystack.includes(normalized)) {
        results.push({
          id: item.id,
          url: item.url,
          platform: item.platform,
          creator: item.creator,
          title: `${record.venue} · ${record.date.toISOString().slice(0, 10)}`,
          projectSlug: projectSummary.slug,
          recordSlug: record.slug,
          provenanceStatus: item.provenance.relation,
        });
      }
      if (results.length >= limit) return results;
    }
  }
  return results;
}