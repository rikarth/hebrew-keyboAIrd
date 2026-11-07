/**
 * ARCHIU DE MAPEIG DEL TECLAT HEBREU
 * ====================================
 * Aquest fitxer conté la configuració de totes les lletres, niqudot (signes de vocalització),
 * signes de puntuació hebreus i el mapeig del teclat físic (QWERTY / Israelià).
 * 
 * Podeu editar aquest fitxer directament per afegir, modificar o canviar les tecles,
 * els noms, les dreceres o la disposició dels botons.
 */

export interface KeyboardKey {
  /** Caràcter Unicode a inserir en el text */
  char: string;
  /** Etiqueta que es mostra al botó del teclat virtual */
  label: string;
  /** Nom descriptiu de la lletra o signe (en català / hebreu) */
  name: string;
  /** Tecla corresponent al teclat físic QWERTY (si en té) */
  physicalKey?: string;
  /** Tipus de tecla */
  type: 'letter' | 'final_letter' | 'niqqud' | 'punctuation' | 'number' | 'special';
  /** Descripció fonètica o d'ús */
  description?: string;
  /** Codis de punts de codi Unicode (ex: U+05D0) */
  codePoint?: string;
}

/**
 * 1. MAPEIG DE TECLES FÍSIQUES QWERTY A LLETRES HEBREES (LAYOUT ISRAELIÀ ESTÀNDARD)
 * Tecla del teclat QWERTY (en minúscula) -> Caràcter Hebreu
 */
export const DEFAULT_ISRAELI_KEY_MAP: Record<string, string> = {
  // Fila superior (QWERTY)
  'q': '/',
  'w': '׳',
  'e': 'ק',
  'r': 'ר',
  't': 'א',
  'y': 'ט',
  'u': 'ו',
  'i': 'ן',
  'o': 'ם',
  'p': 'פ',
  
  // Fila mitjana (ASDFGHJKL)
  'a': 'ש',
  's': 'ד',
  'd': 'ג',
  'f': 'כ',
  'g': 'ע',
  'h': 'י',
  'j': 'ח',
  'k': 'ל',
  'l': 'ך',
  ';': 'ף',
  '\'': ',',

  // Fila inferior (ZXCVBNM)
  'z': 'ז',
  'x': 'ס',
  'c': 'ב',
  'v': 'ה',
  'b': 'נ',
  'n': 'מ',
  'm': 'צ',
  ',': 'ץ',
  '.': 'ת',
  '/': '?',
};

/**
 * 1.2 MAPEIG FONÈTIC ALTERNATIU (PER A USUARIS AMB TECLAT LLATÍ)
 */
export const PHONETIC_KEY_MAP: Record<string, string> = {
  'a': 'א', // Alef
  'b': 'ב', // Bet
  'v': 'ב', // Vet
  'g': 'ג', // Gimel
  'd': 'ד', // Dalet
  'h': 'ה', // Hei
  'u': 'ו', // Vav (vocal)
  'w': 'ש', // Shin / Sin
  'z': 'ז', // Zayin
  'j': 'ח', // Het
  'y': 'י', // Yod
  'k': 'כ', // Kaf
  'l': 'ל', // Lamed
  'm': 'מ', // Mem
  'n': 'נ', // Nun
  's': 'ס', // Samekh
  'e': 'ע', // Ayin
  'p': 'פ', // Pei
  'f': 'ף', // Fei final
  'c': 'צ', // Tsadi
  'q': 'ק', // Qof
  'r': 'ר', // Resh
  't': 'ת', // Tav
  'x': 'ץ', // Tsadi final
  'o': 'ם', // Mem final
  'i': 'ן', // Nun final
  ';': 'ך', // Khaf final
  '\'': '׳', // Geresh
};

/**
 * Mapeig inicial per defecte (Israelià estàndard)
 */
export const PHYSICAL_KEY_MAP: Record<string, string> = { ...DEFAULT_ISRAELI_KEY_MAP };

/**
 * 2. LLETRES HEBREES (LLETRES I FORMES FINALS - SOFFIT)
 */
