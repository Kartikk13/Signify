/* ═══════════════════════════════════════════════════════
   SIGNIFY — SIGNS.JS
   Tile grid renderer + modal with left/right navigation
═══════════════════════════════════════════════════════ */

/* ─── DATA ────────────────────────────────────────── */
const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => ({
  id: l,
  main: l,
  label: `Letter ${l}`,
  gif: `img/${l}.gif`,
  desc: `The ASL fingerspelling sign for the letter "${l}".`
}));

const NUMBERS = Array.from({ length: 10 }, (_, n) => ({
  id: String(n),
  main: String(n),
  label: `Number ${n}`,
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

/* ─── STATE ───────────────────────────────────────── */
// These track what's currently open in the modal
let activeData  = [];   // the current filtered list visible in the grid
let activeIndex = 0;    // which item is open right now

/* ─── RENDER GRID ─────────────────────────────────── */
function renderGrid(type) {
  const grid   = document.getElementById('tilesGrid');
  const search = document.getElementById('tileSearch');
  if (!grid) return;

  const source = type === 'alphabets' ? ALPHABETS
               : type === 'numbers'   ? NUMBERS
               : WORDS;

  function render(filter = '') {
    // Build the filtered list and store it globally
    activeData = filter
      ? source.filter(d =>
          d.label.toLowerCase().includes(filter.toLowerCase()) ||
          d.id.toLowerCase().includes(filter.toLowerCase())
        )
      : [...source];

    if (!activeData.length) {
      grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:rgba(55,67,117,.5);padding:40px 0">
        No results for "<strong>${filter}</strong>"</p>`;
      return;
    }

    grid.innerHTML = activeData.map((item, i) => `
      <div class="sign-tile reveal"
           style="transition-delay:${Math.min(i * 0.04, 0.5)}s"
           data-index="${i}"
           tabindex="0"
           role="button"
           aria-label="${item.label}">
        <span class="${type === 'words' ? 'tile-emoji' : 'tile-main'}">${item.main}</span>
        <span class="tile-label">${item.label}</span>
      </div>
    `).join('');

    /* scroll-reveal re-observe */
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.08 });
      grid.querySelectorAll('.sign-tile').forEach(el => io.observe(el));
    } else {
      grid.querySelectorAll('.sign-tile').forEach(el => el.classList.add('visible'));
    }

    /* click + keyboard handlers — pass the index */
    grid.querySelectorAll('.sign-tile').forEach(tile => {
      const idx = parseInt(tile.dataset.index, 10);
      tile.addEventListener('click',   () => openModal(idx));
      tile.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(idx);
        }
      });
    });
  }

  render();
  search?.addEventListener('input', e => render(e.target.value.trim()));
}

/* ─── FILL MODAL CONTENT ──────────────────────────── */
function fillModal(item, direction) {
  /* direction: 'right' = going forward, 'left' = going back, '' = first open */
  const gifFrame   = document.getElementById('modalGifFrame');
  const placeholder= document.getElementById('modalPlaceholder');
  const title      = document.getElementById('modalTitle');
  const desc       = document.getElementById('modalDesc');
  const path       = document.getElementById('modalPath');

  /* slide animation */
  const animClass = direction === 'right' ? 'modal-sliding-right'
                  : direction === 'left'  ? 'modal-sliding-left'
                  : '';
  const animTarget = document.querySelector('.modal-box');
  if (animClass) {
    animTarget.classList.remove('modal-sliding-right', 'modal-sliding-left');
    /* force reflow so animation restarts */
    void animTarget.offsetWidth;
    animTarget.classList.add(animClass);
  }

  title.textContent = item.label;
  desc.textContent  = item.desc;

  /* try loading the real gif; fall back to emoji placeholder */
  placeholder.style.display = 'none';
  gifFrame.innerHTML = '';

  const img = document.createElement('img');
  img.alt = item.label;
  img.src = item.gif;
  img.onerror = () => {
    img.style.display = 'none';
    placeholder.style.display = 'flex';
    placeholder.querySelector('.modal-gif-placeholder').textContent = item.main;
  };
  gifFrame.appendChild(img);

  updateCounter();
  updateArrows();
}

/* ─── COUNTER + ARROWS ────────────────────────────── */
function updateCounter() {
  const total = activeData.length;
  const text  = `${activeIndex + 1} / ${total}`;
  const el1 = document.getElementById('modalCounter');
  const el2 = document.getElementById('modalCounterMobile');
  if (el1) el1.textContent = text;
  if (el2) el2.textContent = text;
}

function updateArrows() {
  const atStart = activeIndex === 0;
  const atEnd   = activeIndex === activeData.length - 1;

  ['modalPrev', 'modalPrevMobile'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.disabled = atStart;
  });
  ['modalNext', 'modalNextMobile'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.disabled = atEnd;
  });
}

/* ─── OPEN / CLOSE / NAVIGATE ─────────────────────── */
function openModal(index, direction = '') {
  activeIndex = index;
  const overlay = document.getElementById('signModal');
  if (!overlay) return;

  fillModal(activeData[activeIndex], direction);

  /* show mobile arrow row on small screens */
  const mobileRow = document.getElementById('mobileArrowRow');
  if (mobileRow) {
    mobileRow.style.display = window.innerWidth <= 680 ? 'flex' : 'none';
  }

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('signModal');
  overlay?.classList.remove('open');
  document.body.style.overflow = '';
}

function goNext() {
  if (activeIndex < activeData.length - 1) {
    openModal(activeIndex + 1, 'right');
  }
}

function goPrev() {
  if (activeIndex > 0) {
    openModal(activeIndex - 1, 'left');
  }
}

/* ─── EVENT LISTENERS ─────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* close button */
  document.getElementById('modalClose')?.addEventListener('click', closeModal);

  /* click outside modal box */
  document.getElementById('signModal')?.addEventListener('click', e => {
    if (e.target.id === 'signModal') closeModal();
  });

  /* desktop arrows */
  document.getElementById('modalPrev')?.addEventListener('click', goPrev);
  document.getElementById('modalNext')?.addEventListener('click', goNext);

  /* mobile arrows */
  document.getElementById('modalPrevMobile')?.addEventListener('click', goPrev);
  document.getElementById('modalNextMobile')?.addEventListener('click', goNext);

  /* keyboard: ← → Esc */
  document.addEventListener('keydown', e => {
    const overlay = document.getElementById('signModal');
    if (!overlay?.classList.contains('open')) return;

    if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goPrev(); }
    if (e.key === 'Escape')     { closeModal(); }
  });

  /* detect page type from body data attribute and render */
  const page = document.body.dataset.page;
  if (page) renderGrid(page);
});