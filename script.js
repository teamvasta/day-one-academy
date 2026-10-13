/* ========================================
   DAY 1 BRAZILIAN JIU-JITSU - SCRIPTS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ========== Lovato Seminar Announcement Bar (TEMPORARY) ==========
  // Shows on the home page only. Auto-hides Oct 17, 2026 at 1 PM Eastern.
  // To remove early: delete this whole block.
  try { (function () {
    const endsAt = new Date('2026-10-17T13:00:00-04:00');
    const onHomePage = /^\/(index(\.html)?)?$/.test(window.location.pathname);
    if (new Date() > endsAt || !onHomePage) return;

    const bar = document.createElement('a');
    bar.href = 'lovato.html';
    bar.className = 'event-announce';
    bar.innerHTML = '<strong>Rafael Lovato Gi Seminar</strong>' +
      '<span class="event-announce__sep">·</span>Sat, Oct 17' +
      '<span class="event-announce__cta">Reserve your spot &rarr;</span>';

    const style = document.createElement('style');
    style.textContent =
      '.event-announce{display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:4px 10px;' +
      'background:var(--gold);color:var(--black);padding:10px 16px;text-align:center;' +
      'font-family:var(--font-heading);font-size:0.85rem;letter-spacing:1px;text-transform:uppercase;transition:background .2s}' +
      '.event-announce:hover{background:var(--gold-dark);color:var(--black)}' +
      '.event-announce__sep{opacity:.6}' +
      '.event-announce__cta{font-weight:700;text-decoration:underline;text-underline-offset:3px;margin-left:6px}' +
      '@media (max-width:600px){.event-announce{font-size:0.75rem}.event-announce__sep{display:none}}';

    document.head.appendChild(style);
    document.body.insertBefore(bar, document.body.firstChild);
  })(); } catch (e) { /* never let the banner break the page */ }
  // ========== End Lovato Seminar Announcement Bar ==========

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
