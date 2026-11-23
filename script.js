/* ========================================
   DAY 1 BRAZILIAN JIU-JITSU - SCRIPTS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ========== Black Friday Announcement Bar (TEMPORARY) ==========
  // Shows at the top of every page (except the Black Friday page itself).
  // Auto-removes Tuesday, Dec 1, 2026 at 12:00 AM Eastern (right after Cyber Monday ends).
  // To remove early: delete this whole block.
  try { (function () {
    const endsAt = new Date('2026-12-01T00:00:00-05:00');
    const onPromoPage = /\/blackfriday(\.html)?$/.test(window.location.pathname);
    if (new Date() >= endsAt || onPromoPage) return;

    // Leave LINK empty to show the bar as a plain notice (not clickable).
    // When the sign-up forms are ready, set LINK = 'blackfriday.html' to add "See details →".
    const LINK = '';

    const bar = document.createElement(LINK ? 'a' : 'div');
    if (LINK) bar.href = LINK;
    bar.className = 'promo-announce' + (LINK ? ' promo-announce--link' : '');
    bar.innerHTML =
      '<span class="promo-announce__row">' +
        '<span class="promo-announce__tag">Black Friday</span>' +
        '<span class="promo-announce__text"><span class="promo-announce__desk">Membership Special: </span>' +
        '<strong>$99 First Month</strong><span class="promo-announce__sep">&middot;</span>' +
        '<span class="promo-announce__desk">100% </span>Risk-Free</span>' +
      '</span>' +
      '<span class="promo-announce__row">' +
        '<span class="promo-announce__sep promo-announce__desk">&middot;</span>' +
        '<span class="promo-announce__ends">Ends Cyber Monday</span>' +
        (LINK ? '<span class="promo-announce__sep">&middot;</span><span class="promo-announce__cta">See details &rarr;</span>' : '') +
      '</span>';

    const style = document.createElement('style');
    style.textContent =
      '.promo-announce{display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:6px 0;' +
      'padding:11px 16px;text-align:center;font-family:var(--font-heading);font-size:0.85rem;' +
      'letter-spacing:1px;text-transform:uppercase;transition:background .2s;line-height:1.3}' +
      '.promo-announce__row{display:inline-flex;align-items:center;flex-wrap:wrap;justify-content:center}' +
      '.promo-announce__tag{font-weight:800;letter-spacing:2px;padding:4px 10px;margin-right:12px}' +
      '.promo-announce__text strong{font-weight:800}' +
      '.promo-announce__sep{opacity:.6;margin:0 8px}' +
      '.promo-announce__ends{font-weight:700}' +
      '.promo-announce__cta{font-weight:800;text-decoration:underline;text-underline-offset:3px}' +
      '.promo-announce,.promo-announce:visited,.promo-announce:hover{background:var(--gold);color:var(--black)}' +
      '.promo-announce--link:hover{background:var(--gold-light)}' +
      '.promo-announce__tag{background:var(--black);color:var(--gold)}' +
      /* Phones: two tight rows, shorter wording */
      '@media (max-width:600px){.promo-announce{flex-direction:column;font-size:0.72rem;gap:5px;padding:8px 10px;letter-spacing:.5px}' +
      '.promo-announce__desk{display:none}.promo-announce__tag{padding:3px 7px;margin-right:8px;letter-spacing:1.5px}' +
      '.promo-announce__sep{margin:0 6px}}';

    document.head.appendChild(style);
    document.body.insertBefore(bar, document.body.firstChild);
  })(); } catch (e) { /* never let the banner break the page */ }
  // ========== End Black Friday Announcement Bar ==========

  // ========== Mobile Navigation Toggle ==========
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const spans = navToggle.querySelectorAll('span');
      navToggle.classList.toggle('open');
      if (navToggle.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        // Don't close if it's the dropdown parent on mobile
        if (link.closest('.navbar__dropdown') && link === link.closest('.navbar__dropdown').querySelector(':scope > a')) return;
        navLinks.classList.remove('active');
        navToggle.classList.remove('open');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // ========== Mobile Dropdown Toggle ==========
  document.querySelectorAll('.navbar__dropdown > a').forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        this.closest('.navbar__dropdown').classList.toggle('open');
      }
    });
  });

  // ========== Scroll Animations ==========
  const animateElements = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });
  animateElements.forEach(el => observer.observe(el));

  // ========== Smooth Scroll ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = this.getAttribute('href');
      if (target === '#') return;
      const el = document.querySelector(target);
      if (el) {
        e.preventDefault();
        const navH = document.querySelector('.navbar').offsetHeight;
        window.scrollTo({ top: el.offsetTop - navH, behavior: 'smooth' });
      }
    });
  });

  // Contact form is now handled by each page's inline script (redirects to choose-program.html)

  // ========== Phone Call Click Tracking (Google Ads) ==========
  document.querySelectorAll('a[href^="tel:"]').forEach(function(link) {
    link.addEventListener('click', function() {
      if (typeof gtag === 'function') {
        gtag('event', 'conversion', {
          'send_to': 'AW-18081811778/b_8ZCK6joZocEMKaiq5D'
        });
      }
    });
  });

});
