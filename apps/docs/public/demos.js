// Os comportamentos dos exemplos do rascunho (abrir Dialog, filtrar, AM/PM...), uma vez cada.
for (const b of document.querySelectorAll('[data-cycle-demo]'))
  b.addEventListener('click', () => {
    const f = document.getElementById('tf-demo');
    f.dataset.hourCycle = b.dataset.cycleDemo;
    for (const o of document.querySelectorAll('[data-cycle-demo]'))
      o.setAttribute('aria-pressed', String(o === b));
  });
// AppShell: no mobile, o cabeçalho some ao rolar para baixo e volta ao rolar para cima.
for (const header of document.querySelectorAll('[data-hide-on-scroll]')) {
  const frame = header.closest('.feitio-app-frame');
  const menu = header.querySelector('.menu');
  const own = frame && getComputedStyle(frame).overflowY !== 'visible';
  const target = own ? frame : window;
  const pos = () => (own ? frame.scrollTop : scrollY);
  let last = pos();
  target.addEventListener(
    'scroll',
    () => {
      const y = pos();
      const mobile = menu && getComputedStyle(menu).display !== 'none';
      if (!mobile || y < header.offsetHeight) delete header.dataset.hidden;
      else if (y > last + 4) header.dataset.hidden = '';
      else if (y < last - 4) delete header.dataset.hidden;
      last = y;
    },
    { passive: true },
  );
  header.addEventListener('focusin', () => {
    delete header.dataset.hidden;
  });
}
for (const b of document.querySelectorAll('[data-cycle-demo]'))
  b.addEventListener('click', () => {
    const f = document.getElementById('tf-demo');
    f.dataset.hourCycle = b.dataset.cycleDemo;
    for (const o of document.querySelectorAll('[data-cycle-demo]'))
      o.setAttribute('aria-pressed', String(o === b));
  });
for (const b of document.querySelectorAll('[data-copy]')) {
  b.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(b.dataset.copy);
    } catch {
      return;
    }
    if (b.classList.contains('icon-tile')) {
      b.dataset.done = '';
      setTimeout(() => delete b.dataset.done, 1600);
      return;
    }
    const idle = b.innerHTML;
    b.innerHTML = '<span lang="pt-BR">Copiado</span><span lang="en">Copied</span>';
    setTimeout(() => {
      b.innerHTML = idle;
    }, 1600);
  });
}
const waitP = (ms) => new Promise((r) => setTimeout(r, ms));
const iconP = (n) =>
  `<svg class="feitio-icon" aria-hidden="true"><use href="../../feitio/icons/sprite.svg#feitio-${n}"/></svg>`;
const enP = () => document.documentElement.dataset.lang === 'en';
async function runStatus(host, slot, words, result, notice) {
  if (host.dataset.state) return;
  const label = host.querySelector('.feitio-status .label');
  slot.innerHTML = '';
  host.dataset.state = 'loading';
  host.setAttribute('aria-busy', 'true');
  label.textContent = words.loading[enP() ? 1 : 0];
  await waitP(1200);
  host.dataset.state = result;
  label.textContent = words[result][enP() ? 1 : 0];
  host.removeAttribute('aria-busy');
  await waitP(result === 'ok' ? 900 : 1100);
  delete host.dataset.state;
  label.textContent = '';
  slot.innerHTML = notice[result];
  if (result === 'error') slot.firstElementChild?.focus();
}
const noticeP = (status, icon, pt, en, dpt, den) =>
  `<div class="feitio-notice" data-status="${status}"${status === 'error' ? ' tabindex="-1"' : ''}>${iconP(icon)}<strong><span lang="pt-BR">${pt}</span><span lang="en">${en}</span></strong><p><span lang="pt-BR">${dpt}</span><span lang="en">${den}</span></p></div>`;
const dlgApagar = document.getElementById('dlg-apagar');
dlgApagar?.addEventListener('close', () => {
  if (dlgApagar.returnValue !== 'apagar') return;
  runStatus(
    document.getElementById('detalhe'),
    document.getElementById('detalhe-aviso'),
    { loading: ['Apagando…', 'Deleting…'], ok: ['Apagado', 'Deleted'] },
    'ok',
    {
      ok: noticeP(
        'ok',
        'check',
        'Agendamento apagado',
        'Schedule deleted',
        'Na aplicação de verdade, a pessoa volta para a lista com este aviso.',
        'In a real app, the person goes back to the list with this notice.',
      ),
    },
  );
});
let resultP = 'ok';
for (const b of document.querySelectorAll('[data-result]'))
  b.addEventListener('click', () => {
    resultP = b.dataset.result;
    for (const o of document.querySelectorAll('[data-result]'))
      o.setAttribute('aria-pressed', String(o === b));
  });
const formR = document.getElementById('form-lembrete');
formR?.addEventListener('submit', (e) => {
  e.preventDefault();
  runStatus(
    formR,
    document.getElementById('form-aviso'),
    {
      loading: ['Salvando…', 'Saving…'],
      ok: ['Salvo', 'Saved'],
      error: ['Não salvou', 'Not saved'],
    },
    resultP,
    {
      ok: noticeP(
        'ok',
        'check',
        'Lembrete salvo',
        'Reminder saved',
        'Já aparece na lista.',
        'It already shows in the list.',
      ),
      error: noticeP(
        'error',
        'close',
        'Não deu para salvar',
        'Could not save',
        'A conexão caiu. O que você escreveu continua aqui; tente de novo.',
        'The connection dropped. What you wrote is still here; try again.',
      ),
    },
  );
});
for (const b of document.querySelectorAll('[data-cycle-set]'))
  b.addEventListener('click', () => {
    const f = document.getElementById('fp-hora'),
      h = f.querySelector('.seg');
    let n = Number(h.value) || 0;
    const was = f.dataset.hourCycle,
      pm = f.querySelector('.period').textContent === 'PM';
    if (was === '24' && b.dataset.cycleSet === '12') {
      f.querySelector('.period').textContent = n >= 12 ? 'PM' : 'AM';
      n = n % 12 || 12;
    }
    if (was === '12' && b.dataset.cycleSet === '24') {
      n = (n % 12) + (pm ? 12 : 0);
    }
    h.value = String(n).padStart(2, '0');
    f.dataset.hourCycle = b.dataset.cycleSet;
    for (const o of document.querySelectorAll('[data-cycle-set]'))
      o.setAttribute('aria-pressed', String(o === b));
  });
const formF = document.getElementById('form-padrao');
formF?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = formF.querySelector('#fp-nome'),
    err = document.getElementById('fp-nome-erro');
  const bad = !name.value.trim();
  name.setAttribute('aria-invalid', String(bad));
  err.hidden = !bad;
  if (bad) {
    name.focus();
    return;
  }
  runStatus(
    formF,
    document.getElementById('fp-aviso'),
    { loading: ['Salvando…', 'Saving…'], ok: ['Salvo', 'Saved'] },
    'ok',
    {
      ok: noticeP(
        'ok',
        'check',
        'Lembrete criado',
        'Reminder created',
        'Ele dispara no horário que você escolheu.',
        'It goes off at the time you picked.',
      ),
    },
  );
});