export const HEBREW_LETTERS: KeyboardKey[] = [
  { char: 'א', label: 'א', name: 'Alef', physicalKey: 't', type: 'letter', description: 'Silenciosa / Vocal', codePoint: 'U+05D0' },
  { char: 'ב', label: 'ב', name: 'Bet / Vet', physicalKey: 'c', type: 'letter', description: 'Sons B / V', codePoint: 'U+05D1' },
  { char: 'ג', label: 'ג', name: 'Gimel', physicalKey: 'd', type: 'letter', description: 'So G dur', codePoint: 'U+05D2' },
  { char: 'ד', label: 'ד', name: 'Dalet', physicalKey: 's', type: 'letter', description: 'So D', codePoint: 'U+05D3' },
  { char: 'ה', label: 'ה', name: 'Hei', physicalKey: 'v', type: 'letter', description: 'So H suau', codePoint: 'U+05D4' },
  { char: 'ו', label: 'ו', name: 'Vav', physicalKey: 'u', type: 'letter', description: 'So V / O / U', codePoint: 'U+05D5' },
  { char: 'ז', label: 'ז', name: 'Zayin', physicalKey: 'z', type: 'letter', description: 'So Z (S sonora)', codePoint: 'U+05D6' },
  { char: 'ח', label: 'ח', name: 'Het', physicalKey: 'j', type: 'letter', description: 'So J / Jota guttural', codePoint: 'U+05D7' },
  { char: 'ט', label: 'ט', name: 'Tet', physicalKey: 'y', type: 'letter', description: 'So T dur', codePoint: 'U+05D8' },
  { char: 'י', label: 'י', name: 'Yod', physicalKey: 'h', type: 'letter', description: 'So Y / I', codePoint: 'U+05D9' },
  { char: 'כ', label: 'כ', name: 'Kaf / Khaf', physicalKey: 'f', type: 'letter', description: 'So K / Kh', codePoint: 'U+05DA' },
  { char: 'ך', label: 'ך', name: 'Khaf Final (Soffit)', physicalKey: 'l', type: 'final_letter', description: 'Forma final de Khaf', codePoint: 'U+05DA' },
  { char: 'ל', label: 'ל', name: 'Lamed', physicalKey: 'k', type: 'letter', description: 'So L', codePoint: 'U+05DC' },
  { char: 'מ', label: 'מ', name: 'Mem', physicalKey: 'n', type: 'letter', description: 'So M', codePoint: 'U+05DD' },
  { char: 'ם', label: 'ם', name: 'Mem Final (Soffit)', physicalKey: 'o', type: 'final_letter', description: 'Forma final de Mem', codePoint: 'U+05DE' },
  { char: 'נ', label: 'נ', name: 'Nun', physicalKey: 'b', type: 'letter', description: 'So N', codePoint: 'U+05DF' },
  { char: 'ן', label: 'ן', name: 'Nun Final (Soffit)', physicalKey: 'i', type: 'final_letter', description: 'Forma final de Nun', codePoint: 'U+05E0' },
  { char: 'ס', label: 'ס', name: 'Samekh', physicalKey: 'x', type: 'letter', description: 'So S', codePoint: 'U+05E1' },
  { char: 'ע', label: 'ע', name: 'Ayin', physicalKey: 'g', type: 'letter', description: 'Guttural silenciosa', codePoint: 'U+05E2' },
  { char: 'פ', label: 'פ', name: 'Pei / Fei', physicalKey: 'p', type: 'letter', description: 'So P / F', codePoint: 'U+05E3' },
  { char: 'ף', label: 'ף', name: 'Fei Final (Soffit)', physicalKey: ';', type: 'final_letter', description: 'Forma final de Fei', codePoint: 'U+05E4' },
  { char: 'צ', label: 'צ', name: 'Tsadi', physicalKey: 'm', type: 'letter', description: 'So TS', codePoint: 'U+05E5' },
  { char: 'ץ', label: 'ץ', name: 'Tsadi Final (Soffit)', physicalKey: ',', type: 'final_letter', description: 'Forma final de Tsadi', codePoint: 'U+05E6' },
  { char: 'ק', label: 'ק', name: 'Qof', physicalKey: 'e', type: 'letter', description: 'So Q / K', codePoint: 'U+05E7' },
  { char: 'ר', label: 'ר', name: 'Resh', physicalKey: 'r', type: 'letter', description: 'So R', codePoint: 'U+05E8' },
  { char: 'ש', label: 'ש', name: 'Shin / Sin', physicalKey: 'a', type: 'letter', description: 'So SH / S', codePoint: 'U+05E9' },
  { char: 'ת', label: 'ת', name: 'Tav', physicalKey: '.', type: 'letter', description: 'So T', codePoint: 'U+05EA' },
];

