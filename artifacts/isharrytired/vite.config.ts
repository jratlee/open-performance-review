import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import {
  absoluteUrl,
  getSeoMetadata,
  prerenderPaths,
  SITE_NAME,
  SOCIAL_IMAGE_PATH,
} from './src/lib/seo';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    'PORT environment variable is required but was not provided.',
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    'BASE_PATH environment variable is required but was not provided.',
  );
}

function escapeAttribute(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function injectSeo(html: string, routePath: string) {
  const metadata = getSeoMetadata(routePath);
  const canonicalUrl = absoluteUrl(metadata.canonicalPath);
  const imageUrl = absoluteUrl(SOCIAL_IMAGE_PATH);
  const replacements: Array<[RegExp, string]> = [
    [/<title>.*?<\/title>/, `<title>${metadata.title}</title>`],
    [/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeAttribute(metadata.description)}" />`],
    [/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${canonicalUrl}" />`],
    [/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${escapeAttribute(metadata.title)}" />`],
    [/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${escapeAttribute(metadata.description)}" />`],
    [/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${canonicalUrl}" />`],
    [/<meta property="og:site_name" content=".*?" \/>/, `<meta property="og:site_name" content="${SITE_NAME}" />`],
    [/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${imageUrl}" />`],
    [/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${escapeAttribute(metadata.title)}" />`],
    [/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${escapeAttribute(metadata.description)}" />`],
    [/<meta name="twitter:image" content=".*?" \/>/, `<meta name="twitter:image" content="${imageUrl}" />`],
  ];
  return replacements.reduce(
    (result, [pattern, replacement]) => result.replace(pattern, replacement),
    html,
  );
}

function routeMetadataPlugin(): Plugin {
  let outputDirectory = '';
  return {
    name: 'route-metadata',
    configResolved(config) {
      outputDirectory = config.build.outDir;
    },
    transformIndexHtml(html, context) {
      return injectSeo(html, context.path);
    },
    async closeBundle() {
      const builtIndex = await readFile(path.join(outputDirectory, 'index.html'), 'utf8');
      await Promise.all(
        prerenderPaths
          .filter((routePath) => routePath !== '/')
          .map(async (routePath) => {
            const routeDirectory = path.join(outputDirectory, routePath.slice(1));
            await mkdir(routeDirectory, { recursive: true });
            await writeFile(
              path.join(routeDirectory, 'index.html'),
              injectSeo(builtIndex, routePath),
            );
          }),
      );
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    routeMetadataPlugin(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== 'production' &&
    process.env.REPL_ID !== undefined
      ? [
          await import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, '..'),
            }),
          ),
          await import('@replit/vite-plugin-dev-banner').then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
