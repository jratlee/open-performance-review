import { ArrowRight, ArrowUpRight, Download, FileUp, Github, ShieldCheck } from 'lucide-react';
import { Link } from 'wouter';
import { useListProjects } from '@workspace/api-client-react';
import { MomentCard, ProjectCard, RecordCard } from '@/components/data-display';
import { SiteShell, REPOSITORY_URL } from '@/components/site-shell';
import { trackEvent } from '@/lib/analytics';

function LoadingHome() {
  return <SiteShell><div className="page-wrap page-loading"><div className="skeleton h-12 w-2/3" /><div className="skeleton h-5 w-1/2" /><div className="grid gap-5 md:grid-cols-3"><div className="skeleton h-48" /><div className="skeleton h-48" /><div className="skeleton h-48" /></div></div></SiteShell>;
}

export default function Home() {
  const query = useListProjects();
  if (query.isLoading) return <LoadingHome />;
  if (query.isError) return <SiteShell><div className="empty-page"><span className="eyebrow">The index is between entries</span><h1>Could not load the example projects.</h1><p>Try again when the local API is available.</p><button type="button" onClick={() => query.refetch()} className="button-dark" data-testid="button-retry-home">Retry the index</button></div></SiteShell>;
  const projects = query.data ?? [];
  const project = projects[0];
  return <SiteShell>
    <section className="home-hero">
      <div className="home-hero-inner">
        <div className="home-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> open-source field record / local-first</p>
          <h1>Compare a performance<br /><em>without pretending to know a person.</em></h1>
          <p className="home-intro">Choose a project, hold the same moments steady across show nights, and publish what public records show—plus where the evidence stops.</p>
          <div className="home-actions"><Link href="/projects" onClick={() => trackEvent('example_project_opened', { location: 'homepage_hero' })} className="button-dark" data-testid="link-example-project">Explore the example project <ArrowUpRight size={15} /></Link><a href={REPOSITORY_URL} target="_blank" rel="noreferrer noopener" className="text-link"><Github size={14} /> View on GitHub <ArrowUpRight size={14} /></a></div>
          <p className="home-note">A reusable review engine for fan communities · source-linked, cautious, downloadable</p>
        </div>
        <div className="ticket-wrap"><div className="ticket-back" aria-hidden="true" /><article className="field-ticket field-note-ticket"><div className="ticket-body"><div className="ticket-top"><span>open performance review</span><strong>FIELD / 001</strong></div><div className="ticket-date-row"><div><small>step</small><strong className="ticket-number">01</strong></div><div className="ticket-date"><small>start with any run</small><strong>same <i>/</i> moments</strong></div></div><div className="ticket-rule" /><div className="ticket-venue"><small>what stays visible</small><strong>sources + limits</strong><span><ShieldCheck size={12} /> the evidence</span></div><div className="ticket-meta"><div><small>quick read</small><strong>not enough to tell</strong></div><div><small>works from</small><strong>JSON / CSV</strong><span>in your browser</span></div></div><div className="ticket-footer"><div className="barcode" aria-label="Decorative record barcode">{Array.from({ length: 18 }, (_, index) => <i key={index} />)}</div><span>LOCAL / OPEN</span></div></div><div className="ticket-stub"><span>the method</span><strong>repeat<br />the moment</strong><ArrowRight size={20} strokeWidth={1.5} aria-hidden="true" /><span>keep the limits</span></div></article><p className="ticket-caption">a small record format for a large number of fan questions</p></div>
      </div>
    </section>

    <section className="paper-section"><div className="page-wrap"><div className="section-heading"><div><p className="eyebrow">quick start</p><h2>From a clip<br /><em>to a careful read.</em></h2></div><p className="section-heading-copy">The app stays local-first. Search only the bounded index, or bring a validated record file from your own project.</p></div><div className="method-steps quick-start-grid"><div><span>01</span><p><strong>Choose a project</strong> Start with the example, or download the format for another artist and show run.</p></div><div><span>02</span><p><strong>Lock repeatable moments</strong> Define the same observable segment before comparing different nights.</p></div><div><span>03</span><p><strong>Attach public sources</strong> Keep creator, platform, provenance, and coverage next to each observation.</p></div><div><span>04</span><p><strong>Publish bounded reads</strong> Say “not enough to tell” when the baseline or source coverage cannot support more.</p></div></div></div></section>

    {project && <section className="blue-section"><div className="page-wrap"><div className="section-heading-light"><div><p className="eyebrow eyebrow-light">example project / clearly illustrative</p><h2>{project.name}<br /><em>as a starting point.</em></h2></div><p>{project.description}</p></div><div className="home-project-grid"><ProjectCard project={project} featured /><div className="project-boundary"><span className="eyebrow eyebrow-light">what this means</span><p>This project is sample data demonstrating the method. It is not a live report, diagnosis, or statement about an artist's private condition.</p><Link href={`/projects/${project.slug}`} className="text-link text-link-light">Open project records <ArrowRight size={15} /></Link></div></div></div></section>}

    <section className="paper-section"><div className="page-wrap"><div className="section-heading"><div><p className="eyebrow">bring your own records</p><h2>A format<br /><em>you can inspect.</em></h2></div><div className="format-cta"><FileUp size={21} /><p>Import a JSON or CSV file in the browser. Files are validated before they enter the review view and nothing is saved to an account.</p><Link href="/import" className="button-dark">Import a record file <ArrowUpRight size={15} /></Link></div></div></div></section>

    <section className="roll-your-own-section"><div className="page-wrap"><div className="roll-your-own-grid"><div><p className="eyebrow">roll your own</p><h2>Build a run<br /><em>for your community.</em></h2></div><div className="roll-your-own-copy"><p>Download the runnable source, copy the example project, and make a careful review for any artist or show run. The format keeps moments, source lineage, attribution, and evidence limits together.</p><div className="roll-your-own-actions"><a href={REPOSITORY_URL} target="_blank" rel="noreferrer noopener" className="button-dark">Download from jratlee on GitHub <Download size={15} /></a><Link href="/about" className="text-link">Read the contributor method <ArrowUpRight size={14} /></Link></div><p className="roll-your-own-note">No account or database required · project packs stay inspectable and local-first</p></div></div></div></section>

    <section className="ink-section"><div className="page-wrap method-grid"><div className="method-index">03</div><div className="method-title"><p className="eyebrow eyebrow-light">the line we do not cross</p><h2>Observe the stage.<br /><em>Do not diagnose a person.</em></h2></div><div className="method-steps"><div><span>01</span><p><strong>Repeatable moments</strong> Compare the same defined segment instead of collecting favorite clips.</p></div><div><span>02</span><p><strong>Evidence beside the result</strong> Coverage, source quality, and provenance stay visible.</p></div><div><span>03</span><p><strong>No mind-reading</strong> A stage observation cannot establish health, feelings, intent, or private condition.</p></div></div></div></section>
  </SiteShell>;
}