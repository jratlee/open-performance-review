import { Router, type IRouter } from "express";
import {
  GetProjectMomentComparisonResponse,
  GetProjectRecordResponse,
  GetProjectResponse,
  ListProjectsResponse,
  SearchSourceIndexQueryParams,
  SearchSourceIndexResponse,
} from "@workspace/api-zod";
import {
  getMomentComparison,
  getProject,
  getRecord,
  getSourceIndex,
  projects,
} from "../lib/demo-data";

const router: IRouter = Router();
const requestWindows = new Map<string, { startedAt: number; count: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 120;
const slugPattern = /^[a-z0-9-]{1,80}$/;

router.use((req, res, next) => {
  const key = req.ip || "unknown";
  const now = Date.now();
  const current = requestWindows.get(key);
  const window = !current || now - current.startedAt >= WINDOW_MS
    ? { startedAt: now, count: 0 }
    : current;
  window.count += 1;
  requestWindows.set(key, window);
  if (window.count > MAX_REQUESTS_PER_WINDOW) {
    res.setHeader("Retry-After", "60");
    res.status(429).json({ error: "Too many requests" });
    return;
  }
  next();
});

function readSlug(value: string | undefined, res: Parameters<Parameters<IRouter["get"]>[1]>[1]) {
  if (!value || !slugPattern.test(value)) {
    res.status(400).json({ error: "Invalid resource identifier" });
    return null;
  }
  return value;
}

router.get("/projects", (_req, res) => {
  res.json(ListProjectsResponse.parse(projects));
});

router.get("/projects/:projectSlug", (req, res) => {
  const projectSlug = readSlug(req.params.projectSlug, res);
  if (!projectSlug) return;
  const project = getProject(projectSlug);
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json(GetProjectResponse.parse(project));
});

router.get("/projects/:projectSlug/records/:recordSlug", (req, res) => {
  const projectSlug = readSlug(req.params.projectSlug, res);
  const recordSlug = readSlug(req.params.recordSlug, res);
  if (!projectSlug || !recordSlug) return;
  const record = getRecord(projectSlug, recordSlug);
  if (!record) {
    res.status(404).json({ error: "Performance record not found" });
    return;
  }
  res.json(GetProjectRecordResponse.parse(record));
});

router.get("/projects/:projectSlug/moments/:momentSlug/comparison", (req, res) => {
  const projectSlug = readSlug(req.params.projectSlug, res);
  const momentSlug = readSlug(req.params.momentSlug, res);
  if (!projectSlug || !momentSlug) return;
  const comparison = getMomentComparison(projectSlug, momentSlug);
  if (!comparison) {
    res.status(404).json({ error: "Moment comparison not found" });
    return;
  }
  res.json(GetProjectMomentComparisonResponse.parse(comparison));
});

router.get("/source-index", (req, res) => {
  const parsed = SearchSourceIndexQueryParams.safeParse({
    q: req.query.q,
    limit: req.query.limit,
  });
  if (!parsed.success) {
    res.status(400).json({ error: "Enter at least two characters to search the bounded index." });
    return;
  }
  const { q, limit } = parsed.data;
  res.json(SearchSourceIndexResponse.parse({
    query: q,
    bounded: true,
    notice: "This is a small curated index of records already in the project. No arbitrary URL is fetched.",
    results: getSourceIndex(q, limit),
  }));
});

export default router;