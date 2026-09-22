import { ArrowLeft, CircleOff } from 'lucide-react';
import { Link } from 'wouter';
import { SiteShell } from '@/components/site-shell';

export default function NotFound() {
  return <SiteShell><section className="empty-page"><CircleOff size={42} className="text-primary" /><span className="eyebrow">404 / wrong turn</span><h1>Nothing here yet.</h1><p>That page does not point to a project, performance record, or repeatable moment in the notebook.</p><Link href="/" className="button-dark" data-testid="link-return-home"><ArrowLeft size={15} /> Back home</Link></section></SiteShell>;
}
