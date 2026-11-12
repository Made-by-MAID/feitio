import Anchor from '@feitio/astro/Anchor.astro';
import AppShell from '@feitio/astro/AppShell.astro';
import BackToTop from '@feitio/astro/BackToTop.astro';
import Breadcrumbs from '@feitio/astro/Breadcrumbs.astro';
import Button from '@feitio/astro/Button.astro';
import Checkbox from '@feitio/astro/Checkbox.astro';
import Details from '@feitio/astro/Details.astro';
import Divider from '@feitio/astro/Divider.astro';
import EmptyState from '@feitio/astro/EmptyState.astro';
import ErrorMessage from '@feitio/astro/ErrorMessage.astro';
import ErrorSummary from '@feitio/astro/ErrorSummary.astro';
import Field from '@feitio/astro/Field.astro';
import Fieldset from '@feitio/astro/Fieldset.astro';
import FilterField from '@feitio/astro/FilterField.astro';
import Footer from '@feitio/astro/Footer.astro';
import Grid from '@feitio/astro/Grid.astro';
import Header from '@feitio/astro/Header.astro';
import Heading from '@feitio/astro/Heading.astro';
import Icon from '@feitio/astro/Icon.astro';
import Inline from '@feitio/astro/Inline.astro';
import Kbd from '@feitio/astro/Kbd.astro';
import Link from '@feitio/astro/Link.astro';
import Nav from '@feitio/astro/Nav.astro';
import Notice from '@feitio/astro/Notice.astro';
import Pagination from '@feitio/astro/Pagination.astro';
import Radios from '@feitio/astro/Radios.astro';
import ScrollFade from '@feitio/astro/ScrollFade.astro';
import Search from '@feitio/astro/Search.astro';
import SegmentedControl from '@feitio/astro/SegmentedControl.astro';
import Select from '@feitio/astro/Select.astro';
import Stack from '@feitio/astro/Stack.astro';
import StatusOverlay from '@feitio/astro/StatusOverlay.astro';
import SummaryList from '@feitio/astro/SummaryList.astro';
import Switch from '@feitio/astro/Switch.astro';
import Table from '@feitio/astro/Table.astro';
import Tag from '@feitio/astro/Tag.astro';
import TaskList from '@feitio/astro/TaskList.astro';
import Textarea from '@feitio/astro/Textarea.astro';
import TextInput from '@feitio/astro/TextInput.astro';
import TimeInput from '@feitio/astro/TimeInput.astro';
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

  const ST = (opts: string[]) => ({
    name: 'state',
    label: L.state[lang],
    options: opts.map((v) => ({
      value: v,
      label:
        (
          {
            '': words('Normal', 'Normal', 'Normal', 'Normal', 'Normal'),
            disabled: words('Desativado', 'Disabled', 'Desactivado', 'Désactivé', 'Deaktiviert'),
            error: words('Com erro', 'With error', 'Con error', 'Avec erreur', 'Mit Fehler'),
            checked: words('Marcado', 'Checked', 'Marcado', 'Coché', 'Ausgewählt'),
            on: words('Ligado', 'On', 'Encendido', 'Activé', 'An'),
          } as Record<string, string>
        )[v] ?? v,
    })),
  });
  const ERR = words(
    'Escreva um nome para o lembrete',
    'Write a name for the reminder',
    'Escribe un nombre para el recordatorio',
    'Écrivez un nom pour le rappel',
    'Schreib einen Namen für die Erinnerung',
  );
  const HINT = words(
    'Aparece na notificação.',
    'It shows in the notification.',
    'Aparece en la notificación.',
    'Il apparaît dans la notification.',
    'Erscheint in der Benachrichtigung.',
  );
  const LABEL = words(
    'Nome do lembrete',
    'Reminder name',
    'Nombre del recordatorio',
    'Nom du rappel',
    'Name der Erinnerung',
  );
  const ON = words('Ligado', 'On', 'Encendido', 'Activé', 'An');
  const OFF = words('Desligado', 'Off', 'Apagado', 'Désactivé', 'Aus');
  const yesNo = (name: string, label: string) => ({
    name,
    label,
    options: [
      { value: '', label: words('Sem', 'Without', 'Sin', 'Sans', 'Ohne') },
      { value: 'yes', label: words('Com', 'With', 'Con', 'Avec', 'Mit') },
    ],
  });
  if (slug === 'field') {
    return {
      placeholder: PH,
      text: LABEL,
      controls: [
        yesNo('hint', words('Dica', 'Hint', 'Pista', 'Indication', 'Hinweis')),
        ST(['', 'error']),
      ],
      combos: await combos(
        [
          ['', 'yes'],
          ['', 'error'],
        ],
        async ([h, e]) =>
          renderHtml(
            Field,
            {
              label: PH,
              for: 'pg-name',
              hint: h ? HINT : undefined,
              error: e ? ERR : undefined,
              sprite,
            },
            await renderHtml(TextInput, {
              id: 'pg-name',
              invalid: Boolean(e),
              describedBy:
                [h && 'pg-name-hint', e && 'pg-name-error'].filter(Boolean).join(' ') || undefined,
            }),
          ),
      ),
    };
  }
  if (slug === 'textinput') {
    return {
      placeholder: PH,
      text: words(
        'Regar as plantas',
        'Water the plants',
        'Regar las plantas',
        'Arroser les plantes',
        'Pflanzen gießen',
      ),
      controls: [ST(['', 'disabled', 'error'])],
      combos: await combos([['', 'disabled', 'error']], async ([st]) =>
        renderHtml(
          Field,
          { label: LABEL, for: 'pg-t', error: st === 'error' ? ERR : undefined, sprite },
          await renderHtml(TextInput, {
            id: 'pg-t',
            value: PH,
            disabled: st === 'disabled',
            invalid: st === 'error',
            describedBy: st === 'error' ? 'pg-t-error' : undefined,
          }),
        ),
      ),
    };
  }
  if (slug === 'textarea') {
    return {
      placeholder: PH,
      text: words(
        'Me lembre de trocar as fotos do catálogo.',
        'Remind me to replace the catalog photos.',
        'Recuérdame cambiar las fotos del catálogo.',
        'Rappelle-moi de changer les photos du catalogue.',
        'Erinnere mich daran, die Katalogfotos zu ersetzen.',
      ),
      controls: [ST(['', 'disabled', 'error'])],
      combos: await combos([['', 'disabled', 'error']], async ([st]) =>
        renderHtml(
          Field,
          {
            label: words('Observação', 'Note', 'Nota', 'Note', 'Notiz'),
            for: 'pg-ta',
            error: st === 'error' ? ERR : undefined,
            sprite,
          },
          await renderHtml(
            Textarea,
            { id: 'pg-ta', rows: 3, disabled: st === 'disabled', invalid: st === 'error' },
            PH,
          ),
        ),
      ),
    };
  }
  if (slug === 'select') {
    const opts = [
      words('Diário', 'Daily', 'Diario', 'Quotidien', 'Täglich'),
      words('Semanal', 'Weekly', 'Semanal', 'Hebdomadaire', 'Wöchentlich'),
      words('Mensal', 'Monthly', 'Mensual', 'Mensuel', 'Monatlich'),
    ];
    return {
      placeholder: '',
      text: '',
      controls: [
        yesNo(
          'empty',
          words('Opção vazia', 'Empty option', 'Opción vacía', 'Option vide', 'Leere Option'),
        ),
        ST(['', 'disabled', 'error']),
      ],
      combos: await combos(
        [
          ['', 'yes'],
          ['', 'disabled', 'error'],
        ],
        async ([e, st]) =>
          renderHtml(
            Field,
            {
              label: words('Repetir', 'Repeat', 'Repetir', 'Répéter', 'Wiederholen'),
              for: 'pg-s',
              error:
                st === 'error'
                  ? words(
                      'Escolha quando repetir',
                      'Choose when to repeat',
                      'Elige cuándo repetir',
                      'Choisissez quand répéter',
                      'Wähle, wann wiederholt wird',
                    )
                  : undefined,
              sprite,
            },
            await renderHtml(Select, {
              id: 'pg-s',
              options: opts,
              value: e ? undefined : opts[1],
              empty: e ? words('Escolha…', 'Choose…', 'Elige…', 'Choisir…', 'Wählen…') : undefined,
              disabled: st === 'disabled',
              invalid: st === 'error',
              sprite,
            }),
          ),
      ),
    };
  }
  if (slug === 'checkbox') {
    return {
      placeholder: PH,
      text: words(
        'Avisar no Discord',
        'Notify on Discord',
        'Avisar en Discord',
        'Prévenir sur Discord',
        'Auf Discord benachrichtigen',
      ),
      controls: [ST(['', 'checked', 'disabled'])],
      combos: await combos([['', 'checked', 'disabled']], ([st]) =>
        renderHtml(Checkbox, { label: PH, checked: st === 'checked', disabled: st === 'disabled' }),
      ),
    };
  }
  if (slug === 'radios') {
    const opts = [
      words('Todo dia', 'Every day', 'Cada día', 'Chaque jour', 'Jeden Tag'),
      words('Toda semana', 'Every week', 'Cada semana', 'Chaque semaine', 'Jede Woche'),
      words('Todo mês', 'Every month', 'Cada mes', 'Chaque mois', 'Jeden Monat'),
    ];
    return {
      placeholder: '',
      text: '',
      controls: [
        {
          name: 'layout',
          label: words('Disposição', 'Layout', 'Disposición', 'Disposition', 'Anordnung'),
          options: [
            {
              value: 'stack',
              label: words('Empilhadas', 'Stacked', 'Apiladas', 'Empilées', 'Gestapelt'),
            },
            {
              value: 'inline',
              label: words(
                'Lado a lado',
                'Side by side',
                'Lado a lado',
                'Côte à côte',
                'Nebeneinander',
              ),
            },
          ],
        },
        ST(['', 'disabled']),
      ],
      combos: await combos(
        [
          ['stack', 'inline'],
          ['', 'disabled'],
        ],
        ([l, st]) =>
          renderHtml(Radios, {
            legend: words(
              'Com que frequência?',
              'How often?',
              '¿Con qué frecuencia?',
              'À quelle fréquence ?',
              'Wie oft?',
            ),
            name: 'pg-r',
            options: opts,
            value: opts[1],
            layout: l,
            disabled: st === 'disabled',
          }),
      ),
    };
  }
  if (slug === 'switch') {
    return {
      placeholder: PH,
      text: words(
        'Avisos por e-mail',
        'E-mail notices',
        'Avisos por correo',
        'Avis par e-mail',
        'E-Mail-Hinweise',
      ),
      controls: [ST(['', 'on', 'disabled'])],
      combos: await combos([['', 'on', 'disabled']], ([st]) =>
        renderHtml(Switch, {
          label: PH,
          on: st === 'on',
          disabled: st === 'disabled',
          onLabel: ON,
          offLabel: OFF,
        }),
      ),
    };
  }
  if (slug === 'timeinput') {
    const labels = {
      hourLabel: words('Hora', 'Hour', 'Hora', 'Heure', 'Stunde'),
      minuteLabel: words('Minuto', 'Minute', 'Minuto', 'Minute', 'Minute'),
      periodLabel: words('AM ou PM', 'AM or PM', 'AM o PM', 'AM ou PM', 'AM oder PM'),
    };
    return {
      placeholder: '',
      text: '',
      controls: [
        {
          name: 'cycle',
          label: words('Relógio', 'Clock', 'Reloj', 'Horloge', 'Uhr'),
          options: [
            { value: '24', label: '24h' },
            { value: '12', label: '12h' },
          ],
        },
        ST(['', 'error', 'disabled']),
      ],
      combos: await combos(
        [
          ['24', '12'],
          ['', 'error', 'disabled'],
        ],
        async ([c, st]) =>
          renderHtml(
            Fieldset,
            {
              legend: words(
                'Quando lembrar?',
                'When to remind?',
                '¿Cuándo recordar?',
                'Quand rappeler ?',
                'Wann erinnern?',
              ),
            },
            await renderHtml(TimeInput, {
              cycle: c,
              hour: st === 'error' ? '25' : c === '12' ? '07' : '19',
              minute: '30',
              period: 'PM',
              invalid: st === 'error',
              disabled: st === 'disabled',
              ...labels,
            }),
          ),
      ),
    };
  }
  if (slug === 'segmented') {
    const two = [
      words('Dia', 'Day', 'Día', 'Jour', 'Tag'),
      words('Noite', 'Night', 'Noche', 'Nuit', 'Nacht'),
    ];
    const three = [
      words('Dia', 'Day', 'Día', 'Jour', 'Tag'),
      words('Semana', 'Week', 'Semana', 'Semaine', 'Woche'),
      words('Mês', 'Month', 'Mes', 'Mois', 'Monat'),
    ];
    return {
      placeholder: '',
      text: '',
      controls: [
        {
          name: 'count',
          label: words('Opções', 'Options', 'Opciones', 'Options', 'Optionen'),
          options: [
            { value: '2', label: '2' },
            { value: '3', label: '3' },
          ],
        },
      ],
      combos: await combos([['2', '3']], ([n]) =>
        renderHtml(SegmentedControl, {
          label: words('Período', 'Period', 'Período', 'Période', 'Zeitraum'),
          options: n === '2' ? two : three,
        }),
      ),
    };
  }
  if (slug === 'fieldset') {
    const choices = (
      await Promise.all(
        [
          words('Discord', 'Discord', 'Discord', 'Discord', 'Discord'),
          words('E-mail', 'E-mail', 'Correo', 'E-mail', 'E-Mail'),
        ].map((l, i) => renderHtml(Checkbox, { label: l, checked: i === 0 })),
      )
    ).join('');
    return {
      placeholder: '',
      text: '',
      controls: [yesNo('hint', words('Dica', 'Hint', 'Pista', 'Indication', 'Hinweis'))],
      combos: await combos([['', 'yes']], ([h]) =>
        renderHtml(
          Fieldset,
          {
            legend: words(
              'Avisar por',
              'Notify by',
              'Avisar por',
              'Prévenir par',
              'Benachrichtigen per',
            ),
            hint: h
              ? words(
                  'Escolha um ou mais.',
                  'Choose one or more.',
                  'Elige uno o más.',
                  'Choisissez-en un ou plusieurs.',
                  'Wähle eins oder mehrere.',
                )
              : undefined,
          },
          `<div class="feitio-choices">${choices}</div>`,
        ),
      ),
    };
  }
  if (slug === 'filterfield') {
    const items = [
      words(
        'Backup semanal',
        'Weekly backup',
        'Copia semanal',
        'Sauvegarde hebdomadaire',
        'Wöchentliche Sicherung',
      ),
      words(
        'Regar as plantas',
        'Water the plants',
        'Regar las plantas',
        'Arroser les plantes',
        'Pflanzen gießen',
      ),
      words(
        'Relatório do mês',
        'Monthly report',
        'Informe del mes',
        'Rapport du mois',
        'Monatsbericht',
      ),
      words(
        'Trocar as fotos',
        'Replace the photos',
        'Cambiar las fotos',
        'Changer les photos',
        'Fotos ersetzen',
      ),
    ];
    const list = `<ul class="feitio-task-list" id="pg-filter-list">${items.map((i) => `<li data-search="${i}"><span class="name">${i}</span></li>`).join('')}</ul>`;
    const offOn = (name: string, label: string, on: string) => ({
      name,
      label,
      options: [
        { value: '', label: words('Desligada', 'Off', 'Apagada', 'Désactivée', 'Aus') },
        { value: 'on', label: on },
      ],
    });
    return {
      placeholder: '',
      text: '',
      controls: [
        offOn(
          'debounce',
          words('Espera', 'Debounce', 'Espera', 'Attente', 'Verzögerung'),
          '600 ms',
        ),
        offOn(
          'async',
          words(
            'Busca assíncrona',
            'Async search',
            'Búsqueda asíncrona',
            'Recherche asynchrone',
            'Asynchrone Suche',
          ),
          words(
            'Ligada (demo: 1 s)',
            'On (demo: 1 s)',
            'Encendida (demo: 1 s)',
            'Activée (démo : 1 s)',
            'An (Demo: 1 s)',
          ),
        ),
      ],
      combos: await combos(
        [
          ['', 'on'],
          ['', 'on'],
        ],
        async ([d, a]) =>
          `<div class="feitio-stack" data-gap="3" style="inline-size: min(100%, 26rem)" ${a ? 'data-demo-async' : ''}>${await renderHtml(FilterField, { id: 'pg-filter', list: 'pg-filter-list', label: words('Filtrar', 'Filter', 'Filtrar', 'Filtrer', 'Filtern'), placeholder: words('plantas, backup…', 'plants, backup…', 'plantas, copia…', 'plantes, sauvegarde…', 'Pflanzen, Sicherung…'), debounce: d ? 600 : undefined, async: Boolean(a), busyLabel: words('Buscando…', 'Searching…', 'Buscando…', 'Recherche…', 'Suche…') })}${list}</div>`,
      ),
    };
  }

  const GAP = {
    name: 'gap',
    label: words('Espaço (gap)', 'Space (gap)', 'Espacio (gap)', 'Espace (gap)', 'Abstand (gap)'),
    options: ['1', '2', '3', '4', '5', '6', '7'].map((v) => ({ value: v, label: v })),
  };
  const box = (n: number, wide = false) =>
    Array.from(
      { length: n },
      (_, i) => `<span class="lay-box"${wide && i % 3 === 1 ? ' data-wide' : ''}>${i + 1}</span>`,
    ).join('');
  if (slug === 'stack') {
    return {
      placeholder: '',
      text: '',
      controls: [
        GAP,
        {
          name: 'align',
          label: words('Alinhamento', 'Alignment', 'Alineación', 'Alignement', 'Ausrichtung'),
          options: [
            { value: '', label: words('Esticado', 'Stretched', 'Estirado', 'Étiré', 'Gestreckt') },
            { value: 'start', label: words('Início', 'Start', 'Inicio', 'Début', 'Anfang') },
            { value: 'center', label: words('Centro', 'Center', 'Centro', 'Centre', 'Mitte') },
          ],
        },
      ],
      combos: await combos([GAP.options.map((o) => o.value), ['', 'start', 'center']], ([g, a]) =>
        renderHtml(Stack, { gap: Number(g), align: a || undefined }, box(3)),
      ),
    };
  }
  if (slug === 'inline') {
    return {
      placeholder: '',
      text: '',
      controls: [
        GAP,
        {
          name: 'justify',
          label: words('Distribuição', 'Distribution', 'Distribución', 'Répartition', 'Verteilung'),
          options: [
            { value: '', label: words('Início', 'Start', 'Inicio', 'Début', 'Anfang') },
            {
              value: 'between',
              label: words('Espalhado', 'Spread', 'Repartido', 'Réparti', 'Verteilt'),
            },
            { value: 'end', label: words('Fim', 'End', 'Final', 'Fin', 'Ende') },
          ],
        },
        {
          name: 'count',
          label: words('Peças', 'Pieces', 'Piezas', 'Éléments', 'Teile'),
          options: [
            { value: '3', label: '3' },
            {
              value: '12',
              label: words(
                '12 (quebra a linha)',
                '12 (wraps)',
                '12 (salta de línea)',
                '12 (passe à la ligne)',
                '12 (umbrechen)',
              ),
            },
          ],
        },
      ],
      combos: await combos(
        [GAP.options.map((o) => o.value), ['', 'between', 'end'], ['3', '12']],
        ([g, j, n]) =>
          renderHtml(Inline, { gap: Number(g), justify: j || undefined }, box(Number(n))),
      ),
    };
  }
  if (slug === 'grid') {
    return {
      placeholder: '',
      text: '',
      controls: [
        GAP,
        {
          name: 'min',
          label: words(
            'Coluna mínima',
            'Narrowest column',
            'Columna mínima',
            'Colonne minimale',
            'Schmalste Spalte',
          ),
          options: ['6rem', '9rem', '15rem'].map((v) => ({ value: v, label: v })),
        },
        {
          name: 'count',
          label: words('Peças', 'Pieces', 'Piezas', 'Éléments', 'Teile'),
          options: ['5', '8'].map((v) => ({ value: v, label: v })),
        },
      ],
      combos: await combos(
        [GAP.options.map((o) => o.value), ['6rem', '9rem', '15rem'], ['5', '8']],
        ([g, m, n]) => renderHtml(Grid, { gap: Number(g), min: m }, box(Number(n))),
      ),
    };
  }

  if (slug === 'errormessage') {
    return {
      placeholder: PH,
      text: words(
        'Use um horário entre 00:00 e 23:59',
        'Use a time between 00:00 and 23:59',
        'Usa una hora entre 00:00 y 23:59',
        'Utilisez une heure entre 00:00 et 23:59',
        'Nutze eine Uhrzeit zwischen 00:00 und 23:59',
      ),
      controls: [],
      combos: {
        '': await renderHtml(
          Field,
          { label: words('Horário', 'Time', 'Hora', 'Heure', 'Uhrzeit'), for: 'pg-em', sprite },
          `${await renderHtml(TextInput, { id: 'pg-em', value: '25:00', invalid: true, describedBy: 'pg-em-error', width: 10 })}${await renderHtml(ErrorMessage, { id: 'pg-em-error', sprite }, PH)}`,
        ),
      },
    };
  }
  if (slug === 'errorsummary') {
    const all = [
      {
        text: words(
          'Escreva um nome para o lembrete',
          'Write a name for the reminder',
          'Escribe un nombre para el recordatorio',
          'Écrivez un nom pour le rappel',
          'Schreib einen Namen für die Erinnerung',
        ),
        href: '#playground',
      },
      {
        text: words(
          'Use um horário entre 00:00 e 23:59',
          'Use a time between 00:00 and 23:59',
          'Usa una hora entre 00:00 y 23:59',
          'Utilisez une heure entre 00:00 et 23:59',
          'Nutze eine Uhrzeit zwischen 00:00 und 23:59',
        ),
        href: '#playground',
      },
      {
        text: words(
          'Escolha quando repetir',
          'Choose when to repeat',
          'Elige cuándo repetir',
          'Choisissez quand répéter',
          'Wähle, wann wiederholt wird',
        ),
        href: '#playground',
      },
    ];
    const titles = {
      '1': words(
        'Corrija 1 campo para salvar',
        'Fix 1 field to save',
        'Corrige 1 campo para guardar',
        'Corrigez 1 champ pour enregistrer',
        'Korrigiere 1 Feld zum Speichern',
      ),
      '2': words(
        'Corrija 2 campos para salvar',
        'Fix 2 fields to save',
        'Corrige 2 campos para guardar',
        'Corrigez 2 champs pour enregistrer',
        'Korrigiere 2 Felder zum Speichern',
      ),
      '3': words(
        'Corrija 3 campos para salvar',
        'Fix 3 fields to save',
        'Corrige 3 campos para guardar',
        'Corrigez 3 champs pour enregistrer',
        'Korrigiere 3 Felder zum Speichern',
      ),
    } as Record<string, string>;
    return {
      placeholder: '',
      text: '',
      controls: [
        {
          name: 'count',
          label: words('Erros', 'Errors', 'Errores', 'Erreurs', 'Fehler'),
          options: ['1', '2', '3'].map((v) => ({ value: v, label: v })),
        },
      ],
      combos: await combos([['1', '2', '3']], ([n]) =>
        renderHtml(ErrorSummary, {
          title: titles[n ?? '1'],
          errors: all.slice(0, Number(n)),
          sprite,
        }),
      ),
    };
  }
  if (slug === 'emptystate') {
    const action = await renderHtml(
      Button,
      {},
      words(
        'Criar lembrete',
        'Create reminder',
        'Crear recordatorio',
        'Créer un rappel',
        'Erinnerung erstellen',
      ),
    );
    const retry = await renderHtml(
      Button,
      {},
      words('Tentar de novo', 'Try again', 'Intentar de nuevo', 'Réessayer', 'Erneut versuchen'),
    );
    return {
      placeholder: '',
      text: '',
      controls: [
        {
          name: 'art',
          label: words('Desenho', 'Drawing', 'Dibujo', 'Dessin', 'Zeichnung'),
          options: [
            { value: 'basket', label: words('Cesto', 'Basket', 'Cesta', 'Panier', 'Korb') },
            {
              value: 'torn',
              label: words(
                'Papel rasgado',
                'Torn paper',
                'Papel roto',
                'Papier déchiré',
                'Zerrissenes Papier',
              ),
            },
            { value: 'none', label: words('Sem', 'None', 'Sin', 'Aucun', 'Keine') },
          ],
        },
        {
          name: 'size',
          label: L.size[lang],
          options: [
            { value: '', label: words('Normal', 'Regular', 'Normal', 'Normal', 'Normal') },
            {
              value: 'compact',
              label: words('Compacto', 'Compact', 'Compacto', 'Compact', 'Kompakt'),
            },
          ],
        },
        yesNo('action', words('Ação', 'Action', 'Acción', 'Action', 'Aktion')),
      ],
      combos: await combos(
        [
          ['basket', 'torn', 'none'],
          ['', 'compact'],
          ['', 'yes'],
        ],
        ([a, z, act]) =>
          renderHtml(
            EmptyState,
            {
              title:
                a === 'torn'
                  ? words(
                      'Não deu para carregar',
                      'Could not load',
                      'No se pudo cargar',
                      'Impossible de charger',
                      'Konnte nicht laden',
                    )
                  : words(
                      'Nenhum lembrete ainda',
                      'No reminders yet',
                      'Aún no hay recordatorios',
                      'Pas encore de rappels',
                      'Noch keine Erinnerungen',
                    ),
              text:
                a === 'torn'
                  ? words(
                      'A conexão caiu. Tente de novo.',
                      'The connection dropped. Try again.',
                      'Se cayó la conexión. Inténtalo de nuevo.',
                      'La connexion est tombée. Réessayez.',
                      'Die Verbindung ist abgebrochen. Versuch es noch einmal.',
                    )
                  : words(
                      'Crie o primeiro e ele aparece aqui.',
                      'Create the first one and it shows up here.',
                      'Crea el primero y aparecerá aquí.',
                      'Créez le premier et il apparaîtra ici.',
                      'Erstelle die erste, dann erscheint sie hier.',
                    ),
              illustration: a,
              size: z || undefined,
            },
            act ? (a === 'torn' ? retry : action) : '',
          ),
      ),
    };
  }
  if (slug === 'statusoverlay') {
    const states = ['', 'loading', 'ok', 'error'];
    const labels: Record<string, string> = {
      loading: words('Salvando…', 'Saving…', 'Guardando…', 'Enregistrement…', 'Speichern…'),
      ok: words('Salvo', 'Saved', 'Guardado', 'Enregistré', 'Gespeichert'),
      error: words(
        'Não salvou',
        'Not saved',
        'No se guardó',
        'Non enregistré',
        'Nicht gespeichert',
      ),
    };
    const inner = `<div class="feitio-stack" data-gap="3"><strong>${words('Lembrete', 'Reminder', 'Recordatorio', 'Rappel', 'Erinnerung')}</strong>${await renderHtml(Field, { label: LABEL, for: 'pg-so', sprite }, await renderHtml(TextInput, { id: 'pg-so', value: words('Regar as plantas', 'Water the plants', 'Regar las plantas', 'Arroser les plantes', 'Pflanzen gießen') }))}<div>${await renderHtml(Button, { variant: 'primary' }, words('Salvar', 'Save', 'Guardar', 'Enregistrer', 'Speichern'))}</div></div>`;
    return {
      placeholder: '',
      text: '',
      controls: [
        {
          name: 'state',
          label: L.state[lang],
          options: states.map((v) => ({
            value: v,
            label: v ? (labels[v] ?? v) : words('Nenhum', 'None', 'Ninguno', 'Aucun', 'Keiner'),
          })),
        },
      ],
      combos: await combos([states], ([st]) =>
        renderHtml(
          StatusOverlay,
          { state: st || undefined, label: st ? labels[st] : '', as: 'div' },
          inner,
        ),
      ),
    };
  }

  if (slug === 'table') {
    const rowsData = [
      [
        words(
          'Backup semanal',
          'Weekly backup',
          'Copia semanal',
          'Sauvegarde hebdomadaire',
          'Wöchentliche Sicherung',
        ),
        words('Domingo, 3h', 'Sunday, 3 am', 'Domingo, 3 h', 'Dimanche, 3 h', 'Sonntag, 3 Uhr'),
        'ok',
        words('Em dia', 'On time', 'Al día', 'À jour', 'Pünktlich'),
        '48',
      ],
      [
        words(
          'Regar as plantas',
          'Water the plants',
          'Regar las plantas',
          'Arroser les plantes',
          'Pflanzen gießen',
        ),
        words('Terça, 9h', 'Tuesday, 9 am', 'Martes, 9 h', 'Mardi, 9 h', 'Dienstag, 9 Uhr'),
        'warn',
        words('Atrasado', 'Late', 'Atrasado', 'En retard', 'Verspätet'),
        '3',
      ],
      [
        words(
          'Relatório do mês',
          'Monthly report',
          'Informe del mes',
          'Rapport du mois',
          'Monatsbericht',
        ),
        words('Dia 1, 8h', 'The 1st, 8 am', 'Día 1, 8 h', 'Le 1er, 8 h', 'Am 1., 8 Uhr'),
        '',
        words('Pausado', 'Paused', 'En pausa', 'En pause', 'Pausiert'),
        '1.204',
      ],
      [
        words(
          'Trocar as fotos',
          'Replace the photos',
          'Cambiar las fotos',
          'Changer les photos',
          'Fotos ersetzen',
        ),
        words('Sexta, 18h', 'Friday, 6 pm', 'Viernes, 18 h', 'Vendredi, 18 h', 'Freitag, 18 Uhr'),
        'error',
        words('Falhou', 'Failed', 'Falló', 'Échoué', 'Fehlgeschlagen'),
        '12',
      ],
    ];
    const edit = words('Editar', 'Edit', 'Editar', 'Modifier', 'Bearbeiten');
    const columns = [
      { label: words('Nome', 'Name', 'Nombre', 'Nom', 'Name') },
      { label: words('Quando', 'When', 'Cuándo', 'Quand', 'Wann') },
      { label: words('Situação', 'Status', 'Situación', 'Statut', 'Status') },
      {
        label: words('Disparos', 'Runs', 'Ejecuciones', 'Exécutions', 'Läufe'),
        align: 'end' as const,
      },
      { label: words('Ações', 'Actions', 'Acciones', 'Actions', 'Aktionen'), hidden: true },
    ];
    const rowHtml = async (n: number) =>
      Promise.all(
        rowsData
          .slice(0, n)
          .map(async ([name, when, st, word, runs]) => [
            name ?? '',
            when ?? '',
            await renderHtml(Tag, { status: st || undefined, sprite }, word),
            runs ?? '',
            await renderHtml(
              Button,
              { size: 'small', href: '#playground' },
              `${edit}<span class="feitio-visually-hidden"> ${name}</span>`,
            ),
          ]),
      );
    return {
      placeholder: '',
      text: '',
      controls: [
        {
          name: 'density',
          label: words('Densidade', 'Density', 'Densidad', 'Densité', 'Dichte'),
          options: [
            {
              value: '',
              label: words('Confortável', 'Comfortable', 'Cómoda', 'Confortable', 'Bequem'),
            },
            {
              value: 'compact',
              label: words('Compacta', 'Compact', 'Compacta', 'Compacte', 'Kompakt'),
            },
          ],
        },
        yesNo('caption', words('Legenda', 'Caption', 'Leyenda', 'Légende', 'Beschriftung')),
        {
          name: 'rows',
          label: words('Linhas', 'Rows', 'Filas', 'Lignes', 'Zeilen'),
          options: ['2', '4'].map((v) => ({ value: v, label: v })),
        },
      ],
      combos: await combos(
        [
          ['', 'compact'],
          ['yes', ''],
          ['2', '4'],
        ],
        async ([d, c, n]) =>
          renderHtml(Table, {
            id: 'pg-table',
            caption: c
              ? words('Agendamentos', 'Schedules', 'Citas', 'Rendez-vous', 'Termine')
              : undefined,
            columns,
            rows: await rowHtml(Number(n)),
            compact: Boolean(d),
          }),
      ),
    };
  }
  if (slug === 'summarylist') {
    const change = words('Alterar', 'Change', 'Cambiar', 'Modifier', 'Ändern');
    const rows = [
      {
        key: words('Nome', 'Name', 'Nombre', 'Nom', 'Name'),
        value: words(
          'Regar as plantas',
          'Water the plants',
          'Regar las plantas',
          'Arroser les plantes',
          'Pflanzen gießen',
        ),
      },
      {
        key: words('Quando', 'When', 'Cuándo', 'Quand', 'Wann'),
        value: words(
          'Toda terça, às 9h',
          'Every Tuesday, 9 am',
          'Cada martes, a las 9',
          'Chaque mardi, à 9 h',
          'Jeden Dienstag, 9 Uhr',
        ),
      },
      {
        key: words('Avisar por', 'Notify by', 'Avisar por', 'Prévenir par', 'Benachrichtigen per'),
        value: 'Discord, e-mail',
      },
    ];
    return {
      placeholder: '',
      text: '',
      controls: [yesNo('change', words('Alterar', 'Change', 'Cambiar', 'Modifier', 'Ändern'))],
      combos: await combos([['yes', '']], ([c]) =>
        renderHtml(SummaryList, {
          rows: rows.map((r) => ({
            ...r,
            change: c ? { href: '#playground', label: change } : undefined,
          })),
        }),
      ),
    };
  }
  if (slug === 'tasklist') {
    const items = [
      {
        name: words(
          'Revisar o contrato do aluguel',
          'Review the lease',
          'Revisar el contrato de alquiler',
          'Relire le bail',
          'Mietvertrag prüfen',
        ),
        href: '#playground',
        detail: words(
          'Prazo 10 nov',
          'Due Nov 10',
          'Plazo 10 nov',
          'Échéance 10 nov',
          'Fällig 10. Nov.',
        ),
        status: 'warn' as const,
        word: words('Esperando', 'Waiting', 'Esperando', 'En attente', 'Wartet'),
      },
      {
        name: words(
          'Organizar as fotos',
          'Organize the photos',
          'Organizar las fotos',
          'Ranger les photos',
          'Fotos ordnen',
        ),
        href: '#playground',
        detail: words('Em andamento', 'In progress', 'En curso', 'En cours', 'In Arbeit'),
        word: words('Fazendo', 'Doing', 'Haciendo', 'En cours', 'In Arbeit'),
      },
      {
        name: words(
          'Regar as plantas',
          'Water the plants',
          'Regar las plantas',
          'Arroser les plantes',
          'Pflanzen gießen',
        ),
        href: '#playground',
        detail: words(
          'Concluída em 7 nov',
          'Done on Nov 7',
          'Terminada el 7 nov',
          'Terminée le 7 nov',
          'Erledigt am 7. Nov.',
        ),
        status: 'ok' as const,
        word: words('Concluída', 'Done', 'Terminada', 'Terminée', 'Erledigt'),
      },
    ];
    return {
      placeholder: '',
      text: '',
      controls: [yesNo('detail', words('Detalhe', 'Detail', 'Detalle', 'Détail', 'Detail'))],
      combos: await combos([['yes', '']], ([d]) =>
        renderHtml(TaskList, {
          items: items.map((i) => ({ ...i, detail: d ? i.detail : undefined })),
          sprite,
        }),
      ),
    };
  }
  if (slug === 'pagination') {
    return {
      placeholder: '',
      text: '',
      controls: [
        {
          name: 'page',
          label: words(
            'Página atual',
            'Current page',
            'Página actual',
            'Page actuelle',
            'Aktuelle Seite',
          ),
          options: ['1', '3', '7'].map((v) => ({ value: v, label: v })),
        },
        yesNo('per', words('Por página', 'Per page', 'Por página', 'Par page', 'Pro Seite')),
      ],
      combos: await combos(
        [
          ['1', '3', '7'],
          ['yes', ''],
        ],
        ([pgn, per]) => {
          const p = Number(pgn);
          return renderHtml(Pagination, {
            label: words(
              'Páginas dos agendamentos',
              'Schedule pages',
              'Páginas de citas',
              'Pages des rendez-vous',
              'Terminseiten',
            ),
            current: p,
            total: 7,
            href: (n: number) => `#playground-${n}`,
            sprite,
            previousLabel: words('Anterior', 'Previous', 'Anterior', 'Précédente', 'Zurück'),
            nextLabel: words('Próxima', 'Next', 'Siguiente', 'Suivante', 'Weiter'),
            pageLabel: (n: number) => `${words('Página', 'Page', 'Página', 'Page', 'Seite')} ${n}`,
            count: `${words('Mostrando', 'Showing', 'Mostrando', 'Affichage', 'Zeige')} ${(p - 1) * 20 + 1}–${Math.min(p * 20, 132)} / 132`,
            perPage: per
              ? {
                  label: words('Por página', 'Per page', 'Por página', 'Par page', 'Pro Seite'),
                  options: [20, 50, 100],
                  current: 20,
                  href: (n: number) => `#per-${n}`,
                }
              : undefined,
          });
        },
      ),
    };
  }

  const NAVG = (icons: boolean, two: boolean) => [
    {
      title: words('Trabalho', 'Work', 'Trabajo', 'Travail', 'Arbeit'),
      items: [
        {
          text: words('Agendamentos', 'Schedules', 'Citas', 'Rendez-vous', 'Termine'),
          href: '#playground',
          current: true,
          icon: icons ? 'calendar' : undefined,
        },
        {
          text: words('Tarefas', 'Tasks', 'Tareas', 'Tâches', 'Aufgaben'),
          href: '#playground',
          icon: icons ? 'task' : undefined,
        },
      ],
    },
    ...(two
      ? [
          {
            title: words('Produto', 'Product', 'Producto', 'Produit', 'Produkt'),
            items: [
              {
                text: words('Ajustes', 'Settings', 'Ajustes', 'Réglages', 'Einstellungen'),
                href: '#playground',
                icon: icons ? 'sliders' : undefined,
              },
            ],
          },
        ]
      : []),
  ];
  const LONGTEXT = Array.from(
    { length: 10 },
    (_, i) =>
      `<p>${words('Lembrete', 'Reminder', 'Recordatorio', 'Rappel', 'Erinnerung')} ${i + 1}: ${words('toda semana', 'every week', 'cada semana', 'chaque semaine', 'jede Woche')}, ${8 + i}h.</p>`,
  ).join('');
  if (slug === 'nav') {
    return {
      placeholder: '',
      text: '',
      controls: [
        yesNo('icons', words('Ícones', 'Icons', 'Iconos', 'Icônes', 'Symbole')),
        {
          name: 'groups',
          label: words('Grupos', 'Groups', 'Grupos', 'Groupes', 'Gruppen'),
          options: ['1', '2'].map((v) => ({ value: v, label: v })),
        },
      ],
      combos: await combos(
        [
          ['', 'yes'],
          ['1', '2'],
        ],
        ([ic, g]) =>
          renderHtml(Nav, {
            groups: NAVG(Boolean(ic), g === '2'),
            label: words('Principal', 'Main', 'Principal', 'Principale', 'Haupt'),
            sprite,
          }),
      ),
    };
  }
  if (slug === 'breadcrumbs') {
    const steps = [
      { text: words('Início', 'Home', 'Inicio', 'Accueil', 'Start'), href: '#playground' },
      {
        text: words('Agendamentos', 'Schedules', 'Citas', 'Rendez-vous', 'Termine'),
        href: '#playground',
      },
      {
        text: words('Esta semana', 'This week', 'Esta semana', 'Cette semaine', 'Diese Woche'),
        href: '#playground',
      },
    ];
    return {
      placeholder: '',
      text: '',
      controls: [
        {
          name: 'depth',
          label: words('Níveis', 'Levels', 'Niveles', 'Niveaux', 'Ebenen'),
          options: ['2', '3', '4'].map((v) => ({ value: v, label: v })),
        },
      ],
      combos: await combos([['2', '3', '4']], ([d]) =>
        renderHtml(Breadcrumbs, {
          items: steps.slice(0, Number(d) - 1),
          current: words(
            'Backup semanal',
            'Weekly backup',
            'Copia semanal',
            'Sauvegarde hebdomadaire',
            'Wöchentliche Sicherung',
          ),
          label: words('Você está em', 'You are here', 'Estás en', 'Vous êtes ici', 'Du bist hier'),
          sprite,
        }),
      ),
    };
  }
  if (slug === 'anchor') {
    const items = [
      {
        id: 'playground',
        text: words(
          'Quando usar',
          'When to use',
          'Cuándo usarlo',
          'Quand l’utiliser',
          'Wann verwenden',
        ),
      },
      {
        id: 'playground',
        text: words('Exemplos', 'Examples', 'Ejemplos', 'Exemples', 'Beispiele'),
      },
      {
        id: 'playground',
        text: words(
          'Acessibilidade',
          'Accessibility',
          'Accesibilidad',
          'Accessibilité',
          'Barrierefreiheit',
        ),
      },
    ];
    return {
      placeholder: '',
      text: '',
      controls: [
        {
          name: 'current',
          label: words(
            'Trecho atual',
            'Current part',
            'Parte actual',
            'Partie actuelle',
            'Aktueller Teil',
          ),
          options: ['0', '1', '2'].map((v, i) => ({ value: v, label: items[i]?.text ?? v })),
        },
      ],
      combos: await combos([['0', '1', '2']], ([c]) =>
        renderHtml(Anchor, {
          title: words(
            'Nesta página',
            'On this page',
            'En esta página',
            'Sur cette page',
            'Auf dieser Seite',
          ),
          label: words(
            'Exemplo de índice',
            'Index example',
            'Ejemplo de índice',
            'Exemple d’index',
            'Beispielverzeichnis',
          ),
          items: items.map((it, i) => ({ ...it, current: String(i) === c })),
          sprite,
        }),
      ),
    };
  }
  if (slug === 'details') {
    return {
      placeholder: '',
      text: '',
      controls: [
        {
          name: 'open',
          label: L.state[lang],
          options: [
            { value: '', label: words('Fechado', 'Closed', 'Cerrado', 'Fermé', 'Geschlossen') },
            { value: 'open', label: words('Aberto', 'Open', 'Abierto', 'Ouvert', 'Offen') },
          ],
        },
      ],
      combos: await combos([['', 'open']], ([o]) =>
        renderHtml(
          Details,
          {
            summary: words(
              'O que é o fuso horário?',
              'What is the time zone?',
              '¿Qué es la zona horaria?',
              'Qu’est-ce que le fuseau horaire ?',
              'Was ist die Zeitzone?',
            ),
            open: Boolean(o),
            sprite,
          },
          `<p>${words('É a hora local que o produto usa para disparar os lembretes.', 'It is the local time the product uses to fire reminders.', 'Es la hora local que el producto usa para disparar los recordatorios.', 'C’est l’heure locale que le produit utilise pour envoyer les rappels.', 'Es ist die Ortszeit, mit der das Produkt Erinnerungen auslöst.')}</p>`,
        ),
      ),
    };
  }
  if (slug === 'scrollfade' || slug === 'backtotop') {
    const top = await renderHtml(BackToTop, {
      href: '#pg-scroll',
      label: words('Topo', 'Top', 'Arriba', 'Haut', 'Nach oben'),
      sprite,
    });
    const fade = await renderHtml(ScrollFade);
    return {
      placeholder: '',
      text: '',
      controls: [
        {
          name: 'content',
          label: words('Conteúdo', 'Content', 'Contenido', 'Contenu', 'Inhalt'),
          options: [
            {
              value: 'long',
              label: words(
                'Longo (rola)',
                'Long (scrolls)',
                'Largo (desplaza)',
                'Long (défile)',
                'Lang (scrollt)',
              ),
            },
            { value: 'short', label: words('Curto', 'Short', 'Corto', 'Court', 'Kurz') },
          ],
        },
      ],
      combos: await combos(
        [['long', 'short']],
        async ([c]) =>
          `<div class="scroll-demo" id="pg-scroll" tabindex="0"><div class="scroll-demo-content">${c === 'long' ? LONGTEXT : `<p>${words('Só uma linha: nada embaixo.', 'Just one line: nothing below.', 'Solo una línea: nada debajo.', 'Une seule ligne : rien en dessous.', 'Nur eine Zeile: nichts darunter.')}</p>`}</div>${fade}${slug === 'backtotop' ? top : ''}</div>`,
      ),
    };
  }
  if (slug === 'search') {
    const results = [
      ['Table', words('Componentes', 'Components', 'Componentes', 'Composants', 'Komponenten')],
      [
        'Tokens',
        words('Desenvolvimento', 'Development', 'Desarrollo', 'Développement', 'Entwicklung'),
      ],
    ];
    const keys = {
      open: words(
        'abre o primeiro',
        'opens the first',
        'abre el primero',
        'ouvre le premier',
        'öffnet das erste',
      ),
      choose: words('escolhe', 'choose', 'elige', 'choisir', 'auswählen'),
      close: words('fecha', 'closes', 'cierra', 'ferme', 'schließt'),
    };
    return {
      placeholder: '',
      text: '',
      controls: [
        {
          name: 'results',
          label: words('Resultados', 'Results', 'Resultados', 'Résultats', 'Ergebnisse'),
          options: [
            { value: 'yes', label: words('Com', 'With', 'Con', 'Avec', 'Mit') },
            { value: '', label: words('Nenhum', 'None', 'Ninguno', 'Aucun', 'Keine') },
          ],
        },
      ],
      combos: await combos([['yes', '']], async ([r]) => {
        const items = r
          ? results
              .map(
                ([t, a], i) =>
                  `<li><a href="#playground"${i === 0 ? ' data-active' : ''}><strong>${t}</strong><small>${a}</small></a></li>`,
              )
              .join('')
          : '';
        const html = await renderHtml(
          Search,
          {
            id: 'pg-search',
            title: words(
              'Buscar no Feitio',
              'Search Feitio',
              'Buscar en Feitio',
              'Rechercher dans Feitio',
              'Feitio durchsuchen',
            ),
            placeholder: words(
              'Button, cor…',
              'Button, color…',
              'Button, color…',
              'Button, couleur…',
              'Button, Farbe…',
            ),
            closeLabel: words('Fechar', 'Close', 'Cerrar', 'Fermer', 'Schließen'),
            keys,
            sprite,
          },
          items,
        );
        // In the playground the dialog shows in place, open, as a sample.
        return html
          .replace(
            '<dialog class="feitio-dialog search-dialog"',
            '<dialog open class="feitio-dialog search-dialog search-sample"',
          )
          .replace(
            r ? '' : '<ul class="results">',
            r
              ? ''
              : `<p class="empty">${words('Nada encontrado. Tente outra palavra.', 'Nothing found. Try another word.', 'No se encontró nada. Prueba otra palabra.', 'Rien trouvé. Essayez un autre mot.', 'Nichts gefunden. Versuch ein anderes Wort.')}</p><ul class="results">`,
          );
      }),
    };
  }
  if (slug === 'header') {
    const areas = [
      words('Design', 'Design', 'Diseño', 'Design', 'Design'),
      words('Desenvolvimento', 'Development', 'Desarrollo', 'Développement', 'Entwicklung'),
      words('Componentes', 'Components', 'Componentes', 'Composants', 'Komponenten'),
      words('Recursos', 'Resources', 'Recursos', 'Ressources', 'Ressourcen'),
    ];
    const search = await renderHtml(
      Button,
      { size: 'small' },
      `${await renderHtml(Icon, { name: 'search', sprite })}${words('Buscar', 'Search', 'Buscar', 'Rechercher', 'Suchen')}`,
    );
    const lang = await renderHtml(Button, { size: 'small', class: 'wide-only' }, 'PT');
    return {
      placeholder: '',
      text: '',
      controls: [
        {
          name: 'width',
          label: words('Largura', 'Width', 'Ancho', 'Largeur', 'Breite'),
          options: [
            { value: 'wide', label: words('Larga', 'Wide', 'Ancha', 'Large', 'Breit') },
            { value: 'narrow', label: 'Mobile' },
          ],
        },
      ],
      combos: await combos(
        [['wide', 'narrow']],
        async ([wd]) =>
          `<div class="header-sample" style="inline-size: ${wd === 'narrow' ? 'min(100%, 22rem)' : '100%'}">${await renderHtml(Header, { brand: 'Feitio', brandHref: '#playground', areas: areas.map((t, i) => ({ text: t, href: '#playground', current: i === 2 })), label: words('Áreas', 'Areas', 'Áreas', 'Zones', 'Bereiche'), menu: { label: words('Menu', 'Menu', 'Menú', 'Menu', 'Menü'), target: 'pg-header-menu' }, sprite }, `${search}${lang}`)}</div>`,
      ),
    };
  }
  if (slug === 'footer') {
    const links = [
      {
        text: words('Mudanças', 'Changelog', 'Cambios', 'Changements', 'Änderungen'),
        href: '#playground',
      },
      {
        text: words('Licença MIT', 'MIT License', 'Licencia MIT', 'Licence MIT', 'MIT-Lizenz'),
        href: '#playground',
      },
      { text: 'GitHub', href: '#playground' },
    ];
    return {
      placeholder: '',
      text: '',
      controls: [
        {
          name: 'since',
          label: words('Desde', 'Since', 'Desde', 'Depuis', 'Seit'),
          options: [
            {
              value: String(new Date().getFullYear()),
              label: words('Este ano', 'This year', 'Este año', 'Cette année', 'Dieses Jahr'),
            },
            { value: '2024', label: '2024' },
          ],
        },
      ],
      combos: await combos([[String(new Date().getFullYear()), '2024']], ([y]) =>
        renderHtml(Footer, { name: 'Feitio', since: Number(y), links }),
      ),
    };
  }
  if (slug === 'appshell') {
    return {
      placeholder: '',
      text: '',
      controls: [
        yesNo('user', words('Quem entrou', 'Signed in', 'Quién entró', 'Connecté', 'Angemeldet')),
      ],
      combos: await combos(
        [['yes', '']],
        async ([u]) =>
          `<div class="feitio-app-frame" style="block-size: 22rem; inline-size: min(100%, 24rem); overflow-y: auto; border: var(--feitio-border-width) solid var(--feitio-color-line)">${await renderHtml(AppShell, { id: 'pg-app', brand: words('Produto', 'Product', 'Producto', 'Produit', 'Produkt'), nav: NAVG(true, true), user: u ? 'Ana' : undefined, signOut: u ? { text: words('Sair', 'Sign out', 'Salir', 'Se déconnecter', 'Abmelden'), href: '#playground' } : undefined, closeLabel: words('Fechar', 'Close', 'Cerrar', 'Fermer', 'Schließen'), topLabel: words('Topo', 'Top', 'Arriba', 'Haut', 'Nach oben'), sprite }, `<div style="padding: var(--feitio-space-4)"><h3>${words('Agendamentos', 'Schedules', 'Citas', 'Rendez-vous', 'Termine')}</h3>${LONGTEXT}</div>`)}</div>`,
      ),
    };
  }
  return undefined;
}