/**
 * 3. NIQQUD (PUNTS I SIGNES DE VOCALITZACIÓ HEBREA)
 * Nota: Es combinen amb la lletra anterior. Per a la visualització s'utilitza el cercle puntejat ◌.
 */
export const HEBREW_NIQQUD: KeyboardKey[] = [
  { char: '\u05B0', label: '◌ְ', name: 'Sheva (שְׁוָא)', type: 'niqqud', description: 'So "e" molt breu o absència de vocal', codePoint: 'U+05B0' },
  { char: '\u05B1', label: '◌ֱ', name: 'Hataf Segol (חֲטַף סֶגוֹל)', type: 'niqqud', description: 'So "e" breu reduït', codePoint: 'U+05B1' },
  { char: '\u05B2', label: '◌ֲ', name: 'Hataf Pattah (חֲטַף פַּתַּח)', type: 'niqqud', description: 'So "a" breu reduït', codePoint: 'U+05B2' },
  { char: '\u05B3', label: '◌ֳ', name: 'Hataf Qamats (חֲטַף קָמָץ)', type: 'niqqud', description: 'So "o" breu reduït', codePoint: 'U+05B3' },
  { char: '\u05B4', label: '◌ִ', name: 'Hiriq (חִירִיק)', type: 'niqqud', description: 'So "i" (com a "pí")', codePoint: 'U+05B4' },
  { char: '\u05B5', label: '◌ֵ', name: 'Tsere (צֵירֵי)', type: 'niqqud', description: 'So "e" llarg (com a "bé")', codePoint: 'U+05B5' },
  { char: '\u05B6', label: '◌ֶ', name: 'Segol (סֶגוֹל)', type: 'niqqud', description: 'So "e" curts (com a "festa")', codePoint: 'U+05B6' },
  { char: '\u05B7', label: '◌ַ', name: 'Pattah (פַּתַּח)', type: 'niqqud', description: 'So "a" curts', codePoint: 'U+05B7' },
  { char: '\u05B8', label: '◌ָ', name: 'Qamats (קָמָץ)', type: 'niqqud', description: 'So "a" llarg o "o" curta', codePoint: 'U+05B8' },
  { char: '\u05B9', label: '◌ֹ', name: 'Holam (חוֹלָם)', type: 'niqqud', description: 'So "o" superior', codePoint: 'U+05B9' },
  { char: '\u05BA', label: '◌ֺ', name: 'Holam Haser', type: 'niqqud', description: 'Holam reduït per a Vav', codePoint: 'U+05BA' },
  { char: '\u05BB', label: '◌ֻ', name: 'Kubutz (קֻבּוּץ)', type: 'niqqud', description: 'So "u" (tres punts en diagonal)', codePoint: 'U+05BB' },
  { char: '\u05BC', label: '◌ּ', name: 'Dagesh / Mappiq (דָּגֵשׁ)', type: 'niqqud', description: 'Punt central (duplica o enforteix)', codePoint: 'U+05BC' },
  { char: '\u05BD', label: '◌ Meteg', name: 'Meteg (מֶתֶג)', type: 'niqqud', description: 'Línia vertical d\'accentuació', codePoint: 'U+05BD' },
  { char: '\u05BF', label: '◌ֿ', name: 'Rafe (רָפֶה)', type: 'niqqud', description: 'Línia horitzontal superior de fricativa', codePoint: 'U+05BF' },
  { char: '\u05C1', label: '◌ׁ', name: 'Shin Dot (שִׁין)', type: 'niqqud', description: 'Punt a la dreta per al so SH (שׁ)', codePoint: 'U+05C1' },
  { char: '\u05C2', label: '◌ׂ', name: 'Sin Dot (שִׂין)', type: 'niqqud', description: 'Punt a l\'esquerra per al so S (שׂ)', codePoint: 'U+05C2' },
  { char: '\u05C4', label: '◌ׄ', name: 'Punctum Superior', type: 'niqqud', description: 'Punt superior de distinció', codePoint: 'U+05C4' },
  { char: '\u05C5', label: '◌ׅ', name: 'Punctum Inferior', type: 'niqqud', description: 'Punt inferior de distinció', codePoint: 'U+05C5' },
];

