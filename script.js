/* ================================================================
   NISITE WEBCRAFT — Portfolio JavaScript
   Author: Nigilmurugan Sasikumar
   
   TABLE OF CONTENTS:
   1.  Wait for DOM to Load
   2.  Loading Screen
   3.  Custom Cursor
   4.  Particle Background (Canvas)
   5.  Navigation Bar (Scroll + Mobile Menu + Active Link)
   6.  GSAP Animations Setup
   7.  Home Section Typing Effect
   8.  Scroll Reveal Animations
   9.  Skill Progress Rings (Animate on Scroll)
   10. Card Tilt Effect (3D on Mouse Move)
   11. Magnetic Buttons
   12. Parallax on Mouse Move
   13. Contact Form Validation & Submit
   14. Back to Top Button
   15. Start Everything
================================================================ */


/* ================================================================
   1. WAIT FOR DOM TO LOAD
   We wrap all our code inside this listener so we know all
   HTML elements exist before we try to use them.
================================================================ */
document.addEventListener('DOMContentLoaded', function () {

  /* ================================================================
     2. LOADING SCREEN
     Animates a progress bar from 0 to 100%, then hides itself.
  ================================================================ */
  function initLoadingScreen() {
    // Get the elements we need
    var loaderScreen  = document.getElementById('loaderScreen');
    var loaderBar     = document.getElementById('loaderBar');
    var loaderPercent = document.getElementById('loaderPercent');

    // How fast to increment (ms between each tick)
    var tickInterval = 20;

    // Start at 0%
    var currentProgress = 0;

    // This interval runs repeatedly, incrementing the progress bar
    var progressTimer = setInterval(function () {

      // Increase progress by a random small amount for a natural feel
      currentProgress += Math.random() * 3 + 1;

      // Make sure we don't go over 100
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(progressTimer); // Stop the timer at 100%

        // Wait 400ms at 100%, then hide the loader
        setTimeout(function () {
          loaderScreen.classList.add('hidden');

          // After the fade-out transition (800ms), run our page intro animations
          setTimeout(function () {
            runPageIntroAnimation();
          }, 800);
        }, 400);
      }

      // Update the bar width and the text
      loaderBar.style.width = currentProgress + '%';
      loaderPercent.textContent = Math.floor(currentProgress) + '%';

    }, tickInterval);
  }


  /* ================================================================
     3. CUSTOM CURSOR
     Tracks the mouse and moves two cursor elements:
     - A small dot that follows immediately
     - A larger ring that follows with a slight delay (via CSS transitions)
  ================================================================ */
  function initCustomCursor() {
    var cursorDot  = document.getElementById('cursorDot');
    var cursorRing = document.getElementById('cursorRing');

    // Store the current mouse position
    var mouseX = 0;
    var mouseY = 0;

    // Update cursor position on every mouse move
    document.addEventListener('mousemove', function (event) {
      mouseX = event.clientX;
      mouseY = event.clientY;

      // Move the dot immediately
      cursorDot.style.left  = mouseX + 'px';
      cursorDot.style.top   = mouseY + 'px';

      // Move the ring immediately too; the CSS transition handles the delay feel
      cursorRing.style.left = mouseX + 'px';
      cursorRing.style.top  = mouseY + 'px';
    });

    // When hovering over clickable elements, add a 'cursor-hover' class to body
    // This triggers the larger cursor styles defined in CSS
    var clickableElements = document.querySelectorAll(
      'a, button, .btn, .skill-card, .project-card, .service-card, .social-icon, .tilt-card'
    );

    clickableElements.forEach(function (element) {
      element.addEventListener('mouseenter', function () {
        document.body.classList.add('cursor-hover');
      });
      element.addEventListener('mouseleave', function () {
        document.body.classList.remove('cursor-hover');
      });
    });
  }


  /* ================================================================
     4. PARTICLE BACKGROUND (CANVAS)
     Draws a field of small dots that move slowly and connect with
     lines when they get close to each other.
  ================================================================ */
  function initParticleBackground() {
    var canvas  = document.getElementById('bgCanvas');
    var context = canvas.getContext('2d');

    // Number of particles
    var numberOfParticles = 80;

    // The array that holds all particle objects
    var particles = [];

    // Current mouse position (for interactive repulsion)
    var mousePosition = { x: 0, y: 0 };

    // Set canvas size to fill the window
    function resizeCanvas() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse so particles can react to it
    window.addEventListener('mousemove', function (event) {
      mousePosition.x = event.clientX;
      mousePosition.y = event.clientY;
    });

    // Create one particle with random position, speed, and size
    function createParticle() {
      return {
        x:   Math.random() * canvas.width,
        y:   Math.random() * canvas.height,
        vx:  (Math.random() - 0.5) * 0.4,  // velocity X
        vy:  (Math.random() - 0.5) * 0.4,  // velocity Y
        size: Math.random() * 1.5 + 0.5,    // radius
        opacity: Math.random() * 0.4 + 0.1
      };
    }

    // Create all particles
    for (var i = 0; i < numberOfParticles; i++) {
      particles.push(createParticle());
    }

    // Draw everything on the canvas (called every frame)
    function drawFrame() {
      // Clear the previous frame
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw each particle
      particles.forEach(function (particle, index) {

        // Move the particle
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges so particles never disappear
        if (particle.x < 0)              particle.x = canvas.width;
        if (particle.x > canvas.width)   particle.x = 0;
        if (particle.y < 0)              particle.y = canvas.height;
        if (particle.y > canvas.height)  particle.y = 0;

        // Draw the particle dot
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fillStyle = 'rgba(0, 150, 255, ' + particle.opacity + ')';
        context.fill();

        // Draw lines to nearby particles
        for (var j = index + 1; j < particles.length; j++) {
          var otherParticle = particles[j];
          var dx = particle.x - otherParticle.x;
          var dy = particle.y - otherParticle.y;
          var distance = Math.sqrt(dx * dx + dy * dy);

          // Only draw a line if particles are close enough
          if (distance < 120) {
            // Line fades based on distance
            var lineOpacity = (1 - distance / 120) * 0.3;
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(otherParticle.x, otherParticle.y);
            context.strokeStyle = 'rgba(0, 180, 255, ' + lineOpacity + ')';
            context.lineWidth   = 0.5;
            context.stroke();
          }
        }
      });

      // Request next frame (creates the animation loop)
      requestAnimationFrame(drawFrame);
    }

    // Start the animation loop
    drawFrame();
  }


  /* ================================================================
     5. NAVIGATION BAR
     - Add 'scrolled' class when user scrolls down (darkens navbar)
     - Mobile hamburger menu toggle
     - Highlight active nav link based on which section is visible
  ================================================================ */
  function initNavbar() {
    var navbar       = document.getElementById('navbar');
    var hamburger    = document.getElementById('navHamburger');
    var navLinks     = document.getElementById('navLinks');
    var navOverlay   = document.getElementById('navOverlay');
    var allNavLinks  = document.querySelectorAll('.nav-link');

    // --- Scroll: toggle .scrolled class ---
    function handleNavbarScroll() {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // Run once on page load

    // --- Mobile: hamburger toggle ---
    function openMobileMenu() {
      navLinks.classList.add('open');
      navOverlay.classList.add('visible');
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; // Prevent scrolling behind menu
    }

    function closeMobileMenu() {
      navLinks.classList.remove('open');
      navOverlay.classList.remove('visible');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function () {
      if (navLinks.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when overlay is clicked
    navOverlay.addEventListener('click', closeMobileMenu);

    // Close menu when a nav link is clicked
    allNavLinks.forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });

    // --- Active link highlight on scroll ---
    // Collect all sections by ID
    var sections = document.querySelectorAll('section[id]');

    function updateActiveNavLink() {
      var scrollPosition = window.scrollY + 120; // Offset for navbar height

      sections.forEach(function (section) {
        var sectionTop    = section.offsetTop;
        var sectionHeight = section.offsetHeight;
        var sectionId     = section.getAttribute('id');

        // Check if scroll position is inside this section
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          // Remove active from all links
          allNavLinks.forEach(function (link) {
            link.classList.remove('active');
          });
          // Add active to the matching link
          var activeLink = document.querySelector('.nav-link[data-section="' + sectionId + '"]');
          if (activeLink) {
            activeLink.classList.add('active');
          }
        }
      });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Run once
  }


  /* ================================================================
     6. GSAP ANIMATIONS SETUP
     We register the ScrollTrigger plugin, then set up all the
     scroll-triggered animations for GSAP.
  ================================================================ */
  function initGSAPAnimations() {
    // Check GSAP is loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded');
      return;
    }

    // Register the plugin so GSAP knows about it
    gsap.registerPlugin(ScrollTrigger);

    // --- Navbar fade in ---
    gsap.from('.navbar', {
      y: -80,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.3
    });

    // --- Skills section header ---
    gsap.from('.skills-section .section-header', {
      scrollTrigger: {
        trigger: '.skills-section',
        start: 'top 75%'
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    });

    // --- Service cards stagger from bottom ---
    gsap.from('.service-card', {
      scrollTrigger: {
        trigger: '.services-section',
        start: 'top 70%'
      },
      y: 50,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power2.out'
    });

    // --- Footer fade in ---
    gsap.from('.footer', {
      scrollTrigger: {
        trigger: '.footer',
        start: 'top 90%'
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    });

    // --- Section labels (small uppercase text) ---
    gsap.utils.toArray('.section-label').forEach(function (label) {
      gsap.from(label, {
        scrollTrigger: {
          trigger: label,
          start: 'top 80%'
        },
        x: -20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
      });
    });
  }


  /* ================================================================
     7. HOME SECTION — TYPING EFFECT
     Cycles through different job titles with a typing animation.
  ================================================================ */
  function initTypingEffect() {
    var typingElement = document.getElementById('typingText');
    if (!typingElement) return;

    // The strings to cycle through
    var textOptions = [
      'Freelance Web Developer',
      'Founder of NISITE WEBCRAFT',
      'UI/UX Enthusiast'
    ];

    var currentTextIndex = 0; // Which string we're on
    var currentCharIndex = 0; // Which character within that string
    var isDeleting       = false; // Are we typing or deleting?
    var typingSpeed      = 80;    // ms per character while typing
    var deletingSpeed    = 40;    // ms per character while deleting
    var pauseAfterType   = 1800;  // ms to wait after fully typing a string
    var pauseAfterDelete = 400;   // ms to wait after fully deleting

    function typeNextCharacter() {
      // Get the current full string
      var fullText    = textOptions[currentTextIndex];
      // Get the current displayed substring
      var displayText = fullText.substring(0, currentCharIndex);

      // Update the element
      typingElement.textContent = displayText;

      // Decide what to do next
      if (!isDeleting) {
        // Still typing: add one more character
        currentCharIndex++;

        if (currentCharIndex > fullText.length) {
          // Finished typing — pause, then start deleting
          isDeleting = true;
          setTimeout(typeNextCharacter, pauseAfterType);
          return;
        }

        setTimeout(typeNextCharacter, typingSpeed);

      } else {
        // Deleting: remove one character
        currentCharIndex--;

        if (currentCharIndex < 0) {
          // Finished deleting — move to next string
          isDeleting       = false;
          currentCharIndex = 0;
          currentTextIndex = (currentTextIndex + 1) % textOptions.length;
          setTimeout(typeNextCharacter, pauseAfterDelete);
          return;
        }

        setTimeout(typeNextCharacter, deletingSpeed);
      }
    }

    // Start the typing effect after 1 second (gives page time to appear)
    setTimeout(typeNextCharacter, 1000);
  }


  /* ================================================================
     8. SCROLL REVEAL ANIMATIONS
     When elements with .reveal-up / .reveal-left / .reveal-right
     enter the viewport, we add the .visible class to show them.
  ================================================================ */
  function initScrollReveal() {
    // Select all reveal elements
    var revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    // IntersectionObserver watches elements and fires when they enter/leave viewport
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Element is now visible — add class
            entry.target.classList.add('visible');
            // Stop watching this element (we only reveal once)
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: '0px 0px -40px 0px' // Start slightly before element fully enters
      }
    );

    // Start observing each element
    revealElements.forEach(function (element) {
      observer.observe(element);
    });
  }


  /* ================================================================
     9. SKILL PROGRESS RINGS
     When a skill card enters the viewport, we animate its SVG
     progress ring from 0% to the specified percentage.
  ================================================================ */
  function initSkillRings() {
    // The circumference of our circle (2 * π * 40 = 251.2)
    var FULL_CIRCUMFERENCE = 251.2;

    // Add SVG gradient definitions once
    function addSVGGradients() {
      var svgNS = 'http://www.w3.org/2000/svg';

      // We need a <defs> element in the first skill SVG
      var firstSVG = document.querySelector('.skill-ring');
      if (!firstSVG) return;

      var defs = document.createElementNS(svgNS, 'defs');
      var gradient = document.createElementNS(svgNS, 'linearGradient');
      gradient.setAttribute('id', 'ringGradient');
      gradient.setAttribute('x1', '0%');
      gradient.setAttribute('y1', '0%');
      gradient.setAttribute('x2', '100%');
      gradient.setAttribute('y2', '100%');

      var stop1 = document.createElementNS(svgNS, 'stop');
      stop1.setAttribute('offset', '0%');
      stop1.setAttribute('stop-color', '#0066ff');

      var stop2 = document.createElementNS(svgNS, 'stop');
      stop2.setAttribute('offset', '100%');
      stop2.setAttribute('stop-color', '#00d4ff');

      gradient.appendChild(stop1);
      gradient.appendChild(stop2);
      defs.appendChild(gradient);
      firstSVG.insertBefore(defs, firstSVG.firstChild);
    }

    addSVGGradients();

    // Watch each skill card and animate its ring when visible
    var skillCards = document.querySelectorAll('.skill-card');

    var ringObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var card       = entry.target;
            var percentage = parseInt(card.getAttribute('data-skill-level'), 10);
            var ringFill   = card.querySelector('.skill-ring-fill');

            if (ringFill && percentage) {
              // Calculate the stroke-dashoffset:
              // offset = circumference * (1 - percentage/100)
              // e.g. 90% → offset = 251.2 * 0.10 = 25.12 (almost full circle)
              var offset = FULL_CIRCUMFERENCE * (1 - percentage / 100);
              ringFill.style.strokeDashoffset = offset;
            }

            ringObserver.unobserve(card);
          }
        });
      },
      { threshold: 0.3 }
    );

    skillCards.forEach(function (card) {
      ringObserver.observe(card);
    });
  }


  /* ================================================================
     10. CARD TILT EFFECT (3D)
     Cards rotate slightly to follow the mouse pointer, creating
     a 3D depth illusion.
  ================================================================ */
  function initCardTilt() {
    var tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(function (card) {

      card.addEventListener('mousemove', function (event) {
        // Get the card's size and position
        var rect = card.getBoundingClientRect();

        // Mouse position relative to the card center
        var cardCenterX = rect.left + rect.width  / 2;
        var cardCenterY = rect.top  + rect.height / 2;

        // Offset from center (-1 to 1 range)
        var offsetX = (event.clientX - cardCenterX) / (rect.width  / 2);
        var offsetY = (event.clientY - cardCenterY) / (rect.height / 2);

        // Tilt amount in degrees (max 10 degrees)
        var tiltX = -offsetY * 10; // Inverted Y for natural feel
        var tiltY =  offsetX * 10;

        // Apply the 3D rotation
        card.style.transform = 'perspective(800px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) translateZ(10px)';
      });

      // Reset when mouse leaves
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        card.style.transition = 'transform 0.5s ease';
      });

      // Remove transition during move (so it's instant/responsive)
      card.addEventListener('mouseenter', function () {
        card.style.transition = 'transform 0.1s ease';
      });
    });
  }


  /* ================================================================
     11. MAGNETIC BUTTONS
     Buttons that slightly move toward the cursor when hovered,
     creating a "magnetic" attraction effect.
  ================================================================ */
  function initMagneticButtons() {
    var magneticButtons = document.querySelectorAll('.magnetic-btn');

    magneticButtons.forEach(function (button) {

      button.addEventListener('mousemove', function (event) {
        var rect = button.getBoundingClientRect();

        // Mouse position relative to button center
        var buttonCenterX = rect.left + rect.width  / 2;
        var buttonCenterY = rect.top  + rect.height / 2;

        // How far the button should move (max 10px)
        var moveX = (event.clientX - buttonCenterX) * 0.2;
        var moveY = (event.clientY - buttonCenterY) * 0.2;

        button.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
      });

      // Snap back when mouse leaves
      button.addEventListener('mouseleave', function () {
        button.style.transform = 'translate(0, 0)';
        button.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });
    });
  }


  /* ================================================================
     12. PARALLAX ON MOUSE MOVE
     Background shapes move slightly in opposite directions when
     the mouse moves, creating a subtle depth/parallax effect.
  ================================================================ */
  function initParallax() {
    var shapes = document.querySelectorAll('.shape');

    document.addEventListener('mousemove', function (event) {
      // Normalize mouse position from -1 to 1
      var mouseXNorm = (event.clientX / window.innerWidth  - 0.5) * 2;
      var mouseYNorm = (event.clientY / window.innerHeight - 0.5) * 2;

      shapes.forEach(function (shape, index) {
        // Each shape moves by a different amount
        var speed  = (index + 1) * 6;
        var moveX  = mouseXNorm * speed;
        var moveY  = mouseYNorm * speed;
        shape.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
      });
    });
  }


  /* ================================================================
     13. CONTACT FORM — VALIDATION & SUBMIT
     Validates each field before allowing submission.
     Shows a success animation on successful submit.
  ================================================================ */
  function initContactForm() {
    var contactForm    = document.getElementById('contactForm');
    var formFields     = document.getElementById('formFields');
    var formSuccess    = document.getElementById('formSuccess');
    var submitButton   = document.getElementById('submitBtn');

    if (!contactForm) return;

    // --- Validation rules for each field ---

    // Check if a string is a valid email format
    function isValidEmail(email) {
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    }

    // Show an error message under a field
    function showError(fieldId, errorId, message) {
      var field = document.getElementById(fieldId);
      var error = document.getElementById(errorId);
      if (field)  field.classList.add('has-error');
      if (error)  error.textContent = message;
    }

    // Clear all errors
    function clearAllErrors() {
      var errorSpans = document.querySelectorAll('.form-error');
      var inputFields = document.querySelectorAll('.form-input');
      errorSpans.forEach(function (span) { span.textContent = ''; });
      inputFields.forEach(function (input) { input.classList.remove('has-error'); });
    }

    // Validate all fields; returns true if everything is valid
    function validateForm() {
      clearAllErrors();

      var name    = document.getElementById('formName').value.trim();
      var email   = document.getElementById('formEmail').value.trim();
      var subject = document.getElementById('formSubject').value.trim();
      var message = document.getElementById('formMessage').value.trim();

      var isValid = true;

      // Name must be at least 2 characters
      if (name.length < 2) {
        showError('formName', 'nameError', 'Please enter your full name (at least 2 characters).');
        isValid = false;
      }

      // Email must be valid format
      if (!isValidEmail(email)) {
        showError('formEmail', 'emailError', 'Please enter a valid email address.');
        isValid = false;
      }

      // Subject must be at least 3 characters
      if (subject.length < 3) {
        showError('formSubject', 'subjectError', 'Please enter a subject for your message.');
        isValid = false;
      }

      // Message must be at least 20 characters
      if (message.length < 20) {
        showError('formMessage', 'messageError', 'Please write a message of at least 20 characters.');
        isValid = false;
      }

      return isValid;
    }

    // Real-time validation: clear error as user fixes it
    var validatedInputs = contactForm.querySelectorAll('.form-input');
    validatedInputs.forEach(function (input) {
      input.addEventListener('input', function () {
        input.classList.remove('has-error');
      });
    });

    // --- Form submission ---
    contactForm.addEventListener('submit', function (event) {
      // Prevent the default page reload
      event.preventDefault();

      // Run validation
      if (!validateForm()) {
        return; // Stop if invalid
      }

      // Show loading state on button
      var btnText    = submitButton.querySelector('.btn-text');
      var btnLoading = submitButton.querySelector('.btn-loading');
      btnText.style.display    = 'none';
      btnLoading.style.display = 'inline';
      submitButton.disabled    = true;

      // Simulate a network request (1.5 second delay)
      setTimeout(function () {
        // Hide the form fields
        formFields.style.display = 'none';

        // Show the success message
        formSuccess.classList.add('visible');

        // Reset button state
        btnText.style.display    = '';
        btnLoading.style.display = 'none';
        submitButton.disabled    = false;

        // Reset form data after showing success
        contactForm.reset();
        clearAllErrors();

      }, 1500);
    });
  }


  /* ================================================================
     14. BACK TO TOP BUTTON
     Shows a button that scrolls the page back to the top when
     the user has scrolled down more than 400px.
  ================================================================ */
  function initBackToTop() {
    var backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) return;

    // Show or hide the button based on scroll position
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    });

    // Scroll smoothly to top when button is clicked
    backToTopButton.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  /* ================================================================
     PAGE INTRO ANIMATION
     This runs after the loading screen fades out.
     Animates the home section content in.
  ================================================================ */
  function runPageIntroAnimation() {
    if (typeof gsap !== 'undefined') {
      var tl = gsap.timeline();

      // Stagger in the home section elements
      tl.from('.home-greeting', {
        y: 30, opacity: 0, duration: 0.7, ease: 'power3.out'
      })
      .from('.home-title', {
        y: 40, opacity: 0, duration: 0.8, ease: 'power3.out'
      }, '-=0.4')
      .from('.home-typing-wrapper', {
        y: 20, opacity: 0, duration: 0.6, ease: 'power3.out'
      }, '-=0.4')
      .from('.home-intro', {
        y: 20, opacity: 0, duration: 0.6, ease: 'power3.out'
      }, '-=0.3')
      .from('.home-buttons', {
        y: 20, opacity: 0, duration: 0.6, ease: 'power3.out'
      }, '-=0.3')
      .from('.home-socials', {
        y: 20, opacity: 0, duration: 0.5, ease: 'power3.out'
      }, '-=0.2')
      .from('.home-image-wrapper', {
        x: 40, opacity: 0, duration: 0.9, ease: 'power3.out'
      }, '-=0.8')
      .from('.scroll-indicator', {
        y: 10, opacity: 0, duration: 0.5, ease: 'power2.out'
      }, '-=0.2');

    } else {
      // Fallback if GSAP didn't load: just make elements visible
      document.querySelectorAll('.home-section *').forEach(function (el) {
        el.style.opacity = '1';
      });
    }
  }


  /* ================================================================
     15. SMOOTH SCROLL FOR ANCHOR LINKS
     Overrides default jump-to-section with smooth scrolling.
  ================================================================ */
  function initSmoothScroll() {
    var anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(function (link) {
      link.addEventListener('click', function (event) {
        var targetId = link.getAttribute('href');
        if (targetId === '#') return; // Skip if just "#"

        var targetElement = document.querySelector(targetId);
        if (targetElement) {
          event.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }


  /* ================================================================
     START EVERYTHING
     Call all our initialization functions here.
     Order matters! Loading screen should start first.
  ================================================================ */
  initLoadingScreen();
  initCustomCursor();
  initParticleBackground();
  initNavbar();
  initGSAPAnimations();
  initTypingEffect();
  initScrollReveal();
  initSkillRings();
  initCardTilt();
  initMagneticButtons();
  initParallax();
  initContactForm();
  initBackToTop();
  initSmoothScroll();

  // Log a friendly message in the browser console
  console.log('%c🌐 NISITE WEBCRAFT', 'font-size: 20px; font-weight: bold; color: #0066ff;');
  console.log('%cPortfolio of Nigilmurugan Sasikumar — Built with ❤️ and clean code.', 'color: #00d4ff;');

}); // End of DOMContentLoaded