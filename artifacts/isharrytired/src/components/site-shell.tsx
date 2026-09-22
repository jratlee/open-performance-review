import { ArrowUpRight, Github, Menu, Radio, X } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { absoluteUrl, getSeoMetadata, SITE_NAME, SOCIAL_IMAGE_PATH } from '@/lib/seo';

export const REPOSITORY_URL = 'https://github.com/jratlee/open-performance-review';

export function SiteShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  useEffect(() => {
    const { title, description, canonicalPath } = getSeoMetadata(location);
    const canonicalUrl = absoluteUrl(canonicalPath);
    const imageUrl = absoluteUrl(SOCIAL_IMAGE_PATH);
    document.title = title;
    const setHeadAttribute = (selector: string, attribute: string, value: string) => {
      const element = document.querySelector<HTMLElement>(selector);
      if (element) element.setAttribute(attribute, value);
    };
    setHeadAttribute('meta[name="description"]', 'content', description);
    setHeadAttribute('meta[property="og:title"]', 'content', title);
    setHeadAttribute('meta[property="og:description"]', 'content', description);
    setHeadAttribute('meta[property="og:url"]', 'content', canonicalUrl);
    setHeadAttribute('meta[property="og:site_name"]', 'content', SITE_NAME);
    setHeadAttribute('meta[property="og:image"]', 'content', imageUrl);
    setHeadAttribute('meta[name="twitter:title"]', 'content', title);
    setHeadAttribute('meta[name="twitter:description"]', 'content', description);
    setHeadAttribute('meta[name="twitter:image"]', 'content', imageUrl);
    setHeadAttribute('link[rel="canonical"]', 'href', canonicalUrl);
  }, [location]);

  const nav = [
    { href: '/', label: 'Field notes' },
    { href: '/projects', label: 'Example project' },
    { href: '/about', label: 'Method & format' },
  ];

  return <div className="grain min-h-[100dvh]">
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-brand group" data-testid="link-brand">
          <span className="site-brand-mark"><Radio size={17} strokeWidth={2.5} /></span>
          <span><span className="site-brand-title">Field Notes</span><span className="site-brand-subtitle">open performance review</span></span>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          {nav.map((item) => <Link key={item.href} href={item.href} data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`} className={`font-mono-ui text-[11px] uppercase tracking-[.14em] transition-colors ${location === item.href ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>{item.label}</Link>)}
          <a href={REPOSITORY_URL} target="_blank" rel="noreferrer noopener" className="github-link"><Github size={14} /> GitHub <ArrowUpRight size={13} /></a>
        </nav>
        <button type="button" onClick={() => setMenuOpen((value) => !value)} className="site-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'} data-testid="button-mobile-menu" aria-expanded={menuOpen}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
      </div>
      {menuOpen && <nav className="site-mobile-nav" aria-label="Mobile navigation">
        {nav.map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`}>{item.label}<ArrowUpRight size={14} /></Link>)}
        <a href={REPOSITORY_URL} target="_blank" rel="noreferrer noopener" onClick={() => setMenuOpen(false)}><Github size={14} /> GitHub<ArrowUpRight size={14} /></a>
      </nav>}
    </header>
    <div className="site-disclosure" role="note" data-testid="demo-disclosure"><span>Local-first</span><i aria-hidden="true" /><span>public sources only</span><i aria-hidden="true" /><span>no personal-condition claims</span></div>
    <main>{children}</main>
    <footer className="site-footer">
      <div className="site-footer-inner"><div><strong>Field Notes</strong><p>An open-source way to compare repeatable performance moments without pretending a clip tells us a person's private condition.</p></div><div className="site-footer-meta"><span>Example data is illustrative</span><span className="site-footer-dot" /><a href={REPOSITORY_URL} target="_blank" rel="noreferrer noopener">Source and method on GitHub <ArrowUpRight size={14} /></a></div></div>
    </footer>
  </div>;
}