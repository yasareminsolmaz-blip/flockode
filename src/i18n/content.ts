// Game content in every supported language: world names, level names and level tips.
// Kept free of app imports so tests can check that nothing is missing.
// Level k uses LEVEL_NAMES[k] and LEVEL_TIPS[k].

import type { Lang } from './strings';

type Entry = Record<Lang, string>;

export const WORLD_NAMES: Entry[] = [
  { tr: 'Çayır', en: 'Meadow', de: 'Wiese', es: 'Pradera', nl: 'Weide', fr: 'Prairie' },
  { tr: 'Labirent', en: 'Maze', de: 'Labyrinth', es: 'Laberinto', nl: 'Doolhof', fr: 'Labyrinthe' },
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

export const worldName = (lang: Lang, i: number) => WORLD_NAMES[i]?.[lang] ?? '';
export const levelName = (lang: Lang, k: number) => LEVEL_NAMES[k]?.[lang] ?? '';
export const levelTip = (lang: Lang, k: number) => LEVEL_TIPS[k]?.[lang] ?? '';
