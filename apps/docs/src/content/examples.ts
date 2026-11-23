import Anchor from '@feitio/astro/Anchor.astro';
import Block from '@feitio/astro/Block.astro';
import Heatmap from '@feitio/astro/Heatmap.astro';
import Inline from '@feitio/astro/Inline.astro';
import Masonry from '@feitio/astro/Masonry.astro';
import Page from '@feitio/astro/Page.astro';
import Skeleton from '@feitio/astro/Skeleton.astro';
import Stack from '@feitio/astro/Stack.astro';
import type { Locale } from '../i18n/ui.ts';
import { renderHtml } from '../lib/render.ts';
import { w } from './components/types.ts';

/**
 * The live examples a page's drafts mark with @@RENDER:key@@, rendered by the component itself at
 * build time, so the example always shows what the component draws. Data that depends on the
 * language (weekdays, months, dates) comes from Intl.
 */

type Axis = (string | undefined)[];
type Level = {
  id: string;
  label: string;
  tone: 'ok' | 'warn' | 'error' | 'empty' | 'low' | 'mid' | 'high';
};
type Cell = { level: string; title: string };
export type HeatmapSetting = {
  caption: string;
  rows: Axis;
  columns: Axis;
  cells: Cell[][];
  levels: Level[];
};

const DAY = 86_400_000;
/** The last day shown: a Sunday, fixed so the pages build the same every time. */
const LAST_SUNDAY = Date.UTC(2026, 10, 22);

function dayFormat(lang: Locale, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(lang, { timeZone: 'UTC', ...options });
}

/** Monday to Sunday, short, in the page's language. */
function weekdays(lang: Locale, weekday: 'short' | 'long'): string[] {
  const format = dayFormat(lang, { weekday });
  // 2026-11-16 is a Monday.
  return Array.from({ length: 7 }, (_, i) => format.format(Date.UTC(2026, 10, 16 + i)));
}

function hour(h: number): string {
  return `${String(h).padStart(2, '0')}h`;
}

function stateLevels(lang: Locale): Level[] {
  return [
    {
      id: 'up',
      tone: 'ok',
      label: w(
        'Todas respondidas',
        'All answered',
        'Todas respondidas',
        'Toutes répondues',
        'Alle beantwortet',
      )[lang],
    },
    {
      id: 'some',
      tone: 'warn',
      label: w(
        'Algumas falharam',
        'Some missed',
        'Algunas fallaron',
        'Certaines manquées',
        'Einige verpasst',
      )[lang],
    },
    {
      id: 'down',
      tone: 'error',
      label: w('Fora do ar', 'Down', 'Caído', 'En panne', 'Ausgefallen')[lang],
    },
    {
      id: 'none',
      tone: 'empty',
      label: w('Sem dados', 'No data', 'Sin datos', 'Pas de données', 'Keine Daten')[lang],
    },
  ];
}

/** The day at row r (Monday first) and column c (the oldest of 13 weeks first). */
function dayAt(r: number, c: number): number {
  return LAST_SUNDAY - ((12 - c) * 7 + (6 - r)) * DAY;
}

/** 13 weeks by 7 days: every other weekday labelled, a month only on the week it starts. */
function weeksAxes(lang: Locale): { rows: Axis; columns: Axis } {
  const days = weekdays(lang, 'short');
  const month = dayFormat(lang, { month: 'short' });
  return {
    rows: days.map((d, i) => (i % 2 === 0 ? d : undefined)),
    columns: Array.from({ length: 13 }, (_, c) => {
      const monday = new Date(dayAt(0, c));
      return monday.getUTCDate() <= 7 ? month.format(monday) : undefined;
    }),
  };
}

