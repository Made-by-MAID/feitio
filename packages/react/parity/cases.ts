/**
 * The parity cases: each one renders a component with the same props in Astro and in React, and the
 * two HTMLs must match. Slots are plain text: in React the default slot is children and a named slot
 * is the prop of the same name (logo, footer, do, dont).
 */
/** The parity cases whose HTML may carry a style attribute: the legacy Grid length, nothing else. */
export const INLINE_STYLE_ALLOWED = ['grid-length'];

export interface ParityCase {
  id: string;
  component: string;
  props: Record<string, unknown>;
  slots?: Record<string, string>;
  /** Props that only React takes in another shape (htmlFor for for). */
  react?: Record<string, unknown>;
}

function pageHref(page: number): string {
  return `?page=${page}`;
}

function perPageHref(n: number): string {
  return `?per=${n}`;
}

function pageLabel(page: number): string {
  return `Page ${page}`;
}

/**
 * Words that end in letters reaching past their width (the f of "Off"), in every bordered component
 * that wraps a short word. The docs test draws these renders and checks that no ink crosses a border.
 */
export const GLYPH_WORDS = ['Off', 'f', 'ff', 'y', 'j', '7'];

function glyphCases(word: string, n: number): ParityCase[] {
  return [
    { id: `glyph-${n}-tag`, component: 'Tag', props: {}, slots: { default: word } },
    {
      id: `glyph-${n}-tag-ok`,
      component: 'Tag',
      props: { status: 'ok' },
      slots: { default: word },
    },
    {
      id: `glyph-${n}-tag-small`,
      component: 'Tag',
      props: { size: 'small' },
      slots: { default: word },
    },
    { id: `glyph-${n}-button`, component: 'Button', props: {}, slots: { default: word } },
    {
      id: `glyph-${n}-button-small`,
      component: 'Button',
      props: { size: 'small' },
      slots: { default: word },
    },
    {
      id: `glyph-${n}-segmented`,
      component: 'SegmentedControl',
      props: { label: `Choose ${n}`, options: [word, `${word} ${word}`] },
    },
    { id: `glyph-${n}-kbd`, component: 'Kbd', props: {}, slots: { default: word } },
    {
      id: `glyph-${n}-kanban-card`,
      component: 'KanbanCard',
      props: { id: `g${n}`, name: `Card ${n}`, to: ['done'], moveLabel: word },
      slots: { default: word },
    },
  ];
}

const nav = [
  {
    title: 'Casa',
    items: [
      { text: 'Início', href: '#inicio', current: true, icon: 'check' },
      { text: 'Tarefas', href: '#tarefas' },
    ],
  },
  { items: [{ text: 'Ajustes', href: '#ajustes' }] },
];

