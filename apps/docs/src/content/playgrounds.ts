import Button from '@feitio/astro/Button.astro';
import Divider from '@feitio/astro/Divider.astro';
import Heading from '@feitio/astro/Heading.astro';
import Kbd from '@feitio/astro/Kbd.astro';
import Link from '@feitio/astro/Link.astro';
import Notice from '@feitio/astro/Notice.astro';
import Tag from '@feitio/astro/Tag.astro';
import type { Control } from '../components/Playground.astro';
import type { Locale } from '../i18n/ui.ts';
import { renderHtml } from '../lib/render.ts';
import { w } from './components/types.ts';

/** A playground: its controls and the HTML of every combination, rendered by the component. */
export type PlaygroundSetup = {
  controls: Control[];
  combos: Record<string, string>;
  text: string;
  placeholder: string;
};

const PH = '__TEXT__';
const L = {
  variant: w('Variante', 'Variant', 'Variante', 'Variante', 'Variante'),
  size: w('Tamanho', 'Size', 'Tamaño', 'Taille', 'Größe'),
  state: w('Estado', 'State', 'Estado', 'État', 'Zustand'),
  status: w('Estado', 'Status', 'Estado', 'État', 'Status'),
  close: w('Fechar', 'Close', 'Cierre', 'Fermeture', 'Schließen'),
};

async function combos(
  keys: string[][],
  render: (values: string[]) => Promise<string>,
): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  const walk = async (i: number, picked: string[]): Promise<void> => {
    if (i === keys.length) {
      out[picked.join('|')] = await render(picked);
      return;
    }
    for (const v of keys[i] ?? []) await walk(i + 1, [...picked, v]);
  };
  await walk(0, []);
  return out;
}

