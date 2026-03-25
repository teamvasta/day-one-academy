/* ========================================
   DAY 1 BRAZILIAN JIU-JITSU - SCRIPTS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

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
        navLinks.classList.remove('active');
        navToggle.classList.remove('open');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

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

  // ========== Contact Form Handler ==========
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = new FormData(this).get('firstName') || 'there';
      const btn = this.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = `Thank you, ${name}! We'll be in touch.`;
      btn.style.backgroundColor = '#2d7a4f';
      btn.style.borderColor = '#2d7a4f';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
        btn.style.borderColor = '';
        btn.disabled = false;
        contactForm.reset();
      }, 4000);
    });
  }

});
