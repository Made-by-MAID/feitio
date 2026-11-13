import type { ReactElement, ReactNode } from 'react';
import { yearsText } from './calculations/text.ts';

export interface FooterProps {
  name: string;
  since: number;
  links: { text: string; href: string }[];
  /** A short note, as HTML (it may hold a link). */
  note?: string;
  logo?: ReactNode;
}

/** Footer: who made it, since when, and the links that go at the end of every page. */
export function Footer({ name, since, links, note, logo }: FooterProps): ReactElement {
  return (
    <footer className="feitio-footer">
      <div className="inner">
        <span className="who">
          {logo}
          <strong>{name}</strong>
          <span>
            © <span data-since={since}>{yearsText(since, new Date().getFullYear())}</span>
          </span>
        </span>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: the note is the page author's own HTML. */}
        {note && <span dangerouslySetInnerHTML={{ __html: note }} />}
        <ul>
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.text}</a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
