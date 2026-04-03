/* ========================================
   DAY 1 BRAZILIAN JIU-JITSU - SCRIPTS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ========== Password Gate ==========
  const SITE_PASSWORD = 'day1bjj';

  function createPasswordGate() {
    if (sessionStorage.getItem('day1_authenticated') === 'true') {
      document.body.classList.remove('locked');
      return;
    }

    document.body.classList.add('locked');

    const gate = document.createElement('div');
    gate.id = 'password-gate';
    gate.innerHTML = `
      <div class="gate-card">
        <div class="gate-logo">DAY1</div>
        <div class="gate-logo-sub">Brazilian Jiu-Jitsu</div>
        <p class="gate-msg">This site is password protected.</p>
        <form id="gate-form">
          <input type="password" id="gate-input" placeholder="Enter password" autocomplete="off" autofocus>
          <button type="submit">Enter</button>
        </form>
        <p class="gate-error" id="gate-error"></p>
      </div>
    `;
    document.body.appendChild(gate);

    document.getElementById('gate-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const val = document.getElementById('gate-input').value;
      if (val === SITE_PASSWORD) {
        sessionStorage.setItem('day1_authenticated', 'true');
        gate.classList.add('gate-fade-out');
        setTimeout(() => {
          gate.remove();
          document.body.classList.remove('locked');
        }, 400);
      } else {
        const err = document.getElementById('gate-error');
        err.textContent = 'Incorrect password.';
        document.getElementById('gate-input').value = '';
        document.getElementById('gate-input').focus();
      }
    });
  }

  createPasswordGate();

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
