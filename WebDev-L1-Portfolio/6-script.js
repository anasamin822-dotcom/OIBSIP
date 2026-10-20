// typewriter
const roles = ['clean interfaces.', 'responsive websites.', 'things that feel smooth.'];
const el = document.getElementById('type');
let ri = 0, ci = 0, del = false;
function type() {
  const word = roles[ri];
  el.textContent = word.slice(0, ci);
  if (!del && ci === word.length) { del = true; return setTimeout(type, 1500); }
  if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; }
  ci += del ? -1 : 1;
  setTimeout(type, del ? 35 : 75);
}
type();

// cursor spotlight + card spotlight
const spot = document.querySelector('.spot');
addEventListener('pointermove', e => {
  spot.style.setProperty('--x', e.clientX + 'px');
  spot.style.setProperty('--y', e.clientY + 'px');
});
document.querySelectorAll('.spotlight').forEach(c => {
  c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
});

// 3D tilt
const fine = matchMedia('(hover:hover)').matches;
if (fine) document.querySelectorAll('[data-tilt]').forEach(c => {
  c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    c.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
  });
  c.addEventListener('pointerleave', () => { c.style.transform = ''; });
});

// reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((n, i) => { n.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(n); });

// counters
const co = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const b = e.target, end = parseFloat(b.dataset.count), dec = +(b.dataset.dec || 0);
  const t0 = performance.now();
  (function step(t) {
    const p = Math.min((t - t0) / 1200, 1), v = end * (1 - Math.pow(1 - p, 3));
    b.textContent = v.toFixed(dec);
    if (p < 1) requestAnimationFrame(step);
  })(t0);
  co.unobserve(b);
}), { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(n => co.observe(n));

// scroll progress
const bar = document.querySelector('.progress');
addEventListener('scroll', () => {
  const h = document.documentElement;
  bar.style.transform = `scaleX(${scrollY / (h.scrollHeight - innerHeight || 1)})`;
}, { passive: true });

// close mobile menu on link click
document.querySelectorAll('.links a').forEach(a => a.addEventListener('click', () => { document.getElementById('mt').checked = false; }));
