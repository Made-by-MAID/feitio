import { typedTheWord } from '../calculations/confirm-word.ts';

/**
 * Wires the Dialogs of a page by delegation: a button with data-open-dialog="id" opens that Dialog
 * (modal, centered, closing only with an answer), the focus goes to its field when it asks for a
 * typed word, and that form's danger button only turns on with the right word (data-type-to-confirm).
 * Closing empties the field and turns the button off again.
 */
export function wireDialogs(window: Window, root: Document | HTMLElement): void {
  const document = window.document;
  root.addEventListener('click', (event) => {
    const opener = (event.target as HTMLElement).closest<HTMLElement>('[data-open-dialog]');
    if (!opener) return;
    const dialog = document.getElementById(
      opener.dataset.openDialog ?? '',
    ) as HTMLDialogElement | null;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    dialog.querySelector<HTMLInputElement>('[data-type-to-confirm] input')?.focus();
    dialog.addEventListener(
      'close',
      () => {
        const form = dialog.querySelector<HTMLElement>('[data-type-to-confirm]');
        const input = form?.querySelector<HTMLInputElement>('input');
        const danger = form?.querySelector<HTMLButtonElement>('[data-variant="danger"]');
        if (input) input.value = '';
        if (danger) danger.disabled = true;
      },
      { once: true },
    );
  });
  root.addEventListener('input', (event) => {
    const input = event.target as HTMLInputElement;
    const form = input.closest<HTMLElement>('[data-type-to-confirm]');
    if (!form) return;
    const danger = form.querySelector<HTMLButtonElement>('[data-variant="danger"]');
    if (danger) danger.disabled = !typedTheWord(input.value, form.dataset.typeToConfirm ?? '');
  });
}
