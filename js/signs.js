/* ── SIGNIFY SIGNS.JS ── tile grid + modal for alphabets / numbers / words ── */

/* ─── DATA ─── */
const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => ({
  id: l, main: l, label: `Letter ${l}`,
  gif: `img/${l}.gif`,
  desc: `The ASL fingerspelling sign for the letter "${l}".`
}));

const NUMBERS = Array.from({ length: 10 }, (_, n) => ({
  id: String(n), main: String(n), label: `Number ${n}`,
  gif: `img/${n}.gif`,
  desc: `The ASL number sign for "${n}".`
}));

const WORDS = [
  { id:'hello',    main:'👋', label:'Hello',    gif:'img/Hello.gif',     desc:'A common greeting in sign language.' },
  { id:'thankyou', main:'🙏', label:'Thank You', gif:'img/ThankYou.gif',  desc:'Express gratitude using this sign.' },
  { id:'sorry',    main:'😔', label:'Sorry',     gif:'img/Sorry.gif',     desc:'Apologise with this hand movement.' },
  { id:'please',   main:'🤲', label:'Please',    gif:'img/Please.gif',    desc:'A polite way to make a request.' },
  { id:'yes',      main:'✅', label:'Yes',       gif:'img/Yes.gif',       desc:'A simple nod-like hand gesture.' },
  { id:'no',       main:'✋', label:'No',        gif:'img/No.gif',        desc:'Shake two fingers to say no.' },
  { id:'love',     main:'❤️', label:'Love',      gif:'img/Love.gif',      desc:'Cross arms over your chest.' },
  { id:'happy',    main:'😊', label:'Happy',     gif:'img/Happy.gif',     desc:'Brush hand upward on chest.' },
  { id:'Nice-To-Meet-You', main:'👍', label:'Nice to Meet You', gif:'img/Nice-To-Meet-You.gif', desc:'A friendly greeting in sign language.' },
  { id:'Applause',  main:'👏', label:'Applause',   gif:'img/Applause.gif',   desc:'Clap hands together twice.' },
  { id:'Beautiful',    main:'🌸', label:'Beautiful',     gif:'img/Beautiful.gif',     desc:'Compliment someone on their appearance.' },
  { id:'Cool', main:'🆒', label:'Cool',  gif:'img/Cool.gif',  desc:'Shake a T handshape back and forth.' },
  { id:'Understand',   main:'🍕', label:'Understand',    gif:'img/Understand.gif',    desc:'C-hand slides down chest.' },
];

/* ─── RENDER GRID ─── */
function renderGrid(type) {
  const grid = document.getElementById('tilesGrid');
  const search = document.getElementById('tileSearch');
  if (!grid) return;

  const data = type === 'alphabets' ? ALPHABETS : type === 'numbers' ? NUMBERS : WORDS;

  function render(filter = '') {
    const filtered = filter
      ? data.filter(d => d.label.toLowerCase().includes(filter.toLowerCase()) || d.id.toLowerCase().includes(filter.toLowerCase()))
      : data;

    grid.innerHTML = filtered.length ? filtered.map((item, i) => `
      <div class="sign-tile reveal" style="transition-delay:${Math.min(i * 0.04, 0.5)}s"
           data-id="${item.id}" data-type="${type}"
           tabindex="0" role="button" aria-label="${item.label}">
        <span class="${type === 'alphabets' || type === 'numbers' ? 'tile-main' : 'tile-emoji'}">${item.main}</span>
        <span class="tile-label">${item.label}</span>
      </div>
    `).join('') : `<p style="grid-column:1/-1;text-align:center;color:rgba(55,67,117,.5);padding:40px">No results for "${filter}"</p>`;

    /* re-observe for reveal */
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
      }, { threshold: 0.08 });
      grid.querySelectorAll('.sign-tile').forEach(el => io.observe(el));
    } else {
      grid.querySelectorAll('.sign-tile').forEach(el => el.classList.add('visible'));
    }

    /* click/keyboard handlers */
    grid.querySelectorAll('.sign-tile').forEach(tile => {
      const id = tile.dataset.id;
      const item = data.find(d => d.id === id);
      tile.addEventListener('click', () => openModal(item));
      tile.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(item); } });
    });
  }

  render();
  search?.addEventListener('input', e => render(e.target.value));
}

/* ─── MODAL ─── */
function openModal(item) {
  const overlay = document.getElementById('signModal');
  if (!overlay) return;

  document.getElementById('modalTitle').textContent = item.label;
  document.getElementById('modalDesc').textContent = item.desc;

  const frame = document.getElementById('modalGifFrame');
  frame.innerHTML = `<img src="${item.gif}" alt="${item.label}" onerror="this.style.display='none';document.getElementById('modalPlaceholder').style.display='flex'">`;
  const placeholder = document.getElementById('modalPlaceholder');
  placeholder.style.display = 'none';
  placeholder.querySelector('.modal-gif-placeholder').textContent = item.main;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('signModal');
  overlay?.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  document.getElementById('signModal')?.addEventListener('click', e => { if (e.target.id === 'signModal') closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* detect page type */
  const page = document.body.dataset.page;
  if (page) renderGrid(page);
});