import Block from '@feitio/astro/Block.astro';
import Divider from '@feitio/astro/Divider.astro';
import Heading from '@feitio/astro/Heading.astro';
import Icon from '@feitio/astro/Icon.astro';
import Kbd from '@feitio/astro/Kbd.astro';
import Link from '@feitio/astro/Link.astro';
import LinkCard from '@feitio/astro/LinkCard.astro';
import SkipLink from '@feitio/astro/SkipLink.astro';
import Text from '@feitio/astro/Text.astro';
import VisuallyHidden from '@feitio/astro/VisuallyHidden.astro';
import { renderHtml } from '../../lib/render.ts';
import { type ComponentDoc, TITLES, w } from './types.ts';

const NEW_TAB = w(
  '(abre em nova aba)',
  '(opens in a new tab)',
  '(se abre en otra pestaña)',
  '(s’ouvre dans un nouvel onglet)',
  '(öffnet in neuem Tab)',
);

export const ACTIONS_AND_TEXT: ComponentDoc[] = [
  {
    name: 'Link',
    slug: 'link',
    group: 'actions',
    lede: w(
      'Leva a outra página, ou a outro ponto desta. Sublinhado, no laranja feito para texto.',
      'Takes you to another page, or another spot on this one. Underlined, in the orange made for text.',
      'Lleva a otra página, o a otro punto de esta. Subrayado, en el naranja hecho para texto.',
      'Mène à une autre page, ou à un autre endroit de celle-ci. Souligné, dans l’orange fait pour le texte.',
      'Führt zu einer anderen Seite oder an eine andere Stelle dieser Seite. Unterstrichen, im Orange für Text.',
    ),
    sections: [
      {
        kind: 'list',
        id: 'when',
        title: TITLES.when,
        items: [
          w(
            'Para ir a outro lugar: outra página, outro site, uma seção desta.',
            'To go somewhere else: another page, another site, a section of this one.',
            'Para ir a otro lugar: otra página, otro sitio, una sección de esta.',
            'Pour aller ailleurs : une autre page, un autre site, une section de celle-ci.',
            'Um woanders hinzugehen: eine andere Seite, eine andere Website, ein Abschnitt dieser Seite.',
          ),
        ],
      },
      {
        kind: 'list',
        id: 'when-not',
        title: TITLES.whenNot,
        items: [
          w(
            '<strong>Para fazer algo aqui</strong> (salvar, apagar): Button.',
            '<strong>To do something here</strong> (save, delete): Button.',
            '<strong>Para hacer algo aquí</strong> (guardar, borrar): Button.',
            '<strong>Pour faire quelque chose ici</strong> (enregistrer, supprimer) : Button.',
            '<strong>Um hier etwas zu tun</strong> (speichern, löschen): Button.',
          ),
        ],
      },
      {
        kind: 'examples',
        id: 'examples',
        title: TITLES.examples,
        examples: [
          {
            id: 'in-text',
            title: w('No texto', 'In text', 'En el texto', 'Dans le texte', 'Im Text'),
            description: w(
              'O texto do link diz para onde vai, nunca "clique aqui".',
              'The link text says where it goes, never "click here".',
              'El texto del enlace dice adónde va, nunca "haz clic aquí".',
              'Le texte du lien dit où il mène, jamais « cliquez ici ».',
              'Der Linktext sagt, wohin er führt, nie „hier klicken“.',
            ),
            render: async (lang, sprite) =>
              renderHtml(
                Link,
                { href: '#in-text', sprite },
                {
                  pt: 'o relatório de novembro',
                  en: 'the November report',
                  es: 'el informe de noviembre',
                  fr: 'le rapport de novembre',
                  de: 'den Novemberbericht',
                }[lang],
              ),
          },
          {
            id: 'new-tab',
            title: w('Em nova aba', 'New tab', 'En otra pestaña', 'Nouvel onglet', 'Neuer Tab'),
            description: w(
              'A exceção, só quando sair da página faria perder algo, como um formulário pela metade. Sempre com o ícone e o aviso para leitores de tela.',
              'The exception, only when leaving would lose something, like a half-filled form. Always with the icon and the words for screen readers.',
              'La excepción, solo cuando salir haría perder algo, como un formulario a medias. Siempre con el icono y el aviso para lectores de pantalla.',
              'L’exception, seulement quand partir ferait perdre quelque chose, comme un formulaire à moitié rempli. Toujours avec l’icône et les mots pour les lecteurs d’écran.',
              'Die Ausnahme, nur wenn Weggehen etwas verlieren würde, wie ein halb ausgefülltes Formular. Immer mit dem Symbol und den Worten für Screenreader.',
            ),
            render: async (lang, sprite) =>
              renderHtml(
                Link,
                { href: '#new-tab', newTab: true, newTabLabel: NEW_TAB[lang], sprite },
                {
                  pt: 'o guia de horários',
                  en: 'the time guide',
                  es: 'la guía de horarios',
                  fr: 'le guide des horaires',
                  de: 'den Zeitleitfaden',
                }[lang],
              ),
          },
        ],
      },
      {
        kind: 'list',
        id: 'a11y',
        title: TITLES.a11y,
        items: [
          w(
            'O ícone no link quer dizer uma coisa só: abre em outra aba.',
            'The icon on a link means one thing only: it opens another tab.',
            'El icono en el enlace significa una sola cosa: abre otra pestaña.',
            'L’icône sur un lien ne veut dire qu’une chose : il ouvre un autre onglet.',
            'Das Symbol am Link bedeutet nur eines: Er öffnet einen anderen Tab.',
          ),
          w(
            'Sublinhado sempre: a cor sozinha não basta para ver que é link.',
            'Always underlined: color alone is not enough to see it is a link.',
            'Siempre subrayado: el color solo no basta para ver que es un enlace.',
            'Toujours souligné : la couleur seule ne suffit pas pour voir que c’est un lien.',
            'Immer unterstrichen: Farbe allein reicht nicht, um einen Link zu erkennen.',
          ),
        ],
      },
      {
        kind: 'attrs',
        id: 'attributes',
        title: TITLES.attrs,
        attrs: [
          [
            'href',
            w('Para onde vai.', 'Where it goes.', 'Adónde va.', 'Où il mène.', 'Wohin er führt.'),
          ],
          [
            'newTab',
            w(
              'Abre em outra aba, com o ícone e o aviso.',
              'Opens another tab, with the icon and the words.',
              'Abre otra pestaña, con el icono y el aviso.',
              'Ouvre un autre onglet, avec l’icône et les mots.',
              'Öffnet einen anderen Tab, mit Symbol und Hinweis.',
            ),
          ],
          [
            'newTabLabel',
            w(
              'O que o leitor de tela ouve depois do texto.',
              'What screen readers hear after the text.',
              'Lo que oye el lector de pantalla después del texto.',
              'Ce que le lecteur d’écran entend après le texte.',
              'Was der Screenreader nach dem Text hört.',
            ),
          ],
        ],
      },
    ],
  },
  {
    name: 'LinkCard',
    slug: 'linkcard',
    group: 'actions',
    lede: w(
      'Uma porta para outra área: título, uma frase e a seta. O cartão inteiro é o link.',
      'A door to another area: title, one sentence and the arrow. The whole card is the link.',
      'Una puerta a otra área: título, una frase y la flecha. Toda la tarjeta es el enlace.',
      'Une porte vers une autre zone : titre, une phrase et la flèche. Toute la carte est le lien.',
      'Eine Tür zu einem anderen Bereich: Titel, ein Satz und der Pfeil. Die ganze Karte ist der Link.',
    ),
    sections: [
      {
        kind: 'list',
        id: 'when',
        title: TITLES.when,
        items: [
          w(
            'Para apresentar as áreas de um site ou de um produto, lado a lado.',
            'To present the areas of a site or a product, side by side.',
            'Para presentar las áreas de un sitio o producto, lado a lado.',
            'Pour présenter les zones d’un site ou d’un produit, côte à côte.',
            'Um die Bereiche einer Website oder eines Produkts nebeneinander vorzustellen.',
          ),
        ],
      },
      {
        kind: 'list',
        id: 'when-not',
        title: TITLES.whenNot,
        items: [
          w(
            '<strong>Numa lista longa de itens:</strong> Table ou TaskList.',
            '<strong>In a long list of items:</strong> Table or TaskList.',
            '<strong>En una lista larga de elementos:</strong> Table o TaskList.',
            '<strong>Dans une longue liste d’éléments :</strong> Table ou TaskList.',
            '<strong>In einer langen Liste von Einträgen:</strong> Table oder TaskList.',
          ),
        ],
      },
      {
        kind: 'examples',
        id: 'examples',
        title: TITLES.examples,
        examples: [
          {
            id: 'doors',
            title: w('Portas', 'Doors', 'Puertas', 'Portes', 'Türen'),
            description: w(
              'O título é o nome da área; a frase diz o que tem lá.',
              'The title is the area’s name; the sentence says what is there.',
              'El título es el nombre del área; la frase dice qué hay allí.',
              'Le titre est le nom de la zone ; la phrase dit ce qu’on y trouve.',
              'Der Titel ist der Name des Bereichs; der Satz sagt, was es dort gibt.',
            ),
            render: async (lang, sprite) =>
              `<div class="feitio-grid" data-gap="4" style="inline-size: 100%">${await renderHtml(LinkCard, { href: '#doors', title: { pt: 'Design', en: 'Design', es: 'Diseño', fr: 'Design', de: 'Design' }[lang], sprite }, { pt: 'O conceito, os fundamentos e os padrões.', en: 'The concept, the foundations and the patterns.', es: 'El concepto, los fundamentos y los patrones.', fr: 'Le concept, les fondements et les modèles.', de: 'Das Konzept, die Grundlagen und die Muster.' }[lang])}${await renderHtml(LinkCard, { href: '#doors', title: { pt: 'Componentes', en: 'Components', es: 'Componentes', fr: 'Composants', de: 'Komponenten' }[lang], sprite }, { pt: 'Cada peça, com o código de cada exemplo.', en: 'Every piece, with the code of each example.', es: 'Cada pieza, con el código de cada ejemplo.', fr: 'Chaque pièce, avec le code de chaque exemple.', de: 'Jedes Teil, mit dem Code jedes Beispiels.' }[lang])}</div>`,
          },
        ],
      },
      {
        kind: 'attrs',
        id: 'attributes',
        title: TITLES.attrs,
        attrs: [
          [
            'href',
            w('Para onde vai.', 'Where it goes.', 'Adónde va.', 'Où il mène.', 'Wohin er führt.'),
          ],
          [
            'title',
            w(
              'O nome da área.',
              'The area’s name.',
              'El nombre del área.',
              'Le nom de la zone.',
              'Der Name des Bereichs.',
            ),
          ],
        ],
      },
    ],
  },
  {
    name: 'Heading',
    slug: 'heading',
    group: 'text',
    lede: w(
      'O título de uma página ou de uma seção. O nível é o esquema da página, não o tamanho.',
      'The heading of a page or a section. The level is the page outline, not the size.',
      'El título de una página o sección. El nivel es el esquema de la página, no el tamaño.',
      'Le titre d’une page ou d’une section. Le niveau est le plan de la page, pas la taille.',
      'Die Überschrift einer Seite oder eines Abschnitts. Die Ebene ist die Gliederung, nicht die Größe.',
    ),
    sections: [
      {
        kind: 'list',
        id: 'rules',
        title: TITLES.rules,
        items: [
          w(
            'Um <code>h1</code> por página; depois <code>h2</code>, <code>h3</code>, sem pular nível.',
            'One <code>h1</code> per page; then <code>h2</code>, <code>h3</code>, never skipping a level.',
            'Un <code>h1</code> por página; luego <code>h2</code>, <code>h3</code>, sin saltar niveles.',
            'Un <code>h1</code> par page ; puis <code>h2</code>, <code>h3</code>, sans sauter de niveau.',
            'Ein <code>h1</code> pro Seite; dann <code>h2</code>, <code>h3</code>, ohne Ebenen zu überspringen.',
          ),
          w(
            'Sem caixa alta, sem uma palavra noutra cor.',
            'No all caps, no one word in another color.',
            'Sin mayúsculas sostenidas, sin una palabra de otro color.',
            'Pas de majuscules partout, pas de mot d’une autre couleur.',
            'Keine Großbuchstaben, kein Wort in anderer Farbe.',
          ),
        ],
      },
      {
        kind: 'examples',
        id: 'examples',
        title: TITLES.examples,
        examples: [
          {
            id: 'levels',
            title: w('Os níveis', 'The levels', 'Los niveles', 'Les niveaux', 'Die Ebenen'),
            description: w(
              'Do maior ao menor, na Alegreya Sans.',
              'From the largest to the smallest, in Alegreya Sans.',
              'Del mayor al menor, en Alegreya Sans.',
              'Du plus grand au plus petit, en Alegreya Sans.',
              'Von der größten zur kleinsten, in Alegreya Sans.',
            ),
            render: async (lang) =>
              `<div class="feitio-stack" data-gap="3">${await renderHtml(Heading, { level: 2 }, { pt: 'Agendamentos', en: 'Schedules', es: 'Citas', fr: 'Rendez-vous', de: 'Termine' }[lang])}${await renderHtml(Heading, { level: 3 }, { pt: 'Esta semana', en: 'This week', es: 'Esta semana', fr: 'Cette semaine', de: 'Diese Woche' }[lang])}${await renderHtml(Heading, { level: 4 }, { pt: 'Terça', en: 'Tuesday', es: 'Martes', fr: 'Mardi', de: 'Dienstag' }[lang])}</div>`,
          },
        ],
      },
      {
        kind: 'attrs',
        id: 'attributes',
        title: TITLES.attrs,
        attrs: [
          [
            'level',
            w(
              '1 a 4; o padrão é 2.',
              '1 to 4; 2 by default.',
              '1 a 4; 2 por defecto.',
              '1 à 4 ; 2 par défaut.',
              '1 bis 4; standardmäßig 2.',
            ),
          ],
          [
            'id',
            w(
              'Para o índice da página e os links para a seção.',
              'For the page index and links to the section.',
              'Para el índice de la página y los enlaces a la sección.',
              'Pour l’index de la page et les liens vers la section.',
              'Für das Seitenverzeichnis und Links zum Abschnitt.',
            ),
          ],
        ],
      },
    ],
  },
  {
    name: 'Text',
    slug: 'text',
    group: 'text',
    lede: w(
      'O texto para ler, na medida: uma linha que o olho acompanha sem cansar.',
      'Text for reading, at its measure: a line the eye follows without tiring.',
      'El texto para leer, a su medida: una línea que el ojo sigue sin cansarse.',
      'Le texte à lire, à sa mesure : une ligne que l’œil suit sans se fatiguer.',
      'Text zum Lesen, im richtigen Maß: eine Zeile, der das Auge ohne Ermüdung folgt.',
    ),
    sections: [
      {
        kind: 'list',
        id: 'when',
        title: TITLES.when,
        items: [
          w(
            'Para parágrafos: explicações, descrições, artigos.',
            'For paragraphs: explanations, descriptions, articles.',
            'Para párrafos: explicaciones, descripciones, artículos.',
            'Pour les paragraphes : explications, descriptions, articles.',
            'Für Absätze: Erklärungen, Beschreibungen, Artikel.',
          ),
        ],
      },
      {
        kind: 'examples',
        id: 'examples',
        title: TITLES.examples,
        examples: [
          {
            id: 'paragraph',
            title: w('Um parágrafo', 'A paragraph', 'Un párrafo', 'Un paragraphe', 'Ein Absatz'),
            description: w(
              'Na Alegreya, com a entrelinha de leitura e no máximo a medida.',
              'In Alegreya, with the reading line height and at most the measure.',
              'En Alegreya, con el interlineado de lectura y como mucho la medida.',
              'En Alegreya, avec l’interlignage de lecture et au plus la mesure.',
              'In Alegreya, mit dem Lese-Zeilenabstand und höchstens dem Maß.',
            ),
            render: async (lang) =>
              renderHtml(
                Text,
                {},
                {
                  pt: 'O backup roda todo domingo às 3h. Se algo falhar, o aviso chega no Discord com o motivo e o que fazer.',
                  en: 'The backup runs every Sunday at 3. If something fails, the notice reaches Discord with the reason and what to do.',
                  es: 'La copia de seguridad se ejecuta cada domingo a las 3. Si algo falla, el aviso llega a Discord con el motivo y qué hacer.',
                  fr: 'La sauvegarde tourne chaque dimanche à 3 h. Si quelque chose échoue, l’avis arrive sur Discord avec la raison et quoi faire.',
                  de: 'Die Sicherung läuft jeden Sonntag um 3 Uhr. Wenn etwas fehlschlägt, kommt der Hinweis mit Grund und nächstem Schritt in Discord an.',
                }[lang],
              ),
          },
        ],
      },
    ],
  },
  {
    name: 'Icon',
    slug: 'icon',
    group: 'text',
    lede: w(
      'Um desenho do sprite, ao lado da palavra. Feito à mão: toda junção é um cruzamento de traços.',
      'A drawing from the sprite, next to the word. Hand-drawn: every joint is two strokes crossing.',
      'Un dibujo del sprite, junto a la palabra. Hecho a mano: cada unión es un cruce de trazos.',
      'Un dessin du sprite, à côté du mot. Fait main : chaque jonction est un croisement de traits.',
      'Eine Zeichnung aus dem Sprite, neben dem Wort. Von Hand: Jede Verbindung ist eine Kreuzung zweier Striche.',
    ),
    sections: [
      {
        kind: 'list',
        id: 'rules',
        title: TITLES.rules,
        items: [
          w(
            'É decoração (<code>aria-hidden</code>): a palavra ao lado, ou o <code>aria-label</code> de um botão só com ícone, dá o nome.',
            'It is decoration (<code>aria-hidden</code>): the word next to it, or the <code>aria-label</code> of an icon-only button, names it.',
            'Es decoración (<code>aria-hidden</code>): la palabra al lado, o el <code>aria-label</code> de un botón solo con icono, le da nombre.',
            'C’est de la décoration (<code>aria-hidden</code>) : le mot à côté, ou l’<code>aria-label</code> d’un bouton à icône seule, le nomme.',
            'Es ist Dekoration (<code>aria-hidden</code>): Das Wort daneben oder das <code>aria-label</code> eines reinen Symbol-Buttons benennt es.',
          ),
          w(
            'Na cor do texto ao lado; nunca como enfeite solto.',
            'In the color of the text next to it; never as loose decoration.',
            'En el color del texto al lado; nunca como adorno suelto.',
            'Dans la couleur du texte à côté ; jamais comme ornement isolé.',
            'In der Farbe des Textes daneben; nie als loses Ornament.',
          ),
        ],
      },
      {
        kind: 'examples',
        id: 'examples',
        title: TITLES.examples,
        examples: [
          {
            id: 'with-words',
            title: w(
              'Com a palavra',
              'With the word',
              'Con la palabra',
              'Avec le mot',
              'Mit dem Wort',
            ),
            description: w(
              'O ícone acompanha; o catálogo inteiro está em Recursos.',
              'The icon goes along; the whole catalog is in Resources.',
              'El icono acompaña; el catálogo completo está en Recursos.',
              'L’icône accompagne ; tout le catalogue est dans Ressources.',
              'Das Symbol begleitet; der ganze Katalog ist unter Ressourcen.',
            ),
            render: async (lang, sprite) =>
              `<span class="feitio-inline" data-gap="4"><span class="feitio-inline" data-gap="1">${await renderHtml(Icon, { name: 'calendar', sprite })}${{ pt: 'Agenda', en: 'Calendar', es: 'Agenda', fr: 'Agenda', de: 'Kalender' }[lang]}</span><span class="feitio-inline" data-gap="1">${await renderHtml(Icon, { name: 'search', sprite })}${{ pt: 'Buscar', en: 'Search', es: 'Buscar', fr: 'Rechercher', de: 'Suchen' }[lang]}</span><span class="feitio-inline" data-gap="1">${await renderHtml(Icon, { name: 'task', sprite })}${{ pt: 'Tarefas', en: 'Tasks', es: 'Tareas', fr: 'Tâches', de: 'Aufgaben' }[lang]}</span></span>`,
          },
        ],
      },
      {
        kind: 'attrs',
        id: 'attributes',
        title: TITLES.attrs,
        attrs: [
          [
            'name',
            w(
              'O nome no sprite, como "check".',
              'The name in the sprite, like "check".',
              'El nombre en el sprite, como "check".',
              'Le nom dans le sprite, comme "check".',
              'Der Name im Sprite, wie "check".',
            ),
          ],
          [
            'sprite',
            w(
              'Onde o sprite é servido.',
              'Where the sprite is served.',
              'Dónde se sirve el sprite.',
              'Où le sprite est servi.',
              'Wo das Sprite ausgeliefert wird.',
            ),
          ],
        ],
      },
    ],
  },
  {
    name: 'Block',
    slug: 'block',
    group: 'text',
    lede: w(
      'Um bloco de conteúdo sobre a página, num papel um tom acima.',
      'A block of content on the page, on a paper one tone up.',
      'Un bloque de contenido sobre la página, en un papel un tono más arriba.',
      'Un bloc de contenu sur la page, sur un papier d’un ton au-dessus.',
      'Ein Inhaltsblock auf der Seite, auf Papier einen Ton heller.',
    ),
    sections: [
      {
        kind: 'list',
        id: 'when',
        title: TITLES.when,
        items: [
          w(
            'Para agrupar o que vai junto: um resumo, uma seção de ajustes.',
            'To group what goes together: a summary, a settings section.',
            'Para agrupar lo que va junto: un resumen, una sección de ajustes.',
            'Pour regrouper ce qui va ensemble : un résumé, une section de réglages.',
            'Um zu gruppieren, was zusammengehört: eine Zusammenfassung, ein Einstellungsbereich.',
          ),
        ],
      },
      {
        kind: 'examples',
        id: 'examples',
        title: TITLES.examples,
        examples: [
          {
            id: 'block',
            title: w('Um bloco', 'A block', 'Un bloque', 'Un bloc', 'Ein Block'),
            description: w(
              'Sem traço e sem sombra: o tom do papel já separa.',
              'No line and no shadow: the paper’s tone already separates.',
              'Sin trazo y sin sombra: el tono del papel ya separa.',
              'Sans trait et sans ombre : le ton du papier sépare déjà.',
              'Ohne Linie und ohne Schatten: Der Ton des Papiers trennt schon.',
            ),
            render: async (lang) =>
              `<div style="inline-size: 100%">${await renderHtml(Block, {}, `<strong>${{ pt: 'Backup semanal', en: 'Weekly backup', es: 'Copia semanal', fr: 'Sauvegarde hebdomadaire', de: 'Wöchentliche Sicherung' }[lang]}</strong>`)}</div>`,
          },
        ],
      },
      {
        kind: 'attrs',
        id: 'attributes',
        title: TITLES.attrs,
        attrs: [
          [
            'as',
            w(
              '"div" (padrão), "section" ou "article".',
              '"div" (default), "section" or "article".',
              '"div" (por defecto), "section" o "article".',
              '"div" (par défaut), "section" ou "article".',
              '"div" (Standard), "section" oder "article".',
            ),
          ],
        ],
      },
    ],
  },
  {
    name: 'VisuallyHidden',
    slug: 'visually-hidden',
    group: 'text',
    lede: w(
      'Texto só para o leitor de tela: some da vista, fica para quem ouve.',
      'Text for screen readers only: gone from sight, there for those who listen.',
      'Texto solo para el lector de pantalla: desaparece de la vista, queda para quien escucha.',
      'Texte pour les lecteurs d’écran seulement : invisible, présent pour qui écoute.',
      'Text nur für Screenreader: unsichtbar, aber da für alle, die zuhören.',
    ),
    sections: [
      {
        kind: 'list',
        id: 'when',
        title: TITLES.when,
        items: [
          w(
            'Para o rótulo de um campo que já se entende pelo contexto visual, ou o "(abre em nova aba)".',
            'For the label of a field that is clear from the visual context, or the "(opens in a new tab)".',
            'Para la etiqueta de un campo que se entiende por el contexto visual, o el "(se abre en otra pestaña)".',
            'Pour l’étiquette d’un champ clair par le contexte visuel, ou le « (s’ouvre dans un nouvel onglet) ».',
            'Für die Beschriftung eines Felds, das aus dem Kontext klar ist, oder das „(öffnet in neuem Tab)“.',
          ),
        ],
      },
      {
        kind: 'list',
        id: 'when-not',
        title: TITLES.whenNot,
        items: [
          w(
            '<strong>Para esconder de todo mundo:</strong> o atributo <code>hidden</code>.',
            '<strong>To hide from everyone:</strong> the <code>hidden</code> attribute.',
            '<strong>Para ocultar a todos:</strong> el atributo <code>hidden</code>.',
            '<strong>Pour cacher à tout le monde :</strong> l’attribut <code>hidden</code>.',
            '<strong>Um vor allen zu verbergen:</strong> das Attribut <code>hidden</code>.',
          ),
        ],
      },
      {
        kind: 'examples',
        id: 'examples',
        title: TITLES.examples,
        examples: [
          {
            id: 'label',
            title: w(
              'Um rótulo escondido',
              'A hidden label',
              'Una etiqueta oculta',
              'Une étiquette cachée',
              'Eine versteckte Beschriftung',
            ),
            description: w(
              'O leitor de tela anuncia "Filtrar"; quem vê, entende pelo campo.',
              'Screen readers announce "Filter"; sighted people get it from the field.',
              'El lector de pantalla anuncia "Filtrar"; quien ve, lo entiende por el campo.',
              'Le lecteur d’écran annonce « Filtrer » ; qui voit le comprend par le champ.',
              'Der Screenreader sagt „Filtern“; Sehende verstehen es am Feld.',
            ),
            render: async (lang) =>
              `<label>${await renderHtml(VisuallyHidden, {}, { pt: 'Filtrar', en: 'Filter', es: 'Filtrar', fr: 'Filtrer', de: 'Filtern' }[lang])}<input class="feitio-input" type="search" placeholder="…"></label>`,
          },
        ],
      },
    ],
  },
  {
    name: 'SkipLink',
    slug: 'skiplink',
    group: 'text',
    lede: w(
      'Pula direto para o conteúdo, pelo teclado. É o primeiro Tab da página.',
      'Jumps straight to the content, by keyboard. It is the page’s first Tab.',
      'Salta directo al contenido, con el teclado. Es el primer Tab de la página.',
      'Saute directement au contenu, au clavier. C’est le premier Tab de la page.',
      'Springt per Tastatur direkt zum Inhalt. Es ist der erste Tab der Seite.',
    ),
    sections: [
      {
        kind: 'list',
        id: 'rules',
        title: TITLES.rules,
        items: [
          w(
            'Em toda página com cabeçalho ou navegação antes do conteúdo.',
            'On every page with a header or navigation before the content.',
            'En toda página con cabecera o navegación antes del contenido.',
            'Sur toute page avec un en-tête ou une navigation avant le contenu.',
            'Auf jeder Seite mit Kopfzeile oder Navigation vor dem Inhalt.',
          ),
          w(
            'Só aparece com o foco; o alvo é o <code>main</code>, com <code>tabindex="-1"</code>.',
            'It only shows with the focus; the target is the <code>main</code>, with <code>tabindex="-1"</code>.',
            'Solo aparece con el foco; el destino es el <code>main</code>, con <code>tabindex="-1"</code>.',
            'Il n’apparaît qu’avec le focus ; la cible est le <code>main</code>, avec <code>tabindex="-1"</code>.',
            'Er erscheint nur mit dem Fokus; das Ziel ist das <code>main</code> mit <code>tabindex="-1"</code>.',
          ),
        ],
      },
      {
        kind: 'examples',
        id: 'examples',
        title: TITLES.examples,
        examples: [
          {
            id: 'focus',
            title: w(
              'Com o foco',
              'With the focus',
              'Con el foco',
              'Avec le focus',
              'Mit dem Fokus',
            ),
            description: w(
              'Aqui ele aparece sempre, para ver; na página, só com o Tab. Este site tem um: aperte Tab no topo.',
              'Here it always shows, to see it; on the page, only with Tab. This site has one: press Tab at the top.',
              'Aquí aparece siempre, para verlo; en la página, solo con Tab. Este sitio tiene uno: pulsa Tab arriba.',
              'Ici il apparaît toujours, pour le voir ; sur la page, seulement avec Tab. Ce site en a un : appuyez sur Tab en haut.',
              'Hier ist er immer sichtbar; auf der Seite nur mit Tab. Diese Website hat einen: Drück oben Tab.',
            ),
            render: async (lang) =>
              (
                await renderHtml(
                  SkipLink,
                  { href: '#conteudo' },
                  {
                    pt: 'Pular para o conteúdo',
                    en: 'Skip to content',
                    es: 'Saltar al contenido',
                    fr: 'Aller au contenu',
                    de: 'Zum Inhalt springen',
                  }[lang],
                )
              ).replace(
                'class="feitio-skip-link"',
                'class="feitio-skip-link" style="position: static; translate: none"',
              ),
          },
        ],
      },
      {
        kind: 'attrs',
        id: 'attributes',
        title: TITLES.attrs,
        attrs: [
          [
            'href',
            w(
              'O id do conteúdo; o padrão é "#content".',
              'The content’s id; "#content" by default.',
              'El id del contenido; "#content" por defecto.',
              'L’id du contenu ; "#content" par défaut.',
              'Die id des Inhalts; standardmäßig "#content".',
            ),
          ],
        ],
      },
    ],
  },
  {
    name: 'Divider',
    slug: 'divider',
    group: 'text',
    lede: w(
      'A linha fina que separa duas partes que se tocam, quando o espaço sozinho não basta.',
      'The hairline between two parts that touch, when space alone is not enough.',
      'La línea fina que separa dos partes que se tocan, cuando el espacio solo no basta.',
      'Le filet entre deux parties qui se touchent, quand l’espace seul ne suffit pas.',
      'Die Haarlinie zwischen zwei Teilen, die sich berühren, wenn Abstand allein nicht reicht.',
    ),
    sections: [
      {
        kind: 'list',
        id: 'when-not',
        title: TITLES.whenNot,
        items: [
          w(
            '<strong>Entre seções de texto:</strong> o espaço já separa.',
            '<strong>Between text sections:</strong> space already separates.',
            '<strong>Entre secciones de texto:</strong> el espacio ya separa.',
            '<strong>Entre des sections de texte :</strong> l’espace sépare déjà.',
            '<strong>Zwischen Textabschnitten:</strong> Der Abstand trennt schon.',
          ),
          w(
            '<strong>Para marcar um espaço vazio:</strong> isso é o tracejado.',
            '<strong>To mark an empty space:</strong> that is the dashed line.',
            '<strong>Para marcar un espacio vacío:</strong> eso es la línea discontinua.',
            '<strong>Pour marquer un espace vide :</strong> c’est le pointillé.',
            '<strong>Um einen leeren Raum zu markieren:</strong> Das ist die gestrichelte Linie.',
          ),
        ],
      },
      {
        kind: 'examples',
        id: 'examples',
        title: TITLES.examples,
        examples: [
          {
            id: 'tones',
            title: w(
              'Fina e de tinta',
              'Hairline and ink',
              'Fina y de tinta',
              'Fine et d’encre',
              'Fein und Tinte',
            ),
            description: w(
              'A fina para quase tudo; a de tinta para um limite forte.',
              'The hairline for almost everything; the ink one for a strong boundary.',
              'La fina para casi todo; la de tinta para un límite fuerte.',
              'La fine pour presque tout ; celle d’encre pour une limite forte.',
              'Die feine für fast alles; die Tintenlinie für eine starke Grenze.',
            ),
            render: async () =>
              `<div class="feitio-stack" data-gap="4" style="inline-size: 100%">${await renderHtml(Divider)}${await renderHtml(Divider, { tone: 'ink' })}</div>`,
          },
        ],
      },
      {
        kind: 'attrs',
        id: 'attributes',
        title: TITLES.attrs,
        attrs: [
          [
            'tone',
            w(
              '"ink" para a linha de tinta.',
              '"ink" for the ink line.',
              '"ink" para la línea de tinta.',
              '"ink" pour la ligne d’encre.',
              '"ink" für die Tintenlinie.',
            ),
          ],
        ],
      },
    ],
  },
  {
    name: 'Kbd',
    slug: 'kbd',
    group: 'text',
    lede: w(
      'Uma tecla, escrita como no teclado, para dizer qual apertar.',
      'A key, written as on the keyboard, to say which one to press.',
      'Una tecla, escrita como en el teclado, para decir cuál pulsar.',
      'Une touche, écrite comme sur le clavier, pour dire laquelle presser.',
      'Eine Taste, wie auf der Tastatur geschrieben, um zu sagen, welche man drückt.',
    ),
    sections: [
      {
        kind: 'list',
        id: 'rules',
        title: TITLES.rules,
        items: [
          w(
            'Uma tecla por Kbd; combinações com "+" entre elas.',
            'One key per Kbd; combinations with "+" between them.',
            'Una tecla por Kbd; combinaciones con "+" entre ellas.',
            'Une touche par Kbd ; les combinaisons avec « + » entre elles.',
            'Eine Taste pro Kbd; Kombinationen mit „+“ dazwischen.',
          ),
          w(
            'O atalho é um extra: o botão continua lá.',
            'The shortcut is an extra: the button stays.',
            'El atajo es un extra: el botón sigue ahí.',
            'Le raccourci est un plus : le bouton reste.',
            'Die Abkürzung ist ein Extra: Der Button bleibt.',
          ),
        ],
      },
      {
        kind: 'examples',
        id: 'examples',
        title: TITLES.examples,
        examples: [
          {
            id: 'keys',
            title: w('Teclas', 'Keys', 'Teclas', 'Touches', 'Tasten'),
            description: w(
              'Uma tecla, e uma combinação.',
              'One key, and one combination.',
              'Una tecla, y una combinación.',
              'Une touche, et une combinaison.',
              'Eine Taste und eine Kombination.',
            ),
            render: async () =>
              `<span class="feitio-inline" data-gap="4">${await renderHtml(Kbd, {}, 'Esc')}<span>${await renderHtml(Kbd, {}, 'Ctrl')} + ${await renderHtml(Kbd, {}, 'K')}</span></span>`,
          },
        ],
      },
    ],
  },
];
