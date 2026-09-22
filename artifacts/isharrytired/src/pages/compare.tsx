import { ArrowLeft, ArrowRight, ArrowUpRight, BarChart3 } from 'lucide-react';
import { getGetProjectMomentComparisonQueryKey, useGetProjectMomentComparison } from '@workspace/api-client-react';
import { Link, useParams } from 'wouter';
import { ObservationList, ResultMark, SourceList } from '@/components/data-display';
import { SiteShell } from '@/components/site-shell';
import { formatDate } from '@/lib/format';
import { absoluteUrl, PUBLISHER_ID, SITE_ID, StructuredData } from '@/components/structured-data';

export default function Compare() {
  const params = useParams<{ projectSlug: string; momentSlug: string }>();
  const projectSlug = params.projectSlug ?? '';
  const momentSlug = params.momentSlug ?? '';
  const query = useGetProjectMomentComparison(projectSlug, momentSlug, { query: { enabled: Boolean(projectSlug && momentSlug), queryKey: getGetProjectMomentComparisonQueryKey(projectSlug, momentSlug) } });
  if (query.isLoading) return <SiteShell><div className="page-wrap page-loading"><div className="skeleton h-8 w-40" /><div className="skeleton mt-8 h-24 w-3/4" /><div className="skeleton mt-12 h-80" /></div></SiteShell>;
  if (query.isError || !query.data) return <SiteShell><div className="empty-page"><span className="eyebrow">No comparison found</span><h1>That repeatable moment is not in the project.</h1><Link href={`/projects/${projectSlug}`} className="button-dark"><ArrowLeft size={15} /> Back to project</Link></div></SiteShell>;
  const comparison = query.data;
  const comparisonUrl = `/projects/${projectSlug}/moments/${momentSlug}/comparison`;
  return <SiteShell>
    <StructuredData>{{
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${absoluteUrl(comparisonUrl)}#comparison`,
      url: absoluteUrl(comparisonUrl),
      name: `${comparison.moment.name} comparison`,
      description: comparison.moment.description,
      isPartOf: { '@id': SITE_ID },
      publisher: { '@id': PUBLISHER_ID },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: comparison.records.length,
        itemListElement: comparison.records.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: absoluteUrl(`/projects/${projectSlug}/records/${item.record.slug}`),
          name: `${item.record.venue} — ${item.record.date}`,
        })),
      },
    }}</StructuredData>
    <section className="compare-page page-wrap">
      <Link href={`/projects/${projectSlug}`} className="back-link"><ArrowLeft size={14} /> Project records</Link>
      <div className="compare-heading"><div><p className="eyebrow">same moment / {comparison.records.length} records</p><h1>{comparison.moment.name}</h1><p>{comparison.moment.description}</p><div className="compare-segment"><BarChart3 size={17} /> {comparison.moment.segmentLabel}</div></div><div className="compare-rule"><div>how the baseline works</div><p>{comparison.baselineRule}</p><span>{comparison.baselineCoverage >= 2 ? `${comparison.baselineCoverage} comparable records` : 'Not enough to tell'}</span></div></div>
      <div className="comparison-table"><div className="comparison-header"><span>performance record</span><span>bounded read</span><span>what stood out</span><span>sources</span></div>{comparison.records.length ? comparison.records.map((item) => <div key={item.record.slug} className="comparison-row"><div><div className="row-date">{formatDate(item.record.date)}</div><Link href={`/projects/${projectSlug}/records/${item.record.slug}`} className="row-show">{item.record.venue}<ArrowRight size={15} /></Link></div><div><div className="mobile-row-label">bounded read</div><ResultMark result={item.result} compact /></div><div><div className="mobile-row-label">what stood out</div><ObservationList observations={item.observations} /></div><div><div className="mobile-row-label">sources</div><SourceList sources={item.sources} /></div></div>) : <div className="empty-state">No comparisons for this moment yet.</div>}</div>
      <div className="compare-footer"><span>Repeatable moment · baseline coverage {comparison.baselineCoverage}</span><Link href={`/projects/${projectSlug}`}>Browse project records <ArrowUpRight size={14} /></Link></div>
    </section>
  </SiteShell>;
}