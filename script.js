const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

lucide.createIcons();

const progress = $('.progress');
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${(scrollY / max) * 100}%`;
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold:.12});
$$('.reveal').forEach(el => revealObserver.observe(el));

const counters = $$('.counter');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.target);
    const start = performance.now();
    const duration = 1200;
    const tick = now => {
      const p = Math.min((now-start)/duration, 1);
      const eased = 1 - Math.pow(1-p, 3);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, {threshold:.5});
counters.forEach(el => counterObserver.observe(el));

$$('.details-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const details = btn.nextElementSibling;
    details.classList.toggle('open');
    btn.classList.toggle('open');
    const label = details.classList.contains('open') ? 'Hide responsibilities' : 'View responsibilities';
    btn.childNodes[0].textContent = label + ' ';
  });
});

$$('.filter').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    $$('.skill').forEach(card => card.classList.toggle('hide', filter !== 'all' && card.dataset.cat !== filter));
  });
});

const modal = $('#projectModal');
const openModal = () => { modal.classList.add('show'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; };
const closeModal = () => { modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; };
$('#openProject').addEventListener('click', openModal);
$('#projectBtn').addEventListener('click', openModal);
$('.modal-close').addEventListener('click', closeModal);
$('.modal-backdrop').addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

const toast = $('#toast');
$('.copy-email').addEventListener('click', async e => {
  await navigator.clipboard.writeText(e.currentTarget.dataset.email);
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1800);
});

const theme = $('.theme-toggle');
const savedTheme = localStorage.getItem('av-theme');
if (savedTheme === 'light') document.body.classList.add('light');
theme.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('av-theme', document.body.classList.contains('light') ? 'light' : 'dark');
});

const menuBtn = $('.menu-btn');
const nav = $('.nav');
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('mobile-open');
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.innerHTML = open ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
  lucide.createIcons();
});
$$('.nav-links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('mobile-open')));

$('#year').textContent = new Date().getFullYear();
