import type { Locale } from '../../i18n/ui.ts';

/** A text in every language of the site. */
export type Words = Record<Locale, string>;

/** Writes a text in the five languages, in the site's order. */
export function w(pt: string, en: string, es: string, fr: string, de: string): Words {
  return { pt, en, es, fr, de };
}

/** An example: its title and description per language, and the HTML its component renders. */
export type ExampleDoc = {
  id: string;
  title: Words;
  description: Words;
  /** Renders the example with the component itself, in the page's language. */
  render: (lang: Locale, sprite: string) => Promise<string>;
};

export type SectionDoc =
  | { kind: 'list'; id: string; title: Words; items: Words[] }
  | { kind: 'text'; id: string; title: Words; body: Words }
  | { kind: 'examples'; id: string; title: Words; examples: ExampleDoc[] }
  | { kind: 'attrs'; id: string; title: Words; attrs: [string, Words][] };

/** A component's page: its name, group, one-line lede and sections. */
export type ComponentDoc = {
  name: string;
  slug: string;
  group: GroupKey;
  lede: Words;
  sections: SectionDoc[];
};

export type GroupKey =
  | 'actions'
  | 'text'
  | 'layout'
  | 'forms'
  | 'feedback'
  | 'data'
  | 'navigation'
  | 'overlay'
  | 'docs';

/** The groups of the Components area, in order, with their names. */
export const GROUPS: [GroupKey, Words][] = [
  ['actions', w('Ações', 'Actions', 'Acciones', 'Actions', 'Aktionen')],
  [
    'text',
    w(
      'Texto e estrutura da página',
      'Text and page structure',
      'Texto y estructura de la página',
      'Texte et structure de la page',
      'Text und Seitenstruktur',
    ),
  ],
  ['layout', w('Layout', 'Layout', 'Diseño de página', 'Mise en page', 'Layout')],
  ['forms', w('Formulário', 'Forms', 'Formularios', 'Formulaires', 'Formulare')],
  [
    'feedback',
    w(
      'Retorno e erros',
      'Feedback and errors',
      'Retorno y errores',
      'Retour et erreurs',
      'Rückmeldung und Fehler',
    ),
  ],
  ['data', w('Dados', 'Data', 'Datos', 'Données', 'Daten')],
  ['navigation', w('Navegação', 'Navigation', 'Navegación', 'Navigation', 'Navigation')],
  [
    'overlay',
    w(
      'Por cima da tela',
      'On top of the screen',
      'Sobre la pantalla',
      'Par-dessus l’écran',
      'Über dem Bildschirm',
    ),
  ],
  ['docs', w('Documentação', 'Documentation', 'Documentación', 'Documentation', 'Dokumentation')],
  [
    'templates',
    w(
      'Modelos de página',
      'Page templates',
      'Plantillas de página',
      'Modèles de page',
      'Seitenvorlagen',
    ),
  ],
];

/** The section titles every component page shares. */
export const TITLES = {
  when: w('Quando usar', 'When to use', 'Cuándo usarlo', 'Quand l’utiliser', 'Wann verwenden'),
  whenNot: w(
    'Quando não usar',
    'When not to use',
    'Cuándo no usarlo',
    'Quand ne pas l’utiliser',
    'Wann nicht verwenden',
  ),
  examples: w('Exemplos', 'Examples', 'Ejemplos', 'Exemples', 'Beispiele'),
  a11y: w('Acessibilidade', 'Accessibility', 'Accesibilidad', 'Accessibilité', 'Barrierefreiheit'),
  rules: w('Regras', 'Rules', 'Reglas', 'Règles', 'Regeln'),
  attrs: w('Atributos', 'Attributes', 'Atributos', 'Attributs', 'Attribute'),
};