/**
 * 4. SIGNES DE PUNTUACIÓ HEBREUS I GENERALS
 */
export const HEBREW_PUNCTUATION: KeyboardKey[] = [
  { char: '׳', label: '׳', name: 'Geresh (גֶּרֶשׁ)', physicalKey: 'w', type: 'punctuation', description: 'Apostrof hebreu / abreviació / sons modificats (ג׳=j, צ׳=ch)', codePoint: 'U+05F3' },
  { char: '״', label: '״', name: 'Gershayim (גַּרְשַׁיִם)', type: 'punctuation', description: 'Cometes dobles hebrees per acrònims', codePoint: 'U+05F4' },
  { char: '־', label: '־', name: 'Maqaf (מַקָּף)', type: 'punctuation', description: 'Guionet o guió d\'unió hebreu', codePoint: 'U+05BE' },
  { char: '׃', label: '׃', name: 'Sof Pasuq (סוֹף פָּסוּק)', type: 'punctuation', description: 'Punt final o fi de versicle hebreu', codePoint: 'U+05C3' },
  { char: '₪', label: '₪', name: 'Xéquel (שֶׁקֶל)', type: 'punctuation', description: 'Símbol de la moneda israeliana', codePoint: 'U+05F2' },
  { char: '׆', label: '׆', name: 'Nun Hafukha', type: 'punctuation', description: 'Nun invertida', codePoint: 'U+05C6' },
  { char: '\'', label: '\'', name: 'Apostrof estàndard', type: 'punctuation', description: 'Apostrof comú' },
  { char: '"', label: '"', name: 'Cometes dobles', type: 'punctuation', description: 'Cometes estàndard' },
  { char: '-', label: '-', name: 'Guionet / Menys', type: 'punctuation', description: 'Guionet de text' },
  { char: '–', label: '–', name: 'Guió mitjà (En-dash)', type: 'punctuation', description: 'Guió d\'interval' },
  { char: '—', label: '—', name: 'Guió llarg (Em-dash)', type: 'punctuation', description: 'Guió d\'incís' },
  { char: '.', label: '.', name: 'Punt', type: 'punctuation', description: 'Punt' },
  { char: ',', label: ',', name: 'Coma', type: 'punctuation', description: 'Coma' },
  { char: ':', label: ':', name: 'Dos punts', type: 'punctuation', description: 'Dos punts' },
  { char: ';', label: ';', name: 'Punt i coma', type: 'punctuation', description: 'Punt i coma' },
  { char: '?', label: '?', name: 'Interrogació', type: 'punctuation', description: 'Signe d\'interrogació' },
  { char: '!', label: '!', name: 'Exclamació', type: 'punctuation', description: 'Signe d\'exclamació' },
  { char: '(', label: '(', name: 'Parèntesi obert', type: 'punctuation', description: 'Parèntesi' },
  { char: ')', label: ')', name: 'Parèntesi tancat', type: 'punctuation', description: 'Parèntesi' },
  { char: '[', label: '[', name: 'Corxet obert', type: 'punctuation', description: 'Corxet' },
  { char: ']', label: ']', name: 'Corxet tancat', type: 'punctuation', description: 'Corxet' },
  { char: '{', label: '{', name: 'Clau oberta', type: 'punctuation', description: 'Clau' },
  { char: '}', label: '}', name: 'Clau tancada', type: 'punctuation', description: 'Clau' },
  { char: '/', label: '/', name: 'Barra inclinada', type: 'punctuation', description: 'Barra' },
  { char: '\\', label: '\\', name: 'Barra inversa', type: 'punctuation', description: 'Barra inversa' },
  { char: '@', label: '@', name: 'Arroba', type: 'punctuation', description: 'Arroba' },
  { char: '#', label: '#', name: 'Coixinet', type: 'punctuation', description: 'Hashtag / Numero' },
  { char: '$', label: '$', name: 'Dòlar', type: 'punctuation', description: 'Moneda Dòlar' },
  { char: '€', label: '€', name: 'Euro', type: 'punctuation', description: 'Moneda Euro' },
  { char: '%', label: '%', name: 'Percentatge', type: 'punctuation', description: 'Percent' },
  { char: '+', label: '+', name: 'Més', type: 'punctuation', description: 'Símbol Més' },
  { char: '=', label: '=', name: 'Igual', type: 'punctuation', description: 'Símbol Igual' },
];

