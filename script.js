'use strict';

// ===== NAVBAR =====
const nav = document.getElementById('siteNav');
const waSticky = document.getElementById('waSticky');
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 40;
  nav.classList.toggle('scrolled', scrolled);
  waSticky.classList.toggle('visible', scrolled);
  backTop.classList.toggle('visible', scrolled);
}, { passive: true });

backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== MOBILE NAV =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  const open = navToggle.classList.toggle('open');
  navMenu.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
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
const svcTabs = document.querySelectorAll('.svc-tab');
const svcPanels = document.querySelectorAll('.svc-panel');

svcTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const id = tab.dataset.svc;
    svcTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    svcPanels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const panel = document.getElementById('svc-' + id);
    if (panel) panel.classList.add('active');
  });
});

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-a');
    const open = btn.getAttribute('aria-expanded') === 'true';

    // Close all in the same column
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
// Setup: visit web3forms.com → enter infoservenri@gmail.com → verify → copy access key
//        Replace "YOUR_WEB3FORMS_ACCESS_KEY" in the HTML hidden input with your key.
const form = document.getElementById('contactForm');
const success = document.getElementById('cfSuccess');

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
        success.hidden = false;
      } else {
        throw new Error(json.message || 'Submission failed');
      }
    } catch (err) {
      // Fallback: open mailto so the message still reaches the inbox
      const name = form.querySelector('[name="name"]').value;
      const email = form.querySelector('[name="email"]').value;
      const service = form.querySelector('[name="service"]').value;
      const message = form.querySelector('[name="message"]').value;
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nService: ${service}\n\n${message}`);
      window.location.href = `mailto:infoservenri@gmail.com?subject=NRI%20Connect%20Consultation%20Request&body=${body}`;
      btn.textContent = originalLabel;
      btn.disabled = false;
    }
  });
}

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll(
  '.process-step, .diff-item, .testimonial, .svc-item, .faq-item, .ab-stat, .co-entry'
);

revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  // Stagger siblings within the same parent
  const siblings = Array.from(el.parentElement.querySelectorAll('.reveal'));
  const idx = siblings.indexOf(el);
  if (idx > 0 && idx < 5) el.classList.add('d' + idx);
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

revealEls.forEach(el => revealObserver.observe(el));
