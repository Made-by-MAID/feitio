// O site de documentação do Feitio: dia e noite, cabeçalho que some ao rolar (mobile), o índice que
// acompanha a rolagem, copiar código, a busca (Pagefind) e os detalhes do DocPage.
const root = document.documentElement;
const base = root.dataset.base || '/';
const icon = (n) =>
  `<svg class="feitio-icon" aria-hidden="true"><use href="${base}feitio/icons/sprite.svg#feitio-${n}"/></svg>`;
const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- Luz: a escolha fica guardada. O idioma é a página: cada idioma tem as suas.
const saved = (k) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const save = (k, v) => {
  try {
    v ? localStorage.setItem(k, v) : localStorage.removeItem(k);
  } catch {}
};
function setMode(mode) {
  if (mode) root.dataset.mode = mode;
  else delete root.dataset.mode;
  save('feitio-mode', mode);
  for (const b of document.querySelectorAll('[data-mode-set]'))
    b.setAttribute('aria-pressed', String(b.dataset.modeSet === (mode || '')));
}
setMode(saved('feitio-mode') || '');
for (const b of document.querySelectorAll('[data-mode-set]'))
  b.addEventListener('click', () => setMode(b.dataset.modeSet));

// ---- Cabeçalho: no mobile, some ao rolar para baixo e volta ao rolar para cima.
const header = document.querySelector('.site-header');
let lastY = scrollY;
addEventListener(
  'scroll',
  () => {
    const y = scrollY;
    const mobile = getComputedStyle(header.querySelector('.menu')).display !== 'none';
    if (!mobile || y < header.offsetHeight) delete header.dataset.hidden;
    else if (y > lastY + 4) header.dataset.hidden = '';
    else if (y < lastY - 4) delete header.dataset.hidden;
    lastY = y;
  },
  { passive: true },
);
header.addEventListener('focusin', () => {
  delete header.dataset.hidden;
});

// ---- Anchor: marca o trecho em que a pessoa está.
const headings = [...document.querySelectorAll('.site-main h2[id], .site-main h3[id]')];
function spy() {
  let current = headings[0];
  for (const h of headings) if (h.getBoundingClientRect().top < 140) current = h;
  if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) current = headings.at(-1);
  for (const a of document.querySelectorAll('.feitio-anchor a')) {
    if (current && a.getAttribute('href') === `#${current.id}`)
      a.setAttribute('aria-current', 'location');
    else a.removeAttribute('aria-current');
  }
}
if (headings.length) {
  addEventListener('scroll', spy, { passive: true });
  spy();
}
for (const a of document.querySelectorAll('.toc-mobile .feitio-anchor a'))
  a.addEventListener('click', () => {
    a.closest('details').open = false;
  });

// ---- CodeBlock: copia e diz "Copiado" no próprio botão.
for (const b of document.querySelectorAll('.feitio-code .copy')) {
  const idle = b.innerHTML;
  b.addEventListener('click', async () => {
    const text = b.closest('.feitio-code').querySelector('pre:not([hidden])').textContent;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    b.dataset.done = '';
    b.innerHTML = `${icon('check')}${b.dataset.doneLabel || 'Copiado'}`;
    setTimeout(() => {
      delete b.dataset.done;
      b.innerHTML = idle;
    }, 1600);
  });
}

