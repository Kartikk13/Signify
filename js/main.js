/* ── SIGNIFY MAIN.JS ── shared across all pages ── */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── NAV: solid on scroll ─── */
  const nav = document.getElementById('nav');
  const onScroll = () => nav?.classList.toggle('solid', window.scrollY > 30);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ─── HAMBURGER ─── */
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('drawer');
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    drawer?.classList.toggle('open');
  });
  drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    drawer?.classList.remove('open');
  }));

  /* ─── HIGHLIGHT ACTIVE NAV LINK ─── */
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ─── SCROLL REVEAL ─── */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ─── STAT COUNTER ANIMATION ─── */
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const step = Math.ceil(target / 60);
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + suffix;
        if (current >= target) clearInterval(timer);
      }, 18);
    }, { threshold: 0.5 });
    io.observe(el);
  });

  /* ─── CONTACT FORM ─── */
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      form.reset();
      btn.textContent = 'Send Message';
      btn.disabled = false;
      const success = document.getElementById('formSuccess');
      if (success) { success.style.display = 'block'; setTimeout(() => success.style.display = 'none', 4000); }
    }, 1400);
  });

  /* ─── CYCLE LETTER TEXT (landing hero) ─── */
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const cycleEl = document.getElementById('cycleLetterText');
  if (cycleEl) {
    let i = 0;
    setInterval(() => {
      i = (i + 1) % letters.length;
      cycleEl.textContent = letters[i];
    }, 460);
  }
});