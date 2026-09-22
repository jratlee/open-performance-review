import { ArrowRight, Check, CircleAlert, ExternalLink, Minus, MoveDown, MoveUp, Play, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'wouter';
import type { EvidenceSource, PerformanceRecordSummary, ProjectSummary, RepeatableMoment, Observation } from '@workspace/api-client-react';
import { confidenceLabel, coverageLabel, formatDate, resultLabel, resultTone, showSummary, signalLabel, sourceQualityLabel } from '@/lib/format';
import { trackEvent } from '@/lib/analytics';

export function ResultMark({ result, compact = false }: { result: string; compact?: boolean }) {
  const tone = resultTone(result);
  const Icon = tone === 'higher' ? MoveUp : tone === 'lower' ? MoveDown : tone === 'inline' ? Minus : CircleAlert;
  return <span className={`result-mark result-${tone} ${compact ? 'result-compact' : ''}`} data-testid={`status-result-${tone}`}><Icon size={compact ? 13 : 16} strokeWidth={2.3} /><span>{resultLabel(result)}</span></span>;
}

export function Confidence({ value }: { value: string | null }) {
  return <span className="inline-flex items-center gap-1.5 font-mono-ui text-[10px] uppercase tracking-[.14em] text-muted-foreground" data-testid={`status-confidence-${value ?? 'none'}`}><ShieldCheck size={13} className={value === 'high' ? 'text-primary' : ''} /> {confidenceLabel(value)}</span>;
}

export function Coverage({ status, note }: { status: string; note?: string }) {
  return <span title={note} className={`coverage coverage-${status}`} data-testid={`status-coverage-${status}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{coverageLabel(status)}</span>;
}

export function ProjectCard({ project, featured = false }: { project: ProjectSummary; featured?: boolean }) {
  return <Link href={`/projects/${project.slug}`} className={`show-card group block ${featured ? 'show-card-featured' : ''}`} data-testid={`card-project-${project.slug}`}>
    <div className="show-card-top"><span>{project.status} project</span><ArrowRight size={17} /></div>
    <div className="show-card-main"><h3>{project.name}</h3><p>{project.description}</p><div className="show-card-read"><small>{project.artist.name} · {project.runLabel}</small><Coverage status={project.coverageStatus} /></div></div>
    <div className="show-card-footer"><span>{project.showCount} records</span><span>{project.momentCount} repeatable moments</span></div>
  </Link>;
}

export function RecordCard({ projectSlug, record, featured = false }: { projectSlug: string; record: PerformanceRecordSummary; featured?: boolean }) {
  return <Link href={`/projects/${projectSlug}/records/${record.slug}`} onClick={() => trackEvent('record_opened', { source: featured ? 'featured_record_card' : 'record_card', record_slug: record.slug })} className={`show-card group block ${featured ? 'show-card-featured' : ''}`} data-testid={`card-record-${record.slug}`}>
    <div className="show-card-top"><span>{formatDate(record.date)}</span><ArrowRight size={17} /></div>
    <div className="show-card-main"><h3>{record.venue}</h3><div className="show-card-read"><small>bounded read</small><ResultMark result={record.result} /></div><p>{showSummary(record.result)}</p></div>
    <div className="show-card-footer"><Coverage status={record.evidenceStatus} note={record.coverageNote} /><Confidence value={record.confidence} /></div>
  </Link>;
}

export function MomentCard({ projectSlug, moment, index = 0 }: { projectSlug: string; moment: RepeatableMoment; index?: number }) {
  return <Link href={`/projects/${projectSlug}/moments/${moment.slug}/comparison`} className="anchor-card group" data-testid={`card-moment-${moment.slug}`}>
    <div className="anchor-card-top"><span className="anchor-number">0{index + 1}</span><span>repeatable moment</span></div>
    <p className="anchor-marker">{moment.segmentLabel}</p><h3>{moment.name}</h3><p className="anchor-description">{moment.description}</p>
    <div className="anchor-card-footer"><span>{moment.focus.replaceAll('_', ' ')}</span><ArrowRight size={15} /></div>
  </Link>;
}

export function ObservationList({ observations }: { observations: Observation[] }) {
  return <div className="space-y-3">{observations.map((observation, index) => <div key={`${observation.label}-${index}`} className="observation-row" data-testid={`observation-${index}`}><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" /><div><div className="font-mono-ui text-[10px] uppercase tracking-[.14em] text-primary">{signalLabel(observation.signalType)}</div><div className="mt-1 text-sm leading-6 text-foreground/80">{observation.note}</div></div></div>)}</div>;
}

export function SourceList({ sources }: { sources: EvidenceSource[] }) {
  if (!sources.length) return <div className="font-mono-ui text-[10px] uppercase tracking-[.12em] text-muted-foreground">No sources linked yet.</div>;
  return <div className="space-y-2">{sources.map((source) => <a key={source.id} href={source.url} onClick={() => trackEvent('source_link_opened', { platform: source.platform, quality: source.quality, provenance: source.provenance.relation })} target="_blank" rel="noreferrer noopener" className="source-row group" data-testid={`link-source-${source.id}`}><span className="source-icon"><Play size={12} fill="currentColor" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm">{source.creator || source.platform}</span><span className="font-mono-ui text-[9px] uppercase tracking-[.12em] text-muted-foreground">{source.platform} · {sourceQualityLabel(source.quality)} · {source.provenance.relation}</span></span><ExternalLink size={14} className="shrink-0 text-muted-foreground transition-colors group-hover:text-primary" /></a>)}</div>;
}

export function CopyNote({ children }: { children: ReactNode }) {
  return <div className="copy-note"><Check size={16} /><div>{children}</div></div>;
}