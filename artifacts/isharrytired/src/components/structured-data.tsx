import type { ReactNode } from 'react';

type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdValue[]
  | { [key: string]: JsonLdValue };

export const SITE_URL = 'https://is-harry-tired.replit.app';
export const SITE_ID = `${SITE_URL}/#website`;
export const PUBLISHER_ID = `${SITE_URL}/#publisher`;

export function absoluteUrl(path: string) {
  return new URL(path, `${SITE_URL}/`).toString();
}

export function StructuredData({
  children,
}: {
  children: JsonLdValue;
}): ReactNode {
  const json = JSON.stringify(children).replaceAll('<', '\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}