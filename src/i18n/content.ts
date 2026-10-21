// Game content in every supported language: world names, level names and level tips.
// Kept free of app imports so tests can check that nothing is missing.
// Level k uses LEVEL_NAMES[k] and LEVEL_TIPS[k].

import type { Lang } from './strings';

type Entry = Record<Lang, string>;

export const WORLD_NAMES: Entry[] = [
  { tr: 'Çayır', en: 'Meadow', de: 'Wiese', es: 'Pradera', nl: 'Weide', fr: 'Prairie' },
  { tr: 'Labirent', en: 'Maze', de: 'Labyrinth', es: 'Laberinto', nl: 'Doolhof', fr: 'Labyrinthe' },
  { tr: 'Kırmızı Çiçek', en: 'Red Flower', de: 'Rote Blume', es: 'Flor roja', nl: 'Rode bloem', fr: 'Fleur rouge' },
  { tr: 'Kurt İzleri', en: 'Wolf Tracks', de: 'Wolfsspuren', es: 'Huellas de lobo', nl: 'Wolvensporen', fr: 'Traces de loup' },
  { tr: 'Dere', en: 'The Stream', de: 'Der Bach', es: 'El arroyo', nl: 'De beek', fr: 'Le ruisseau' },
  { tr: 'Çiçekli Labirent', en: 'Flower Maze', de: 'Blumenlabyrinth', es: 'Laberinto de flores', nl: 'Bloemendoolhof', fr: 'Labyrinthe fleuri' },
  { tr: 'Kurt Labirenti', en: 'Wolf Maze', de: 'Wolfslabyrinth', es: 'Laberinto del lobo', nl: 'Wolvendoolhof', fr: 'Labyrinthe du loup' },
  { tr: 'Akıntılı Labirent', en: 'River Maze', de: 'Flusslabyrinth', es: 'Laberinto del río', nl: 'Rivierdoolhof', fr: 'Labyrinthe de la rivière' },
  { tr: 'Gece Çayırı', en: 'Night Meadow', de: 'Nachtwiese', es: 'Pradera nocturna', nl: 'Nachtweide', fr: 'Prairie de nuit' },
  { tr: 'Çiçek Deresi', en: 'Flower Creek', de: 'Blumenbach', es: 'Arroyo de flores', nl: 'Bloemenbeek', fr: 'Ruisseau fleuri' },
  { tr: 'Uzun Koridorlar', en: 'Long Corridors', de: 'Lange Gänge', es: 'Pasillos largos', nl: 'Lange gangen', fr: 'Longs couloirs' },
  { tr: 'Kurt ve Dere', en: 'Wolves and Water', de: 'Wölfe und Wasser', es: 'Lobos y agua', nl: 'Wolven en water', fr: 'Loups et eau' },
  { tr: 'Üç Çiçek', en: 'Three Flowers', de: 'Drei Blumen', es: 'Tres flores', nl: 'Drie bloemen', fr: 'Trois fleurs' },
  { tr: 'Sisli Tarla', en: 'Foggy Field', de: 'Nebelfeld', es: 'Campo con niebla', nl: 'Mistig veld', fr: 'Champ brumeux' },
  { tr: 'Kurt Sürüsü', en: 'Wolf Pack', de: 'Wolfsrudel', es: 'Manada de lobos', nl: 'Wolvenroedel', fr: 'Meute de loups' },
  { tr: 'Taşkın', en: 'Flood', de: 'Hochwasser', es: 'Inundación', nl: 'Overstroming', fr: 'Inondation' },
  { tr: 'Büyük Çiftlik', en: 'Big Farm', de: 'Großer Hof', es: 'Gran granja', nl: 'Grote boerderij', fr: 'Grande ferme' },
  { tr: 'Gece Labirenti', en: 'Night Maze', de: 'Nachtlabyrinth', es: 'Laberinto nocturno', nl: 'Nachtdoolhof', fr: 'Labyrinthe de nuit' },
  { tr: 'Usta Çoban', en: 'Master Shepherd', de: 'Meisterhirte', es: 'Pastor experto', nl: 'Meesterherder', fr: 'Berger expert' },
  { tr: 'Efsane Sürü', en: 'Legendary Flock', de: 'Legendäre Herde', es: 'Rebaño legendario', nl: 'Legendarische kudde', fr: 'Troupeau légendaire' },
];