export function weeksSetting(lang: Locale): HeatmapSetting {
  const date = dayFormat(lang, { dateStyle: 'medium' });
  const started = Date.UTC(2026, 8, 9);
  return {
    caption: w(
      'Últimas 13 semanas, um quadrado por dia',
      'Last 13 weeks, one square a day',
      'Últimas 13 semanas, un cuadrado por día',
      'Les 13 dernières semaines, un carré par jour',
      'Die letzten 13 Wochen, ein Quadrat pro Tag',
    )[lang],
    ...weeksAxes(lang),
    cells: Array.from({ length: 7 }, (_, r) =>
      Array.from({ length: 13 }, (_, c) => {
        const day = dayAt(r, c);
        const level =
          day < started
            ? 'none'
            : c === 12 && r === 6
              ? 'down'
              : (r * 7 + c) % 19 === 3
                ? 'some'
                : 'up';
        return { level, title: date.format(day) };
      }),
    ),
    levels: stateLevels(lang),
  };
}

/** 7 days by 24 hours: every day labelled, the hours every 6. */
export function hoursSetting(lang: Locale): HeatmapSetting {
  const long = weekdays(lang, 'long');
  return {
    caption: w(
      'Últimos 7 dias, um quadrado por hora',
      'Last 7 days, one square an hour',
      'Últimos 7 días, un cuadrado por hora',
      'Les 7 derniers jours, un carré par heure',
      'Die letzten 7 Tage, ein Quadrat pro Stunde',
    )[lang],
    rows: weekdays(lang, 'short'),
    columns: Array.from({ length: 24 }, (_, c) => (c % 6 === 0 ? hour(c) : undefined)),
    cells: long.map((day, r) =>
      Array.from({ length: 24 }, (_, c) => ({
        level:
          r === 6 && c >= 12 ? (c > 13 ? 'none' : 'down') : (r * 24 + c) % 37 === 5 ? 'some' : 'up',
        title: `${day} ${String(c).padStart(2, '0')}:00`,
      })),
    ),
    levels: stateLevels(lang),
  };
}

/** A count over 13 weeks, on the intensity scale. */
export function countSetting(lang: Locale): HeatmapSetting {
  const date = dayFormat(lang, { dateStyle: 'medium' });
  const counts = ['0', '1', '2', '3'];
  return {
    caption: w(
      'Notas escritas nas últimas 13 semanas',
      'Notes written in the last 13 weeks',
      'Notas escritas en las últimas 13 semanas',
      'Notes écrites ces 13 dernières semaines',
      'Notizen der letzten 13 Wochen',
    )[lang],
    ...weeksAxes(lang),
    cells: Array.from({ length: 7 }, (_, r) =>
      Array.from({ length: 13 }, (_, c) => ({
        level: counts[r > 4 ? (r + c) % 2 : (r * 5 + c * 3) % 4] ?? '0',
        title: date.format(dayAt(r, c)),
      })),
    ),
    levels: [
      { id: '0', tone: 'empty', label: w('Nenhuma', 'None', 'Ninguna', 'Aucune', 'Keine')[lang] },
      { id: '1', tone: 'low', label: w('1 a 2', '1 to 2', '1 a 2', '1 à 2', '1 bis 2')[lang] },
      { id: '2', tone: 'mid', label: w('3 a 5', '3 to 5', '3 a 5', '3 à 5', '3 bis 5')[lang] },
      {
        id: '3',
        tone: 'high',
        label: w('6 ou mais', '6 or more', '6 o más', '6 ou plus', '6 oder mehr')[lang],
      },
    ],
  };
}

/** Blocks of different lengths, like the areas of a home screen: from one line to five. */
export async function areaBlocks(lang: Locale, item: 'div' | 'li' = 'div'): Promise<string> {
  const names = [
    w('Saúde', 'Health', 'Salud', 'Santé', 'Gesundheit'),
    w('Tarefas', 'Tasks', 'Tareas', 'Tâches', 'Aufgaben'),
    w('Lembretes', 'Reminders', 'Recordatorios', 'Rappels', 'Erinnerungen'),
    w('Notas', 'Notes', 'Notas', 'Notes', 'Notizen'),
    w('Dinheiro', 'Money', 'Dinero', 'Argent', 'Geld'),
    w('Casa', 'Home', 'Casa', 'Maison', 'Zuhause'),
  ];
  const line = w('Item', 'Item', 'Elemento', 'Élément', 'Eintrag')[lang];
  const lengths = [3, 1, 5, 2, 4, 1];
  const blocks: string[] = [];
  for (const [i, name] of names.entries()) {
    const lines = Array.from(
      { length: lengths[i] ?? 1 },
      (_, n) => `<span>${line} ${n + 1}</span>`,
    ).join('');
    const block = await renderHtml(
      Block,
      {},
      await renderHtml(Stack, { gap: 2 }, `<strong>${name[lang]}</strong>${lines}`),
    );
    blocks.push(item === 'li' ? `<li>${block}</li>` : block);
  }
  return blocks.join('');
}

