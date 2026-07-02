/* ── SIGNIFY SIGNS.JS ── tile grid + modal for alphabets / numbers / words ── */

/* ─── DATA ─── */
const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => ({
  id: l, main: l, label: `Letter ${l}`,
  gif: `img/alphabets/${l}.gif`,
  desc: `The ASL fingerspelling sign for the letter "${l}".`
}));

const NUMBERS = Array.from({ length: 10 }, (_, n) => ({
  id: String(n), main: String(n), label: `Number ${n}`,
  gif: `img/numbers/${n}.gif`,
  desc: `The ASL number sign for "${n}".`
}));

const WORDS = [
  { id:'hello',    main:'👋', label:'Hello',    gif:'img/words/hello.gif',     desc:'A common greeting in sign language.' },
  { id:'thankyou', main:'🙏', label:'Thank You', gif:'img/words/thankyou.gif',  desc:'Express gratitude using this sign.' },
  { id:'sorry',    main:'😔', label:'Sorry',     gif:'img/words/sorry.gif',     desc:'Apologise with this hand movement.' },
  { id:'please',   main:'🤲', label:'Please',    gif:'img/words/please.gif',    desc:'A polite way to make a request.' },
  { id:'yes',      main:'✅', label:'Yes',       gif:'img/words/yes.gif',       desc:'A simple nod-like hand gesture.' },
  { id:'no',       main:'✋', label:'No',        gif:'img/words/no.gif',        desc:'Shake two fingers to say no.' },
  { id:'help',     main:'🆘', label:'Help',      gif:'img/words/help.gif',      desc:'Ask for assistance with this sign.' },
  { id:'love',     main:'❤️', label:'Love',      gif:'img/words/love.gif',      desc:'Cross arms over your chest.' },
  { id:'friend',   main:'🤝', label:'Friend',    gif:'img/words/friend.gif',    desc:'Interlock fingers to show friendship.' },
  { id:'family',   main:'👨‍👩‍👧', label:'Family',   gif:'img/words/family.gif',   desc:'A sweeping gesture for family.' },
  { id:'eat',      main:'🍽️', label:'Eat',       gif:'img/words/eat.gif',       desc:'Bring hand to mouth to sign "eat".' },
  { id:'water',    main:'💧', label:'Water',     gif:'img/words/water.gif',     desc:'Tap your chin with a W handshape.' },
  { id:'home',     main:'🏠', label:'Home',      gif:'img/words/home.gif',      desc:'Touch fingertips to cheek then chin.' },
  { id:'school',   main:'🎓', label:'School',    gif:'img/words/school.gif',    desc:'Clap hands together twice.' },
  { id:'happy',    main:'😊', label:'Happy',     gif:'img/words/happy.gif',     desc:'Brush hand upward on chest.' },
  { id:'good',     main:'👍', label:'Good',      gif:'img/words/good.gif',      desc:'Bring flat hand from chin forward.' },
  { id:'morning',  main:'🌅', label:'Morning',   gif:'img/words/morning.gif',   desc:'Raise arm like the rising sun.' },
  { id:'night',    main:'🌙', label:'Night',     gif:'img/words/night.gif',     desc:'Arc wrist downward over forearm.' },
  { id:'bathroom', main:'🚿', label:'Bathroom',  gif:'img/words/bathroom.gif',  desc:'Shake a T handshape back and forth.' },
  { id:'hungry',   main:'🍕', label:'Hungry',    gif:'img/words/hungry.gif',    desc:'C-hand slides down chest.' },
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
  document.getElementById('modalPath').textContent = item.gif;

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