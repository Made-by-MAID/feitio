import type { Locale } from '../i18n/ui.ts';

type NoticePage = {
  lede: string;
  examples: string;
  four: [string, string];
  samples: {
    info: [string, string];
    ok: [string, string];
    warn: [string, string];
    error: [string, string];
  };
  close: [string, string];
  time: [string, string];
  again: string;
  rules: [string, string[]];
  attrs: [string, [string, string][]];
  area: string;
};

export const NOTICE: Record<Locale, NoticePage> = {
  pt: {
    lede: 'Um aviso dentro da página: o que a pessoa precisa saber agora, com o estado dito por cor, ícone e palavra.',
    examples: 'Exemplos',
    four: [
      'Os quatro',
      'Informação, certo, atenção e erro, sempre com o traço em volta. Nenhum é laranja.',
    ],
    samples: {
      info: ['Nova versão do Feitio', 'A documentação ganhou os guias de formulário.'],
      ok: ['Agendamento criado', 'O primeiro aviso sai amanhã às 9h.'],
      warn: ['Backup atrasado', 'Roda de novo hoje às 3h.'],
      error: [
        'Não deu para salvar',
        'A conexão caiu. O que você escreveu continua aqui; tente de novo.',
      ],
    },
    close: ['Com o fechar', 'O X no canto: o aviso fica até a pessoa fechar.'],
    time: [
      'Com tempo',
      'Some sozinho, e o fio em volta do X se desfaz enquanto o tempo passa. Com o mouse em cima, o tempo para.',
    ],
    again: 'Mostrar de novo',
    rules: [
      'Fechar e tempo',
      [
        'O tempo vem desligado; ligado, vem sempre com o fechar.',
        'Só certo e informação somem sozinhos; atenção e erro ficam.',
        'Já na tela, mostrar de novo só recomeça o tempo, sem cair de novo como papel.',
      ],
    ],
    attrs: [
      'Atributos',
      [
        ['status', '"ok", "warn" ou "error"; sem ele, informação.'],
        ['title', 'O que aconteceu, curto.'],
        ['close', 'Põe o X no canto.'],
        ['timeout', 'Milissegundos até sumir; só certo e informação.'],
        ['role', '"status" depois de uma ação, "alert" num erro.'],
      ],
    ],
    area: 'Componentes',
  },
  en: {
    lede: 'A notice within the page: what the person needs to know now, with the status told by color, icon and word.',
    examples: 'Examples',
    four: [
      'The four',
      'Information, success, warning and error, always with the line around them. None is orange.',
    ],
    samples: {
      info: ['New Feitio version', 'The docs gained the form guides.'],
      ok: ['Schedule created', 'The first one goes out tomorrow at 9.'],
      warn: ['Backup late', 'Runs again today at 3.'],
      error: ['Could not save', 'The connection dropped. What you wrote is still here; try again.'],
    },
    close: ['With close', 'The X in the corner: the notice stays until the person closes it.'],
    time: [
      'With time',
      'It goes away on its own, and the thread around the X comes undone as time passes. With the mouse over it, the time stops.',
    ],
    again: 'Show again',
    rules: [
      'Close and time',
      [
        'Time is off by default; when on, the close button always comes with it.',
        'Only success and information go away on their own; warnings and errors stay.',
        'Already on screen, showing it again only restarts the time, without landing as paper again.',
      ],
    ],
    attrs: [
      'Attributes',
      [
        ['status', '"ok", "warn" or "error"; without it, information.'],
        ['title', 'What happened, short.'],
        ['close', 'Adds the X in the corner.'],
        ['timeout', 'Milliseconds until it goes; only success and information.'],
        ['role', '"status" after an action, "alert" for an error.'],
      ],
    ],
    area: 'Components',
  },
  es: {
    lede: 'Un aviso dentro de la página: lo que la persona necesita saber ahora, con el estado dicho por color, icono y palabra.',
    examples: 'Ejemplos',
    four: [
      'Los cuatro',
      'Información, correcto, atención y error, siempre con el trazo alrededor. Ninguno es naranja.',
    ],
    samples: {
      info: ['Nueva versión de Feitio', 'La documentación ganó las guías de formularios.'],
      ok: ['Cita creada', 'El primer aviso sale mañana a las 9.'],
      warn: ['Copia de seguridad atrasada', 'Se ejecuta de nuevo hoy a las 3.'],
      error: [
        'No se pudo guardar',
        'Se cayó la conexión. Lo que escribiste sigue aquí; inténtalo de nuevo.',
      ],
    },
    close: ['Con cierre', 'La X en la esquina: el aviso se queda hasta que la persona lo cierra.'],
    time: [
      'Con tiempo',
      'Desaparece solo, y el hilo alrededor de la X se deshace mientras pasa el tiempo. Con el ratón encima, el tiempo se detiene.',
    ],
    again: 'Mostrar de nuevo',
    rules: [
      'Cierre y tiempo',
      [
        'El tiempo viene apagado; encendido, siempre viene con el cierre.',
        'Solo correcto e información desaparecen solos; atención y error se quedan.',
        'Ya en pantalla, mostrarlo de nuevo solo reinicia el tiempo, sin caer otra vez como papel.',
      ],
    ],
    attrs: [
      'Atributos',
      [
        ['status', '"ok", "warn" o "error"; sin él, información.'],
        ['title', 'Lo que pasó, corto.'],
        ['close', 'Pone la X en la esquina.'],
        ['timeout', 'Milisegundos hasta desaparecer; solo correcto e información.'],
        ['role', '"status" tras una acción, "alert" en un error.'],
      ],
    ],
    area: 'Componentes',
  },
  fr: {
    lede: 'Un avis dans la page : ce que la personne doit savoir maintenant, avec l’état dit par la couleur, l’icône et le mot.',
    examples: 'Exemples',
    four: [
      'Les quatre',
      'Information, succès, attention et erreur, toujours avec le trait autour. Aucun n’est orange.',
    ],
    samples: {
      info: ['Nouvelle version de Feitio', 'La documentation a gagné les guides de formulaires.'],
      ok: ['Rendez-vous créé', 'Le premier rappel part demain à 9 h.'],
      warn: ['Sauvegarde en retard', 'Elle repart aujourd’hui à 3 h.'],
      error: [
        'Impossible d’enregistrer',
        'La connexion est tombée. Ce que vous avez écrit est toujours là ; réessayez.',
      ],
    },
    close: [
      'Avec fermeture',
      'Le X dans le coin : l’avis reste jusqu’à ce que la personne le ferme.',
    ],
    time: [
      'Avec durée',
      'Il disparaît tout seul, et le fil autour du X se défait à mesure que le temps passe. Avec la souris dessus, le temps s’arrête.',
    ],
    again: 'Afficher à nouveau',
    rules: [
      'Fermeture et durée',
      [
        'La durée est désactivée par défaut ; activée, elle vient toujours avec la fermeture.',
        'Seuls le succès et l’information disparaissent seuls ; l’attention et l’erreur restent.',
        'Déjà à l’écran, l’afficher à nouveau relance seulement la durée, sans retomber comme du papier.',
      ],
    ],
    attrs: [
      'Attributs',
      [
        ['status', '"ok", "warn" ou "error" ; sans lui, information.'],
        ['title', 'Ce qui s’est passé, en bref.'],
        ['close', 'Ajoute le X dans le coin.'],
        ['timeout', 'Millisecondes avant de disparaître ; seulement succès et information.'],
        ['role', '"status" après une action, "alert" pour une erreur.'],
      ],
    ],
    area: 'Composants',
  },
  de: {
    lede: 'Ein Hinweis in der Seite: was die Person jetzt wissen muss, mit dem Zustand in Farbe, Symbol und Wort.',
    examples: 'Beispiele',
    four: [
      'Die vier',
      'Information, Erfolg, Achtung und Fehler, immer mit der Linie drumherum. Keiner ist orange.',
    ],
    samples: {
      info: ['Neue Feitio-Version', 'Die Doku hat die Formular-Leitfäden bekommen.'],
      ok: ['Termin erstellt', 'Die erste Erinnerung geht morgen um 9 Uhr raus.'],
      warn: ['Sicherung verspätet', 'Läuft heute um 3 Uhr erneut.'],
      error: [
        'Speichern fehlgeschlagen',
        'Die Verbindung ist abgebrochen. Was du geschrieben hast, ist noch da; versuch es noch einmal.',
      ],
    },
    close: ['Mit Schließen', 'Das X in der Ecke: Der Hinweis bleibt, bis die Person ihn schließt.'],
    time: [
      'Mit Zeit',
      'Er verschwindet von selbst, und der Faden um das X löst sich, während die Zeit vergeht. Mit der Maus darüber hält die Zeit an.',
    ],
    again: 'Erneut zeigen',
    rules: [
      'Schließen und Zeit',
      [
        'Die Zeit ist standardmäßig aus; eingeschaltet kommt immer das Schließen mit.',
        'Nur Erfolg und Information verschwinden von selbst; Achtung und Fehler bleiben.',
        'Schon auf dem Bildschirm startet erneutes Zeigen nur die Zeit neu, ohne erneut als Papier zu landen.',
      ],
    ],
    attrs: [
      'Attribute',
      [
        ['status', '"ok", "warn" oder "error"; ohne, Information.'],
        ['title', 'Was passiert ist, kurz.'],
        ['close', 'Fügt das X in der Ecke hinzu.'],
        ['timeout', 'Millisekunden bis zum Verschwinden; nur Erfolg und Information.'],
        ['role', '"status" nach einer Aktion, "alert" bei einem Fehler.'],
      ],
    ],
    area: 'Komponenten',
  },
};
