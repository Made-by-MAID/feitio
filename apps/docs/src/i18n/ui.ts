/** The languages of the site, each with its own pages, and the words of the page frame. */
export const LOCALES = ['pt', 'en', 'es', 'fr', 'de'] as const;
export type Locale = (typeof LOCALES)[number];

/** The html lang of each language. */
export const HTML_LANG: Record<Locale, string> = {
  pt: 'pt-BR',
  en: 'en',
  es: 'es',
  fr: 'fr',
  de: 'de',
};

type Words = {
  skip: string;
  areas: { design: string; dev: string; comp: string; res: string };
  home: string;
  search: string;
  searchTitle: string;
  searchPlaceholder: string;
  searchEmpty: string;
  searchFirst: string;
  searchChoose: string;
  searchClose: string;
  close: string;
  menu: string;
  language: string;
  light: string;
  auto: string;
  day: string;
  night: string;
  onThisPage: string;
  copy: string;
  copied: string;
  showCode: string;
  top: string;
  madeBy: string;
  changelog: string;
  license: string;
  closeNotice: string;
  newTab: string;
};

export const WORDS: Record<Locale, Words> = {
  pt: {
    skip: 'Pular para o conteúdo',
    areas: { design: 'Design', dev: 'Desenvolvimento', comp: 'Componentes', res: 'Recursos' },
    home: 'Início',
    search: 'Buscar',
    searchTitle: 'Buscar no Feitio',
    searchPlaceholder: 'Button, cor, Drawer…',
    searchEmpty: 'Nada encontrado. Tente outra palavra.',
    searchFirst: 'abre o primeiro',
    searchChoose: 'escolhe',
    searchClose: 'fecha',
    close: 'Fechar',
    menu: 'Menu',
    language: 'Idioma',
    light: 'Luz',
    auto: 'Auto',
    day: 'Dia',
    night: 'Noite',
    onThisPage: 'Nesta página',
    copy: 'Copiar',
    copied: 'Copiado',
    showCode: 'Mostrar código',
    top: 'Topo',
    madeBy: 'Feito pela MAID, uma assistente de IA, para',
    changelog: 'Mudanças',
    license: 'Licença MIT',
    closeNotice: 'Fechar o aviso',
    newTab: '(abre em nova aba)',
  },
  en: {
    skip: 'Skip to content',
    areas: { design: 'Design', dev: 'Development', comp: 'Components', res: 'Resources' },
    home: 'Home',
    search: 'Search',
    searchTitle: 'Search Feitio',
    searchPlaceholder: 'Button, color, Drawer…',
    searchEmpty: 'Nothing found. Try another word.',
    searchFirst: 'opens the first',
    searchChoose: 'choose',
    searchClose: 'closes',
    close: 'Close',
    menu: 'Menu',
    language: 'Language',
    light: 'Light',
    auto: 'Auto',
    day: 'Day',
    night: 'Night',
    onThisPage: 'On this page',
    copy: 'Copy',
    copied: 'Copied',
    showCode: 'Show code',
    top: 'Top',
    madeBy: 'Made by MAID, an AI assistant, for',
    changelog: 'Changelog',
    license: 'MIT License',
    closeNotice: 'Close the notice',
    newTab: '(opens in a new tab)',
  },
  es: {
    skip: 'Saltar al contenido',
    areas: { design: 'Diseño', dev: 'Desarrollo', comp: 'Componentes', res: 'Recursos' },
    home: 'Inicio',
    search: 'Buscar',
    searchTitle: 'Buscar en Feitio',
    searchPlaceholder: 'Button, color, Drawer…',
    searchEmpty: 'No se encontró nada. Prueba otra palabra.',
    searchFirst: 'abre el primero',
    searchChoose: 'elige',
    searchClose: 'cierra',
    close: 'Cerrar',
    menu: 'Menú',
    language: 'Idioma',
    light: 'Luz',
    auto: 'Auto',
    day: 'Día',
    night: 'Noche',
    onThisPage: 'En esta página',
    copy: 'Copiar',
    copied: 'Copiado',
    showCode: 'Mostrar código',
    top: 'Arriba',
    madeBy: 'Hecho por MAID, una asistente de IA, para',
    changelog: 'Cambios',
    license: 'Licencia MIT',
    closeNotice: 'Cerrar el aviso',
    newTab: '(se abre en otra pestaña)',
  },
  fr: {
    skip: 'Aller au contenu',
    areas: { design: 'Design', dev: 'Développement', comp: 'Composants', res: 'Ressources' },
    home: 'Accueil',
    search: 'Rechercher',
    searchTitle: 'Rechercher dans Feitio',
    searchPlaceholder: 'Button, couleur, Drawer…',
    searchEmpty: 'Rien trouvé. Essayez un autre mot.',
    searchFirst: 'ouvre le premier',
    searchChoose: 'choisir',
    searchClose: 'ferme',
    close: 'Fermer',
    menu: 'Menu',
    language: 'Langue',
    light: 'Lumière',
    auto: 'Auto',
    day: 'Jour',
    night: 'Nuit',
    onThisPage: 'Sur cette page',
    copy: 'Copier',
    copied: 'Copié',
    showCode: 'Afficher le code',
    top: 'Haut',
    madeBy: 'Fait par MAID, une assistante IA, pour',
    changelog: 'Changements',
    license: 'Licence MIT',
    closeNotice: 'Fermer l’avis',
    newTab: '(s’ouvre dans un nouvel onglet)',
  },
  de: {
    skip: 'Zum Inhalt springen',
    areas: { design: 'Design', dev: 'Entwicklung', comp: 'Komponenten', res: 'Ressourcen' },
    home: 'Start',
    search: 'Suchen',
    searchTitle: 'Feitio durchsuchen',
    searchPlaceholder: 'Button, Farbe, Drawer…',
    searchEmpty: 'Nichts gefunden. Versuche ein anderes Wort.',
    searchFirst: 'öffnet das erste',
    searchChoose: 'auswählen',
    searchClose: 'schließt',
    close: 'Schließen',
    menu: 'Menü',
    language: 'Sprache',
    light: 'Licht',
    auto: 'Auto',
    day: 'Tag',
    night: 'Nacht',
    onThisPage: 'Auf dieser Seite',
    copy: 'Kopieren',
    copied: 'Kopiert',
    showCode: 'Code anzeigen',
    top: 'Nach oben',
    madeBy: 'Gemacht von MAID, einer KI-Assistentin, für',
    changelog: 'Änderungen',
    license: 'MIT-Lizenz',
    closeNotice: 'Hinweis schließen',
    newTab: '(öffnet in neuem Tab)',
  },
};

/** The same page in another language: only the first part of the path changes. */
export function pathIn(locale: Locale, path: string, base: string): string {
  const rest = path.slice(base.length).replace(/^[a-z]{2}\//, '');
  return `${base}${locale}/${rest}`;
}