/**
 * 5. NÚMEROS I CARÀCTERS EN ANGLÈS PER A ACCÉS RÀPID
 */
export const NUMBERS_AND_ENGLISH: KeyboardKey[] = [
  { char: '1', label: '1', name: '1', type: 'number' },
  { char: '2', label: '2', name: '2', type: 'number' },
  { char: '3', label: '3', name: '3', type: 'number' },
  { char: '4', label: '4', name: '4', type: 'number' },
  { char: '5', label: '5', name: '5', type: 'number' },
  { char: '6', label: '6', name: '6', type: 'number' },
  { char: '7', label: '7', name: '7', type: 'number' },
  { char: '8', label: '8', name: '8', type: 'number' },
  { char: '9', label: '9', name: '9', type: 'number' },
  { char: '0', label: '0', name: '0', type: 'number' },
];

/**
 * 6. DISPOSICIÓ EN FILERES DEL TECLAT VIRTUAL (SIMULANT UN TECLAT FÍSIC)
 */
export const VIRTUAL_KEYBOARD_LAYOUT = {
  numbersRow: [
    { char: ';', label: '1  ;', sub: ';' },
    { char: '2', label: '2  "', sub: '"' },
    { char: '3', label: '3  £', sub: '£' },
    { char: '4', label: '4  $', sub: '$' },
    { char: '5', label: '5  %', sub: '%' },
    { char: '6', label: '6  ^', sub: '^' },
    { char: '7', label: '7  &', sub: '&' },
    { char: '8', label: '8  *', sub: '*' },
    { char: '9', label: '9  (', sub: '(' },
    { char: '0', label: '0  )', sub: ')' },
    { char: '-', label: '-  _', sub: '_' },
    { char: '=', label: '=  +', sub: '+' },
  ],
  topRow: [
    { char: '/', label: 'q /', sub: 'q' },
    { char: '׳', label: 'w ׳', sub: 'w' },
    { char: 'ק', label: 'e ק', sub: 'e' },
    { char: 'ר', label: 'r ר', sub: 'r' },
    { char: 'א', label: 't א', sub: 't' },
    { char: 'ט', label: 'y ט', sub: 'y' },
    { char: 'ו', label: 'u ו', sub: 'u' },
    { char: 'ן', label: 'i ן', sub: 'i' },
    { char: 'ם', label: 'o ם', sub: 'o' },
    { char: 'פ', label: 'p פ', sub: 'p' },
    { char: ']', label: '[ ]', sub: ']' },
    { char: '[', label: '] [', sub: '[' },
  ],
  homeRow: [
    { char: 'ש', label: 'a ש', sub: 'a' },
    { char: 'ד', label: 's ד', sub: 's' },
    { char: 'ג', label: 'd ג', sub: 'd' },
    { char: 'כ', label: 'f כ', sub: 'f' },
    { char: 'ע', label: 'g ע', sub: 'g' },
    { char: 'י', label: 'h י', sub: 'h' },
    { char: 'ח', label: 'j ח', sub: 'j' },
    { char: 'ל', label: 'k ל', sub: 'k' },
    { char: 'ך', label: 'l ך', sub: 'l' },
    { char: 'ף', label: '; ף', sub: ';' },
    { char: ',', label: '\' ,', sub: '\'' },
  ],
  bottomRow: [
    { char: 'ז', label: 'z ז', sub: 'z' },
    { char: 'ס', label: 'x ס', sub: 'x' },
    { char: 'ב', label: 'c ב', sub: 'c' },
    { char: 'ה', label: 'v ה', sub: 'v' },
    { char: 'נ', label: 'b נ', sub: 'b' },
    { char: 'מ', label: 'n מ', sub: 'n' },
    { char: 'צ', label: 'm צ', sub: 'm' },
    { char: 'ץ', label: '< ץ', sub: '<' },
    { char: 'ת', label: '> ת', sub: '>' },
    { char: '?', label: '? /', sub: '?' },
  ]
};
