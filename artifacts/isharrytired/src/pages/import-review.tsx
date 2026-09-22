import { AlertTriangle, ArrowLeft, Check, FileUp, ShieldCheck } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link } from 'wouter';
import { SiteShell } from '@/components/site-shell';
import { importedProject, type ImportedProject } from '@/lib/import-schema';

const MAX_FILE_BYTES = 2 * 1024 * 1024;

function parseCsv(text: string): unknown {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) throw new Error('The CSV file has no rows.');
  const headers = lines[0].split(',').map((header) => header.trim());
  const required = ['recordSlug', 'date', 'venue', 'momentSlug', 'momentName', 'sourceUrl', 'platform'];
  if (!required.every((header) => headers.includes(header))) throw new Error('CSV needs recordSlug, date, venue, momentSlug, momentName, sourceUrl, and platform columns.');
  const rows = lines.slice(1).map((line) => {
    const values = line.split(',').map((value) => value.trim());
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
  });
  const recordMap = new Map<string, any>();
  for (const row of rows) {
    const record = recordMap.get(row.recordSlug) ?? { slug: row.recordSlug, date: row.date, venue: row.venue, moments: [] };
    const moment = record.moments.find((item: any) => item.momentSlug === row.momentSlug);
    if (moment) moment.sources.push({ url: row.sourceUrl, platform: row.platform, creator: row.creator || null });
    else record.moments.push({ momentSlug: row.momentSlug, result: row.result || 'no_reliable_read', observations: row.observation ? [{ signalType: row.signalType || 'staging', label: row.label || 'observed', note: row.observation }] : [], sources: [{ url: row.sourceUrl, platform: row.platform, creator: row.creator || null }] });
    recordMap.set(row.recordSlug, record);
  }
  return { project: { slug: 'imported-project', name: 'Imported project', artist: { slug: 'artist', name: 'Imported artist' }, runLabel: 'Local import' }, moments: [...new Map(rows.map((row) => [row.momentSlug, { slug: row.momentSlug, name: row.momentName, focus: 'other', description: 'Imported repeatable moment', segmentLabel: row.momentName }])).values()], records: [...recordMap.values()] };
}

export default function ImportReview() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ kind: 'idle' | 'success' | 'error'; message?: string; data?: ImportedProject }>({ kind: 'idle' });
  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) return setStatus({ kind: 'error', message: 'That file is larger than the 2 MB browser import limit.' });
    if (!/\.json$|\.csv$/i.test(file.name)) return setStatus({ kind: 'error', message: 'Choose a JSON or CSV record file.' });
    try {
      const text = await file.text();
      const raw = /\.csv$/i.test(file.name) ? parseCsv(text) : JSON.parse(text);
      const parsed = importedProject.safeParse(raw);
      if (!parsed.success) return setStatus({ kind: 'error', message: `The file could not be validated: ${parsed.error.issues[0]?.message ?? 'check the documented format.'}` });
      setStatus({ kind: 'success', data: parsed.data, message: `Validated ${parsed.data.records.length} records and ${parsed.data.moments.length} repeatable moments.` });
    } catch {
      setStatus({ kind: 'error', message: 'The file could not be read. Use valid UTF-8 JSON or CSV and try again.' });
    }
  }
  return <SiteShell><section className="page-wrap import-page"><Link href="/" className="back-link"><ArrowLeft size={14} /> Field notes</Link><div className="method-intro"><p className="eyebrow">local browser import / untrusted input</p><h1>Bring a record<br /><em>you can inspect.</em></h1><p>Validate a small JSON or CSV project in your browser before comparing it. The file is not uploaded, saved, or rendered as media.</p></div><div className="import-grid"><div className="import-dropzone"><FileUp size={28} /><h2>Choose a record file</h2><p>JSON or CSV · maximum 2 MB</p><input ref={inputRef} type="file" accept=".json,.csv,application/json,text/csv" onChange={(event) => handleFile(event.target.files?.[0])} data-testid="input-import-file" /><button type="button" className="button-dark" onClick={() => inputRef.current?.click()}>Select file <FileUp size={15} /></button></div><div className="import-rules"><div><ShieldCheck size={18} /><p><strong>Safe by default</strong> Public http(s) source links only. Localhost, private IPs, scripts, media embeds, and arbitrary HTML are rejected.</p></div><div><Check size={18} /><p><strong>Review before use</strong> Nothing enters a comparison until the schema passes. Source URLs remain links with creator and provenance fields.</p></div><div><AlertTriangle size={18} /><p><strong>Evidence is not diagnosis</strong> A valid file can still be illustrative or incomplete. The engine will return “not enough to tell” when the baseline is insufficient.</p></div></div></div>{status.kind !== 'idle' && <div className={`import-status ${status.kind}`} role={status.kind === 'error' ? 'alert' : 'status'}>{status.kind === 'error' ? <AlertTriangle size={18} /> : <Check size={18} />}<div><strong>{status.kind === 'error' ? 'Import stopped' : 'File validated'}</strong><p>{status.message}</p>{status.data && <><div className="import-preview"><span>{status.data.project.name}</span><span>{status.data.records.length} records</span><span>{status.data.moments.length} moments</span></div><div className="import-record-preview" aria-label="Validated record preview">{status.data.records.slice(0, 8).map((record) => <div key={record.slug}><strong>{record.date} · {record.venue}</strong><small>{record.moments.length} moments · {record.moments.reduce((count, moment) => count + moment.sources.length, 0)} source links</small></div>)}</div></>}</div></div>}</section></SiteShell>;
}