/** One line about each world, on the home and world screens. */
export const WORLD_INTROS: Entry[] = [
  { tr: 'Bütün kuzular aynı kodu çalıştırır. Kuralları yaz, sürüyü ahıra getir.', en: 'Every sheep runs the same code. Write the rules and bring the flock home to the barn.', de: 'Alle Schafe führen denselben Code aus. Schreib die Regeln und bring die Herde in den Stall.', es: 'Todas las ovejas ejecutan el mismo código. Escribe las reglas y lleva el rebaño al establo.', nl: 'Alle schapen voeren dezelfde code uit. Schrijf de regels en breng de kudde naar de stal.', fr: 'Tous les moutons exécutent le même code. Écris les règles et ramène le troupeau à la bergerie.' },
  { tr: 'Çiçekler yol gösterir, "sap" hareketleri labirentte kestirme açar.', en: 'Flowers show the way, and side steps open shortcuts through the maze.', de: 'Blumen zeigen den Weg, und Seitenschritte öffnen Abkürzungen durch das Labyrinth.', es: 'Las flores marcan el camino y los pasos laterales abren atajos en el laberinto.', nl: 'Bloemen wijzen de weg en zijstappen openen kortere routes door het doolhof.', fr: 'Les fleurs montrent le chemin et les pas de côté ouvrent des raccourcis dans le labyrinthe.' },
  { tr: 'Yeni tabela: kırmızı çiçek. Üç renk, üç farklı kural.', en: 'A new sign: the red flower. Three colours, three different rules.', de: 'Ein neues Zeichen: die rote Blume. Drei Farben, drei verschiedene Regeln.', es: 'Una señal nueva: la flor roja. Tres colores, tres reglas distintas.', nl: 'Een nieuw teken: de rode bloem. Drie kleuren, drie verschillende regels.', fr: 'Un nouveau signe : la fleur rouge. Trois couleurs, trois règles différentes.' },
  { tr: 'Kurtlar çayırda bekliyor. Kurdun karesine adım atan kuzu kaybolur.', en: 'Wolves wait in the meadow. A sheep that steps onto a wolf’s square is lost.', de: 'Wölfe warten auf der Wiese. Ein Schaf, das auf das Feld eines Wolfs tritt, ist verloren.', es: 'Los lobos esperan en la pradera. Una oveja que pisa la casilla de un lobo se pierde.', nl: 'Wolven wachten in de weide. Een schaap dat op het vakje van een wolf stapt, is verloren.', fr: 'Des loups attendent dans la prairie. Un mouton qui marche sur la case d’un loup est perdu.' },
  { tr: 'Dereye basan kuzuyu su bir kare sürükler. Akıntı yardım da eder, yolundan da çıkarır.', en: 'A sheep that steps into the stream is carried one square. The current can help, or push you off course.', de: 'Wer in den Bach tritt, wird ein Feld mitgetragen. Die Strömung hilft oder bringt dich vom Weg ab.', es: 'Una oveja que pisa el arroyo es arrastrada una casilla. La corriente puede ayudar o desviarte.', nl: 'Een schaap dat in de beek stapt, wordt één vakje meegevoerd. De stroming helpt, of brengt je van je pad.', fr: 'Un mouton qui entre dans le ruisseau est emporté d’une case. Le courant peut aider ou te dévier.' },
  { tr: 'Üç renk çiçek ve sap hareketleri, dolambaçlı labirentlerde.', en: 'Three flower colours and side steps, in twisting mazes.', de: 'Drei Blumenfarben und Seitenschritte in verwinkelten Labyrinthen.', es: 'Tres colores de flor y pasos laterales, en laberintos retorcidos.', nl: 'Drie bloemkleuren en zijstappen, in kronkelige doolhoven.', fr: 'Trois couleurs de fleurs et des pas de côté, dans des labyrinthes tortueux.' },
  { tr: 'Labirent koridorlarında kurtlar var. Hangi kural önce okunmalı?', en: 'Wolves in the maze corridors. Which rule should be read first?', de: 'Wölfe in den Labyrinthgängen. Welche Regel muss zuerst gelesen werden?', es: 'Lobos en los pasillos del laberinto. ¿Qué regla debe leerse primero?', nl: 'Wolven in de gangen van het doolhof. Welke regel moet eerst gelezen worden?', fr: 'Des loups dans les couloirs. Quelle règle faut-il lire en premier ?' },
  { tr: 'Labirentten dereler akıyor. Akıntıyı hesaba kat.', en: 'Streams run through the maze. Take the current into account.', de: 'Bäche fließen durch das Labyrinth. Rechne mit der Strömung.', es: 'Los arroyos cruzan el laberinto. Ten en cuenta la corriente.', nl: 'Er lopen beken door het doolhof. Houd rekening met de stroming.', fr: 'Des ruisseaux traversent le labyrinthe. Tiens compte du courant.' },
  { tr: 'Gece çayırında kurtlar ve çiçekler bir arada.', en: 'Wolves and flowers together in the night meadow.', de: 'Wölfe und Blumen zusammen auf der Nachtwiese.', es: 'Lobos y flores juntos en la pradera nocturna.', nl: 'Wolven en bloemen samen in de nachtweide.', fr: 'Loups et fleurs ensemble dans la prairie de nuit.' },
  { tr: 'Çiçekler ve dereler: tabelaları ve akıntıyı birlikte kullan.', en: 'Flowers and streams: use the signs and the current together.', de: 'Blumen und Bäche: Nutze Zeichen und Strömung zusammen.', es: 'Flores y arroyos: usa las señales y la corriente juntas.', nl: 'Bloemen en beken: gebruik de tekens en de stroming samen.', fr: 'Fleurs et ruisseaux : utilise les signes et le courant ensemble.' },
  { tr: 'Büyük labirentler, döngülü koridorlar. Sadece çitlere bakarak çık.', en: 'Big mazes with looping corridors. Find the way using only the fences.', de: 'Große Labyrinthe mit Rundgängen. Finde hinaus, nur mit Blick auf die Zäune.', es: 'Grandes laberintos con pasillos en bucle. Sal usando solo las vallas.', nl: 'Grote doolhoven met rondlopende gangen. Vind de weg alleen met de hekken.', fr: 'De grands labyrinthes aux couloirs en boucle. Sors en utilisant seulement les clôtures.' },
  { tr: 'Kurtlar ve dereler aynı tarlada. Akıntı seni kurda götürmesin.', en: 'Wolves and streams in the same field. Don’t let the current carry you to a wolf.', de: 'Wölfe und Bäche auf demselben Feld. Lass dich nicht zum Wolf treiben.', es: 'Lobos y arroyos en el mismo campo. Que la corriente no te lleve a un lobo.', nl: 'Wolven en beken in hetzelfde veld. Laat de stroming je niet naar een wolf brengen.', fr: 'Loups et ruisseaux dans le même champ. Ne te laisse pas porter vers un loup.' },
  { tr: 'Açık tarlalarda üç renk çiçek. Dört satırlık kodlar zamanı.', en: 'Three flower colours in open fields. Time for four-line codes.', de: 'Drei Blumenfarben auf offenen Feldern. Zeit für Codes mit vier Zeilen.', es: 'Tres colores de flor en campos abiertos. Hora de códigos de cuatro líneas.', nl: 'Drie bloemkleuren in open velden. Tijd voor codes van vier regels.', fr: 'Trois couleurs de fleurs dans des champs ouverts. Place aux codes de quatre lignes.' },
  { tr: 'Taşlarla dolu geniş tarlalar. Kenarı takip etmek her zaman yetmez.', en: 'Wide fields full of stones. Following the edge is not always enough.', de: 'Weite Felder voller Steine. Am Rand entlang reicht nicht immer.', es: 'Campos amplios llenos de piedras. Seguir el borde no siempre basta.', nl: 'Brede velden vol stenen. De rand volgen is niet altijd genoeg.', fr: 'De vastes champs pleins de pierres. Suivre le bord ne suffit pas toujours.' },
  { tr: 'Her yerde kurt var. Güvenli yolu bul.', en: 'Wolves everywhere. Find the safe way.', de: 'Überall Wölfe. Finde den sicheren Weg.', es: 'Lobos por todas partes. Encuentra el camino seguro.', nl: 'Overal wolven. Vind de veilige weg.', fr: 'Des loups partout. Trouve le chemin sûr.' },
  { tr: 'Tarla dere dolu. Akıntılar kuzuları her yöne savuruyor.', en: 'The field is full of streams. The currents push sheep every which way.', de: 'Das Feld ist voller Bäche. Die Strömungen treiben die Schafe in alle Richtungen.', es: 'El campo está lleno de arroyos. Las corrientes empujan a las ovejas a todas partes.', nl: 'Het veld zit vol beken. De stroming duwt de schapen alle kanten op.', fr: 'Le champ est plein de ruisseaux. Les courants poussent les moutons dans tous les sens.' },
  { tr: 'Çiçek, kurt ve dere aynı çiftlikte. Hepsini bildin, şimdi birleştir.', en: 'Flowers, wolves and streams on one farm. You know them all, now combine them.', de: 'Blumen, Wölfe und Bäche auf einem Hof. Du kennst alles, jetzt kombiniere es.', es: 'Flores, lobos y arroyos en una granja. Ya los conoces, ahora combínalos.', nl: 'Bloemen, wolven en beken op één boerderij. Je kent ze allemaal, combineer ze nu.', fr: 'Fleurs, loups et ruisseaux dans une ferme. Tu les connais tous, combine-les.' },
  { tr: 'Büyük labirentlerde hepsi birden.', en: 'All of them at once, in big mazes.', de: 'Alles auf einmal, in großen Labyrinthen.', es: 'Todo a la vez, en grandes laberintos.', nl: 'Alles tegelijk, in grote doolhoven.', fr: 'Tout à la fois, dans de grands labyrinthes.' },
  { tr: 'Her seviye dört satır ister. Gerçek bir usta çoban ol.', en: 'Every level needs four lines. Become a true master shepherd.', de: 'Jedes Level braucht vier Zeilen. Werde ein echter Meisterhirte.', es: 'Cada nivel necesita cuatro líneas. Conviértete en un verdadero pastor experto.', nl: 'Elk level heeft vier regels nodig. Word een echte meesterherder.', fr: 'Chaque niveau demande quatre lignes. Deviens un vrai berger expert.' },
  { tr: 'Son dünya. En büyük tarlalar, en zor sürüler.', en: 'The last world. The biggest fields, the hardest flocks.', de: 'Die letzte Welt. Die größten Felder, die schwierigsten Herden.', es: 'El último mundo. Los campos más grandes, los rebaños más difíciles.', nl: 'De laatste wereld. De grootste velden, de moeilijkste kuddes.', fr: 'Le dernier monde. Les plus grands champs, les troupeaux les plus difficiles.' },
];

