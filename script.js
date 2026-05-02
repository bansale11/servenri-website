'use strict';

// ===== NAV SCROLL STATE =====
const nav = document.getElementById('siteNav');
const waSticky = document.getElementById('waSticky');
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 40;
  nav?.classList.toggle('scrolled', scrolled);
  waSticky?.classList.toggle('visible', scrolled);
  backTop?.classList.toggle('visible', scrolled);
}, { passive: true });

backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== MOBILE NAV =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navCta = document.getElementById('navCta');

navToggle?.addEventListener('click', () => {
  const open = navToggle.classList.toggle('open');
  navLinks?.classList.toggle('open', open);
  navCta?.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle?.classList.remove('open');
    navLinks.classList.remove('open');
    navCta?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ===== SERVICES TABS =====
const svcRows = document.querySelectorAll('.svc-row[data-svc]');
const svcPanels = document.querySelectorAll('.svc-panel[data-panel]');

function activateSvc(id) {
  svcRows.forEach(r => {
    const active = r.dataset.svc === id;
    r.dataset.active = String(active);
    r.setAttribute('aria-selected', String(active));
  });
  svcPanels.forEach(p => {
    p.classList.toggle('active', p.dataset.panel === id);
  });
}

svcRows.forEach(row => {
  row.addEventListener('click', () => activateSvc(row.dataset.svc));
  row.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activateSvc(row.dataset.svc);
    }
  });
});

// ===== AUDIENCE PILLS =====
document.querySelectorAll('.pill[data-audience]').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.pill[data-audience]').forEach(p => delete p.dataset.active);
    pill.dataset.active = 'true';
  });
});

// ===== TESTIMONIALS =====
const testiItems = document.querySelectorAll('.testi-item');
const testiCounter = document.getElementById('testiCounter');

let testiCurrent = 0;

function goToTesti(idx) {
  testiCurrent = (idx + testiItems.length) % testiItems.length;
  testiItems.forEach((item, i) => item.classList.toggle('active', i === testiCurrent));
  if (testiCounter) {
    const total = testiItems.length;
    testiCounter.textContent = `0${testiCurrent + 1} / 0${total}`;
  }
}

function testimonialPrev() { goToTesti(testiCurrent - 1); }
function testimonialNext() { goToTesti(testiCurrent + 1); }

window.testimonialPrev = testimonialPrev;
window.testimonialNext = testimonialNext;

document.getElementById('testiPrev')?.addEventListener('click', testimonialPrev);
document.getElementById('testiNext')?.addEventListener('click', testimonialNext);

// ===== COUNTRY "OTHER" FIELD =====
const countrySelect = document.getElementById('cf-country');
const countryOther = document.getElementById('cf-country-other');

countrySelect?.addEventListener('change', () => {
  const isOther = countrySelect.value === 'Other';
  countryOther.style.display = isOther ? 'block' : 'none';
  countryOther.required = isOther;
  if (!isOther) countryOther.value = '';
});

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-a');
    const open = btn.getAttribute('aria-expanded') === 'true';

    item.closest('.faq-col').querySelectorAll('.faq-item').forEach(i => {
      i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      i.querySelector('.faq-a').hidden = true;
    });

    if (!open) {
      btn.setAttribute('aria-expanded', 'true');
      answer.hidden = false;
    }
  });
});

// ===== CONTACT FORM — Web3Forms =====
const form = document.getElementById('contactForm');
const cfSuccess = document.getElementById('cfSuccess');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const btn = form.querySelector('button[type="submit"]');
    const originalLabel = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const data = new FormData(form);
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      });
      const json = await res.json();

      if (json.success) {
        form.hidden = true;
        if (cfSuccess) cfSuccess.hidden = false;
      } else {
        throw new Error(json.message || 'Submission failed');
      }
    } catch (_) {
      const name = form.querySelector('[name="name"]')?.value ?? '';
      const email = form.querySelector('[name="email"]')?.value ?? '';
      const service = form.querySelector('[name="service"]')?.value ?? '';
      const message = form.querySelector('[name="message"]')?.value ?? '';
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nService: ${service}\n\n${message}`);
      window.location.href = `mailto:infoservenri@gmail.com?subject=NRI%20Connect%20Consultation%20Request&body=${body}`;
      btn.textContent = originalLabel;
      btn.disabled = false;
    }
  });
}

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
