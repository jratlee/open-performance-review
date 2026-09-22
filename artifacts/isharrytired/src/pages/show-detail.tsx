import { ArrowLeft, ArrowUpRight, CalendarDays, MapPin } from 'lucide-react';
import { getGetProjectRecordQueryKey, useGetProjectRecord } from '@workspace/api-client-react';
import { Link, useParams } from 'wouter';
import { CopyNote, Coverage, Confidence, ObservationList, ResultMark, SourceList } from '@/components/data-display';
import { SiteShell } from '@/components/site-shell';
import { coverageSummary, formatDate, momentSummary, showSummary } from '@/lib/format';

export default function ShowDetailPage() {
  const params = useParams<{ projectSlug: string; recordSlug: string }>();
  const projectSlug = params.projectSlug ?? '';
  const recordSlug = params.recordSlug ?? '';
  const query = useGetProjectRecord(projectSlug, recordSlug, { query: { enabled: Boolean(projectSlug && recordSlug), queryKey: getGetProjectRecordQueryKey(projectSlug, recordSlug) } });
  if (query.isLoading) return <SiteShell><div className="page-wrap page-loading"><div className="skeleton h-8 w-40" /><div className="skeleton mt-8 h-24 w-3/4" /><div className="skeleton mt-12 h-64" /></div></SiteShell>;
  if (query.isError || !query.data) return <SiteShell><div className="empty-page"><span className="eyebrow">No record found</span><h1>That performance record is not in the project.</h1><Link href={`/projects/${projectSlug}`} className="button-dark"><ArrowLeft size={15} /> Back to project</Link></div></SiteShell>;
  const record = query.data;
  return <SiteShell><article className="detail-page">
    <div className="detail-hero"><div className="page-wrap"><Link href={`/projects/${projectSlug}`} className="back-link"><ArrowLeft size={14} /> Project records</Link><div className="detail-hero-grid"><div><p className="eyebrow">{formatDate(record.date)} / performance record</p><h1>{record.venue}</h1><div className="detail-facts"><span><CalendarDays size={15} />{formatDate(record.date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span><span><MapPin size={15} />{record.venue}</span></div></div><div className="detail-read"><div className="detail-read-label">the bounded read</div><ResultMark result={record.result} /><p>{showSummary(record.result)}</p><div className="detail-status"><Coverage status={record.evidenceStatus} note={record.coverageNote} /><Confidence value={record.confidence} /></div></div></div></div></div>
    <div className="page-wrap detail-content"><aside className="detail-aside"><p className="eyebrow">record limits</p><h2>Moments first.<br /><em>Claims last.</em></h2><p>{record.summary}</p><CopyNote>{coverageSummary(record.evidenceStatus)} {record.coverageNote}</CopyNote></aside><div className="moment-list">{record.moments.length ? record.moments.map((entry, index) => <section key={entry.moment.slug} className="moment-section"><div className="moment-heading"><div><span className="eyebrow">part 0{index + 1} / {entry.moment.segmentLabel}</span><h2>{entry.moment.name}</h2></div><ResultMark result={entry.result} /></div><p className="moment-evidence">{momentSummary(entry.result)} {entry.evidenceNote}</p><div className="moment-columns"><div><div className="sub-label">what the record shows</div><ObservationList observations={entry.observations} /></div><div><div className="sub-label">source lineage</div><SourceList sources={entry.sources} /></div></div><Link href={`/projects/${projectSlug}/moments/${entry.moment.slug}/comparison`} className="moment-link">Compare this moment across the run <ArrowUpRight size={14} /></Link></section>) : <div className="empty-state">No reads have been published for this record yet.</div>}</div></div>
  </article></SiteShell>;
}