/** Tips for levels of worlds 3–20 after the first one of each world. */
export const GENERIC_TIPS: Entry[] = [
  { tr: 'Önce Karıştır\'la farklı başlangıçlar dene, sonra kodunu düzelt.', en: 'Try different starts with Shuffle first, then fix your code.', de: 'Probier erst mit Mischen andere Starts aus, dann verbessere deinen Code.', es: 'Prueba primero otros comienzos con Mezclar y luego arregla tu código.', nl: 'Probeer eerst andere starts met Schudden en verbeter dan je code.', fr: 'Essaie d’abord d’autres départs avec Mélanger, puis corrige ton code.' },
  { tr: 'Kırmızı karelere bak: kuzular orada neden takılıyor?', en: 'Look at the red squares: why do sheep get stuck there?', de: 'Sieh dir die roten Felder an: Warum bleiben die Schafe dort hängen?', es: 'Mira las casillas rojas: ¿por qué se atascan ahí las ovejas?', nl: 'Kijk naar de rode vakjes: waarom lopen de schapen daar vast?', fr: 'Regarde les cases rouges : pourquoi les moutons y restent-ils bloqués ?' },
  { tr: 'Kural sırasını değiştirmek bazen yeni kural eklemekten iyidir.', en: 'Changing the order of the rules is sometimes better than adding one.', de: 'Die Reihenfolge zu ändern ist manchmal besser, als eine Regel hinzuzufügen.', es: 'A veces cambiar el orden de las reglas es mejor que añadir una.', nl: 'De volgorde veranderen is soms beter dan een regel toevoegen.', fr: 'Changer l’ordre des règles vaut parfois mieux qu’en ajouter une.' },
  { tr: 'Kendini bir kuzu gibi düşün: önünde, sağında, solunda ne var?', en: 'Think like a sheep: what is ahead, on your right, on your left?', de: 'Denk wie ein Schaf: Was ist vorne, rechts, links?', es: 'Piensa como una oveja: ¿qué hay delante, a la derecha, a la izquierda?', nl: 'Denk als een schaap: wat is er voor je, rechts, links?', fr: 'Pense comme un mouton : qu’y a-t-il devant, à droite, à gauche ?' },
  { tr: 'YOKSA satırı en çok kullanılan hareket olmalı.', en: 'The ELSE line should be the move used most often.', de: 'Die SONST-Zeile sollte der häufigste Zug sein.', es: 'La línea SI NO debería ser el movimiento más usado.', nl: 'De ANDERS-regel hoort de zet te zijn die je het meest gebruikt.', fr: 'La ligne SINON devrait être le mouvement le plus utilisé.' },
  { tr: 'Takıldıysan ipucu iste: çözüm satır satır açılır.', en: 'Stuck? Ask for a hint: the solution opens line by line.', de: 'Festgefahren? Hol dir einen Tipp: Die Lösung öffnet sich Zeile für Zeile.', es: '¿Atascado? Pide una pista: la solución se abre línea a línea.', nl: 'Vast? Vraag een hint: de oplossing gaat regel voor regel open.', fr: 'Bloqué ? Demande un indice : la solution s’ouvre ligne par ligne.' },
];

