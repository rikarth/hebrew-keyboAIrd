import { TextStats } from '../types';

/**
 * Insereix un caràcter o text en la posició actual del cursor d'un HTMLTextAreaElement.
 */
export function insertTextAtCursor(
  textarea: HTMLTextAreaElement | null,
  currentText: string,
  textToInsert: string
): { newText: string; newCursorPos: number } {
  if (!textarea) {
    return {
      newText: currentText + textToInsert,
      newCursorPos: currentText.length + textToInsert.length,
    };
  }

  const start = textarea.selectionStart ?? currentText.length;
  const end = textarea.selectionEnd ?? currentText.length;

  const newText =
    currentText.substring(0, start) +
    textToInsert +
    currentText.substring(end);

  const newCursorPos = start + textToInsert.length;

  return { newText, newCursorPos };
}

/**
 * Esborra el caràcter anterior a la posició del cursor (Backspace).
 */
export function backspaceAtCursor(
  textarea: HTMLTextAreaElement | null,
  currentText: string
): { newText: string; newCursorPos: number } {
  if (!textarea) {
    if (currentText.length === 0) return { newText: '', newCursorPos: 0 };
    const newText = currentText.slice(0, -1);
    return { newText, newCursorPos: newText.length };
  }

  const start = textarea.selectionStart ?? currentText.length;
  const end = textarea.selectionEnd ?? currentText.length;

  if (start !== end) {
    // Si hi ha text seleccionat, esborra la selecció
    const newText = currentText.substring(0, start) + currentText.substring(end);
    return { newText, newCursorPos: start };
  }

  if (start === 0) {
    return { newText: currentText, newCursorPos: 0 };
  }

  // Si el caràcter anterior és un Niqqud (combining mark in Unicode range U+0591-U+05C7),
  // esborrem només aquest punt de combinació o el cluster
  const newText = currentText.substring(0, start - 1) + currentText.substring(start);
  return { newText, newCursorPos: start - 1 };
}

/**
 * Esborra el caràcter següent a la posició del cursor (Delete).
 */
export function deleteAtCursor(
  textarea: HTMLTextAreaElement | null,
  currentText: string
): { newText: string; newCursorPos: number } {
  if (!textarea) return { newText: currentText, newCursorPos: currentText.length };

  const start = textarea.selectionStart ?? currentText.length;
  const end = textarea.selectionEnd ?? currentText.length;

  if (start !== end) {
    const newText = currentText.substring(0, start) + currentText.substring(end);
    return { newText, newCursorPos: start };
  }

  if (start >= currentText.length) {
    return { newText: currentText, newCursorPos: currentText.length };
  }

  const newText = currentText.substring(0, start) + currentText.substring(start + 1);
  return { newText, newCursorPos: start };
}

/**
 * Calcula les estadístiques del text (caràcters, paraules, lletres hebrees, niqudot).
 */
export function calculateTextStats(text: string): TextStats {
  const characters = text.length;
  
  // Paraules: separats per espais i salts de línia
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  
  // Compte de lletres hebrees (U+05D0 fins a U+05EA)
  const hebrewLetterRegex = /[\u05D0-\u05EA]/g;
  const hebrewMatches = text.match(hebrewLetterRegex);
  const hebrewLetters = hebrewMatches ? hebrewMatches.length : 0;

  // Compte de Niqudot / Punts de vocalització (U+05B0 fins a U+05C7)
  const niqqudRegex = /[\u05B0-\u05C7]/g;
  const niqqudMatches = text.match(niqqudRegex);
  const niqqudCount = niqqudMatches ? niqqudMatches.length : 0;

  // Línies
  const lines = text ? text.split('\n').length : 1;

  return {
    characters,
    words,
    hebrewLetters,
    niqqudCount,
    lines,
  };
}
