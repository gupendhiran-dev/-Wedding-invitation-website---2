/* =============================================
   WEDDING INVITE — PARALLAX.JS
   GSAP ScrollTrigger parallax system
   ============================================= */

function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger not loaded');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // ─── Hero Parallax Layers ─────────────────
  const hero = document.getElementById('hero');
  if (hero) {
    const layers = [
      { selector: '.layer-sky',       speed: 0.15 },
      { selector: '.layer-mountains', speed: 0.35 },
      { selector: '.layer-trees',     speed: 0.55 },
      { selector: '.layer-flora',     speed: 0.75 },
    ];

    layers.forEach(({ selector, speed }) => {
      const el = hero.querySelector(selector);
      if (!el) return;

      gsap.to(el, {
        y: () => window.innerHeight * speed * -1,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
    });

    // Hero content parallax (fade up on scroll)
    gsap.to('.hero-content', {
      y: -80,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '60% top',
        scrub: true,
      }
    });

    // Scroll indicator fade
    gsap.to('.scroll-indicator', {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: '10% top',
        end: '25% top',
        scrub: true,
      }
    });

    // Parallax mouse movement
    document.addEventListener('mousemove', (e) => {
      const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
      const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;

      layers.forEach(({ selector }, i) => {
        const el = hero.querySelector(selector);
        if (!el) return;
        const strength = (i + 1) * 8;
        gsap.to(el, {
          x: xPercent * strength,
          y: yPercent * strength * 0.5,
          duration: 1.5,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      });

      // Hero content subtle movement
      gsap.to('.hero-content', {
        x: xPercent * -15,
        y: yPercent * -8,
        duration: 1.8,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });
  }

  // ─── Section Transitions ──────────────────
  // Couple section parallax decorations
  const coupleSection = document.getElementById('couple');
  if (coupleSection) {
    gsap.fromTo('.person-card:nth-child(1)', 
      { x: -60, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 1,
        scrollTrigger: {
          trigger: coupleSection,
          start: 'top 70%',
          end: 'top 30%',
          scrub: false,
          toggleActions: 'play none none reverse',
        }
      }
    );

    gsap.fromTo('.couple-divider',
      { scale: 0.8, opacity: 0 },
      {
        scale: 1, opacity: 1, duration: 0.8,
        scrollTrigger: {
          trigger: coupleSection,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        }
      }
    );

    gsap.fromTo('.person-card:last-child',
      { x: 60, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 1,
        scrollTrigger: {
          trigger: coupleSection,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  }

  // ─── Timeline Reveals ─────────────────────
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item, i) => {
    const isOdd = i % 2 === 0;
    gsap.fromTo(item,
      {
        x: isOdd ? -60 : 60,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  });

  // ─── Event Cards Stagger ──────────────────
  const eventCards = document.querySelectorAll('.event-card');
  if (eventCards.length) {
    gsap.fromTo(eventCards,
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#events',
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  }

  // ─── Gallery Stagger ──────────────────────
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length) {
    gsap.fromTo(galleryItems,
      { scale: 0.85, opacity: 0 },
      {
        scale: 1, opacity: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#gallery',
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  }

  // ─── Countdown Reveal ─────────────────────
  gsap.fromTo('.countdown-item',
    { y: 40, opacity: 0 },
    {
      y: 0, opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'back.out(1.5)',
      scrollTrigger: {
        trigger: '#countdown',
        start: 'top 65%',
        toggleActions: 'play none none reverse',
      }
    }
  );

  // ─── Venue Reveal ─────────────────────────
  gsap.fromTo('.venue-map-container',
    { x: -50, opacity: 0 },
    {
      x: 0, opacity: 1, duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#venue',
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      }
    }
  );

  gsap.fromTo('.venue-details',
    { x: 50, opacity: 0 },
    {
      x: 0, opacity: 1, duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#venue',
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      }
    }
  );

  // ─── RSVP Form Reveal ─────────────────────
  gsap.fromTo('.rsvp-form',
    { y: 60, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#rsvp',
        start: 'top 65%',
        toggleActions: 'play none none reverse',
      }
    }
  );

  // ─── Thank You Reveal ─────────────────────
  gsap.fromTo('.thankyou-content > *',
    { y: 40, opacity: 0 },
    {
      y: 0, opacity: 1,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#thankyou',
        start: 'top 60%',
        toggleActions: 'play none none reverse',
      }
    }
  );

  // ─── Section Header Reveals ───────────────
  document.querySelectorAll('.story-header, .events .container > *:not(.events-grid), #countdown .section-label, #countdown .section-title, #rsvp .rsvp-wrapper > *:not(.rsvp-form)').forEach(el => {
    gsap.fromTo(el,
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  });

  // ─── Background Parallax on dark sections ─
  gsap.to('#our-story', {
    backgroundPosition: '50% 30%',
    ease: 'none',
    scrollTrigger: {
      trigger: '#our-story',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    }
  });

  // ─── Envelope section entrance ────────────
  gsap.fromTo('#envelope-section .envelope-prompt',
    { y: 40, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 1,
      scrollTrigger: {
        trigger: '#envelope-section',
        start: 'top 65%',
        toggleActions: 'play none none reverse',
      }
    }
  );

  gsap.fromTo('.envelope-container',
    { scale: 0.85, opacity: 0 },
    {
      scale: 1, opacity: 1, duration: 1.2,
      ease: 'back.out(1.2)',
      scrollTrigger: {
        trigger: '#envelope-section',
        start: 'top 60%',
        toggleActions: 'play none none reverse',
      }
    }
  );
}

// Init when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Delay to let Lenis init first
  setTimeout(initParallax, 100);
});