// ---- Busca: "/" ou Ctrl+K abre. O índice é do Pagefind, gerado na publicação, um por idioma; os
// resultados são links, e os títulos desta página entram primeiro.
const plain = (s) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
const dlg = document.getElementById('busca');
const field = dlg?.querySelector('input');
const list = dlg?.querySelector('.results');
const empty = dlg?.querySelector('.empty');
const hereLabel = dlg?.dataset.hereLabel || '';
let pagefind;
async function loadPagefind() {
  if (pagefind !== undefined) return pagefind;
  try {
    pagefind = await import(`${base}pagefind/pagefind.js`);
    await pagefind.options({ baseUrl: base });
  } catch {
    pagefind = null;
  }
  return pagefind;
}
let asked = 0;
async function render() {
  const q = field.value.trim();
  const ticket = ++asked;
  const here = headings
    .filter((h) => !q || plain(h.textContent).includes(plain(q)))
    .slice(0, 4)
    .map((h) => ({ url: `#${h.id}`, title: h.textContent.trim(), where: hereLabel }));
  let found = [];
  const pf = q ? await loadPagefind() : null;
  if (pf) {
    const results = await pf.debouncedSearch(q, {}, 150);
    if (results)
      found = await Promise.all(
        results.results.slice(0, 8).map(async (r) => {
          const d = await r.data();
          return { url: d.url, title: d.meta.title, where: d.meta.area || '' };
        }),
      );
  }
  if (ticket !== asked) return;
  const all = [...here, ...found].slice(0, 10);
  list.innerHTML = all
    .map(
      (p, i) =>
        `<li><a href="${p.url}"${i === 0 && q ? ' data-active' : ''}><strong>${p.title}</strong><small>${p.where}</small></a></li>`,
    )
    .join('');
  empty.hidden = all.length > 0 || !q;
}
function openSearch() {
  if (!dlg || dlg.open) return;
  field.value = '';
  render();
  dlg.showModal();
  field.focus();
  loadPagefind();
}
if (dlg) {
  field.addEventListener('input', render);
  field.addEventListener('keydown', (e) => {
    const first = list.querySelector('a');
    if (e.key === 'Enter' && first && field.value.trim()) {
      e.preventDefault();
      location.href = first.href;
      dlg.close();
    }
    if (e.key === 'ArrowDown' && first) {
      e.preventDefault();
      first.focus();
    }
  });
  list.addEventListener('keydown', (e) => {
    const links = [...list.querySelectorAll('a')],
      i = links.indexOf(document.activeElement);
    if (e.key === 'ArrowDown' && i < links.length - 1) {
      e.preventDefault();
      links[i + 1].focus();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      (i > 0 ? links[i - 1] : field).focus();
    }
  });
  list.addEventListener('click', (e) => {
    if (e.target.closest('a')) dlg.close();
  });
  for (const b of document.querySelectorAll('[data-open-search]'))
    b.addEventListener('click', openSearch);
  addEventListener('keydown', (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName);
    if ((e.key === '/' && !typing) || (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey))) {
      e.preventDefault();
      openSearch();
    }
  });
}

// ---- Details: toda abertura e todo fechamento animam a altura (sem script, abre direto).
const motionOff = () => still() || root.dataset.motion === 'direct';
for (const box of document.querySelectorAll('details')) {
  const summary = box.querySelector('summary');
  let running = null;
  summary.addEventListener('click', (event) => {
    if (motionOff()) return;
    event.preventDefault();
    running?.cancel();
    const cs = getComputedStyle(box);
    const edges = ['paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth'].reduce(
      (n, k) => n + parseFloat(cs[k]),
      0,
    );
    const closed = `${summary.getBoundingClientRect().height + edges}px`;
    const timing = { duration: 320, easing: 'cubic-bezier(0.3, 0, 0.2, 1)' };
    const wasClosing = box.dataset.closing !== undefined;
    if (!box.open || wasClosing) {
      const from = wasClosing ? `${box.getBoundingClientRect().height}px` : closed;
      delete box.dataset.closing;
      box.open = true;
      const to = `${box.getBoundingClientRect().height}px`;
      running = box.animate(
        [
          { height: from, overflow: 'hidden' },
          { height: to, overflow: 'hidden' },
        ],
        timing,
      );
    } else {
      box.dataset.closing = '';
      running = box.animate(
        [
          { height: `${box.getBoundingClientRect().height}px`, overflow: 'hidden' },
          { height: closed, overflow: 'hidden' },
        ],
        timing,
      );
      running.onfinish = () => {
        box.open = false;
        delete box.dataset.closing;
      };
    }
  });
}

