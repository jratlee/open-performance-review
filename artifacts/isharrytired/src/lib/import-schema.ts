import { z } from 'zod';

const safeSourceUrl = z.string().url().refine((value) => {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) return false;
    const hostname = url.hostname.toLowerCase();
    const normalizedHostname = hostname.replaceAll('[', '').replaceAll(']', '');
    if (normalizedHostname === 'localhost' || normalizedHostname.endsWith('.local') || normalizedHostname === '::1' || normalizedHostname === '0.0.0.0' || normalizedHostname.startsWith('127.')) return false;
    const privateIpv4 = /^(0|10|127|169\.254|192\.168|172\.(1[6-9]|2\d|3[0-1])|100\.(6[4-9]|[7-9]\d))\./;
    return !privateIpv4.test(normalizedHostname);
  } catch {
    return false;
  }
}, 'Use a public http(s) source URL.');

const importedSource = z.object({
  url: safeSourceUrl,
  platform: z.string().trim().min(1).max(40),
  creator: z.string().trim().max(160).nullable().optional(),
  provenance: z.object({
    relation: z.enum(['original', 'repost', 'unknown']),
    note: z.string().max(300).nullable().optional(),
  }).optional(),
});

const importedObservation = z.object({
  signalType: z.string().trim().min(1).max(60),
  label: z.string().trim().min(1).max(80),
  note: z.string().trim().min(1).max(500),
});

const importedMoment = z.object({
  slug: z.string().regex(/^[a-z0-9-]{1,80}$/),
  name: z.string().trim().min(1).max(160),
  version: z.number().int().positive().default(1),
  focus: z.enum(['movement', 'vocal_interaction', 'crowd_interaction', 'staging', 'other']),
  description: z.string().trim().min(1).max(500),
  segmentLabel: z.string().trim().min(1).max(160),
});

const importedRecordMoment = z.object({
  momentSlug: z.string().regex(/^[a-z0-9-]{1,80}$/),
  result: z.enum(['lower', 'in_line', 'higher', 'no_reliable_read']),
  observations: z.array(importedObservation).max(20).default([]),
  sources: z.array(importedSource).max(30).default([]),
});

export const importedProject = z.object({
  project: z.object({
    slug: z.string().regex(/^[a-z0-9-]{1,80}$/),
    name: z.string().trim().min(1).max(160),
    artist: z.object({ slug: z.string().regex(/^[a-z0-9-]{1,80}$/), name: z.string().trim().min(1).max(160) }),
    runLabel: z.string().trim().min(1).max(160),
    description: z.string().trim().max(500).default('Imported local project'),
  }),
  moments: z.array(importedMoment).min(1).max(50),
  records: z.array(z.object({
    slug: z.string().regex(/^[a-z0-9-]{1,80}$/),
    date: z.string().date(),
    venue: z.string().trim().min(1).max(200),
    moments: z.array(importedRecordMoment).min(1).max(50),
  })).min(1).max(500),
});

export type ImportedProject = z.infer<typeof importedProject>;
export { safeSourceUrl };