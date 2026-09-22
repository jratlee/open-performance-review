export const SITE_NAME = 'Field Notes · Open Performance Review';
export const SITE_ORIGIN = 'https://is-harry-tired.replit.app';
export const SOCIAL_IMAGE_PATH = '/share-card.png';

export type SeoMetadata = { title: string; description: string; canonicalPath: string };

const staticRoutes: Record<string, SeoMetadata> = {
  '/': {
    title: 'Field Notes · Open Performance Review',
    description: 'An open-source, local-first tool for comparing repeatable public performance moments without making claims about an artist’s private condition.',
    canonicalPath: '/',
  },
  '/projects': {
    title: 'Example Projects · Field Notes',
    description: 'Browse artist-agnostic performance review projects with visible sources, provenance, coverage, and cautious comparison results.',
    canonicalPath: '/projects',
  },
  '/about': {
    title: 'Method, Format, and Limits · Field Notes',
    description: 'Learn the open performance review record format, comparison rule, source-use expectations, and evidence limits.',
    canonicalPath: '/about',
  },
  '/import': {
    title: 'Import Performance Records · Field Notes',
    description: 'Validate a local JSON or CSV performance review file in the browser without uploading or hosting source media.',
    canonicalPath: '/import',
  },
};

export function normalizePath(path: string) {
  const cleanPath = path.split(/[?#]/, 1)[0] || '/';
  return cleanPath === '/' ? '/' : cleanPath.replace(/\/+$/, '');
}

export function getSeoMetadata(path: string): SeoMetadata {
  const cleanPath = normalizePath(path);
  if (staticRoutes[cleanPath]) return staticRoutes[cleanPath];
  if (cleanPath.startsWith('/projects/')) {
    return {
      title: 'Performance Record · Field Notes',
      description: 'A source-linked performance record with repeatable moments, provenance, coverage, and a cautious comparative read.',
      canonicalPath: cleanPath,
    };
  }
  return staticRoutes['/'];
}

export function absoluteUrl(path: string) {
  return new URL(path, SITE_ORIGIN).toString();
}

export const prerenderPaths = Object.keys(staticRoutes);