const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v) => Math.max(0, Math.min(1, v));

// Menu
const burger = $('.burger'), nav = $('#nav');
const setMenu = (open) => {
  nav.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
};
burger.onclick = () => setMenu(!nav.classList.contains('open'));
nav.onclick = (e) => e.target.closest('a') && setMenu(false);
addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));

// Scroll-linked: header state and the pinned "attention becomes..." story
const story = $('.story'), says = $$('.say'), rise = $$('.rise i'), top_ = $('.top');
let queued = false;
function onScroll() {
  queued = false;
  top_.classList.toggle('on', scrollY > 40);
  if (still) return;
  const r = story.getBoundingClientRect();
  if (r.bottom < 0 || r.top > innerHeight) return;
  const p = clamp(-r.top / (r.height - innerHeight)) * says.length;
  const at = Math.min(says.length - 1, Math.floor(p));
  says.forEach((s, i) => {
    s.classList.toggle('on', i === at);
    s.style.setProperty('--w', 1 - (1 - clamp((p - i) * 1.25)) ** 2);
  });
  rise.forEach((b, i) => b.style.setProperty('--s', clamp(p - i)));
}
const queue = () => { if (!queued) { queued = true; requestAnimationFrame(onScroll); } };
addEventListener('scroll', queue, {passive: true});
addEventListener('resize', queue);
onScroll();

// Reveals and counters
const count = (el) => {
  const end = +el.dataset.n, tail = el.textContent.replace(/^\d+/, ''), t0 = performance.now();
  const step = (t) => {
    const k = clamp((t - t0) / 1400);
    el.textContent = Math.round(end * (1 - (1 - k) ** 4)) + tail;
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
const io = new IntersectionObserver((list) => list.forEach((e) => {
  if (!e.isIntersecting) return;
  io.unobserve(e.target);
  e.target.classList.add('in');
  const n = $('[data-n]', e.target);
  if (n && !still) count(n);
}), {threshold: 0.12});
$$('[data-r]').forEach((el) => io.observe(el));

// Glass loop in the hero, paused offscreen
const loop = $('.disc video');
if (!still) new IntersectionObserver(([e]) => e.isIntersecting ? loop.play().catch(() => {}) : loop.pause()).observe(loop);

// Intro film opens out of the disc
const film = $('.film'), reel = $('video', film);
$$('[data-film]').forEach((b) => b.onclick = () => {
  const r = $('.disc', b).getBoundingClientRect();
  film.style.setProperty('--x', r.left + r.width / 2 + 'px');
  film.style.setProperty('--y', r.top + r.height / 2 + 'px');
  film.style.setProperty('--r', r.width / 2 + 'px');
  film.showModal();
  document.documentElement.style.overflow = 'hidden';
  reel.currentTime = 0;
  reel.play().catch(() => {});
});
$('.close').onclick = () => film.close();
film.onclose = () => { reel.pause(); document.documentElement.style.overflow = ''; };
reel.onended = () => film.close();

// Case-study links preselect the project type; the form hands off to WhatsApp
const form = $('form');
$$('[data-project]').forEach((a) => a.addEventListener('click', () => { form.elements.type.value = a.dataset.project; }));
form.onsubmit = (e) => {
  e.preventDefault();
  const d = new FormData(form);
  const text = [['Name', 'name'], ['Company', 'company'], ['Phone', 'phone'], ['Email', 'email'], ['Project', 'type']]
    .filter(([, k]) => d.get(k)).map(([l, k]) => `${l}: ${d.get(k)}`).concat('', d.get('message')).join('\n');
  window.open('https://wa.me/918310582071?text=' + encodeURIComponent(text), '_blank', 'noopener');
  $('[role=status]', form).textContent = 'WhatsApp opened in a new tab. Press send there to reach us.';
};
