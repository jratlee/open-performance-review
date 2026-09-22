import {
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clipboard,
  MapPin,
  Menu,
  MoveDown,
  Radio,
  X,
} from "lucide-react";
import { useState } from "react";

import "./TicketNotebook.css";

type AnchorMoment = {
  number: string;
  title: string;
  marker: string;
  read: string;
  detail: string;
};

const anchors: AnchorMoment[] = [
  {
    number: "01",
    title: "The opening songs",
    marker: "songs 1–3",
    read: "Lower than the run’s working range",
    detail:
      "The room warms up, but the first shared refrain arrives later than in the comparison set.",
  },
  {
    number: "02",
    title: "The final exchange",
    marker: "encore / last song",
    read: "Clear, sustained response",
    detail:
      "Audience return is audible in the available clips, and the last exchange holds.",
  },
];

const archiveRows = [
  { night: "09", date: "Sep 15", place: "New York City", read: "In line", tone: "steady" },
  { night: "08", date: "Sep 13", place: "New York City", read: "Higher", tone: "up" },
  { night: "07", date: "Sep 12", place: "New York City", read: "Lower", tone: "down" },
];

export function TicketNotebook() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  const copyEntryId = async () => {
    try {
      await navigator.clipboard.writeText("IHT-10-NYC-160926");
    } catch {
      // The visual confirmation is still useful in preview environments without clipboard access.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="ticket-notebook-v2">
      <header className="tb-header">
        <a className="tb-brand" href="#tb-top" aria-label="Is Harry Tired? home">
          <span className="tb-brand-mark" aria-hidden="true">
            <Radio size={15} strokeWidth={2.2} />
          </span>
          <span>
            <strong>Is Harry Tired?</strong>
            <small>performance notes / public file</small>
          </span>
        </a>

        <nav className="tb-nav" aria-label="Notebook navigation">
          <a href="#tb-entry">Entry 010</a>
          <a href="#tb-anchors">Fixed points</a>
          <a href="#tb-method">Method</a>
        </nav>

        <button
          className="tb-menu"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="tb-mobile-nav"
          aria-label={menuOpen ? "Close notebook menu" : "Open notebook menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </header>

      {menuOpen && (
        <nav className="tb-mobile-nav" id="tb-mobile-nav" aria-label="Mobile notebook navigation">
          <a href="#tb-entry" onClick={() => setMenuOpen(false)}>Entry 010 <ArrowUpRight size={14} /></a>
          <a href="#tb-anchors" onClick={() => setMenuOpen(false)}>Fixed points <ArrowUpRight size={14} /></a>
          <a href="#tb-method" onClick={() => setMenuOpen(false)}>Method <ArrowUpRight size={14} /></a>
        </nav>
      )}

      <main id="tb-top">
        <div className="tb-disclosure">
          <span>Illustrative file</span>
          <i aria-hidden="true" />
          <span>observable performance only</span>
          <i aria-hidden="true" />
          <span>no diagnosis</span>
        </div>

        <section className="tb-hero" id="tb-entry" aria-labelledby="tb-title">
          <div className="tb-hero-copy">
            <p className="tb-eyebrow"><span /> night 10 / new york city</p>
            <h1 id="tb-title">How did<br /><em>Night 10 go?</em></h1>
            <p className="tb-intro">
              A quick look at the opening songs, the final exchange, and the clips we could check
              from Madison Square Garden. We’re comparing the same moments across the run—not
              guessing how Harry felt.
            </p>
            <div className="tb-hero-actions">
              <button type="button" className="tb-primary-button" onClick={() => jumpTo("tb-anchors")}>
                See the two moments <ArrowUpRight size={15} />
              </button>
              <button type="button" className="tb-link-button" onClick={() => jumpTo("tb-method")}>
                How we checked it <ArrowUpRight size={14} />
              </button>
            </div>
            <p className="tb-hand-note">Wednesday, September 16 <span>—</span> entry 010</p>
          </div>

          <div className="tb-ticket-wrap">
            <div className="tb-ticket-back" aria-hidden="true" />
            <article className="tb-ticket" aria-label="Night 10 field record">
              <div className="tb-ticket-body">
                <div className="tb-ticket-top">
                  <span>night 10 / new york city</span>
                  <strong>IHT / 010</strong>
                </div>
                <div className="tb-ticket-date-row">
                  <div>
                    <small>night</small>
                    <strong className="tb-night-number">10</strong>
                  </div>
                  <div className="tb-date">
                    <small>Wednesday</small>
                    <strong>16 <i>/</i> 09 <i>/</i> 26</strong>
                  </div>
                </div>
                <div className="tb-ticket-rule" />
                <div className="tb-venue">
                  <small>where it happened</small>
                  <strong>Madison Square Garden</strong>
                  <span><MapPin size={12} /> New York City</span>
                </div>
                <div className="tb-ticket-meta">
                  <div><small>opening set</small><strong>Jamie xx</strong></div>
                  <div><small>tour run</small><strong>30 nights</strong><span>Aug — Oct 2026</span></div>
                </div>
                <div className="tb-ticket-footer">
                  <div className="tb-barcode" aria-label="Decorative record barcode">
                    {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
                  </div>
                  <span>NYC / 160926 / 010</span>
                </div>
              </div>
              <div className="tb-ticket-stub">
                <span className="tb-stub-label">what we could see</span>
                <strong>lower<br />energy</strong>
                <MoveDown size={20} strokeWidth={1.5} aria-hidden="true" />
                <span className="tb-stub-file">from this show</span>
              </div>
            </article>
            <p className="tb-ticket-caption">details we could check from this night</p>
          </div>
        </section>

        <section className="tb-signal" aria-label="Current read summary">
          <div className="tb-signal-label"><span className="tb-pulse" /> what the clips show</div>
          <div className="tb-signal-result"><MoveDown size={22} /><strong>Lower energy</strong></div>
          <p>Across the first three songs, observable cues sit below the run’s working range. The late-room return is still clear in the available clips.</p>
          <div className="tb-confidence"><small>confidence</small><strong>High</strong></div>
        </section>

        <section className="tb-details" aria-labelledby="tb-details-title">
          <div className="tb-section-intro">
            <p className="tb-eyebrow">night 10 / new york city</p>
            <h2 id="tb-details-title">What we checked,<br /><em>and what we saw.</em></h2>
            <p>We looked at the same two moments we use for every show: the opening songs and the final exchange. Here’s what the available clips support.</p>
          </div>
          <dl className="tb-detail-list">
            <div><dt><CalendarDays size={17} /> show date</dt><dd>September 16, 2026</dd></div>
            <div><dt><MapPin size={17} /> venue</dt><dd>Madison Square Garden · New York City</dd></div>
            <div><dt>↕ run we compared</dt><dd>30-night run · Aug—Oct 2026</dd></div>
            <div><dt>□ clips checked</dt><dd>9 usable sources</dd></div>
          </dl>
        </section>

        <section className="tb-anchors" id="tb-anchors" aria-labelledby="tb-anchors-title">
          <div className="tb-anchors-heading">
              <div><p className="tb-eyebrow tb-eyebrow-light">two moments / same every night</p><h2 id="tb-anchors-title">The first songs.<br /><em>The final exchange.</em></h2></div>
              <p>If you want to compare nights fairly, you have to look in the same places. These are the two moments we use here.</p>
          </div>
          <div className="tb-anchor-grid">
            {anchors.map((anchor, index) => (
              <article className={`tb-anchor-card tb-anchor-card-${index + 1}`} key={anchor.number}>
                <div className="tb-card-top"><span>{anchor.number}</span><small>same checkpoint</small></div>
                <p className="tb-card-marker">{anchor.marker}</p>
                <h3>{anchor.title}</h3>
                <div className="tb-card-read"><small>what we saw tonight</small><strong>{anchor.read}</strong></div>
                <p>{anchor.detail}</p>
                <button type="button" onClick={() => jumpTo("tb-method")}>Why these moments <ArrowUpRight size={13} /></button>
              </article>
            ))}
          </div>
        </section>

        <section className="tb-archive" aria-labelledby="tb-archive-title">
          <div className="tb-archive-heading">
            <div><p className="tb-eyebrow">nearby nights</p><h2 id="tb-archive-title">Other nights<br /><em>from the run.</em></h2></div>
            <p className="tb-index-note">10 of 30 nights indexed<br /><span>updated after review</span></p>
          </div>
          <div className="tb-archive-list">
            <div className="tb-archive-label">other nights<br />same checks</div>
            {archiveRows.map((row) => (
              <div className="tb-archive-row" key={row.night}>
                <strong>N{row.night}</strong><span>{row.date}</span><b>{row.place}</b>
                <em className={`tb-read-${row.tone}`}>{row.read}</em><ArrowUpRight size={14} />
              </div>
            ))}
          </div>
          <button type="button" className="tb-archive-toggle" aria-expanded={archiveOpen} onClick={() => setArchiveOpen((open) => !open)}>
            {archiveOpen ? "Close night list" : "See more nights"} <ChevronDown size={15} />
          </button>
          {archiveOpen && (
            <div className="tb-archive-note">
              <strong>INDEX / 30</strong>
              <p>Night 10 is the latest published read. More nights will appear as they’re checked against the same two moments.</p>
              <a href="#tb-entry" onClick={() => setArchiveOpen(false)}>Back to Night 10 <ArrowUpRight size={13} /></a>
            </div>
          )}
        </section>

        <section className="tb-method" id="tb-method" aria-labelledby="tb-method-title">
          <div className="tb-method-index">03</div>
          <div className="tb-method-title"><p className="tb-eyebrow tb-eyebrow-light">how we compare shows</p><h2 id="tb-method-title">Same checks,<br /><em>every night.</em></h2></div>
          <div className="tb-method-steps">
            <div><span>01</span><p><strong>Same moments</strong> We check the opening songs and final exchange every night.</p></div>
            <div><span>02</span><p><strong>Clips, not guesses</strong> Sources are labelled, and coverage stays visible.</p></div>
            <div><span>03</span><p><strong>No diagnosis</strong> This is about observable performance cues, not how Harry feels.</p></div>
          </div>
        </section>

        <section className="tb-close" aria-labelledby="tb-close-title">
          <p className="tb-close-kicker">save this show night</p>
          <h2 id="tb-close-title">Want to keep<br /><em>this one?</em></h2>
          <p>Copy the entry ID so you can find Night 10 again.</p>
          <button type="button" onClick={copyEntryId}>
            {copied ? <Check size={15} /> : <Clipboard size={15} />}
            {copied ? "Night 10 ID copied" : "Copy Night 10 ID"}
          </button>
        </section>
      </main>

      <footer className="tb-footer">
        <strong>Is Harry Tired?</strong>
        <p>Illustrative prototype data. Brand language, not a conclusion. No affiliation with any performer, venue, or tour.</p>
        <a href="#tb-top">Back to top <ArrowUpRight size={13} /></a>
      </footer>
    </div>
  );
}

export default TicketNotebook;