/** The components whose props are worth trying. The rest get the playground with no controls. */
export async function playgroundFor(
  slug: string,
  lang: Locale,
  sprite: string,
): Promise<PlaygroundSetup | undefined> {
  const words = (pt: string, en: string, es: string, fr: string, de: string) =>
    w(pt, en, es, fr, de)[lang];
  if (slug === 'button') {
    const keys = [
      ['', 'primary', 'danger'],
      ['', 'small', 'large'],
      ['', 'disabled'],
    ];
    return {
      placeholder: PH,
      text: words(
        'Salvar alterações',
        'Save changes',
        'Guardar cambios',
        'Enregistrer',
        'Änderungen speichern',
      ),
      controls: [
        {
          name: 'variant',
          label: L.variant[lang],
          options: [
            { value: '', label: words('Comum', 'Default', 'Común', 'Courant', 'Standard') },
            {
              value: 'primary',
              label: words('Principal', 'Primary', 'Principal', 'Principal', 'Primär'),
            },
            { value: 'danger', label: words('Perigo', 'Danger', 'Peligro', 'Danger', 'Gefahr') },
          ],
        },
        {
          name: 'size',
          label: L.size[lang],
          options: [
            { value: '', label: words('Normal', 'Regular', 'Normal', 'Normal', 'Normal') },
            { value: 'small', label: words('Pequeno', 'Small', 'Pequeño', 'Petit', 'Klein') },
            { value: 'large', label: words('Grande', 'Large', 'Grande', 'Grand', 'Groß') },
          ],
        },
        {
          name: 'state',
          label: L.state[lang],
          options: [
            { value: '', label: words('Ativo', 'Enabled', 'Activo', 'Actif', 'Aktiv') },
            {
              value: 'disabled',
              label: words('Desativado', 'Disabled', 'Desactivado', 'Désactivé', 'Deaktiviert'),
            },
          ],
        },
      ],
      combos: await combos(keys, ([v, z, d]) =>
        renderHtml(
          Button,
          { variant: v || undefined, size: z || undefined, disabled: d ? true : undefined },
          PH,
        ),
      ),
    };
  }
  if (slug === 'notice') {
    const keys = [
      ['', 'ok', 'warn', 'error'],
      ['', 'close'],
    ];
    return {
      placeholder: PH,
      text: words(
        'O primeiro aviso sai amanhã às 9h.',
        'The first one goes out tomorrow at 9.',
        'El primer aviso sale mañana a las 9.',
        'Le premier rappel part demain à 9 h.',
        'Die erste Erinnerung geht morgen um 9 Uhr raus.',
      ),
      controls: [
        {
          name: 'status',
          label: L.status[lang],
          options: [
            {
              value: '',
              label: words(
                'Informação',
                'Information',
                'Información',
                'Information',
                'Information',
              ),
            },
            { value: 'ok', label: words('Certo', 'Success', 'Correcto', 'Succès', 'Erfolg') },
            {
              value: 'warn',
              label: words('Atenção', 'Warning', 'Atención', 'Attention', 'Achtung'),
            },
            { value: 'error', label: words('Erro', 'Error', 'Error', 'Erreur', 'Fehler') },
          ],
        },
        {
          name: 'close',
          label: L.close[lang],
          options: [
            { value: '', label: words('Sem', 'Without', 'Sin', 'Sans', 'Ohne') },
            { value: 'close', label: words('Com', 'With', 'Con', 'Avec', 'Mit') },
          ],
        },
      ],
      combos: await combos(keys, ([st, c]) =>
        renderHtml(
          Notice,
          {
            status: st || undefined,
            title: words(
              'Lembrete salvo',
              'Reminder saved',
              'Recordatorio guardado',
              'Rappel enregistré',
              'Erinnerung gespeichert',
            ),
            close: Boolean(c),
            sprite,
          },
          PH,
        ),
      ),
    };
  }

  if (slug === 'divider') {
    const keys = [
      ['', 'ink'],
      ['horizontal', 'vertical'],
    ];
    return {
      placeholder: '',
      text: '',
      controls: [
        {
          name: 'tone',
          label: words('Tom', 'Tone', 'Tono', 'Ton', 'Ton'),
          options: [
            { value: '', label: words('Fina', 'Hairline', 'Fina', 'Fine', 'Fein') },
            { value: 'ink', label: words('Tinta', 'Ink', 'Tinta', 'Encre', 'Tinte') },
          ],
        },
        {
          name: 'orientation',
          label: words('Direção', 'Direction', 'Dirección', 'Direction', 'Richtung'),
          options: [
            {
              value: 'horizontal',
              label: words('Horizontal', 'Horizontal', 'Horizontal', 'Horizontale', 'Horizontal'),
            },
            {
              value: 'vertical',
              label: words('Vertical', 'Vertical', 'Vertical', 'Verticale', 'Vertikal'),
            },
          ],
        },
      ],
      combos: await combos(keys, async ([tone, o]) => {
        const hr = await renderHtml(Divider, { tone: tone || undefined, orientation: o });
        const a = words('Acima', 'Above', 'Arriba', 'Au-dessus', 'Oben');
        const b = words('Abaixo', 'Below', 'Abajo', 'En dessous', 'Unten');
        return o === 'vertical'
          ? `<div class="feitio-inline" data-gap="3"><span>${a}</span>${hr}<span>${b}</span></div>`
          : `<div class="feitio-stack" data-gap="3" style="inline-size: min(100%, 24rem)"><span>${a}</span>${hr}<span>${b}</span></div>`;
      }),
    };
  }
  if (slug === 'tag') {
    const keys = [
      ['', 'ok', 'warn', 'error'],
      ['', 'small'],
    ];
    return {
      placeholder: PH,
      text: words('Atrasado', 'Late', 'Atrasado', 'En retard', 'Verspätet'),
      controls: [
        {
          name: 'status',
          label: L.status[lang],
          options: [
            { value: '', label: words('Neutra', 'Neutral', 'Neutra', 'Neutre', 'Neutral') },
            { value: 'ok', label: words('Certo', 'Success', 'Correcto', 'Succès', 'Erfolg') },
            {
              value: 'warn',
              label: words('Atenção', 'Warning', 'Atención', 'Attention', 'Achtung'),
            },
            { value: 'error', label: words('Erro', 'Error', 'Error', 'Erreur', 'Fehler') },
          ],
        },
        {
          name: 'size',
          label: L.size[lang],
          options: [
            { value: '', label: words('Normal', 'Regular', 'Normal', 'Normal', 'Normal') },
            { value: 'small', label: words('Pequena', 'Small', 'Pequeña', 'Petite', 'Klein') },
          ],
        },
      ],
      combos: await combos(keys, ([st, z]) =>
        renderHtml(Tag, { status: st || undefined, size: z || undefined, sprite }, PH),
      ),
    };
  }
  if (slug === 'link') {
    const keys = [['', 'new-tab']];
    return {
      placeholder: PH,
      text: words(
        'o relatório de novembro',
        'the November report',
        'el informe de noviembre',
        'le rapport de novembre',
        'den Novemberbericht',
      ),
      controls: [
        {
          name: 'tab',
          label: words('Abre em', 'Opens in', 'Se abre en', 'S’ouvre dans', 'Öffnet in'),
          options: [
            {
              value: '',
              label: words('Esta aba', 'This tab', 'Esta pestaña', 'Cet onglet', 'Diesem Tab'),
            },
            {
              value: 'new-tab',
              label: words('Nova aba', 'New tab', 'Otra pestaña', 'Nouvel onglet', 'Neuem Tab'),
            },
          ],
        },
      ],
      combos: await combos(keys, ([t]) =>
        renderHtml(
          Link,
          {
            href: '#playground',
            newTab: Boolean(t),
            newTabLabel: words(
              '(abre em nova aba)',
              '(opens in a new tab)',
              '(se abre en otra pestaña)',
              '(s’ouvre dans un nouvel onglet)',
              '(öffnet in neuem Tab)',
            ),
            sprite,
          },
          PH,
        ),
      ),
    };
  }
  if (slug === 'heading') {
    const keys = [['1', '2', '3', '4']];
    return {
      placeholder: PH,
      text: words('Agendamentos', 'Schedules', 'Citas', 'Rendez-vous', 'Termine'),
      controls: [
        {
          name: 'level',
          label: words('Nível', 'Level', 'Nivel', 'Niveau', 'Ebene'),
          options: ['1', '2', '3', '4'].map((v) => ({ value: v, label: `h${v}` })),
        },
      ],
      combos: await combos(keys, ([v]) => renderHtml(Heading, { level: Number(v) }, PH)),
    };
  }
  if (slug === 'kbd') {
    return {
      placeholder: PH,
      text: 'Esc',
      controls: [],
      combos: { '': await renderHtml(Kbd, {}, PH) },
    };
  }
  return undefined;
}