export const LEVEL_NAMES: Entry[] = [
  { tr: 'İlk Adım', en: 'First Steps', de: 'Erste Schritte', es: 'Primeros pasos', nl: 'Eerste stappen', fr: 'Premiers pas' },
  { tr: 'İki Yön', en: 'Both Ways', de: 'Beide Richtungen', es: 'Dos sentidos', nl: 'Twee kanten', fr: 'Dans les deux sens' },
  { tr: 'Köşe', en: 'Corner', de: 'Ecke', es: 'Esquina', nl: 'Hoek', fr: 'Coin' },
  { tr: 'Öbür Köşe', en: 'The Other Corner', de: 'Die andere Ecke', es: 'La otra esquina', nl: 'De andere hoek', fr: "L'autre coin" },
  { tr: 'Büyük Çayır', en: 'Big Meadow', de: 'Große Wiese', es: 'Gran pradera', nl: 'Grote weide', fr: 'Grande prairie' },
  { tr: 'Salyangoz', en: 'Snail', de: 'Schnecke', es: 'Caracol', nl: 'Slak', fr: 'Escargot' },
  { tr: 'Zikzak', en: 'Zigzag', de: 'Zickzack', es: 'Zigzag', nl: 'Zigzag', fr: 'Zigzag' },
  { tr: 'Kıvrık Yol', en: 'Winding Path', de: 'Kurvenweg', es: 'Camino sinuoso', nl: 'Kronkelpad', fr: 'Chemin sinueux' },
  { tr: 'Taşlı Çayır', en: 'Stony Meadow', de: 'Steinige Wiese', es: 'Pradera pedregosa', nl: 'Stenige weide', fr: 'Prairie caillouteuse' },
  { tr: 'Eve Uzun Yol', en: 'Long Way Home', de: 'Langer Heimweg', es: 'Largo camino a casa', nl: 'Lange weg naar huis', fr: 'Long retour' },
  { tr: 'Mavi Çiçek', en: 'Blue Flower', de: 'Blaue Blume', es: 'Flor azul', nl: 'Blauwe bloem', fr: 'Fleur bleue' },
  { tr: 'Sarı Çiçekler', en: 'Yellow Flowers', de: 'Gelbe Blumen', es: 'Flores amarillas', nl: 'Gele bloemen', fr: 'Fleurs jaunes' },
  { tr: 'Çite Tutun', en: 'Hold the Fence', de: 'Am Zaun entlang', es: 'Junto a la valla', nl: 'Langs het hek', fr: 'Le long de la clôture' },
  { tr: 'Sağ El', en: 'Right Hand', de: 'Rechte Hand', es: 'Mano derecha', nl: 'Rechterhand', fr: 'Main droite' },
  { tr: 'Sol El', en: 'Left Hand', de: 'Linke Hand', es: 'Mano izquierda', nl: 'Linkerhand', fr: 'Main gauche' },
  { tr: 'Mavi Kapı', en: 'Blue Gate', de: 'Blaues Tor', es: 'Puerta azul', nl: 'Blauwe poort', fr: 'Porte bleue' },
  { tr: 'İki Çiçek', en: 'Two Flowers', de: 'Zwei Blumen', es: 'Dos flores', nl: 'Twee bloemen', fr: 'Deux fleurs' },
  { tr: 'Çıkmaz Sokaklar', en: 'Dead Ends', de: 'Sackgassen', es: 'Callejones sin salida', nl: 'Doodlopende paden', fr: 'Impasses' },
  { tr: 'Çiçek Tarlası', en: 'Flower Field', de: 'Blumenfeld', es: 'Campo de flores', nl: 'Bloemenveld', fr: 'Champ de fleurs' },
  { tr: 'Çoban Sınavı', en: "Shepherd's Test", de: 'Hirtenprüfung', es: 'Prueba del pastor', nl: 'Herdersproef', fr: 'Épreuve du berger' },
];