/** Numbered pieces of three heights (site.css), to show the order going down a column. */
export function orderBoxes(count: number): string {
  const heights = ['1', '2', '3', '1', '3', '2', '1', '2'];
  return Array.from(
    { length: count },
    (_, i) => `<span class="lay-box" data-height="${heights[i % heights.length]}">${i + 1}</span>`,
  ).join('');
}

/** The live examples of a page, by key, or none. */
/**
 * An Anchor beside a box that scrolls, with four sections: a click scrolls the box to the section,
 * and the scroll marks the section in view. The behavior is the page's anchors(window).
 */
export async function anchorDemo(lang: Locale, sprite: string): Promise<string> {
  const sections = [
    {
      id: 'demo-water',
      title: w('Água', 'Water', 'Agua', 'Arrosage', 'Gießen'),
      text: w(
        'Regue quando a terra secar a dois dedos de fundo; a raiz encharcada apodrece.',
        'Water when the soil is dry two fingers deep; soaked roots rot.',
        'Riega cuando la tierra esté seca a dos dedos de hondo; la raíz encharcada se pudre.',
        'Arrosez quand la terre est sèche sur deux doigts ; les racines noyées pourrissent.',
        'Gieß, wenn die Erde zwei Finger tief trocken ist; nasse Wurzeln faulen.',
      ),
    },
    {
      id: 'demo-light',
      title: w('Luz', 'Light', 'Luz', 'Lumière', 'Licht'),
      text: w(
        'Perto da janela, sem sol direto do meio-dia; vire o vaso a cada semana.',
        'Near the window, out of the midday sun; turn the pot every week.',
        'Cerca de la ventana, sin el sol directo del mediodía; gira la maceta cada semana.',
        'Près de la fenêtre, à l’abri du soleil de midi ; tournez le pot chaque semaine.',
        'Nah am Fenster, ohne Mittagssonne; dreh den Topf jede Woche.',
      ),
    },
    {
      id: 'demo-soil',
      title: w('Terra', 'Soil', 'Tierra', 'Terre', 'Erde'),
      text: w(
        'Terra solta, com casca de pinus e um pouco de areia, para a água passar.',
        'Loose soil, with pine bark and a little sand, so the water runs through.',
        'Tierra suelta, con corteza de pino y algo de arena, para que el agua pase.',
        'Une terre légère, avec de l’écorce de pin et un peu de sable, pour que l’eau passe.',
        'Lockere Erde mit Pinienrinde und etwas Sand, damit das Wasser abläuft.',
      ),
    },
    {
      id: 'demo-pruning',
      title: w('Poda', 'Pruning', 'Poda', 'Taille', 'Schnitt'),
      text: w(
        'Corte as folhas secas rente ao caule, com a tesoura limpa.',
        'Cut dry leaves close to the stem, with clean scissors.',
        'Corta las hojas secas a ras del tallo, con la tijera limpia.',
        'Coupez les feuilles sèches au ras de la tige, avec des ciseaux propres.',
        'Schneid trockene Blätter dicht am Stiel ab, mit sauberer Schere.',
      ),
    },
  ];
  const label = w('Cuidados', 'Care', 'Cuidados', 'Soins', 'Pflege')[lang];
  const box = sections
    .map(
      (section) =>
        `<section><h3 id="${section.id}">${section.title[lang]}</h3>${`<p>${section.text[lang]}</p>`.repeat(3)}</section>`,
    )
    .join('');
  const anchor = await renderHtml(Anchor, {
    title: label,
    label: `${label}: ${w('nesta caixa', 'in this box', 'en esta caja', 'dans cette boîte', 'in diesem Kasten')[lang]}`,
    items: sections.map((section) => ({ id: section.id, text: section.title[lang] })),
    sprite,
  });
  return `<div class="anchor-demo"><div class="anchor-demo-box" tabindex="0" role="region" aria-label="${label}">${box}</div>${anchor}</div>`;
}

