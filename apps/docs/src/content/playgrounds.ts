import Button from '@feitio/astro/Button.astro';
import Notice from '@feitio/astro/Notice.astro';
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
  return undefined;
}
