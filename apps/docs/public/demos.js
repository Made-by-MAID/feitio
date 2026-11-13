// Os comportamentos dos exemplos do rascunho (abrir Dialog, filtrar, AM/PM...), uma vez cada.
try {
  for (const b of document.querySelectorAll('[data-cycle-demo]'))
    b?.addEventListener('click', () => {
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
    target?.addEventListener(
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
    header?.addEventListener('focusin', () => {
      delete header.dataset.hidden;
    });
  }
} catch (error) {
  console.warn(error);
}
try {
  for (const b of document.querySelectorAll('[data-cycle-demo]'))
    b?.addEventListener('click', () => {
      const f = document.getElementById('tf-demo');
      f.dataset.hourCycle = b.dataset.cycleDemo;
      for (const o of document.querySelectorAll('[data-cycle-demo]'))
        o.setAttribute('aria-pressed', String(o === b));
    });
} catch (error) {
  console.warn(error);
}
try {
  for (const b of document.querySelectorAll('[data-copy]')) {
    b?.addEventListener('click', async () => {
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
} catch (error) {
  console.warn(error);
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
try {
  for (const b of document.querySelectorAll('[data-result]'))
    b?.addEventListener('click', () => {
      resultP = b.dataset.result;
      for (const o of document.querySelectorAll('[data-result]'))
        o.setAttribute('aria-pressed', String(o === b));
    });
} catch (error) {
  console.warn(error);
}
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
try {
  for (const b of document.querySelectorAll('[data-cycle-set]'))
    b?.addEventListener('click', () => {
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
} catch (error) {
  console.warn(error);
}
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
try {
  for (const b of document.querySelectorAll('[data-density-set]'))
    b?.addEventListener('click', () => {
      const t = document.getElementById('densidade-tabela');
      if (b.dataset.densitySet) t.dataset.density = b.dataset.densitySet;
      else delete t.dataset.density;
      for (const o of document.querySelectorAll('[data-density-set]'))
        o.setAttribute('aria-pressed', String(o === b));
    });
} catch (error) {
  console.warn(error);
}
const menu = document.getElementById('menu-ordem');
const opener = document.querySelector('[popovertarget="menu-ordem"]');
menu?.addEventListener('beforetoggle', (e) => {
  if (e.newState !== 'open') return;
  const r = opener.getBoundingClientRect();
  menu.style.top = `${r.bottom + 8}px`;
  menu.style.left = `${r.left}px`;
});
try {
  addEventListener('scroll', () => menu.matches(':popover-open') && menu.hidePopover(), {
    passive: true,
  });
} catch (error) {
  console.warn(error);
}
try {
  // A curva de Bézier: acha o ponto da curva para cada instante (x) e devolve o avanço (y).
} catch (error) {
  console.warn(error);
}
function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1,
    bx = 3 * (x2 - x1) - cx,
    ax = 1 - cx - bx;
  const cy = 3 * y1,
    by = 3 * (y2 - y1) - cy,
    ay = 1 - cy - by;
  const X = (u) => ((ax * u + bx) * u + cx) * u,
    Y = (u) => ((ay * u + by) * u + cy) * u;
  const dX = (u) => (3 * ax * u + 2 * bx) * u + cx;
  return (x) => {
    let u = x;
    for (let i = 0; i < 8; i++) {
      const d = dX(u);
      if (Math.abs(d) < 1e-6) break;
      u -= (X(u) - x) / d;
    }
    return Y(Math.min(1, Math.max(0, u)));
  };
}
function play() {
  for (const c of document.querySelectorAll('.curve[data-bezier]')) {
    const ease = bezier(...c.dataset.bezier.split(',').map(Number));
    const dot = c.querySelector('.dot'),
      ball = c.querySelector('.ball'),
      track = c.querySelector('.track');
    const ms = Number(c.dataset.ms) * 4,
      start = performance.now();
    const frame = (now) => {
      const t = Math.min(1, (now - start) / ms),
        p = ease(t);
      dot.setAttribute('cx', 12 + 100 * t);
      dot.setAttribute('cy', 84 - 70 * p);
      ball.style.translate = `${p * (track.clientWidth - ball.offsetWidth)}px 0`;
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
}
try {
  document.getElementById('ver-de-novo')?.addEventListener('click', play);
} catch (error) {
  console.warn(error);
}
try {
  addEventListener('load', play);
} catch (error) {
  console.warn(error);
}
try {
  for (const piece of document.querySelectorAll('[data-drag]')) {
    const area = piece.parentElement;
    piece?.addEventListener('pointerdown', (e) => {
      piece.setPointerCapture(e.pointerId);
      const r = area.getBoundingClientRect(),
        p = piece.getBoundingClientRect();
      const dx = e.clientX - p.left,
        dy = e.clientY - p.top;
      const move = (ev) => {
        const x = Math.max(0, Math.min(r.width - p.width, ev.clientX - r.left - dx));
        const y = Math.max(0, Math.min(r.height - p.height, ev.clientY - r.top - dy));
        piece.style.translate = `${x - piece.offsetLeft}px ${y - piece.offsetTop}px`;
      };
      const up = () => {
        piece.removeEventListener('pointermove', move);
        piece.removeEventListener('pointerup', up);
      };
      piece?.addEventListener('pointermove', move);
      piece?.addEventListener('pointerup', up);
    });
  }
} catch (error) {
  console.warn(error);
}
const pgSample = document.getElementById('pg-sample');
const pgCode = document.querySelector('#pg-code pre code');
const pgState = { mode: '', density: '' };
function pgRender() {
  if (pgState.mode) pgSample.dataset.mode = pgState.mode;
  else delete pgSample.dataset.mode;
  if (pgState.density) pgSample.dataset.density = pgState.density;
  else delete pgSample.dataset.density;
  const attrs = [
    'data-theme="casa"',
    pgState.mode && `data-mode="${pgState.mode}"`,
    pgState.density && `data-density="${pgState.density}"`,
  ]
    .filter(Boolean)
    .join(' ');
  pgCode.textContent = `<div ${attrs}>…</div>`;
  if (typeof highlightHtml === 'function') pgCode.innerHTML = highlightHtml(pgCode.textContent);
}
try {
  for (const b of document.querySelectorAll('[data-pg]'))
    b?.addEventListener('click', () => {
      pgState[b.dataset.pg] = b.dataset.pgValue;
      for (const o of document.querySelectorAll(`[data-pg="${b.dataset.pg}"]`))
        o.setAttribute('aria-pressed', String(o === b));
      pgRender();
    });
} catch (error) {
  console.warn(error);
}
try {
  // Catálogo: filtra enquanto digita e copia o código de cada peça, dizendo "Copiado" no lugar.
} catch (error) {
  console.warn(error);
}
try {
  for (const b of document.querySelectorAll('[data-copy]')) {
    b?.addEventListener('click', async () => {
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

  // Na visão geral, um grupo sem nenhum componente visível some junto.
} catch (error) {
  console.warn(error);
}
const ovInput = document.getElementById('filtro-comp');
ovInput?.addEventListener('input', () => {
  for (const g of document.querySelectorAll('.comp-group'))
    g.hidden = ![...g.querySelectorAll('li')].some((li) => !li.hidden);
});