export async function liveExamples(
  slug: string,
  lang: Locale,
  sprite = '',
): Promise<Record<string, string>> {
  if (slug === 'anchor') return { 'anchor-follow': await anchorDemo(lang, sprite) };
  if (slug === 'masonry')
    return {
      'masonry-areas': await renderHtml(Masonry, { gap: 3 }, await areaBlocks(lang)),
      'masonry-order': await renderHtml(Masonry, { gap: 3, min: 'narrow' }, orderBoxes(8)),
      'masonry-max': await renderHtml(
        Masonry,
        { gap: 3, min: 'narrow', max: 2 },
        await areaBlocks(lang),
      ),
      'masonry-list': await renderHtml(Masonry, { gap: 3, as: 'ul' }, await areaBlocks(lang, 'li')),
    };
  if (slug === 'page') {
    const back = [{ text: w('Início', 'Home', 'Inicio', 'Accueil', 'Start')[lang], href: '#' }];
    const part = (text: string) => renderHtml(Block, {}, `<p>${text}</p>`);
    const parts = async () => renderHtml(Stack, { gap: 3 }, (await part('1')) + (await part('2')));
    return {
      'page-sections': await renderHtml(
        Page,
        {
          title: w('Configurações', 'Settings', 'Ajustes', 'Réglages', 'Einstellungen')[lang],
          lede: w(
            'De onde vem cada valor',
            'Where each value comes from',
            'De dónde viene cada valor',
            "D'où vient chaque valeur",
            'Woher jeder Wert kommt',
          )[lang],
          trail: back,
          trailLabel: w(
            'Caminho do exemplo de seções',
            'Path of the sections example',
            'Ruta del ejemplo de secciones',
            "Chemin de l'exemple de sections",
            'Pfad des Abschnittsbeispiels',
          )[lang],
          sprite,
          as: 'div',
        },
        await parts(),
      ),
      'page-detail': await renderHtml(
        Page,
        {
          layout: 'detail',
          as: 'div',
          asideLabel: w('Resumo', 'Summary', 'Resumen', 'Résumé', 'Übersicht')[lang],
          title: w('Saúde', 'Health', 'Salud', 'Santé', 'Zustand')[lang],
          trail: back,
          trailLabel: w(
            'Caminho do exemplo de detalhe',
            'Path of the detail example',
            'Ruta del ejemplo de detalle',
            "Chemin de l'exemple de détail",
            'Pfad des Detailbeispiels',
          )[lang],
          sprite,
        },
        {
          default: await parts(),
          aside: await part(w('Resumo', 'Summary', 'Resumen', 'Résumé', 'Übersicht')[lang]),
        },
      ),
    };
  }
  if (slug === 'skeleton') {
    const label = w('Carregando…', 'Loading…', 'Cargando…', 'Chargement…', 'Lädt…')[lang];
    return {
      'skeleton-text': await renderHtml(Skeleton, { label }),
      'skeleton-card': await renderHtml(
        Block,
        {},
        await renderHtml(
          Stack,
          { gap: 3 },
          (await renderHtml(Skeleton, { shape: 'block', label })) +
            (await renderHtml(Skeleton, { lines: 2, label: '' })),
        ),
      ),
      'skeleton-avatar': await renderHtml(
        Inline,
        { gap: 3 },
        (await renderHtml(Skeleton, { shape: 'circle', label })) +
          (await renderHtml(Skeleton, { lines: 2, label: '' })),
      ),
    };
  }
  if (slug === 'heatmap')
    return {
      'heatmap-weeks': await renderHtml(Heatmap, { id: 'ex-hm-weeks', ...weeksSetting(lang) }),
      'heatmap-hours': await renderHtml(Heatmap, { id: 'ex-hm-hours', ...hoursSetting(lang) }),
      'heatmap-count': await renderHtml(Heatmap, { id: 'ex-hm-count', ...countSetting(lang) }),
    };
  return {};
}