// ---- Anchor e links da própria página: rolam suave até a seção, e o endereço acompanha.
for (const a of document.querySelectorAll('a[href^="#"]:not(.feitio-back-to-top)')) {
  a.addEventListener('click', (event) => {
    const id = a.getAttribute('href').slice(1);
    const target = id && document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: motionOff() ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
    if (target.matches('main, [tabindex]')) target.focus({ preventScroll: true });
  });
}

// ---- CodeBlock: cores de HTML, montadas a partir do texto (o Copiar copia o texto puro).
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function highlightHtml(src) {
  return src.replace(
    /(<!--[\s\S]*?-->)|(<\/?)([\w-]+)([^>]*?)(\/?>)|([^<]+)|(<)/g,
    (_m, com, open, name, attrs, close, text, lt) => {
      if (com) return `<span class="c-comment">${esc(com)}</span>`;
      if (name) {
        const a = attrs.replace(
          /([\w:-]+)(?:(=)("[^"]*"|'[^']*'|[^\s"'>]+))?/g,
          (_mm, an, eq, val) =>
            `<span class="c-attr">${esc(an)}</span>${eq ? '<span class="c-punct">=</span>' : ''}${val ? `<span class="c-value">${esc(val)}</span>` : ''}`,
        );
        return `<span class="c-punct">${esc(open)}</span><span class="c-tag">${name}</span>${a}<span class="c-punct">${esc(close)}</span>`;
      }
      return esc(text ?? lt);
    },
  );
}
for (const c of document.querySelectorAll(
  '.feitio-code:is([data-lang="html"], [data-lang="jsx"]) pre code',
))
  c.innerHTML = highlightHtml(c.textContent);

// ScrollFade e BackToTop: @feitio/vanilla (scrolls), ligados no DocPage.

// ---- Busca: não é uma decisão, então um toque fora fecha (o Dialog de confirmar continua só
// fechando com uma resposta). closedby="any" onde o navegador já entende; o clique conferido
// pela posição, onde não entende.
if (dlg) {
  dlg.setAttribute('closedby', 'any');
  dlg.addEventListener('click', (e) => {
    if (e.target !== dlg) return;
    const r = dlg.getBoundingClientRect();
    const inside =
      e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) dlg.close();
  });
}

// ---- Gerenciador de pacotes: uma escolha para todos os blocos, guardada.
function setPm(pm) {
  for (const b of document.querySelectorAll('[data-pm-set]'))
    b.setAttribute('aria-pressed', String(b.dataset.pmSet === pm));
  for (const pre of document.querySelectorAll('pre[data-pm]')) pre.hidden = pre.dataset.pm !== pm;
  save('feitio-pm', pm);
}
if (document.querySelector('[data-pm-set]')) {
  setPm(saved('feitio-pm') || 'npm');
  for (const b of document.querySelectorAll('[data-pm-set]'))
    b.addEventListener('click', () => setPm(b.dataset.pmSet));
}

