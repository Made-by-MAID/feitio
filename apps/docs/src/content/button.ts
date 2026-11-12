import type { Locale } from '../i18n/ui.ts';

/** The Button page's words, per language. The examples' HTML comes from the component itself. */
type ButtonPage = {
  lede: string;
  when: [string, string[]];
  whenNot: [string, string[]];
  examples: string;
  primary: [string, string, string];
  plain: [string, string, string];
  danger: [string, string, string];
  sizes: [string, string, string, string];
  link: [string, string, string];
  a11y: [string, string[]];
  attrs: [string, [string, string][]];
  area: string;
  /** Playground: title, variant, its three names, size, its three names, state, its two names, text, background. */
  pg: [
    string,
    string,
    [string, string, string],
    string,
    [string, string, string],
    string,
    [string, string],
    string,
    string,
  ];
};

export const BUTTON: Record<Locale, ButtonPage> = {
  pt: {
    lede: 'Faz uma ação na tela onde está. Para ir a outra página, é um link.',
    when: ['Quando usar', ['Para salvar, criar, enviar, apagar: tudo que muda algo aqui.']],
    whenNot: [
      'Quando não usar',
      [
        '<strong>Para ir a outra página:</strong> Link.',
        '<strong>Para escolher entre opções vizinhas:</strong> SegmentedControl.',
      ],
    ],
    examples: 'Exemplos',
    primary: [
      'Principal',
      'A ação que a tela existe para fazer. Laranja, e no máximo um por tela.',
      'Salvar alterações',
    ],
    plain: ['Comum', 'Todas as outras ações. Na dúvida, é este.', 'Cancelar'],
    danger: [
      'Perigo',
      'Apaga ou desfaz algo que não volta. Sempre com uma confirmação antes.',
      'Apagar',
    ],
    sizes: [
      'Tamanhos',
      'O pequeno para barras e cabeçalhos; o grande para a porta de entrada de uma página.',
      'Pequeno',
      'Grande',
    ],
    link: [
      'Com cara de botão',
      'Um link que leva a outra página, vestido de botão: só para portas, como "Começar".',
      'Começar',
    ],
    a11y: [
      'Acessibilidade',
      [
        'Uma ação é um <code>&lt;button&gt;</code>; um caminho é um <code>&lt;a&gt;</code>, mesmo com cara de botão.',
        'O texto diz o que acontece: verbo e objeto.',
        'O pequeno mantém uma área de toque de 40px em volta.',
      ],
    ],
    attrs: [
      'Atributos',
      [
        ['variant', '"primary" ou "danger"; sem ele, o comum.'],
        ['size', '"small" ou "large".'],
        ['href', 'Vira um link com cara de botão.'],
        ['type', '"button" (padrão), "submit" ou "reset".'],
      ],
    ],
    area: 'Componentes',
    pg: [
      'Playground',
      'Variante',
      ['Comum', 'Principal', 'Perigo'],
      'Tamanho',
      ['Normal', 'Pequeno', 'Grande'],
      'Estado',
      ['Ativo', 'Desativado'],
      'Texto',
      'Fundo',
    ],
  },
  en: {
    lede: 'Performs an action on the screen it is on. To go to another page, it is a link.',
    when: ['When to use', ['To save, create, send, delete: anything that changes something here.']],
    whenNot: [
      'When not to use',
      [
        '<strong>To go to another page:</strong> Link.',
        '<strong>To choose among neighboring options:</strong> SegmentedControl.',
      ],
    ],
    examples: 'Examples',
    primary: [
      'Primary',
      'The action the screen exists for. Orange, and at most one per screen.',
      'Save changes',
    ],
    plain: ['Default', 'Every other action. When in doubt, it is this one.', 'Cancel'],
    danger: [
      'Danger',
      'Deletes or undoes something that does not come back. Always with a confirmation first.',
      'Delete',
    ],
    sizes: [
      'Sizes',
      'Small for bars and headers; large for the front door of a page.',
      'Small',
      'Large',
    ],
    link: [
      'Looking like a button',
      'A link to another page, dressed as a button: only for doors, like "Get started".',
      'Get started',
    ],
    a11y: [
      'Accessibility',
      [
        'An action is a <code>&lt;button&gt;</code>; a path is an <code>&lt;a&gt;</code>, even when it looks like a button.',
        'The text says what happens: verb and object.',
        'The small one keeps a 40px touch area around it.',
      ],
    ],
    attrs: [
      'Attributes',
      [
        ['variant', '"primary" or "danger"; without it, the default.'],
        ['size', '"small" or "large".'],
        ['href', 'Makes it a link that looks like a button.'],
        ['type', '"button" (default), "submit" or "reset".'],
      ],
    ],
    area: 'Components',
    pg: [
      'Playground',
      'Variant',
      ['Default', 'Primary', 'Danger'],
      'Size',
      ['Regular', 'Small', 'Large'],
      'State',
      ['Enabled', 'Disabled'],
      'Text',
      'Background',
    ],
  },
  es: {
    lede: 'Hace una acción en la pantalla donde está. Para ir a otra página, es un enlace.',
    when: ['Cuándo usarlo', ['Para guardar, crear, enviar, borrar: todo lo que cambia algo aquí.']],
    whenNot: [
      'Cuándo no usarlo',
      [
        '<strong>Para ir a otra página:</strong> Link.',
        '<strong>Para elegir entre opciones vecinas:</strong> SegmentedControl.',
      ],
    ],
    examples: 'Ejemplos',
    primary: [
      'Principal',
      'La acción para la que existe la pantalla. Naranja, y como mucho uno por pantalla.',
      'Guardar cambios',
    ],
    plain: ['Común', 'Todas las demás acciones. Ante la duda, es este.', 'Cancelar'],
    danger: [
      'Peligro',
      'Borra o deshace algo que no vuelve. Siempre con una confirmación antes.',
      'Borrar',
    ],
    sizes: [
      'Tamaños',
      'El pequeño para barras y cabeceras; el grande para la puerta de entrada de una página.',
      'Pequeño',
      'Grande',
    ],
    link: [
      'Con aspecto de botón',
      'Un enlace a otra página, vestido de botón: solo para puertas, como "Empezar".',
      'Empezar',
    ],
    a11y: [
      'Accesibilidad',
      [
        'Una acción es un <code>&lt;button&gt;</code>; un camino es un <code>&lt;a&gt;</code>, aunque parezca un botón.',
        'El texto dice lo que pasa: verbo y objeto.',
        'El pequeño mantiene un área táctil de 40px alrededor.',
      ],
    ],
    attrs: [
      'Atributos',
      [
        ['variant', '"primary" o "danger"; sin él, el común.'],
        ['size', '"small" o "large".'],
        ['href', 'Lo convierte en un enlace con aspecto de botón.'],
        ['type', '"button" (por defecto), "submit" o "reset".'],
      ],
    ],
    area: 'Componentes',
    pg: [
      'Playground',
      'Variante',
      ['Común', 'Principal', 'Peligro'],
      'Tamaño',
      ['Normal', 'Pequeño', 'Grande'],
      'Estado',
      ['Activo', 'Desactivado'],
      'Texto',
      'Fondo',
    ],
  },
  fr: {
    lede: 'Effectue une action sur l’écran où il se trouve. Pour aller vers une autre page, c’est un lien.',
    when: [
      'Quand l’utiliser',
      ['Pour enregistrer, créer, envoyer, supprimer : tout ce qui change quelque chose ici.'],
    ],
    whenNot: [
      'Quand ne pas l’utiliser',
      [
        '<strong>Pour aller vers une autre page :</strong> Link.',
        '<strong>Pour choisir entre des options voisines :</strong> SegmentedControl.',
      ],
    ],
    examples: 'Exemples',
    primary: [
      'Principal',
      'L’action pour laquelle l’écran existe. Orange, et un seul par écran au plus.',
      'Enregistrer les modifications',
    ],
    plain: ['Courant', 'Toutes les autres actions. En cas de doute, c’est celui-ci.', 'Annuler'],
    danger: [
      'Danger',
      'Supprime ou annule quelque chose qui ne revient pas. Toujours avec une confirmation avant.',
      'Supprimer',
    ],
    sizes: [
      'Tailles',
      'Le petit pour les barres et les en-têtes ; le grand pour la porte d’entrée d’une page.',
      'Petit',
      'Grand',
    ],
    link: [
      'Avec l’allure d’un bouton',
      'Un lien vers une autre page, habillé en bouton : seulement pour les portes, comme « Commencer ».',
      'Commencer',
    ],
    a11y: [
      'Accessibilité',
      [
        'Une action est un <code>&lt;button&gt;</code> ; un chemin est un <code>&lt;a&gt;</code>, même s’il ressemble à un bouton.',
        'Le texte dit ce qui se passe : verbe et objet.',
        'Le petit garde une zone tactile de 40px autour de lui.',
      ],
    ],
    attrs: [
      'Attributs',
      [
        ['variant', '"primary" ou "danger" ; sans lui, le courant.'],
        ['size', '"small" ou "large".'],
        ['href', 'En fait un lien qui ressemble à un bouton.'],
        ['type', '"button" (par défaut), "submit" ou "reset".'],
      ],
    ],
    area: 'Composants',
    pg: [
      'Playground',
      'Variante',
      ['Courant', 'Principal', 'Danger'],
      'Taille',
      ['Normal', 'Petit', 'Grand'],
      'État',
      ['Actif', 'Désactivé'],
      'Texte',
      'Fond',
    ],
  },
  de: {
    lede: 'Führt eine Aktion auf dem Bildschirm aus, auf dem er steht. Um zu einer anderen Seite zu gehen, ist es ein Link.',
    when: [
      'Wann verwenden',
      ['Zum Speichern, Erstellen, Senden, Löschen: alles, was hier etwas ändert.'],
    ],
    whenNot: [
      'Wann nicht verwenden',
      [
        '<strong>Um zu einer anderen Seite zu gehen:</strong> Link.',
        '<strong>Um zwischen benachbarten Optionen zu wählen:</strong> SegmentedControl.',
      ],
    ],
    examples: 'Beispiele',
    primary: [
      'Primär',
      'Die Aktion, für die es den Bildschirm gibt. Orange, und höchstens einer pro Bildschirm.',
      'Änderungen speichern',
    ],
    plain: ['Standard', 'Alle anderen Aktionen. Im Zweifel ist es dieser.', 'Abbrechen'],
    danger: [
      'Gefahr',
      'Löscht oder macht etwas rückgängig, das nicht zurückkommt. Immer mit einer Bestätigung vorher.',
      'Löschen',
    ],
    sizes: [
      'Größen',
      'Der kleine für Leisten und Kopfzeilen; der große für die Eingangstür einer Seite.',
      'Klein',
      'Groß',
    ],
    link: [
      'Wie ein Button aussehend',
      'Ein Link zu einer anderen Seite, als Button gekleidet: nur für Türen, wie „Loslegen“.',
      'Loslegen',
    ],
    a11y: [
      'Barrierefreiheit',
      [
        'Eine Aktion ist ein <code>&lt;button&gt;</code>; ein Weg ist ein <code>&lt;a&gt;</code>, auch wenn er wie ein Button aussieht.',
        'Der Text sagt, was passiert: Verb und Objekt.',
        'Der kleine behält eine Berührungsfläche von 40px um sich herum.',
      ],
    ],
    attrs: [
      'Attribute',
      [
        ['variant', '"primary" oder "danger"; ohne, der Standard.'],
        ['size', '"small" oder "large".'],
        ['href', 'Macht ihn zu einem Link, der wie ein Button aussieht.'],
        ['type', '"button" (Standard), "submit" oder "reset".'],
      ],
    ],
    area: 'Komponenten',
    pg: [
      'Playground',
      'Variante',
      ['Standard', 'Primär', 'Gefahr'],
      'Größe',
      ['Normal', 'Klein', 'Groß'],
      'Zustand',
      ['Aktiv', 'Deaktiviert'],
      'Text',
      'Hintergrund',
    ],
  },
};
