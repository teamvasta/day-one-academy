/* ========================================
   DAY 1 BJJ - FREE TRIAL BOOKING SYSTEM
   Multi-step signup with calendar scheduler
   ======================================== */

(function () {
  'use strict';

  // ── CLASS SCHEDULE DATA (from the official schedule) ──
  // dayOfWeek: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  var SCHEDULE = [
    // Monday
    { day: 1, time: '6:15 AM', className: 'All Levels', programs: ['adults-fundamentals', 'adults-advanced'] },
    { day: 1, time: '12:00 PM', className: 'Intermediate / Advanced', programs: ['adults-advanced'] },
    { day: 1, time: '5:00 PM', className: 'Kids (10-15 Yrs)', programs: ['kids-10-15'] },
    { day: 1, time: '6:00 PM', className: 'Intermediate / Advanced', programs: ['adults-advanced'] },
    { day: 1, time: '7:00 PM', className: 'Fundamentals', programs: ['adults-fundamentals'] },
    // Tuesday
    { day: 2, time: '12:00 PM', className: 'Fundamentals', programs: ['adults-fundamentals'] },
    { day: 2, time: '5:00 PM', className: 'Kids (7-9 Yrs)', programs: ['kids-7-9'] },
    { day: 2, time: '6:00 PM', className: 'Fundamentals', programs: ['adults-fundamentals'] },
    { day: 2, time: '7:00 PM', className: 'NOGI Int/Advanced', programs: ['adults-advanced'] },
    // Wednesday
    { day: 3, time: '6:15 AM', className: 'All Levels', programs: ['adults-fundamentals', 'adults-advanced'] },
    { day: 3, time: '12:00 PM', className: 'NOGI Int/Advanced', programs: ['adults-advanced'] },
    { day: 3, time: '5:00 PM', className: 'Kids (10-15 Yrs)', programs: ['kids-10-15'] },
    { day: 3, time: '6:00 PM', className: 'Intermediate / Advanced', programs: ['adults-advanced'] },
    { day: 3, time: '7:00 PM', className: 'Fundamentals', programs: ['adults-fundamentals'] },
    // Thursday
    { day: 4, time: '12:00 PM', className: 'Fundamentals', programs: ['adults-fundamentals'] },
    { day: 4, time: '5:00 PM', className: 'Kids (7-9 Yrs)', programs: ['kids-7-9'] },
    { day: 4, time: '6:00 PM', className: 'Fundamentals', programs: ['adults-fundamentals'] },
    { day: 4, time: '7:00 PM', className: 'NOGI Int/Advanced', programs: ['adults-advanced'] },
    // Friday
    { day: 5, time: '6:15 AM', className: 'NOGI Int/Advanced', programs: ['adults-advanced'] },
    { day: 5, time: '12:00 PM', className: 'Intermediate / Advanced', programs: ['adults-advanced'] },
    { day: 5, time: '6:00 PM', className: 'Fundamentals', programs: ['adults-fundamentals'] },
    { day: 5, time: '7:00 PM', className: 'Open Mat / Drill (Gi & NOGI)', programs: ['adults-fundamentals', 'adults-advanced'] },
    // Saturday
    { day: 6, time: '10:00 AM', className: 'Kids (9-15 Yrs)', programs: ['kids-7-9', 'kids-10-15'] },
    { day: 6, time: '11:00 AM', className: 'Fundamentals', programs: ['adults-fundamentals'] },
    { day: 6, time: '12:00 PM', className: 'Open Mat / Drill (Gi & NOGI)', programs: ['adults-fundamentals', 'adults-advanced'] },
    // Sunday
    { day: 0, time: '10:00 AM', className: 'Fundamentals', programs: ['adults-fundamentals'] },
    { day: 0, time: '11:00 AM', className: 'Open Mat / Drill (Gi & NOGI)', programs: ['adults-fundamentals', 'adults-advanced'] }
  ];

  var PROGRAM_LABELS = {
    'kids-7-9': 'Kids Jiu-Jitsu (Ages 7-9)',
    'kids-10-15': 'Kids Jiu-Jitsu (Ages 10-15)',
    'adults-fundamentals': 'Adults Fundamentals',
    'adults-advanced': 'Adults Intermediate / Advanced',
    'private': 'Private Training'
  };

  var PROGRAM_DESCRIPTIONS = {
    'kids-7-9': 'Building confidence, discipline, and coordination through age-appropriate Jiu-Jitsu training.',
    'kids-10-15': 'Developing technique, focus, and self-defense skills for teens.',
    'adults-fundamentals': 'Perfect for beginners. No experience or equipment required. Adults ages 16 & up.',
    'adults-advanced': 'For students with prior experience. White belt 2 stripes and up.',
    'private': 'One-on-one personalized coaching for accelerated learning at any level.'
  };

  var MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  var DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var DAY_NAMES_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // ── STATE ──
  var state = {
    step: 1,
    fullName: '',
    email: '',
    phone: '',
    program: '',
    selectedDate: null,
    selectedSlot: null,
    calendarMonth: new Date().getMonth(),
    calendarYear: new Date().getFullYear()
  };

  // ── GOOGLE APPS SCRIPT ENDPOINT ──
  var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzxp7RcI4xgF9FXmim69WzINDV0i8FEADcBgLiIfrHdJIjKs4a_7SIc-zJZiU2Y4tcW/exec';

  // ── BUILD MODAL HTML ──
  function buildModal() {
    var overlay = document.createElement('div');
    overlay.className = 'trial-modal-overlay';
    overlay.id = 'trialModalOverlay';

    overlay.innerHTML =
      '<div class="trial-modal trial-modal--multi">' +
        '<div class="trial-modal__header">' +
          '<button class="trial-modal__close" id="trialModalClose">&times;</button>' +
          '<h2>Book Your Free Trial</h2>' +
          '<p>Schedule your FREE class today!</p>' +
          '<div class="trial-steps" id="trialSteps">' +
            '<div class="trial-steps__item active" data-step="1"><span class="trial-steps__num">1</span><span class="trial-steps__label">Info</span></div>' +
            '<div class="trial-steps__line"></div>' +
            '<div class="trial-steps__item" data-step="2"><span class="trial-steps__num">2</span><span class="trial-steps__label">Program</span></div>' +
            '<div class="trial-steps__line"></div>' +
            '<div class="trial-steps__item" data-step="3"><span class="trial-steps__num">3</span><span class="trial-steps__label">Schedule</span></div>' +
            '<div class="trial-steps__line"></div>' +
            '<div class="trial-steps__item" data-step="4"><span class="trial-steps__num">4</span><span class="trial-steps__label">Confirm</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="trial-modal__body" id="trialModalBody"></div>' +
      '</div>';

    document.body.appendChild(overlay);
    return overlay;
  }

  // ── STEP RENDERERS ──

  function renderStep1() {
    return (
      '<div class="trial-step" id="trialStep1">' +
        '<h3 class="trial-step__title">Your Information</h3>' +
        '<p class="trial-step__subtitle">Tell us about yourself so we can get in touch.</p>' +
        '<form id="trialFormStep1" class="trial-form">' +
          '<div class="trial-form__field">' +
            '<label for="trial-fullName">Full Name *</label>' +
            '<input type="text" id="trial-fullName" name="fullName" placeholder="Full Name" value="' + escHtml(state.fullName) + '" required>' +
          '</div>' +
          '<div class="trial-form__field">' +
            '<label for="trial-email">Email *</label>' +
            '<input type="email" id="trial-email" name="email" placeholder="Email address" value="' + escHtml(state.email) + '" required>' +
          '</div>' +
          '<div class="trial-form__field">' +
            '<label for="trial-phone">Phone *</label>' +
            '<input type="tel" id="trial-phone" name="phone" placeholder="Phone number" value="' + escHtml(state.phone) + '" required>' +
          '</div>' +
          '<p class="trial-form__disclaimer">By submitting this form you consent to receive periodic text messages from Day 1 BJJ. Standard rates may apply. Reply STOP to opt out.</p>' +
          '<button type="submit" class="btn btn-gold trial-btn">Next — Choose Program</button>' +
        '</form>' +
      '</div>'
    );
  }

  function renderStep2() {
    var programs = ['kids-7-9', 'kids-10-15', 'adults-fundamentals', 'adults-advanced', 'private'];
    var icons = {
      'kids-7-9': '👦',
      'kids-10-15': '🥋',
      'adults-fundamentals': '🤝',
      'adults-advanced': '🏆',
      'private': '🎯'
    };
    var html = '<div class="trial-step" id="trialStep2">' +
      '<h3 class="trial-step__title">Choose Your Program</h3>' +
      '<p class="trial-step__subtitle">Select the program that\'s right for you.</p>' +
      '<div class="trial-programs">';

    for (var i = 0; i < programs.length; i++) {
      var key = programs[i];
      var selected = state.program === key ? ' selected' : '';
      html += '<button class="trial-program-card' + selected + '" data-program="' + key + '">' +
        '<span class="trial-program-card__icon">' + icons[key] + '</span>' +
        '<span class="trial-program-card__name">' + PROGRAM_LABELS[key] + '</span>' +
        '<span class="trial-program-card__desc">' + PROGRAM_DESCRIPTIONS[key] + '</span>' +
      '</button>';
    }

    html += '</div>' +
      '<div class="trial-nav">' +
        '<button class="btn btn-outline trial-btn-back" id="trialBack2">← Back</button>' +
      '</div>' +
    '</div>';
    return html;
  }

  function renderStep3() {
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    // Build calendar grid
    var year = state.calendarYear;
    var month = state.calendarMonth;
    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    var calHtml = '<div class="trial-calendar">' +
      '<div class="trial-calendar__header">' +
        '<button class="trial-calendar__nav" id="calPrev">&#8249;</button>' +
        '<span class="trial-calendar__month">' + MONTH_NAMES[month] + ' ' + year + '</span>' +
        '<button class="trial-calendar__nav" id="calNext">&#8250;</button>' +
      '</div>' +
      '<div class="trial-calendar__grid">';

    // Day headers
    for (var d = 0; d < 7; d++) {
      calHtml += '<div class="trial-calendar__day-name">' + DAY_NAMES[d] + '</div>';
    }

    // Empty cells before first day
    for (var e = 0; e < firstDay; e++) {
      calHtml += '<div class="trial-calendar__cell empty"></div>';
    }

    // Day cells
    for (var day = 1; day <= daysInMonth; day++) {
      var cellDate = new Date(year, month, day);
      var dayOfWeek = cellDate.getDay();
      var isPast = cellDate < today;
      var hasClasses = getClassesForDay(dayOfWeek, state.program).length > 0;
      var isSelected = state.selectedDate &&
        state.selectedDate.getFullYear() === year &&
        state.selectedDate.getMonth() === month &&
        state.selectedDate.getDate() === day;
      var isToday = cellDate.getTime() === today.getTime();

      var cellClasses = 'trial-calendar__cell';
      if (isPast) cellClasses += ' past';
      else if (!hasClasses) cellClasses += ' no-class';
      else cellClasses += ' available';
      if (isSelected) cellClasses += ' selected';
      if (isToday) cellClasses += ' today';

      calHtml += '<div class="' + cellClasses + '" data-date="' + year + '-' + (month + 1) + '-' + day + '">' + day + '</div>';
    }

    calHtml += '</div></div>';

    // Time slots panel
    var slotsHtml = '<div class="trial-slots" id="trialSlots">';
    if (state.selectedDate) {
      var dow = state.selectedDate.getDay();
      var classes = getClassesForDay(dow, state.program);
      var dateLabel = DAY_NAMES_FULL[dow] + ', ' + MONTH_NAMES[state.selectedDate.getMonth()] + ' ' + state.selectedDate.getDate() + ', ' + state.selectedDate.getFullYear();

      slotsHtml += '<h4 class="trial-slots__date">' + dateLabel + '</h4>';
      slotsHtml += '<p class="trial-slots__hint">Available classes:</p>';

      if (classes.length === 0) {
        slotsHtml += '<p class="trial-slots__none">No classes available on this day for your program.</p>';
      } else {
        for (var s = 0; s < classes.length; s++) {
          var cls = classes[s];
          var slotSelected = state.selectedSlot &&
            state.selectedSlot.time === cls.time &&
            state.selectedSlot.className === cls.className ? ' selected' : '';
          slotsHtml += '<button class="trial-slot' + slotSelected + '" data-time="' + cls.time + '" data-class="' + escHtml(cls.className) + '">' +
            '<span class="trial-slot__time">' + cls.time + '</span>' +
            '<span class="trial-slot__name">' + cls.className + '</span>' +
          '</button>';
        }
      }
    } else {
      slotsHtml += '<div class="trial-slots__prompt">' +
        '<span class="trial-slots__prompt-icon">📅</span>' +
        '<p>Select a date on the calendar to see available class times.</p>' +
      '</div>';
    }
    slotsHtml += '</div>';

    var nextDisabled = !state.selectedSlot ? ' disabled' : '';

    return (
      '<div class="trial-step" id="trialStep3">' +
        '<h3 class="trial-step__title">Pick a Date & Time</h3>' +
        '<p class="trial-step__subtitle">Choose when you\'d like to attend your free trial class.</p>' +
        '<div class="trial-scheduler">' +
          calHtml +
          slotsHtml +
        '</div>' +
        '<div class="trial-nav">' +
          '<button class="btn btn-outline trial-btn-back" id="trialBack3">← Back</button>' +
          '<button class="btn btn-gold trial-btn"' + nextDisabled + ' id="trialNext3">Next — Confirm</button>' +
        '</div>' +
      '</div>'
    );
  }

  function renderStep4() {
    var dateStr = '';
    if (state.selectedDate) {
      dateStr = DAY_NAMES_FULL[state.selectedDate.getDay()] + ', ' +
        MONTH_NAMES[state.selectedDate.getMonth()] + ' ' +
        state.selectedDate.getDate() + ', ' +
        state.selectedDate.getFullYear();
    }

    return (
      '<div class="trial-step" id="trialStep4">' +
        '<h3 class="trial-step__title">Confirm Your Booking</h3>' +
        '<p class="trial-step__subtitle">Review your details and confirm your free trial class.</p>' +
        '<div class="trial-summary">' +
          '<div class="trial-summary__section">' +
            '<h4>Your Information</h4>' +
            '<p><strong>' + escHtml(state.fullName) + '</strong></p>' +
            '<p>' + escHtml(state.email) + '</p>' +
            '<p>' + escHtml(state.phone) + '</p>' +
          '</div>' +
          '<div class="trial-summary__section">' +
            '<h4>Program</h4>' +
            '<p><strong>' + (PROGRAM_LABELS[state.program] || state.program) + '</strong></p>' +
          '</div>' +
          (state.selectedSlot ? (
            '<div class="trial-summary__section">' +
              '<h4>Class Details</h4>' +
              '<p><strong>' + dateStr + '</strong></p>' +
              '<p>' + state.selectedSlot.time + ' — ' + escHtml(state.selectedSlot.className) + '</p>' +
            '</div>'
          ) : '') +
        '</div>' +
        '<div class="trial-nav">' +
          '<button class="btn btn-outline trial-btn-back" id="trialBack4">← Back</button>' +
          '<button class="btn btn-gold trial-btn" id="trialSubmit">Reserve My Spot</button>' +
        '</div>' +
      '</div>'
    );
  }

  // Special confirmation for private training (no calendar step)
  function renderStep4Private() {
    return (
      '<div class="trial-step" id="trialStep4">' +
        '<h3 class="trial-step__title">Confirm Your Inquiry</h3>' +
        '<p class="trial-step__subtitle">We\'ll reach out to schedule your private training session.</p>' +
        '<div class="trial-summary">' +
          '<div class="trial-summary__section">' +
            '<h4>Your Information</h4>' +
            '<p><strong>' + escHtml(state.fullName) + '</strong></p>' +
            '<p>' + escHtml(state.email) + '</p>' +
            '<p>' + escHtml(state.phone) + '</p>' +
          '</div>' +
          '<div class="trial-summary__section">' +
            '<h4>Program</h4>' +
            '<p><strong>Private Training</strong></p>' +
            '<p>Our team will contact you to arrange a time that works best.</p>' +
          '</div>' +
        '</div>' +
        '<div class="trial-nav">' +
          '<button class="btn btn-outline trial-btn-back" id="trialBack4">← Back</button>' +
          '<button class="btn btn-gold trial-btn" id="trialSubmit">Submit Inquiry</button>' +
        '</div>' +
      '</div>'
    );
  }

  function renderSuccess() {
    return (
      '<div class="trial-step trial-success">' +
        '<div class="trial-success__icon">✓</div>' +
        '<h3 class="trial-step__title">You\'re All Set!</h3>' +
        '<p class="trial-step__subtitle">Thank you, <strong>' + escHtml(state.fullName.split(' ')[0]) + '</strong>! Your free trial class has been booked.</p>' +
        (state.selectedSlot ? (
          '<div class="trial-success__details">' +
            '<p><strong>' + (PROGRAM_LABELS[state.program] || '') + '</strong></p>' +
            '<p>' + formatDateFull(state.selectedDate) + '</p>' +
            '<p>' + state.selectedSlot.time + ' — ' + state.selectedSlot.className + '</p>' +
          '</div>'
        ) : (
          '<div class="trial-success__details">' +
            '<p><strong>Private Training Inquiry</strong></p>' +
            '<p>We\'ll contact you shortly to schedule your session.</p>' +
          '</div>'
        )) +
        '<p class="trial-success__note">A confirmation has been added to our calendar. We\'ll see you on the mats! 🥋</p>' +
        '<button class="btn btn-gold trial-btn" id="trialDone">Close</button>' +
      '</div>'
    );
  }

  // ── HELPERS ──

  function getClassesForDay(dayOfWeek, program) {
    var results = [];
    for (var i = 0; i < SCHEDULE.length; i++) {
      if (SCHEDULE[i].day === dayOfWeek && SCHEDULE[i].programs.indexOf(program) >= 0) {
        results.push(SCHEDULE[i]);
      }
    }
    return results;
  }

  function escHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str || ''));
    return div.innerHTML;
  }

  function formatDateFull(date) {
    if (!date) return '';
    return DAY_NAMES_FULL[date.getDay()] + ', ' +
      MONTH_NAMES[date.getMonth()] + ' ' +
      date.getDate() + ', ' +
      date.getFullYear();
  }

  // ── RENDER CURRENT STEP ──

  function renderCurrentStep() {
    var body = document.getElementById('trialModalBody');
    if (!body) return;

    if (state.step === 1) {
      body.innerHTML = renderStep1();
      bindStep1Events();
    } else if (state.step === 2) {
      body.innerHTML = renderStep2();
      bindStep2Events();
    } else if (state.step === 3) {
      body.innerHTML = renderStep3();
      bindStep3Events();
    } else if (state.step === 4) {
      if (state.program === 'private') {
        body.innerHTML = renderStep4Private();
      } else {
        body.innerHTML = renderStep4();
      }
      bindStep4Events();
    } else if (state.step === 5) {
      body.innerHTML = renderSuccess();
      bindSuccessEvents();
    }

    updateStepIndicators();
    // Scroll modal body to top
    body.scrollTop = 0;
  }

  function updateStepIndicators() {
    var items = document.querySelectorAll('.trial-steps__item');
    var lines = document.querySelectorAll('.trial-steps__line');
    for (var i = 0; i < items.length; i++) {
      var stepNum = parseInt(items[i].getAttribute('data-step'));
      items[i].classList.remove('active', 'completed');
      if (stepNum < state.step) {
        items[i].classList.add('completed');
      } else if (stepNum === state.step || (state.step === 5 && stepNum === 4)) {
        items[i].classList.add('active');
      }
    }
    for (var j = 0; j < lines.length; j++) {
      lines[j].classList.remove('completed');
      if (j < state.step - 1) {
        lines[j].classList.add('completed');
      }
    }
  }

  // ── EVENT BINDINGS ──

  function bindStep1Events() {
    var form = document.getElementById('trialFormStep1');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        state.fullName = document.getElementById('trial-fullName').value.trim();
        state.email = document.getElementById('trial-email').value.trim();
        state.phone = document.getElementById('trial-phone').value.trim();
        state.step = 2;
        renderCurrentStep();
      });
    }
  }

  function bindStep2Events() {
    var cards = document.querySelectorAll('.trial-program-card');
    for (var i = 0; i < cards.length; i++) {
      cards[i].addEventListener('click', function () {
        var prog = this.getAttribute('data-program');
        state.program = prog;
        state.selectedDate = null;
        state.selectedSlot = null;

        if (prog === 'private') {
          // Skip calendar for private training
          state.step = 4;
        } else {
          state.step = 3;
        }
        renderCurrentStep();
      });
    }

    var backBtn = document.getElementById('trialBack2');
    if (backBtn) {
      backBtn.addEventListener('click', function () {
        state.step = 1;
        renderCurrentStep();
      });
    }
  }

  function bindStep3Events() {
    // Calendar navigation
    var prevBtn = document.getElementById('calPrev');
    var nextBtn = document.getElementById('calNext');
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        state.calendarMonth--;
        if (state.calendarMonth < 0) {
          state.calendarMonth = 11;
          state.calendarYear--;
        }
        renderCurrentStep();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        state.calendarMonth++;
        if (state.calendarMonth > 11) {
          state.calendarMonth = 0;
          state.calendarYear++;
        }
        renderCurrentStep();
      });
    }

    // Date cell clicks
    var cells = document.querySelectorAll('.trial-calendar__cell.available');
    for (var i = 0; i < cells.length; i++) {
      cells[i].addEventListener('click', function () {
        var parts = this.getAttribute('data-date').split('-');
        state.selectedDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        state.selectedSlot = null;
        renderCurrentStep();
      });
    }

    // Time slot clicks
    var slots = document.querySelectorAll('.trial-slot');
    for (var j = 0; j < slots.length; j++) {
      slots[j].addEventListener('click', function () {
        state.selectedSlot = {
          time: this.getAttribute('data-time'),
          className: this.getAttribute('data-class')
        };
        renderCurrentStep();
      });
    }

    // Back button
    var backBtn = document.getElementById('trialBack3');
    if (backBtn) {
      backBtn.addEventListener('click', function () {
        state.step = 2;
        renderCurrentStep();
      });
    }

    // Next button
    var nextBtn3 = document.getElementById('trialNext3');
    if (nextBtn3) {
      nextBtn3.addEventListener('click', function () {
        if (state.selectedSlot) {
          state.step = 4;
          renderCurrentStep();
        }
      });
    }
  }

  function bindStep4Events() {
    var backBtn = document.getElementById('trialBack4');
    if (backBtn) {
      backBtn.addEventListener('click', function () {
        if (state.program === 'private') {
          state.step = 2;
        } else {
          state.step = 3;
        }
        renderCurrentStep();
      });
    }

    var submitBtn = document.getElementById('trialSubmit');
    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        submitBooking();
      });
    }
  }

  function bindSuccessEvents() {
    var doneBtn = document.getElementById('trialDone');
    if (doneBtn) {
      doneBtn.addEventListener('click', function () {
        closeModal();
      });
    }
  }

  // ── SUBMIT BOOKING ──

  function submitBooking() {
    var btn = document.getElementById('trialSubmit');
    if (btn) {
      btn.textContent = 'Booking...';
      btn.disabled = true;
    }

    var dateStr = '';
    var timeStr = '';
    var classStr = '';

    if (state.selectedDate && state.selectedSlot) {
      dateStr = (state.selectedDate.getMonth() + 1) + '/' +
        state.selectedDate.getDate() + '/' +
        state.selectedDate.getFullYear();
      timeStr = state.selectedSlot.time;
      classStr = state.selectedSlot.className;
    }

    var params = new URLSearchParams();
    params.append('fullName', state.fullName);
    params.append('email', state.email);
    params.append('phone', state.phone);
    params.append('program', PROGRAM_LABELS[state.program] || state.program);
    params.append('trialDate', dateStr);
    params.append('trialTime', timeStr);
    params.append('trialClass', classStr);
    params.append('createCalendarEvent', 'true');

    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    }).then(function () {
      state.step = 5;
      renderCurrentStep();
    }).catch(function () {
      // Still show success since mode is no-cors
      state.step = 5;
      renderCurrentStep();
    });
  }

  // ── MODAL CONTROLS ──

  var overlay;

  function openModal(e) {
    if (e) e.preventDefault();
    if (!overlay) {
      overlay = buildModal();
    }
    // Reset state for new booking
    state.step = 1;
    state.fullName = '';
    state.email = '';
    state.phone = '';
    state.program = '';
    state.selectedDate = null;
    state.selectedSlot = null;
    state.calendarMonth = new Date().getMonth();
    state.calendarYear = new Date().getFullYear();

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      overlay.classList.add('visible');
    }, 10);

    renderCurrentStep();

    // Bind close
    var closeBtn = document.getElementById('trialModalClose');
    if (closeBtn) {
      closeBtn.onclick = closeModal;
    }
    overlay.onclick = function (e) {
      if (e.target === overlay) closeModal();
    };
  }

  function closeModal() {
    if (!overlay) return;
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
    setTimeout(function () {
      overlay.classList.remove('active');
    }, 300);
  }

  // ── INIT ──

  document.addEventListener('DOMContentLoaded', function () {
    // Escape key closes modal
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });

    // Bind all "Book Free Trial" links to open our multi-step modal
    var triggers = document.querySelectorAll(
      'a[href="#contact-form"], a[href="contact.html#contact-form"], a[href="#book-trial"]'
    );
    for (var i = 0; i < triggers.length; i++) {
      if (triggers[i].textContent.toLowerCase().indexOf('waiver') === -1) {
        triggers[i].addEventListener('click', openModal);
      }
    }

    // Inline contact-form is now handled by each page's own script (redirects to choose-program.html)
    // Do not intercept it here
  });

})();
