// Interface texts in every supported language. Kept free of app imports so tests can check that
// no language misses a text. Use {name} placeholders; fill them with `format`.

export const LANGS = ['en', 'de', 'es', 'nl', 'fr', 'tr'] as const;
export type Lang = (typeof LANGS)[number];

export const LANG_NAMES: Record<Lang, string> = {
  tr: 'Türkçe',
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  nl: 'Nederlands',
  fr: 'Français',
};

type Entry = Record<Lang, string>;

export const STRINGS = {
  // Home and worlds
  tagline: {
    tr: 'Tek kod, koca bir sürü.',
    en: 'One code, a whole flock.',
    de: 'Ein Code, eine ganze Herde.',
    es: 'Un código, todo un rebaño.',
    nl: 'Eén code, een hele kudde.',
    fr: 'Un seul code, tout un troupeau.',
  },
  worlds: { tr: 'Dünyalar', en: 'Worlds', de: 'Welten', es: 'Mundos', nl: 'Werelden', fr: 'Mondes' },
  worldN: { tr: 'Dünya {n}', en: 'World {n}', de: 'Welt {n}', es: 'Mundo {n}', nl: 'Wereld {n}', fr: 'Monde {n}' },
  upNext: { tr: 'Sırada', en: 'Up next', de: 'Als Nächstes', es: 'Próximo', nl: 'Hierna', fr: 'Ensuite' },
  comingSoon: { tr: 'Yakında', en: 'Coming soon', de: 'Bald', es: 'Muy pronto', nl: 'Binnenkort', fr: 'Bientôt' },
  comingSoonBody: {
    tr: 'Yeni dünyalar geliyor: çan sinyalleri, çoban köpekleri ve kurt gecesi.',
    en: 'New worlds are on the way: bell signals, sheepdogs and the wolf night.',
    de: 'Neue Welten kommen: Glockensignale, Hütehunde und die Wolfsnacht.',
    es: 'Llegan mundos nuevos: señales de campana, perros pastores y la noche del lobo.',
    nl: 'Er komen nieuwe werelden: klokkensignalen, herdershonden en de wolvennacht.',
    fr: 'De nouveaux mondes arrivent : signaux de cloche, chiens de berger et la nuit du loup.',
  },
  soundOn: { tr: 'Ses açık', en: 'Sound on', de: 'Ton an', es: 'Sonido sí', nl: 'Geluid aan', fr: 'Son activé' },
  soundOff: { tr: 'Ses kapalı', en: 'Sound off', de: 'Ton aus', es: 'Sonido no', nl: 'Geluid uit', fr: 'Son coupé' },
  soundEffects: { tr: 'Ses efektleri', en: 'Sound effects', de: 'Soundeffekte', es: 'Efectos de sonido', nl: 'Geluidseffecten', fr: 'Effets sonores' },
  language: { tr: 'Dil', en: 'Language', de: 'Sprache', es: 'Idioma', nl: 'Taal', fr: 'Langue' },
  deviceLanguage: { tr: 'Cihazın dili', en: 'Device language', de: 'Gerätesprache', es: 'Idioma del dispositivo', nl: 'Taal van het apparaat', fr: "Langue de l'appareil" },
  close: { tr: 'Kapat', en: 'Close', de: 'Schließen', es: 'Cerrar', nl: 'Sluiten', fr: 'Fermer' },
  levelN: { tr: 'Seviye {n}', en: 'Level {n}', de: 'Level {n}', es: 'Nivel {n}', nl: 'Level {n}', fr: 'Niveau {n}' },
  locked: { tr: 'Kilitli', en: 'Locked', de: 'Gesperrt', es: 'Bloqueado', nl: 'Op slot', fr: 'Verrouillé' },
  bossLevel: { tr: 'Dünya sonu', en: 'Final level', de: 'Endlevel', es: 'Nivel final', nl: 'Eindlevel', fr: 'Niveau final' },
  worldOpensAfter: {
    tr: 'Bu dünyanın seviyeleri, Dünya {n} bitince açılır.',
    en: 'The levels of this world open after you finish World {n}.',
    de: 'Die Level dieser Welt öffnen sich, wenn du Welt {n} geschafft hast.',
    es: 'Los niveles de este mundo se abren al terminar el Mundo {n}.',
    nl: 'De levels van deze wereld gaan open als je Wereld {n} hebt uitgespeeld.',
    fr: "Les niveaux de ce monde s'ouvrent quand tu as fini le Monde {n}.",
  },
  introWorld1: {
    tr: 'Bütün kuzular aynı kodu çalıştırır. Kuralları yaz, sürüyü ahıra getir.',
    en: 'Every sheep runs the same code. Write the rules and bring the flock home to the barn.',
    de: 'Alle Schafe führen denselben Code aus. Schreib die Regeln und bring die Herde in den Stall.',
    es: 'Todas las ovejas ejecutan el mismo código. Escribe las reglas y lleva el rebaño al establo.',
    nl: 'Alle schapen voeren dezelfde code uit. Schrijf de regels en breng de kudde naar de stal.',
    fr: 'Tous les moutons exécutent le même code. Écris les règles et ramène le troupeau à la bergerie.',
  },
  introWorld2: {
    tr: 'Çiçekler yol gösterir, "sap" hareketleri labirentte kestirme açar.',
    en: 'Flowers show the way, and side steps open shortcuts through the maze.',
    de: 'Blumen zeigen den Weg, und Seitenschritte öffnen Abkürzungen durch das Labyrinth.',
    es: 'Las flores marcan el camino y los pasos laterales abren atajos en el laberinto.',
    nl: 'Bloemen wijzen de weg en zijstappen openen kortere routes door het doolhof.',
    fr: 'Les fleurs montrent le chemin et les pas de côté ouvrent des raccourcis dans le labyrinthe.',
  },
  levelEyebrow: {
    tr: 'Dünya {w} · {name} · Seviye {n}',
    en: 'World {w} · {name} · Level {n}',
    de: 'Welt {w} · {name} · Level {n}',
    es: 'Mundo {w} · {name} · Nivel {n}',
    nl: 'Wereld {w} · {name} · Level {n}',
    fr: 'Monde {w} · {name} · Niveau {n}',
  },

  // Playing
  run: { tr: 'Çalıştır', en: 'Run', de: 'Start', es: 'Ejecutar', nl: 'Start', fr: 'Lancer' },
  stop: { tr: 'Durdur', en: 'Stop', de: 'Stopp', es: 'Parar', nl: 'Stop', fr: 'Arrêter' },
  backToStart: { tr: 'Başa al', en: 'Back to start', de: 'Zurück zum Start', es: 'Volver al inicio', nl: 'Terug naar start', fr: 'Revenir au début' },
  shuffle: { tr: 'Karıştır', en: 'Shuffle', de: 'Mischen', es: 'Mezclar', nl: 'Schudden', fr: 'Mélanger' },
  original: { tr: 'İlk sürü', en: 'First flock', de: 'Erste Herde', es: 'Primer rebaño', nl: 'Eerste kudde', fr: 'Premier troupeau' },
  speed: { tr: 'Hız', en: 'Speed', de: 'Tempo', es: 'Velocidad', nl: 'Snelheid', fr: 'Vitesse' },
  testAll: { tr: 'Her kareden dene', en: 'Test every square', de: 'Jedes Feld testen', es: 'Probar cada casilla', nl: 'Elk vakje testen', fr: 'Tester chaque case' },
  hideTest: { tr: 'Haritayı gizle', en: 'Hide the map', de: 'Karte ausblenden', es: 'Ocultar el mapa', nl: 'Kaart verbergen', fr: 'Masquer la carte' },
  testResult: {
    tr: '{total} karenin {ok} tanesinden her yöne bakan kuzu ahıra ulaşıyor.',
    en: 'From {ok} of {total} squares, sheep facing any way reach the barn.',
    de: 'Von {ok} der {total} Felder aus erreichen Schafe in jeder Blickrichtung den Stall.',
    es: 'Desde {ok} de {total} casillas, las ovejas llegan al establo miren hacia donde miren.',
    nl: 'Vanaf {ok} van de {total} vakjes komen schapen in elke kijkrichting bij de stal.',
    fr: 'Depuis {ok} cases sur {total}, les moutons atteignent la bergerie, quelle que soit leur direction.',
  },
  testAllOk: {
    tr: 'Kodun her kareden çalışıyor. Şans değil, gerçekten doğru!',
    en: 'Your code works from every square. Not luck: it is really right!',
    de: 'Dein Code funktioniert von jedem Feld aus. Kein Glück: er ist wirklich richtig!',
    es: 'Tu código funciona desde cada casilla. No es suerte: ¡es correcto de verdad!',
    nl: 'Je code werkt vanaf elk vakje. Geen geluk: hij klopt echt!',
    fr: "Ton code marche depuis chaque case. Ce n'est pas de la chance : il est vraiment juste !",
  },
  testLegend: {
    tr: 'Yeşil: her yönden çalışıyor. Sarı: bazı yönlerden. Kırmızı: hiç.',
    en: 'Green: works facing any way. Yellow: only some ways. Red: never.',
    de: 'Grün: klappt in jede Richtung. Gelb: nur in manche. Rot: nie.',
    es: 'Verde: funciona mirando a cualquier lado. Amarillo: solo a algunos. Rojo: nunca.',
    nl: 'Groen: werkt in elke richting. Geel: maar in sommige. Rood: nooit.',
    fr: 'Vert : marche dans toutes les directions. Jaune : seulement certaines. Rouge : jamais.',
  },
  inBarn: { tr: 'Ahırda {n}/{total}', en: 'In the barn {n}/{total}', de: 'Im Stall {n}/{total}', es: 'En el establo {n}/{total}', nl: 'In de stal {n}/{total}', fr: 'À la bergerie {n}/{total}' },
  stepN: { tr: 'Adım {n}', en: 'Step {n}', de: 'Schritt {n}', es: 'Paso {n}', nl: 'Stap {n}', fr: 'Étape {n}' },
  lostSheep: {
    tr: '{n} kuzu hep aynı yolda dönüp duruyor. Bu kod onlar için hiç bitmeyecek.',
    en: '{n} sheep keep going round the same path. For them this code never ends.',
    de: '{n} Schafe drehen immer dieselbe Runde. Für sie endet dieser Code nie.',
    es: '{n} ovejas dan vueltas por el mismo camino. Para ellas este código nunca termina.',
    nl: '{n} schapen blijven hetzelfde rondje lopen. Voor hen stopt deze code nooit.',
    fr: '{n} moutons tournent toujours sur le même chemin. Pour eux, ce code ne finit jamais.',
  },
  lostHelp: {
    tr: 'Soru işaretli kuzulara bak. Kuralları değiştirip tekrar dene.',
    en: 'Look at the sheep with a question mark. Change the rules and try again.',
    de: 'Sieh dir die Schafe mit dem Fragezeichen an. Ändere die Regeln und versuch es nochmal.',
    es: 'Mira las ovejas con signo de interrogación. Cambia las reglas y vuelve a probar.',
    nl: 'Kijk naar de schapen met een vraagteken. Verander de regels en probeer opnieuw.',
    fr: "Regarde les moutons avec un point d'interrogation. Change les règles et réessaie.",
  },

  // Code editor
  yourCode: { tr: 'Sürünün kodu', en: "The flock's code", de: 'Der Code der Herde', es: 'El código del rebaño', nl: 'De code van de kudde', fr: 'Le code du troupeau' },
  codeExplain: {
    tr: 'Her adımda her kuzu kuralları yukarıdan aşağı okur ve tutan ilk kuralı yapar. Hiçbiri tutmazsa son satır çalışır.',
    en: 'At every step each sheep reads the rules from the top and does the first one that fits. If none fits, the last line runs.',
    de: 'Bei jedem Schritt liest jedes Schaf die Regeln von oben und macht die erste, die passt. Passt keine, läuft die letzte Zeile.',
    es: 'En cada paso, cada oveja lee las reglas de arriba abajo y hace la primera que encaja. Si no encaja ninguna, se ejecuta la última línea.',
    nl: 'Bij elke stap leest elk schaap de regels van boven naar beneden en doet de eerste die past. Past er geen, dan loopt de laatste regel.',
    fr: "À chaque étape, chaque mouton lit les règles du haut vers le bas et fait la première qui convient. Si aucune ne convient, la dernière ligne s'exécute.",
  },
  ifWord: { tr: 'EĞER', en: 'IF', de: 'WENN', es: 'SI', nl: 'ALS', fr: 'SI' },
  elseWord: { tr: 'YOKSA', en: 'ELSE', de: 'SONST', es: 'SI NO', nl: 'ANDERS', fr: 'SINON' },
  alwaysWord: { tr: 'HER ZAMAN', en: 'ALWAYS', de: 'IMMER', es: 'SIEMPRE', nl: 'ALTIJD', fr: 'TOUJOURS' },
  addRule: { tr: '+ Kural ekle', en: '+ Add a rule', de: '+ Regel hinzufügen', es: '+ Añadir regla', nl: '+ Regel toevoegen', fr: '+ Ajouter une règle' },
  removeRule: { tr: 'Kuralı sil', en: 'Delete rule', de: 'Regel löschen', es: 'Borrar regla', nl: 'Regel wissen', fr: 'Supprimer la règle' },
  moveUp: { tr: 'Yukarı taşı', en: 'Move up', de: 'Nach oben', es: 'Subir', nl: 'Omhoog', fr: 'Monter' },
  lineCount: {
    tr: '{n} satır · en kısası {best}',
    en: '{n} lines · shortest {best}',
    de: '{n} Zeilen · kürzeste {best}',
    es: '{n} líneas · la más corta {best}',
    nl: '{n} regels · kortste {best}',
    fr: '{n} lignes · la plus courte {best}',
  },
  pickCondition: { tr: 'Kuzu neyi kontrol etsin?', en: 'What should the sheep check?', de: 'Was soll das Schaf prüfen?', es: '¿Qué debe comprobar la oveja?', nl: 'Wat moet het schaap controleren?', fr: 'Que doit vérifier le mouton ?' },
  pickAction: { tr: 'Kuzu ne yapsın?', en: 'What should the sheep do?', de: 'Was soll das Schaf tun?', es: '¿Qué debe hacer la oveja?', nl: 'Wat moet het schaap doen?', fr: 'Que doit faire le mouton ?' },
  newTool: { tr: 'Yeni', en: 'New', de: 'Neu', es: 'Nuevo', nl: 'Nieuw', fr: 'Nouveau' },

  condFenceAhead: { tr: 'Önüm çit', en: 'Fence ahead', de: 'Zaun vorne', es: 'Valla delante', nl: 'Hek voor me', fr: 'Clôture devant' },
  condFreeAhead: { tr: 'Önüm boş', en: 'Way ahead clear', de: 'Vorne frei', es: 'Delante libre', nl: 'Voor me vrij', fr: 'Devant libre' },
  condBarnAhead: { tr: 'Önümde ahır', en: 'Barn ahead', de: 'Stall vorne', es: 'Establo delante', nl: 'Stal voor me', fr: 'Bergerie devant' },
  condFenceRight: { tr: 'Sağım çit', en: 'Fence on my right', de: 'Zaun rechts', es: 'Valla a la derecha', nl: 'Hek rechts', fr: 'Clôture à droite' },
  condFreeRight: { tr: 'Sağım boş', en: 'Right side clear', de: 'Rechts frei', es: 'Derecha libre', nl: 'Rechts vrij', fr: 'Droite libre' },
  condFenceLeft: { tr: 'Solum çit', en: 'Fence on my left', de: 'Zaun links', es: 'Valla a la izquierda', nl: 'Hek links', fr: 'Clôture à gauche' },
  condFreeLeft: { tr: 'Solum boş', en: 'Left side clear', de: 'Links frei', es: 'Izquierda libre', nl: 'Links vrij', fr: 'Gauche libre' },
  condOnYellow: { tr: 'Sarı çiçekteyim', en: 'On a yellow flower', de: 'Auf gelber Blume', es: 'Sobre flor amarilla', nl: 'Op gele bloem', fr: 'Sur fleur jaune' },
  condOnBlue: { tr: 'Mavi çiçekteyim', en: 'On a blue flower', de: 'Auf blauer Blume', es: 'Sobre flor azul', nl: 'Op blauwe bloem', fr: 'Sur fleur bleue' },
  actForward: { tr: 'İlerle', en: 'Go forward', de: 'Vorwärts', es: 'Avanzar', nl: 'Vooruit', fr: 'Avancer' },
  actRight: { tr: 'Sağa dön', en: 'Turn right', de: 'Rechts drehen', es: 'Girar a la derecha', nl: 'Rechtsom', fr: 'Tourner à droite' },
  actLeft: { tr: 'Sola dön', en: 'Turn left', de: 'Links drehen', es: 'Girar a la izquierda', nl: 'Linksom', fr: 'Tourner à gauche' },
  actBack: { tr: 'Geri dön', en: 'Turn around', de: 'Umdrehen', es: 'Darse la vuelta', nl: 'Omdraaien', fr: 'Faire demi-tour' },
  actStepRight: { tr: 'Sağa sap', en: 'Step right', de: 'Rechts abbiegen', es: 'Paso a la derecha', nl: 'Stap naar rechts', fr: 'Pas à droite' },
  actStepLeft: { tr: 'Sola sap', en: 'Step left', de: 'Links abbiegen', es: 'Paso a la izquierda', nl: 'Stap naar links', fr: 'Pas à gauche' },
  actStepNote: {
    tr: 'Sap: dön ve aynı adımda bir kare ilerle.',
    en: 'Step: turn and move one square in the same step.',
    de: 'Abbiegen: drehen und im selben Schritt ein Feld gehen.',
    es: 'Paso: gira y avanza una casilla en el mismo paso.',
    nl: 'Stap: draai en ga in dezelfde stap één vakje verder.',
    fr: "Pas : tourne et avance d'une case dans la même étape.",
  },

  // Hints
  hintGet: { tr: 'İpucu', en: 'Hint', de: 'Tipp', es: 'Pista', nl: 'Hint', fr: 'Indice' },
  hintMore: { tr: 'Bir satır daha', en: 'One more line', de: 'Noch eine Zeile', es: 'Una línea más', nl: 'Nog een regel', fr: 'Une ligne de plus' },
  hintWait: { tr: 'İpucu {n} sn', en: 'Hint in {n}s', de: 'Tipp in {n} s', es: 'Pista en {n} s', nl: 'Hint over {n} s', fr: 'Indice dans {n} s' },
  hintAllShown: { tr: 'Çözüm gösterildi', en: 'Solution shown', de: 'Lösung gezeigt', es: 'Solución mostrada', nl: 'Oplossing getoond', fr: 'Solution affichée' },
  hintStarts: { tr: 'Çözüm böyle başlıyor:', en: 'The solution starts like this:', de: 'So beginnt die Lösung:', es: 'La solución empieza así:', nl: 'Zo begint de oplossing:', fr: 'La solution commence ainsi :' },
  hintSolution: { tr: 'Tam çözüm:', en: 'The whole solution:', de: 'Die ganze Lösung:', es: 'La solución completa:', nl: 'De hele oplossing:', fr: 'La solution complète :' },

  // Winning
  win3: { tr: 'Usta çoban!', en: 'Master shepherd!', de: 'Meisterhirte!', es: '¡Pastor experto!', nl: 'Meesterherder!', fr: 'Berger expert !' },
  win2: { tr: 'Her kareden çalışıyor!', en: 'Works from every square!', de: 'Klappt von jedem Feld!', es: '¡Funciona desde cada casilla!', nl: 'Werkt vanaf elk vakje!', fr: 'Marche depuis chaque case !' },
  win1: { tr: 'Sürü ahırda!', en: 'The flock is home!', de: 'Die Herde ist im Stall!', es: '¡El rebaño está en el establo!', nl: 'De kudde is binnen!', fr: 'Le troupeau est rentré !' },
  winWorld: { tr: 'Dünya {n} bitti!', en: 'World {n} complete!', de: 'Welt {n} geschafft!', es: '¡Mundo {n} completado!', nl: 'Wereld {n} uitgespeeld!', fr: 'Monde {n} terminé !' },
  star1: { tr: 'Sürü ahıra girdi', en: 'The flock reached the barn', de: 'Die Herde ist im Stall', es: 'El rebaño llegó al establo', nl: 'De kudde is in de stal', fr: 'Le troupeau est à la bergerie' },
  star2: { tr: 'Her kareden çalışıyor', en: 'Works from every square', de: 'Klappt von jedem Feld', es: 'Funciona desde cada casilla', nl: 'Werkt vanaf elk vakje', fr: 'Marche depuis chaque case' },
  star3: { tr: 'En çok {n} satır', en: 'At most {n} lines', de: 'Höchstens {n} Zeilen', es: 'Como mucho {n} líneas', nl: 'Hoogstens {n} regels', fr: 'Au plus {n} lignes' },
  winNotEverywhere: {
    tr: 'Bu sürü için çalıştı ama her kareden değil. Haritadaki kırmızı ve sarı kareler nerede takıldığını gösterir.',
    en: 'It worked for this flock, but not from every square. Red and yellow squares on the map show where it gets stuck.',
    de: 'Für diese Herde hat es geklappt, aber nicht von jedem Feld. Rote und gelbe Felder zeigen, wo es hängt.',
    es: 'Funcionó con este rebaño, pero no desde cada casilla. Las casillas rojas y amarillas muestran dónde se atasca.',
    nl: 'Het werkte voor deze kudde, maar niet vanaf elk vakje. Rode en gele vakjes laten zien waar het vastloopt.',
    fr: "Ça a marché pour ce troupeau, mais pas depuis chaque case. Les cases rouges et jaunes montrent où ça bloque.",
  },
  winTryShorter: {
    tr: 'Kodun {n} satır. {best} satırla da olur, dener misin?',
    en: 'Your code has {n} lines. It can be done in {best}. Want to try?',
    de: 'Dein Code hat {n} Zeilen. Es geht auch mit {best}. Probierst du es?',
    es: 'Tu código tiene {n} líneas. Se puede con {best}. ¿Lo intentas?',
    nl: 'Je code heeft {n} regels. Het kan ook met {best}. Probeer je het?',
    fr: 'Ton code a {n} lignes. On peut le faire en {best}. Tu essaies ?',
  },
  winShortest: {
    tr: 'Kodun hem her kareden çalışıyor hem de en kısa.',
    en: 'Your code works from every square and it is the shortest.',
    de: 'Dein Code klappt von jedem Feld und ist der kürzeste.',
    es: 'Tu código funciona desde cada casilla y es el más corto.',
    nl: 'Je code werkt vanaf elk vakje en is de kortste.',
    fr: 'Ton code marche depuis chaque case et c’est le plus court.',
  },
  showMap: { tr: 'Haritada göster', en: 'Show on the map', de: 'Auf der Karte zeigen', es: 'Mostrar en el mapa', nl: 'Op de kaart tonen', fr: 'Montrer sur la carte' },
  playAgain: { tr: 'Tekrar oyna', en: 'Play again', de: 'Nochmal spielen', es: 'Jugar otra vez', nl: 'Opnieuw spelen', fr: 'Rejouer' },
  nextLevel: { tr: 'Sonraki seviye', en: 'Next level', de: 'Nächstes Level', es: 'Siguiente nivel', nl: 'Volgende level', fr: 'Niveau suivant' },
  allDone: {
    tr: 'Şimdilik bütün seviyeleri bitirdin. Yeni dünyalar yakında!',
    en: 'You finished every level for now. New worlds are coming soon!',
    de: 'Du hast vorerst alle Level geschafft. Neue Welten kommen bald!',
    es: 'Has terminado todos los niveles por ahora. ¡Pronto llegan mundos nuevos!',
    nl: 'Je hebt voorlopig alle levels uitgespeeld. Binnenkort komen er nieuwe werelden!',
    fr: 'Tu as fini tous les niveaux pour l’instant. De nouveaux mondes arrivent bientôt !',
  },

  // Our other game
  promoTitle: { tr: 'Robo Rota\'yı da dene', en: 'Try Robo Rota too', de: 'Probier auch Robo Rota', es: 'Prueba también Robo Rota', nl: 'Probeer ook Robo Rota', fr: 'Essaie aussi Robo Rota' },
  promoBody: {
    tr: 'Robotu komut bloklarıyla pile götür. 200 seviyelik kodlama bulmacası.',
    en: 'Guide a robot to its battery with command blocks. A coding puzzle with 200 levels.',
    de: 'Bring einen Roboter mit Befehlsblöcken zu seiner Batterie. Ein Programmier-Rätsel mit 200 Leveln.',
    es: 'Lleva a un robot hasta su batería con bloques de órdenes. Un rompecabezas de programación con 200 niveles.',
    nl: 'Breng een robot met opdrachtblokken naar zijn batterij. Een programmeerpuzzel met 200 levels.',
    fr: "Guide un robot jusqu'à sa batterie avec des blocs de commandes. Un casse-tête de programmation en 200 niveaux.",
  },
  promoOpen: { tr: 'App Store\'da aç', en: 'Open in the App Store', de: 'Im App Store öffnen', es: 'Abrir en el App Store', nl: 'Openen in de App Store', fr: "Ouvrir dans l'App Store" },

  // Adults
  errorTitle: { tr: 'Bir şeyler ters gitti', en: 'Something went wrong', de: 'Etwas ist schiefgelaufen', es: 'Algo salió mal', nl: 'Er ging iets mis', fr: "Quelque chose s'est mal passé" },
  tryAgain: { tr: 'Tekrar dene', en: 'Try again', de: 'Nochmal versuchen', es: 'Reintentar', nl: 'Opnieuw proberen', fr: 'Réessayer' },
  forAdults: { tr: 'Yetişkinler için', en: 'For adults', de: 'Für Erwachsene', es: 'Para adultos', nl: 'Voor volwassenen', fr: 'Pour les adultes' },
  parentalGate: { tr: 'Ebeveyn kontrolü', en: 'Parental gate', de: 'Elternkontrolle', es: 'Control parental', nl: 'Ouderlijk slot', fr: 'Contrôle parental' },
  parentalBody: {
    tr: 'App Store\'u açmadan önce bir yetişkinin bu soruyu yanıtlaması gerekiyor.',
    en: 'An adult needs to answer this question before the App Store opens.',
    de: 'Bevor der App Store öffnet, muss ein Erwachsener diese Frage beantworten.',
    es: 'Un adulto debe responder esta pregunta antes de abrir el App Store.',
    nl: 'Een volwassene moet deze vraag beantwoorden voordat de App Store opengaat.',
    fr: "Un adulte doit répondre à cette question avant d'ouvrir l'App Store.",
  },
  answer: { tr: 'Yanıt', en: 'Answer', de: 'Antwort', es: 'Respuesta', nl: 'Antwoord', fr: 'Réponse' },
  wrongAnswer: { tr: 'Olmadı, yeni soru:', en: 'Not quite. New question:', de: 'Nicht ganz. Neue Frage:', es: 'No es correcto. Nueva pregunta:', nl: 'Niet goed. Nieuwe vraag:', fr: 'Pas tout à fait. Nouvelle question :' },
  cancel: { tr: 'Vazgeç', en: 'Cancel', de: 'Abbrechen', es: 'Cancelar', nl: 'Annuleren', fr: 'Annuler' },
  continue: { tr: 'Devam', en: 'Continue', de: 'Weiter', es: 'Continuar', nl: 'Doorgaan', fr: 'Continuer' },
} satisfies Record<string, Entry>;

export type StringKey = keyof typeof STRINGS;

/** Fills {name} placeholders. */
export function format(text: string, vars?: Record<string, string | number>): string {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

export function translate(lang: Lang, key: StringKey, vars?: Record<string, string | number>): string {
  return format(STRINGS[key][lang], vars);
}

/** Picks a supported language from a device language code such as "de" or "pt". */
export function pickLang(code: string | null | undefined): Lang {
  const c = (code ?? '').toLowerCase().slice(0, 2);
  return (LANGS as readonly string[]).includes(c) ? (c as Lang) : 'en';
}
