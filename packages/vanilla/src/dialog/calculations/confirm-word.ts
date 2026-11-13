/** Whether what was typed is the confirming word: case and the spaces around it do not matter. */
export function typedTheWord(typed: string, word: string): boolean {
  return typed.trim().toUpperCase() === word.trim().toUpperCase() && word.trim() !== '';
}