export const cases: ParityCase[] = [
  {
    id: 'anchor',
    component: 'Anchor',
    props: {
      title: 'Nesta página',
      items: [
        { id: 'a', text: 'Uso', current: true, children: [{ id: 'a1', text: 'Quando' }] },
        { id: 'b', text: 'Regras' },
      ],
    },
  },
  {
    id: 'anchor-sticky',
    component: 'Anchor',
    props: { title: 'Nesta página', sticky: true, items: [{ id: 'c', text: 'Cuidados' }] },
  },
  {
    id: 'anchor-label',
    component: 'Anchor',
    props: { label: 'Índice', items: [{ id: 'x', text: 'X' }] },
  },
  {
    id: 'app-shell',
    component: 'AppShell',
    props: { id: 'app', brand: 'Feitio', nav },
    slots: { default: 'Conteúdo' },
  },
  {
    id: 'app-shell-user',
    component: 'AppShell',
    props: {
      id: 'app2',
      brand: 'Feitio',
      nav,
      user: 'Ana',
      signOut: { text: 'Sair', href: '#sair' },
      menuLabel: 'Navegar',
      closeLabel: 'Close',
      topLabel: 'Top',
      sprite: '/s.svg',
    },
  },
  { id: 'back-to-top', component: 'BackToTop', props: {} },
  {
    id: 'back-to-top-props',
    component: 'BackToTop',
    props: { href: '#main', label: 'Top', sprite: '/s.svg' },
  },
  { id: 'block', component: 'Block', props: {}, slots: { default: 'Um bloco' } },
  {
    id: 'block-section',
    component: 'Block',
    props: { as: 'section' },
    slots: { default: 'Seção' },
  },
  {
    id: 'breadcrumbs',
    component: 'Breadcrumbs',
    props: {
      items: [
        { text: 'Início', href: '/' },
        { text: 'Componentes', href: '/c/' },
      ],
      current: 'Botão',
    },
  },
  {
    id: 'breadcrumbs-label',
    component: 'Breadcrumbs',
    props: { items: [], current: 'Home', label: 'You are here' },
  },
  { id: 'button', component: 'Button', props: {}, slots: { default: 'Salvar' } },
  {
    id: 'button-primary',
    component: 'Button',
    props: {
      variant: 'primary',
      size: 'large',
      type: 'submit',
      class: 'extra',
      id: 'b1',
      disabled: true,
    },
    slots: { default: 'Enviar' },
  },
  {
    id: 'button-link',
    component: 'Button',
    props: { href: '/x', variant: 'danger', size: 'small' },
    slots: { default: 'Ir' },
  },
  {
    id: 'button-data',
    component: 'Button',
    props: { 'data-open-dialog': 'd1', 'aria-label': 'Abrir' },
    slots: { default: 'Abrir' },
  },
  { id: 'checkbox', component: 'Checkbox', props: { label: 'Lembrar' } },
  {
    id: 'checkbox-all',
    component: 'Checkbox',
    props: { label: 'Aceito', name: 'ok', value: 'sim', checked: true, disabled: true },
  },
  { id: 'code-block', component: 'CodeBlock', props: { code: '<p class="x">Olá & tchau</p>' } },
  {
    id: 'code-block-jsx',
    component: 'CodeBlock',
    props: {
      code: '<Button />',
      label: 'React',
      syntax: 'jsx',
      copyLabel: 'Copy',
      copiedLabel: 'Copied',
    },
  },
  { id: 'details', component: 'Details', props: { summary: 'Mais' }, slots: { default: 'Texto' } },
  {
    id: 'details-open',
    component: 'Details',
    props: { summary: 'Mais', open: true, sprite: '/s.svg' },
  },
  {
    id: 'dialog',
    component: 'Dialog',
    props: { id: 'd1', title: 'Sair?', action: 'Sair' },
    slots: { default: 'Vai perder.' },
  },
  {
    id: 'dialog-word',
    component: 'Dialog',
    props: {
      id: 'd2',
      title: 'Apagar tudo?',
      action: 'Apagar',
      cancel: 'Voltar',
      danger: true,
      confirmWord: { word: 'APAGAR', label: 'Digite APAGAR' },
    },
  },
  { id: 'divider', component: 'Divider', props: {} },
  {
    id: 'page-dashboard',
    component: 'Page',
    props: { layout: 'dashboard', title: 'MAID', lede: 'Production on macOS' },
    slots: { default: 'Cards' },
  },
  {
    id: 'page-sections',
    component: 'Page',
    props: {
      title: 'Settings',
      lede: 'Where each value comes from',
      trail: [{ text: 'MAID', href: '/' }],
      trailLabel: 'Caminho',
    },
    slots: { default: 'Parts' },
  },
  {
    id: 'page-detail',
    component: 'Page',
    props: {
      layout: 'detail',
      width: 'full',
      title: 'Health',
      trail: [{ text: 'MAID', href: '/' }],
      asideLabel: 'Checks',
    },
    slots: { default: 'Checks', aside: 'Index' },
  },
  {
    id: 'page-detail-alone',
    component: 'Page',
    props: { layout: 'detail', title: 'A post' },
    slots: { default: 'The post' },
  },
  {
    id: 'page-board',
    component: 'Page',
    props: { layout: 'board', title: 'Posts' },
    slots: { default: 'Board' },
  },
  { id: 'skeleton', component: 'Skeleton', props: {} },
  {
    id: 'skeleton-lines',
    component: 'Skeleton',
    props: { lines: 5, label: 'Carregando os posts…' },
  },
  { id: 'skeleton-block', component: 'Skeleton', props: { shape: 'block', size: 'large' } },
  { id: 'skeleton-circle', component: 'Skeleton', props: { shape: 'circle', size: 'small' } },
  { id: 'skeleton-silent', component: 'Skeleton', props: { lines: 2, label: '' } },
  { id: 'skeleton-one-silent', component: 'Skeleton', props: { lines: '1', label: '' } },
  { id: 'divider-vertical', component: 'Divider', props: { tone: 'ink', orientation: 'vertical' } },
  {
    id: 'do-dont',
    component: 'DoDont',
    props: { doWhy: 'Claro.', dontWhy: 'Confuso.' },
    slots: { do: 'Salvar', dont: 'OK' },
  },
  {
    id: 'do-dont-labels',
    component: 'DoDont',
    props: { doWhy: 'a', dontWhy: 'b', doLabel: 'Do', dontLabel: "Don't", sprite: '/s.svg' },
  },
  {
    id: 'drawer',
    component: 'Drawer',
    props: { id: 'dr', title: 'Filtros' },
    slots: { default: 'Corpo' },
  },
  {
    id: 'drawer-footer',
    component: 'Drawer',
    props: { id: 'dr2', side: 'start', label: 'Menu', closeLabel: 'Close' },
    slots: { default: 'Corpo', footer: 'Rodapé' },
  },
  { id: 'empty', component: 'EmptyState', props: { title: 'Nada aqui' } },
  {
    id: 'empty-torn',
    component: 'EmptyState',
    props: { title: 'Deu errado', text: 'Tente de novo.', illustration: 'torn', size: 'compact' },
    slots: { default: 'Ação' },
  },
  { id: 'empty-none', component: 'EmptyState', props: { title: 'Vazio', illustration: 'none' } },
  {
    id: 'error-message',
    component: 'ErrorMessage',
    props: { id: 'e1' },
    slots: { default: 'Diga o nome' },
  },
  {
    id: 'error-summary',
    component: 'ErrorSummary',
    props: {
      title: 'Corrija',
      errors: [
        { text: 'Nome', href: '#nome' },
        { text: 'Hora', href: '#hora' },
      ],
    },
  },
  {
    id: 'example',
    component: 'Example',
    props: { id: 'ex', title: 'Botão', description: 'Um botão.', code: '<button>' },
    slots: { default: 'Ao vivo' },
  },
  {
    id: 'example-labels',
    component: 'Example',
    props: {
      id: 'ex2',
      title: 'B',
      description: 'd',
      code: 'x',
      showLabel: 'Show code',
      copyLabel: 'Copy',
      copiedLabel: 'Copied',
    },
  },
  {
    id: 'field',
    component: 'Field',
    props: { label: 'Nome', for: 'nome' },
    slots: { default: 'campo' },
  },
  {
    id: 'field-all',
    component: 'Field',
    props: { label: 'Nome', for: 'n', hint: 'Como aparece', error: 'Diga o nome' },
  },
  {
    id: 'fieldset',
    component: 'Fieldset',
    props: { legend: 'Quando' },
    slots: { default: 'escolhas' },
  },
  { id: 'fieldset-hint', component: 'Fieldset', props: { legend: 'Quando', hint: 'Escolha um' } },
  {
    id: 'kanban',
    component: 'Kanban',
    props: {
      id: 'k',
      label: 'Posts',
      columns: [
        {
          id: 'ideia',
          title: 'Ideia',
          create: { label: 'Nova ideia', field: 'Título da ideia' },
        },
        { id: 'rascunho', title: 'Rascunho', empty: 'Nenhum texto em andamento.' },
        { id: 'publicado', title: 'Publicado' },
      ],
    },
  },
  {
    id: 'kanban-current',
    component: 'Kanban',
    props: {
      id: 'k2',
      label: 'Board',
      current: 'b',
      moveLabel: 'Move to',
      columns: [
        {
          id: 'a',
          title: 'A',
          create: { label: 'New', field: 'Title', save: 'Save', cancel: 'Cancel' },
        },
        { id: 'b', title: 'B' },
      ],
    },
  },
  {
    id: 'kanban-card',
    component: 'KanbanCard',
    props: { id: 'c1', name: 'O goleiro', to: ['agendado', 'recusado'] },
    slots: { default: 'Conteúdo' },
  },
  {
    id: 'kanban-card-fixed',
    component: 'KanbanCard',
    props: { id: 'c2', name: 'Feitio', fixedLabel: 'fixed', moveLabel: 'Move' },
    slots: { default: 'Conteúdo' },
  },
  { id: 'filter', component: 'FilterField', props: { id: 'f', list: 'l', label: 'Filtrar' } },
  {
    id: 'filter-async',
    component: 'FilterField',
    props: {
      id: 'f2',
      list: 'l2',
      label: 'Filtrar',
      placeholder: 'Nome',
      debounce: 300,
      async: true,
      busyLabel: 'Wait',
    },
  },
  {
    id: 'filter-debounce',
    component: 'FilterField',
    props: { id: 'f3', list: 'l3', label: 'F', debounce: 200 },
  },
  {
    id: 'footer',
    component: 'Footer',
    props: { name: 'Feitio', since: 2024, links: [{ text: 'GitHub', href: 'https://github.com' }] },
  },
  {
    id: 'footer-note',
    component: 'Footer',
    props: {
      name: 'F',
      since: new Date().getFullYear(),
      links: [],
      note: 'Feito <a href="#">à mão</a>',
    },
    slots: { logo: 'Logo' },
  },
  { id: 'grid', component: 'Grid', props: {}, slots: { default: 'peças' } },
  { id: 'grid-min', component: 'Grid', props: { gap: 2, min: 'narrow', as: 'ul' } },
  { id: 'grid-wide', component: 'Grid', props: { min: 'wide' } },
  { id: 'grid-regular', component: 'Grid', props: { min: 'regular' } },
  // The one inline style left, kept for compatibility: a Grid min that is not a step. The docs test
  // allows it here only (INLINE_STYLE_ALLOWED); a strict CSP blocks it.
  { id: 'grid-length', component: 'Grid', props: { min: '9rem' } },
  {
    id: 'heatmap',
    component: 'Heatmap',
    props: {
      caption: 'Últimas 3 semanas',
      rows: ['Seg', '', 'Qua'],
      columns: ['', 'Nov', '', 'Dez'],
      cells: [
        [
          { level: 'up', title: '2026-11-02' },
          { level: 'down', title: '2026-11-09' },
          { level: 'gone', title: '2026-11-16' },
          { level: 'up', title: '2026-11-23' },
        ],
        [{ level: 'some', title: '2026-11-03' }],
        [],
      ],
      levels: [
        { id: 'up', label: 'No ar', tone: 'ok' },
        { id: 'some', label: 'Algumas falhas', tone: 'warn' },
        { id: 'down', label: 'Fora do ar', tone: 'error' },
      ],
    },
  },
  {
    id: 'heatmap-count',
    component: 'Heatmap',
    props: {
      id: 'hm2',
      caption: 'Notas',
      rows: ['00h', '06h'],
      columns: ['Seg', 'Ter'],
      cells: [
        [
          { level: '1', title: 'a' },
          { level: '2', title: 'b' },
        ],
        [
          { level: '3', title: 'c' },
          { level: '0', title: 'd' },
        ],
      ],
      levels: [
        { id: '0', label: 'Nenhuma', tone: 'empty' },
        { id: '1', label: 'Poucas', tone: 'low' },
        { id: '2', label: 'Algumas', tone: 'mid' },
        { id: '3', label: 'Muitas', tone: 'high' },
      ],
    },
  },
  {
    id: 'header',
    component: 'Header',
    props: {
      brand: 'Feitio',
      brandHref: '/',
      areas: [
        { text: 'Design', href: '/d/', current: true },
        { text: 'Dev', href: '/v/' },
      ],
    },
  },
  {
    id: 'header-menu',
    component: 'Header',
    props: {
      brand: 'F',
      brandHref: '/',
      areas: [],
      label: 'Áreas',
      menu: { label: 'Menu', target: 'nav' },
      sprite: '/s.svg',
    },
    slots: { default: 'busca', logo: 'L' },
  },
  { id: 'heading', component: 'Heading', props: {}, slots: { default: 'Título' } },
  {
    id: 'heading-1',
    component: 'Heading',
    props: { level: 1, id: 't' },
    slots: { default: 'Topo' },
  },
  {
    id: 'hint',
    component: 'Hint',
    props: { id: 'nome-dica' },
    slots: { default: 'Aparece na notificação' },
  },
  { id: 'hint-bare', component: 'Hint', props: {}, slots: { default: 'Opcional' } },
  { id: 'icon', component: 'Icon', props: { name: 'check' } },
  { id: 'icon-sprite', component: 'Icon', props: { name: 'search', sprite: '/a/b.svg' } },
  { id: 'inline', component: 'Inline', props: {}, slots: { default: 'x' } },
  { id: 'inline-props', component: 'Inline', props: { gap: 1, justify: 'between', as: 'ul' } },
  { id: 'kbd', component: 'Kbd', props: {}, slots: { default: 'Esc' } },
  { id: 'masonry', component: 'Masonry', props: {}, slots: { default: 'blocos' } },
  { id: 'masonry-min', component: 'Masonry', props: { gap: 3, min: 'wide', as: 'ul' } },
  { id: 'masonry-narrow', component: 'Masonry', props: { min: 'narrow' } },
  { id: 'masonry-regular', component: 'Masonry', props: { min: 'regular' } },
  {
    id: 'masonry-max',
    component: 'Masonry',
    props: { min: 'narrow', max: 3 },
    slots: { default: 'blocos' },
  },
  {
    id: 'masonry-uncapped',
    component: 'Masonry',
    props: { min: 'narrow' },
    slots: { default: 'blocos' },
  },
  {
    id: 'label',
    component: 'Label',
    props: { for: 'nome' },
    react: { for: undefined, htmlFor: 'nome' },
    slots: { default: 'Nome do lembrete' },
  },
  { id: 'link', component: 'Link', props: { href: '/x' }, slots: { default: 'Ver' } },
  {
    id: 'link-new-tab',
    component: 'Link',
    props: { href: 'https://x.dev', newTab: true },
    slots: { default: 'Site' },
  },
  {
    id: 'link-new-tab-label',
    component: 'Link',
    props: { href: 'https://x.dev', newTab: true, newTabLabel: '(new tab)', sprite: '/s.svg' },
    slots: { default: 'Site' },
  },
  {
    id: 'link-card',
    component: 'LinkCard',
    props: { href: '/c/', title: 'Componentes' },
    slots: { default: 'Todos' },
  },
  {
    id: 'menu',
    component: 'Menu',
    props: {
      id: 'lang',
      label: 'PT',
      hint: ', idioma: Português',
      size: 'small',
      items: [
        { text: 'Português', href: '/pt/', current: true, lang: 'pt', hreflang: 'pt' },
        { text: 'English', href: '/en/', lang: 'en', hreflang: 'en' },
      ],
    },
  },
  {
    id: 'menu-actions',
    component: 'Menu',
    props: { id: 'm', label: 'Ações', items: [{ text: 'Duplicar' }, { text: 'Apagar' }] },
  },
  { id: 'nav', component: 'Nav', props: { groups: nav } },
  { id: 'nav-label', component: 'Nav', props: { groups: nav, label: 'Produto', sprite: '/s.svg' } },
  { id: 'notice', component: 'Notice', props: { title: 'Atenção' } },
  {
    id: 'notice-text',
    component: 'Notice',
    props: { title: 'Salvo', status: 'ok', role: 'status' },
    slots: { default: 'Tudo certo.' },
  },
  {
    id: 'notice-timed',
    component: 'Notice',
    props: {
      title: 'Salvo',
      status: 'ok',
      timeout: 5000,
      id: 'n1',
      hidden: true,
      closeLabel: 'Close',
    },
  },
  {
    id: 'notice-close',
    component: 'Notice',
    props: { title: 'Erro', status: 'error', close: true, role: 'alert' },
  },
  {
    id: 'notice-warn',
    component: 'Notice',
    props: { title: 'Cuidado', status: 'warn', sprite: '/s.svg' },
  },
  {
    id: 'pagination',
    component: 'Pagination',
    props: { label: 'Páginas', current: 5, total: 12, href: pageHref },
  },
  {
    id: 'pagination-first',
    component: 'Pagination',
    props: { label: 'Páginas', current: 1, total: 3, href: pageHref },
  },
  {
    id: 'pagination-last',
    component: 'Pagination',
    props: { label: 'P', current: 9, total: 9, href: pageHref, count: '81 itens' },
  },
  {
    id: 'pagination-per-page',
    component: 'Pagination',
    props: {
      label: 'Pages',
      current: 2,
      total: 4,
      href: pageHref,
      pageLabel,
      perPage: { label: 'Per page', options: [10, 25, 50], current: 25, href: perPageHref },
      previousLabel: 'Previous',
      nextLabel: 'Next',
    },
  },
  {
    id: 'radios',
    component: 'Radios',
    props: { legend: 'Quando', name: 'q', options: ['Hoje', 'Amanhã'] },
  },
  {
    id: 'radios-inline',
    component: 'Radios',
    props: {
      legend: 'Quando',
      name: 'q2',
      options: ['Sim', 'Não'],
      value: 'Não',
      disabled: true,
      layout: 'inline',
    },
  },
  { id: 'scroll-fade', component: 'ScrollFade', props: {} },
  {
    id: 'search',
    component: 'Search',
    props: { id: 's', title: 'Buscar' },
    slots: { default: 'resultados' },
  },
  {
    id: 'search-keys',
    component: 'Search',
    props: {
      id: 's2',
      title: 'Search',
      placeholder: 'Type',
      closeLabel: 'Close',
      keys: { open: 'open', choose: 'choose', close: 'close' },
    },
  },
  {
    id: 'segmented',
    component: 'SegmentedControl',
    props: { label: 'Vista', options: ['Lista', 'Grade'] },
  },
  {
    id: 'segmented-value',
    component: 'SegmentedControl',
    props: { label: 'Vista', options: ['Lista', 'Grade'], value: 'Grade' },
  },
  { id: 'select', component: 'Select', props: { id: 'sel', options: ['Um', 'Dois'] } },
  {
    id: 'select-all',
    component: 'Select',
    props: {
      id: 'sel2',
      options: ['Um', 'Dois'],
      value: 'Dois',
      empty: 'Escolha…',
      disabled: true,
      invalid: true,
      describedBy: 'h',
    },
  },
  { id: 'skip-link', component: 'SkipLink', props: {}, slots: { default: 'Pular' } },
  {
    id: 'skip-link-href',
    component: 'SkipLink',
    props: { href: '#main' },
    slots: { default: 'Skip' },
  },
  { id: 'stack', component: 'Stack', props: {}, slots: { default: 'x' } },
  { id: 'stack-props', component: 'Stack', props: { gap: 7, align: 'center', as: 'ol' } },
  { id: 'status', component: 'StatusOverlay', props: {}, slots: { default: 'Conteúdo' } },
  {
    id: 'status-loading',
    component: 'StatusOverlay',
    props: { state: 'loading', label: 'Salvando', as: 'form' },
  },
  {
    id: 'summary-list',
    component: 'SummaryList',
    props: {
      rows: [
        { key: 'Nome', value: 'Ana', change: { href: '#n', label: 'Mudar' } },
        { key: 'Hora', value: '9h' },
      ],
    },
  },
  { id: 'swatch', component: 'Swatch', props: { role: 'accent' } },
  { id: 'swatch-ok-surface', component: 'Swatch', props: { role: 'ok-surface' } },
  { id: 'switch', component: 'Switch', props: { label: 'Avisos' } },
  {
    id: 'switch-on',
    component: 'Switch',
    props: { label: 'Avisos', on: true, disabled: true, onLabel: 'On', offLabel: 'Off' },
  },
  {
    id: 'table',
    component: 'Table',
    props: {
      id: 't',
      caption: 'Tarefas',
      columns: [
        { label: 'Nome' },
        { label: 'Horas', align: 'end' },
        { label: 'Ações', hidden: true },
      ],
      rows: [
        ['Lavar', '2', 'Editar'],
        ['Passar', '1', 'Editar'],
      ],
    },
  },
  {
    id: 'table-compact',
    component: 'Table',
    props: {
      id: 't2',
      columns: [{ label: 'Nome' }, { label: 'Estado' }],
      rows: [['A', 'ok']],
      compact: true,
    },
  },
  { id: 'tag', component: 'Tag', props: {}, slots: { default: 'Novo' } },
  {
    id: 'tag-ok',
    component: 'Tag',
    props: { status: 'ok', sprite: '/s.svg' },
    slots: { default: 'Pronto' },
  },
  {
    id: 'tag-small',
    component: 'Tag',
    props: { status: 'error', size: 'small' },
    slots: { default: 'Falhou' },
  },
  {
    id: 'task-list',
    component: 'TaskList',
    props: {
      items: [
        { name: 'Dados', href: '#d', detail: 'Nome e hora', status: 'ok', word: 'Feito' },
        { name: 'Revisar', href: '#r', word: 'A fazer' },
      ],
    },
  },
  { id: 'text', component: 'Text', props: {}, slots: { default: 'Um parágrafo.' } },
  { id: 'text-input', component: 'TextInput', props: { id: 'ti' } },
  {
    id: 'text-input-all',
    component: 'TextInput',
    props: {
      id: 'ti2',
      invalid: true,
      describedBy: 'ti2-hint',
      width: 10,
      class: 'x',
      name: 'n',
      placeholder: 'p',
      required: true,
    },
  },
  { id: 'textarea', component: 'Textarea', props: { id: 'ta' } },
  {
    id: 'textarea-all',
    component: 'Textarea',
    props: { id: 'ta2', invalid: true, describedBy: 'h', rows: 4, class: 'x' },
  },
  { id: 'time', component: 'TimeInput', props: {} },
  {
    id: 'time-12',
    component: 'TimeInput',
    props: {
      hour: '07',
      minute: '30',
      cycle: '12',
      period: 'PM',
      hourLabel: 'Hour',
      minuteLabel: 'Minute',
      periodLabel: 'AM or PM',
      invalid: true,
      disabled: true,
    },
  },
  {
    id: 'visually-hidden',
    component: 'VisuallyHidden',
    props: {},
    slots: { default: 'Só ouvido' },
  },
  ...GLYPH_WORDS.flatMap(glyphCases),
];