export const LEVEL_TIPS: Entry[] = [
  {
    tr: 'Bütün kuzular ahıra bakıyor. Çalıştır\'a bas ve izle. Sonra Karıştır\'a bas: kuzular başka yerlere dağılınca kod yine çalışıyor mu?',
    en: 'All the sheep face the barn. Press Run and watch. Then press Shuffle: does the code still work when the sheep are somewhere else?',
    de: 'Alle Schafe schauen zum Stall. Drück auf Start und schau zu. Dann drück auf Mischen: Klappt der Code noch, wenn die Schafe woanders stehen?',
    es: 'Todas las ovejas miran al establo. Pulsa Ejecutar y mira. Luego pulsa Mezclar: ¿sigue funcionando el código si las ovejas están en otro sitio?',
    nl: 'Alle schapen kijken naar de stal. Druk op Start en kijk. Druk dan op Schudden: werkt de code nog als de schapen ergens anders staan?',
    fr: 'Tous les moutons regardent la bergerie. Appuie sur Lancer et regarde. Puis appuie sur Mélanger : le code marche-t-il encore si les moutons sont ailleurs ?',
  },
  {
    tr: 'Bazı kuzular ahıra arkasını dönmüş. Bir kural ekle: EĞER önüm çit ise dön.',
    en: 'Some sheep have their backs to the barn. Add a rule: IF there is a fence ahead, turn.',
    de: 'Manche Schafe drehen dem Stall den Rücken zu. Füge eine Regel hinzu: WENN vorne ein Zaun ist, dreh dich.',
    es: 'Algunas ovejas dan la espalda al establo. Añade una regla: SI hay una valla delante, gira.',
    nl: 'Sommige schapen staan met hun rug naar de stal. Voeg een regel toe: ALS er een hek voor je is, draai.',
    fr: 'Certains moutons tournent le dos à la bergerie. Ajoute une règle : SI une clôture est devant, tourne.',
  },
  {
    tr: 'Yol bir köşede kıvrılıyor. Kuzu çite gelince hangi yöne dönmeli?',
    en: 'The road bends at a corner. Which way should a sheep turn when it meets the fence?',
    de: 'Der Weg macht eine Kurve. In welche Richtung soll sich ein Schaf am Zaun drehen?',
    es: 'El camino gira en una esquina. ¿Hacia dónde debe girar la oveja al llegar a la valla?',
    nl: 'De weg maakt een bocht. Welke kant moet een schaap op draaien als het bij het hek komt?',
    fr: 'Le chemin tourne dans un coin. De quel côté le mouton doit-il tourner devant la clôture ?',
  },
  {
    tr: 'Bu sefer yol öbür yöne kıvrılıyor.',
    en: 'This time the road bends the other way.',
    de: 'Diesmal biegt der Weg in die andere Richtung ab.',
    es: 'Esta vez el camino gira hacia el otro lado.',
    nl: 'Deze keer buigt de weg de andere kant op.',
    fr: "Cette fois, le chemin tourne de l'autre côté.",
  },
  {
    tr: 'Açık bir çayır. Kuzular çitler boyunca yürürse ahırı bulur mu? Yeni: Geri dön.',
    en: 'An open meadow. Will the sheep find the barn if they walk along the fences? New: Turn around.',
    de: 'Eine offene Wiese. Finden die Schafe den Stall, wenn sie am Zaun entlanggehen? Neu: Umdrehen.',
    es: 'Una pradera abierta. ¿Encontrarán el establo si caminan junto a las vallas? Nuevo: Darse la vuelta.',
    nl: 'Een open weide. Vinden de schapen de stal als ze langs de hekken lopen? Nieuw: Omdraaien.',
    fr: 'Une prairie ouverte. Les moutons trouveront-ils la bergerie en longeant les clôtures ? Nouveau : Faire demi-tour.',
  },
  {
    tr: 'Yol içe doğru dönerek ahıra gidiyor. Ters yöne bakan kuzuları unutma.',
    en: 'The road spirals inward to the barn. Don’t forget the sheep facing the wrong way.',
    de: 'Der Weg windet sich nach innen zum Stall. Vergiss die Schafe nicht, die falsch herum schauen.',
    es: 'El camino gira hacia dentro hasta el establo. No olvides las ovejas que miran al revés.',
    nl: 'De weg draait naar binnen naar de stal. Vergeet de schapen niet die de verkeerde kant op kijken.',
    fr: "Le chemin s'enroule vers la bergerie. N'oublie pas les moutons qui regardent dans le mauvais sens.",
  },
  {
    tr: 'Köşeler bir sağa bir sola dönüyor. Yeni: kuzu artık sağına ve soluna da bakabiliyor. Kural sırası önemli, üstteki kural önce okunur.',
    en: 'The corners turn right, then left. New: sheep can now look to their right and left. The order matters: the top rule is read first.',
    de: 'Die Ecken gehen mal rechts, mal links. Neu: Schafe schauen jetzt auch nach rechts und links. Die Reihenfolge zählt: Die oberste Regel wird zuerst gelesen.',
    es: 'Las esquinas giran a la derecha y luego a la izquierda. Nuevo: la oveja ya mira a su derecha y a su izquierda. El orden importa: la regla de arriba se lee primero.',
    nl: 'De hoeken gaan eerst naar rechts, dan naar links. Nieuw: schapen kijken nu ook naar rechts en links. De volgorde telt: de bovenste regel wordt eerst gelezen.',
    fr: "Les coins tournent à droite puis à gauche. Nouveau : les moutons regardent aussi à droite et à gauche. L'ordre compte : la règle du haut est lue en premier.",
  },
  {
    tr: 'Yol açıksa yürü. Değilse boş olan tarafa dön.',
    en: 'If the way is clear, walk. If not, turn toward the open side.',
    de: 'Ist der Weg frei, geh. Wenn nicht, dreh dich zur offenen Seite.',
    es: 'Si el camino está libre, camina. Si no, gira hacia el lado abierto.',
    nl: 'Is de weg vrij, loop dan. Zo niet, draai naar de open kant.',
    fr: "Si la voie est libre, marche. Sinon, tourne du côté ouvert.",
  },
  {
    tr: 'Taşlar kuzuların önünü kesiyor. Çiti takip etmenin bir yolunu bul.',
    en: 'Stones block the sheep. Find a way to follow the fence.',
    de: 'Steine versperren den Schafen den Weg. Finde einen Weg, dem Zaun zu folgen.',
    es: 'Las piedras cortan el paso. Encuentra una forma de seguir la valla.',
    nl: 'Stenen versperren de weg. Zoek een manier om het hek te volgen.',
    fr: 'Des pierres bloquent les moutons. Trouve un moyen de suivre la clôture.',
  },
  {
    tr: 'Dünya sonu! Dört satırla her kareden çalışan bir kod var.',
    en: 'Final level! There is a four-line code that works from every square.',
    de: 'Endlevel! Es gibt einen Code mit vier Zeilen, der von jedem Feld aus klappt.',
    es: '¡Nivel final! Hay un código de cuatro líneas que funciona desde cada casilla.',
    nl: 'Eindlevel! Er is een code van vier regels die vanaf elk vakje werkt.',
    fr: 'Niveau final ! Il existe un code de quatre lignes qui marche depuis chaque case.',
  },
  {
    tr: 'Çiçekler yol tabelası gibi. Kuzu mavi çiçeğin üstündeyken ne yapmalı?',
    en: 'Flowers work like road signs. What should a sheep do when it stands on a blue flower?',
    de: 'Blumen sind wie Wegweiser. Was soll ein Schaf tun, wenn es auf einer blauen Blume steht?',
    es: 'Las flores son como señales. ¿Qué debe hacer la oveja cuando está sobre una flor azul?',
    nl: 'Bloemen zijn net wegwijzers. Wat moet een schaap doen als het op een blauwe bloem staat?',
    fr: 'Les fleurs sont comme des panneaux. Que doit faire le mouton sur une fleur bleue ?',
  },
  {
    tr: 'Sarı çiçekler nereden dönüleceğini gösteriyor.',
    en: 'The yellow flowers show where to turn.',
    de: 'Die gelben Blumen zeigen, wo man abbiegt.',
    es: 'Las flores amarillas muestran dónde girar.',
    nl: 'De gele bloemen laten zien waar je moet afslaan.',
    fr: 'Les fleurs jaunes montrent où tourner.',
  },
  {
    tr: 'Yeni hareket: Sağa sap, yani sağa dön ve aynı adımda bir kare ilerle. Sağını çitte tutan kuzu labirentten çıkar.',
    en: 'New move: Step right, which turns right and moves one square in the same step. A sheep that keeps the fence on its right finds its way out.',
    de: 'Neuer Zug: Rechts abbiegen, also rechts drehen und im selben Schritt ein Feld gehen. Ein Schaf mit dem Zaun rechts findet hinaus.',
    es: 'Movimiento nuevo: Paso a la derecha, que gira y avanza una casilla en el mismo paso. Una oveja que mantiene la valla a su derecha encuentra la salida.',
    nl: 'Nieuwe zet: Stap naar rechts, dus rechtsom draaien en in dezelfde stap één vakje verder. Een schaap met het hek rechts vindt de weg.',
    fr: "Nouveau mouvement : Pas à droite, qui tourne et avance d'une case dans la même étape. Un mouton qui garde la clôture à sa droite trouve la sortie.",
  },
  {
    tr: 'Sağ el kuralını bu labirentte de dene. Kaç satır yeter?',
    en: 'Try the right-hand rule in this maze too. How many lines do you need?',
    de: 'Probier die Rechte-Hand-Regel auch hier. Wie viele Zeilen brauchst du?',
    es: 'Prueba también aquí la regla de la mano derecha. ¿Cuántas líneas necesitas?',
    nl: 'Probeer hier ook de rechterhandregel. Hoeveel regels heb je nodig?',
    fr: 'Essaie aussi la règle de la main droite ici. Combien de lignes faut-il ?',
  },
  {
    tr: 'Bu kez solunu çitte tut.',
    en: 'This time keep the fence on your left.',
    de: 'Diesmal bleibt der Zaun links.',
    es: 'Esta vez mantén la valla a tu izquierda.',
    nl: 'Houd het hek deze keer links.',
    fr: 'Cette fois, garde la clôture à gauche.',
  },
  {
    tr: 'Mavi çiçek ahıra giden geçidi gösteriyor.',
    en: 'The blue flower marks the passage to the barn.',
    de: 'Die blaue Blume zeigt den Durchgang zum Stall.',
    es: 'La flor azul señala el paso hacia el establo.',
    nl: 'De blauwe bloem wijst de doorgang naar de stal.',
    fr: 'La fleur bleue indique le passage vers la bergerie.',
  },
  {
    tr: 'Çiçeklerden biri yolu gösteriyor, öteki seni şaşırtmak için orada.',
    en: 'One flower shows the way. The other is there to trick you.',
    de: 'Eine Blume zeigt den Weg. Die andere will dich nur verwirren.',
    es: 'Una flor indica el camino. La otra está ahí para despistarte.',
    nl: 'Eén bloem wijst de weg. De andere is er om je te misleiden.',
    fr: "Une fleur montre le chemin. L'autre est là pour te piéger.",
  },
  {
    tr: 'Kuzular çıkmaz sokaklarda takılmasın. Kural sırasını iyi düşün.',
    en: 'Don’t let the sheep get stuck in dead ends. Think hard about the order of the rules.',
    de: 'Lass die Schafe nicht in Sackgassen stecken. Denk gut über die Reihenfolge der Regeln nach.',
    es: 'Que las ovejas no se atasquen en los callejones. Piensa bien el orden de las reglas.',
    nl: 'Laat de schapen niet vastlopen in doodlopende paden. Denk goed na over de volgorde van de regels.',
    fr: "Ne laisse pas les moutons se coincer dans les impasses. Réfléchis bien à l'ordre des règles.",
  },
  {
    tr: 'Açık tarlada çiti takip etmek zor. Sarı çiçekten yararlan.',
    en: 'Following the fence is hard in an open field. Use the yellow flower.',
    de: 'Auf einem offenen Feld ist es schwer, dem Zaun zu folgen. Nutze die gelbe Blume.',
    es: 'En un campo abierto cuesta seguir la valla. Aprovecha la flor amarilla.',
    nl: 'In een open veld is het lastig het hek te volgen. Gebruik de gele bloem.',
    fr: 'Dans un champ ouvert, suivre la clôture est difficile. Utilise la fleur jaune.',
  },
  {
    tr: 'Son sınav! Dört satırlık bir kod bütün kuzuları her kareden eve getiriyor.',
    en: 'The final test! A four-line code brings every sheep home from every square.',
    de: 'Die letzte Prüfung! Ein Code mit vier Zeilen bringt jedes Schaf von jedem Feld nach Hause.',
    es: '¡La prueba final! Un código de cuatro líneas lleva a todas las ovejas a casa desde cada casilla.',
    nl: 'De laatste proef! Een code van vier regels brengt elk schaap vanaf elk vakje thuis.',
    fr: 'Le test final ! Un code de quatre lignes ramène chaque mouton depuis chaque case.',
  },
];

const PER_WORLD = 10;

export const worldName = (lang: Lang, i: number) => WORLD_NAMES[i]?.[lang] ?? '';
export const worldIntro = (lang: Lang, i: number) => WORLD_INTROS[i]?.[lang] ?? '';

/** Worlds 1–2 have their own level names; later levels are "<world name> <n>". */
export function levelName(lang: Lang, k: number): string {
  if (k < LEVEL_NAMES.length) return LEVEL_NAMES[k][lang];
  return `${worldName(lang, Math.floor(k / PER_WORLD))} ${(k % PER_WORLD) + 1}`;
}

/** Worlds 1–2 have their own tips; later worlds open with the world's intro, then general tips. */
export function levelTip(lang: Lang, k: number): string {
  if (k < LEVEL_TIPS.length) return LEVEL_TIPS[k][lang];
  if (k % PER_WORLD === 0) return worldIntro(lang, Math.floor(k / PER_WORLD));
  return GENERIC_TIPS[k % GENERIC_TIPS.length][lang];
}