// ---- Anatomia: as setas à mão, recalculadas quando o tamanho, a letra ou o idioma mudam.
function drawSketches() {
  for (const box of document.querySelectorAll('.sketch-anatomy')) {
    const svg = box.querySelector('svg.sketch');
    if (getComputedStyle(svg).display === 'none') continue;
    const origin = box.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${origin.width} ${origin.height}`);
    // Cada seta sai pelo lado livre da peça (data-exit: right, o padrão, up ou down),
    // corre por fora das peças e só faz a curva no vão entre as peças e as notas.
    const parts = box.querySelector('.parts').getBoundingClientRect();
    const gx = parts.right - origin.left + 10;
    const items = [];
    for (const note of box.querySelectorAll('[data-note]')) {
      const part = box.querySelector(`[data-part="${note.dataset.note}"]`);
      if (!part) continue;
      items.push({
        p: part.getBoundingClientRect(),
        n: note.getBoundingClientRect(),
        exit: part.dataset.exit || 'right',
      });
    }
    // Quem está mais à esquerda corre na raia mais afastada, para as setas não se cruzarem.
    for (const dir of ['up', 'down']) {
      const list = items.filter((it) => it.exit === dir).sort((a, b) => a.p.left - b.p.left);
      list.forEach((it, i) => {
        it.lane = 10 + 10 * (list.length - 1 - i);
      });
    }
    const paths = [];
    for (const { p, n, exit, lane } of items) {
      const x2 = n.left - origin.left - 10,
        y2 = n.top - origin.top + Math.min(n.height / 2, 10);
      let d, ys;
      if (exit === 'right') {
        const x1 = p.right - origin.left + 6;
        ys = p.top - origin.top + Math.min(p.height / 2, 14);
        d = `M${x1} ${ys + 0.6} L${gx} ${ys}`;
      } else {
        const cx = p.left - origin.left + Math.min(p.width / 2, 28),
          r = 5;
        const up = exit === 'up';
        const y0 = up ? p.top - origin.top - 4 : p.bottom - origin.top + 4;
        ys = up ? parts.top - origin.top - lane : parts.bottom - origin.top + lane;
        d = `M${cx} ${y0} L${cx + 0.6} ${up ? ys + r : ys - r} Q${cx} ${ys} ${cx + r} ${ys} L${gx} ${ys + 0.5}`;
      }
      const dx = x2 - gx;
      if (dx < 16) continue;
      const c2x = x2 - dx * 0.5,
        c2y = y2 + (ys - y2) * 0.12;
      d += ` C${gx + dx * 0.5} ${ys + 0.8} ${c2x} ${c2y} ${x2} ${y2}`;
      paths.push(d);
      const ang = Math.atan2(y2 - c2y, x2 - c2x);
      const len = 9,
        spread = 0.5;
      const ax = x2 - len * Math.cos(ang - spread),
        ay = y2 - len * Math.sin(ang - spread);
      const bx = x2 - len * Math.cos(ang + spread),
        by = y2 - len * Math.sin(ang + spread);
      paths.push(
        `M${ax - 0.6} ${ay - 0.4} L${x2 + 1.4 * Math.cos(ang)} ${y2 + 1.4 * Math.sin(ang)}`,
      );
      paths.push(
        `M${bx + 0.5} ${by + 0.6} L${x2 + 1.1 * Math.cos(ang)} ${y2 + 0.9 * Math.sin(ang)}`,
      );
    }
    svg.innerHTML = paths.map((d) => `<path d="${d}"/>`).join('');
  }
}
addEventListener('load', drawSketches);
addEventListener('resize', drawSketches);
document.fonts?.ready.then(drawSketches);

// ---- Navegação lateral: guarda onde a lista estava e garante que o item atual apareça, sem saltar.
const sideList = document.querySelector('.site-side .side-inner');
if (sideList) {
  try {
    const y = sessionStorage.getItem('feitio-side-scroll');
    if (y) sideList.scrollTop = Number(y);
  } catch {}
  const cur = sideList.querySelector('[aria-current="page"]');
  if (cur) {
    const top =
        cur.getBoundingClientRect().top - sideList.getBoundingClientRect().top + sideList.scrollTop,
      bottom = top + cur.offsetHeight;
    if (top < sideList.scrollTop || bottom > sideList.scrollTop + sideList.clientHeight - 48)
      sideList.scrollTop = top - sideList.clientHeight / 3;
  }
  addEventListener('pagehide', () => {
    try {
      sessionStorage.setItem('feitio-side-scroll', String(sideList.scrollTop));
    } catch {}
  });
}

// ---- Footer: os anos. Um ano só enquanto for o mesmo; "2026–2027" quando virar.
for (const y of document.querySelectorAll('[data-since]')) {
  const since = Number(y.dataset.since),
    now = new Date().getFullYear();
  y.textContent = now > since ? `${since}–${now}` : String(since);
}
