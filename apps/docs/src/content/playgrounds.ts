import Button from '@feitio/astro/Button.astro';
import Checkbox from '@feitio/astro/Checkbox.astro';
import Divider from '@feitio/astro/Divider.astro';
import Field from '@feitio/astro/Field.astro';
import Fieldset from '@feitio/astro/Fieldset.astro';
import FilterField from '@feitio/astro/FilterField.astro';
import Heading from '@feitio/astro/Heading.astro';
import Kbd from '@feitio/astro/Kbd.astro';
import Link from '@feitio/astro/Link.astro';
import Notice from '@feitio/astro/Notice.astro';
import Radios from '@feitio/astro/Radios.astro';
import SegmentedControl from '@feitio/astro/SegmentedControl.astro';
import Select from '@feitio/astro/Select.astro';
import Switch from '@feitio/astro/Switch.astro';
import Tag from '@feitio/astro/Tag.astro';
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
    return {
      placeholder: '',
      text: '',
      controls: [],
      combos: {
        '': `<div class="feitio-stack" data-gap="3" style="inline-size: min(100%, 26rem)">${await renderHtml(FilterField, { id: 'pg-filter', list: 'pg-filter-list', label: words('Filtrar', 'Filter', 'Filtrar', 'Filtrer', 'Filtern'), placeholder: words('plantas, backup…', 'plants, backup…', 'plantas, copia…', 'plantes, sauvegarde…', 'Pflanzen, Sicherung…') })}${list}</div>`,
      },
    };
  }
  return undefined;
}
