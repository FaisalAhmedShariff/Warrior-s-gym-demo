/* ============================================================
   WARRIORS GYM — Clean & Fast Performance Scripts
   Mobile-Responsive & Device-Adaptive Interactive Features
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- 1. Cinematic Combat Intro (ONLY ON FIRST VISIT PER SESSION) ----
  const combatIntro = document.getElementById('combatIntro');
  if (combatIntro) {
    const hasSeenIntro = sessionStorage.getItem('warriors_intro_viewed');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hasSeenIntro || prefersReducedMotion) {
      // User has already seen the intro or prefers reduced motion: remove immediately
      combatIntro.style.display = 'none';
      combatIntro.remove();
    } else {
      // Mark as seen so internal link clicks and page switches never replay it
      sessionStorage.setItem('warriors_intro_viewed', 'true');

      const slide1 = combatIntro.querySelector('.slide-1');
      const slide2 = combatIntro.querySelector('.slide-2');
      const slide3 = combatIntro.querySelector('.slide-3');
      const impactStage = combatIntro.querySelector('.intro-impact-stage');
      const flash = combatIntro.querySelector('.intro-flash-blast');
      const shockwave = combatIntro.querySelector('.intro-shockwave');
      const logoReveal = combatIntro.querySelector('.intro-logo-reveal');

      let isDismissed = false;
      function dismissIntro() {
        if (isDismissed) return;
        isDismissed = true;
        combatIntro.classList.add('opened');
        setTimeout(() => {
          combatIntro.classList.add('dismissed');
          setTimeout(() => {
            if (combatIntro.parentNode) combatIntro.remove();
          }, 450);
        }, 550);
      }

      // Instant dismissal on click, touch or keypress
      combatIntro.addEventListener('click', dismissIntro);
      combatIntro.addEventListener('touchstart', dismissIntro, { passive: true });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') dismissIntro();
      });

      // Beat 1: "TRAIN HARD." is initial state
      // Beat 2: 0.45s -> "FIGHT SMART."
      setTimeout(() => {
        if (isDismissed) return;
        if (slide1) slide1.classList.remove('active');
        if (slide2) slide2.classList.add('active');
      }, 450);

      // Beat 3: 0.90s -> "STAY FIT."
      setTimeout(() => {
        if (isDismissed) return;
        if (slide2) slide2.classList.remove('active');
        if (slide3) slide3.classList.add('active');
      }, 900);

      // Beat 4: 1.30s -> CLIMAX IMPACT (Flash + Shockwave + Logo Reveal)
      setTimeout(() => {
        if (isDismissed) return;
        if (slide3) slide3.classList.remove('active');
        if (impactStage) impactStage.classList.add('active');
        if (flash) flash.classList.add('active');
        if (shockwave) shockwave.classList.add('active');
        if (logoReveal) logoReveal.classList.add('active');

        // Tactile haptics on supported mobile devices
        if (navigator.vibrate) {
          try { navigator.vibrate([25, 20, 35]); } catch (e) {}
        }
      }, 1300);

      // Beat 5: 2.35s -> Curtains open and unveil website
      setTimeout(() => {
        dismissIntro();
      }, 2350);
    }
  }

  // ---- 2. Navbar Scroll Effect ----
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // ---- 3. Mobile Navigation Overlay ----
  const hamburger = document.querySelector('.hamburger');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  if (hamburger && mobileOverlay) {
    function toggleMenu() {
      hamburger.classList.toggle('open');
      mobileOverlay.classList.toggle('open');
      document.body.classList.toggle('menu-open');
    }
    function closeMenu() {
      hamburger.classList.remove('open');
      mobileOverlay.classList.remove('open');
      document.body.classList.remove('menu-open');
    }

    hamburger.addEventListener('click', toggleMenu);

    mobileOverlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileOverlay.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // ---- 4. Device-Adaptive Accordion (Hover on Desktop, Clean Tap on Mobile) ----
  const accordions = document.querySelectorAll('.accordion-strip');
  accordions.forEach(strip => {
    const panels = strip.querySelectorAll('.accordion-panel');

    panels.forEach(panel => {
      // Desktop mouse hover
      panel.addEventListener('mouseenter', () => {
        if (window.innerWidth > 860) {
          panels.forEach(p => p.classList.remove('active'));
          panel.classList.add('active');
        }
      });

      // Click / Touch tap toggle
      panel.addEventListener('click', () => {
        const isAlreadyActive = panel.classList.contains('active');
        if (window.innerWidth <= 860) {
          // On mobile, tap toggles open or focuses this card
          panels.forEach(p => p.classList.remove('active'));
          if (!isAlreadyActive) {
            panel.classList.add('active');
          } else {
            // Keep at least one or toggle
            panel.classList.add('active');
          }
        } else {
          panels.forEach(p => p.classList.remove('active'));
          panel.classList.add('active');
        }
      });
    });
  });

  // ---- 5. Interactive Timetable Day Tabs ----
  const dayTabs = document.querySelectorAll('.day-tab-btn');
  const scheduleLists = document.querySelectorAll('.schedule-day-content');
  if (dayTabs.length > 0) {
    dayTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetDay = tab.getAttribute('data-day');
        dayTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        scheduleLists.forEach(list => {
          if (list.getAttribute('data-day') === targetDay) {
            list.style.display = 'flex';
          } else {
            list.style.display = 'none';
          }
        });
      });
    });
  }

  // ---- 6. Interactive & Touch-Swipe Gallery Slideshow ----
  const sliderWrap = document.querySelector('.gallery-slider-wrap');
  if (sliderWrap) {
    const slides = sliderWrap.querySelectorAll('.gallery-slide');
    const dots = sliderWrap.querySelectorAll('.slider-dot');
    const prevBtn = sliderWrap.querySelector('.prev-btn');
    const nextBtn = sliderWrap.querySelector('.next-btn');
    let currentIndex = 0;
    let autoPlayTimer = null;

    function showSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      currentIndex = index;

      slides.forEach((s, i) => {
        s.classList.toggle('active', i === currentIndex);
      });
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === currentIndex);
      });
    }

    function nextSlide() {
      showSlide(currentIndex + 1);
    }
    function prevSlide() {
      showSlide(currentIndex - 1);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-slide') || '0', 10);
        showSlide(idx);
        resetTimer();
      });
    });

    function startTimer() {
      if (!autoPlayTimer) {
        autoPlayTimer = setInterval(nextSlide, 4500);
      }
    }
    function stopTimer() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }
    function resetTimer() {
      stopTimer();
      startTimer();
    }

    sliderWrap.addEventListener('mouseenter', stopTimer);
    sliderWrap.addEventListener('mouseleave', startTimer);

    // Mobile Touch Swipe Handling
    let touchStartX = 0;
    let touchEndX = 0;

    sliderWrap.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopTimer();
    }, { passive: true });

    sliderWrap.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) {
          nextSlide(); // Swiped left -> next slide
        } else {
          prevSlide(); // Swiped right -> prev slide
        }
      }
      startTimer();
    }, { passive: true });

    startTimer();
  }

  // ---- 7. WhatsApp Direct Form Integration ----
  const waForm = document.getElementById('whatsappEnquiryForm');
  if (waForm) {
    waForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName')?.value.trim();
      const phone = document.getElementById('clientPhone')?.value.trim();
      const email = document.getElementById('clientEmail')?.value.trim();
      const program = document.getElementById('clientProgram')?.value;
      const notes = document.getElementById('clientNotes')?.value.trim();

      const checkedSlots = [];
      document.querySelectorAll('input[name="timeSlot"]:checked').forEach(c => {
        checkedSlots.push(c.value);
      });

      if (!name || !phone) {
        alert('Please enter your full name and contact number.');
        return;
      }
      if (checkedSlots.length === 0) {
        alert('Please select at least one preferred training time slot.');
        return;
      }

      let msg = `WARRIORS GYM - ENQUIRY\n`;
      msg += `===============================\n`;
      msg += `Full Name: ${name}\n`;
      msg += `Phone: ${phone}\n`;
      if (email) msg += `Email: ${email}\n`;
      msg += `Program: ${program || 'General Combat & Fitness'}\n`;
      msg += `Slots: ${checkedSlots.join(', ')}\n`;
      if (notes) msg += `Notes: ${notes}\n`;
      msg += `===============================\n`;
      msg += `Facility: Warriors Gym, Al Maha St, Bawshar, Muscat\n`;
      msg += `Sent via Warriors Gym Website`;

      const target = '96892223330';
      const url = `https://wa.me/${target}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
    });
  }
});
