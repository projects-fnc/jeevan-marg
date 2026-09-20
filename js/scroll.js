/* =========================================================
   Jeevan Marg — Premium Scroll Effects (v3 - FIXED)
   Powered by Lenis (lerp mode) + IntersectionObserver + rAF
   ========================================================= */
   (function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // =====================================================
    // 1. LENIS — uses LERP for instant, responsive feel
    // =====================================================
    let lenis = null;

    if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            lerp: 0.1,              // ⬅️ KEY: instant response, smooth trail
            smoothWheel: true,
            wheelMultiplier: 1,     // 1 = normal speed
            touchMultiplier: 1.5,
            smoothTouch: false,
            infinite: false,
        });

        // Keep the rAF loop alive — bulletproof
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Explicitly start (safe even if already running)
        lenis.start();

        // Expose globally
        window.lenis = lenis;

        // ---------- Smooth anchor links ----------
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (!href || href === '#') return;

                if (href === '#top') {
                    e.preventDefault();
                    lenis.scrollTo(0, { duration: 1.2 });
                    return;
                }

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    lenis.scrollTo(target, {
                        offset: -90,
                        duration: 1.2,
                        easing: (t) => 1 - Math.pow(1 - t, 3),
                    });
                }
            });
        });
    }

    // =====================================================
    // 2. SCROLL PROGRESS BAR
    // =====================================================
    const progressBar = document.getElementById('scrollProgress');

    function updateProgress() {
        if (!progressBar) return;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress  = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
        progressBar.style.transform = `scaleX(${progress})`;
    }

    // =====================================================
    // 3. SMART NAVBAR
    // =====================================================
    const nav = document.getElementById('mainNav');
    let lastScrollY = window.scrollY;
    let navHidden = false;

    function updateNav() {
        if (!nav) return;
        const currentY = window.scrollY;
        const scrollingDown = currentY > lastScrollY;
        const isMobile = window.innerWidth < 768;

        if (!isMobile) {
            if (scrollingDown && currentY > 500 && !navHidden) {
                nav.style.transform = 'translateY(-180%)';
                navHidden = true;
            } else if (!scrollingDown && navHidden) {
                nav.style.transform = 'translateY(0)';
                navHidden = false;
            }
        } else {
            nav.style.transform = 'translateY(0)';
            navHidden = false;
        }
        lastScrollY = currentY;
    }

    // =====================================================
    // 4. HERO PARALLAX
    // =====================================================
    const heroImage   = document.querySelector('.blob-img img');
    const heroCard    = document.querySelector('.animate-float');
    const heroSection = document.getElementById('top');

    function updateParallax() {
        if (prefersReducedMotion || !heroSection) return;
        const scrolled = window.scrollY;
        if (scrolled > heroSection.offsetHeight + 100) return;

        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.12}px) scale(${1 + scrolled * 0.00015})`;
        }
        if (heroCard) {
            heroCard.style.transform = `translateY(${scrolled * -0.08}px)`;
        }
    }

    // =====================================================
    // 5. ACTIVE NAV LINK
    // =====================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#mainNav a[href^="#"]');

    function updateActiveLink() {
        if (!sections.length || !navLinks.length) return;
        const scrollPos = window.scrollY + 220;
        let currentId = '';

        sections.forEach((section) => {
            if (section.offsetTop <= scrollPos) {
                currentId = section.getAttribute('id');
            }
        });

        if (window.scrollY < 100) currentId = '';

        navLinks.forEach((link) => {
            link.classList.toggle('nav-active', link.getAttribute('href') === `#${currentId}`);
        });
    }

    // =====================================================
    // 6. BACK TO TOP
    // =====================================================
    const backToTop = document.getElementById('backToTop');

    function updateBackToTop() {
        if (!backToTop) return;
        const show = window.scrollY > 600;
        backToTop.classList.toggle('opacity-0', !show);
        backToTop.classList.toggle('pointer-events-none', !show);
    }

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            if (lenis) lenis.scrollTo(0, { duration: 1.5, easing: (t) => 1 - Math.pow(1 - t, 4) });
            else window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =====================================================
    // 7. AUTO-ADD LIFT-HOVER CLASS
    // =====================================================
    const liftSelectors = [
        '.verse-card',
        '.scripture-highlight',
        '.invite-list',
        '.question-list span',
        '.prayer-box',
        '#core-message .grid > div',
        '#gospel .flex-wrap.justify-center > span',
        '#about .grid > div',
    ];

    document.querySelectorAll(liftSelectors.join(',')).forEach((el) => {
        el.classList.add('lift-hover');
    });

    // =====================================================
    // 8. REVEAL ON SCROLL (re-triggers both directions)
    // =====================================================
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                entry.target.classList.toggle('revealed', entry.isIntersecting);
            });
        },
        {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px',
        }
    );

    document
        .querySelectorAll(
            '.verse-card, .section-image, .scripture-highlight, .question-list span, .prayer-box, .invite-list'
        )
        .forEach((el) => {
            el.classList.add('reveal-on-scroll');
            revealObserver.observe(el);
        });

    document.querySelectorAll('.verse-card').forEach((card, i) => {
        card.style.transitionDelay = `${i * 60}ms`;
    });

       // =====================================================
    // 9. CURTAIN FOOTER — bulletproof sizing
    // =====================================================
    const footer      = document.getElementById('curtainFooter');
    const pageContent = document.querySelector('.page-content');

    function updateFooterSpacing() {
        if (!footer || !pageContent) return;

        // getBoundingClientRect().height is more reliable than offsetHeight
        const h = Math.round(footer.getBoundingClientRect().height);

        if (h > 0) {
            pageContent.style.marginBottom = h + 'px';
            // Update CSS variable so you can use it in CSS if needed
            document.documentElement.style.setProperty('--footer-h', h + 'px');
        }
    }

    // 1) Run immediately (DOM is parsed)
    updateFooterSpacing();

    // 2) Run on next frame (styles applied)
    requestAnimationFrame(updateFooterSpacing);

    // 3) Run after a short delay (fonts/Tailwind settle)
    setTimeout(updateFooterSpacing, 100);
    setTimeout(updateFooterSpacing, 500);

    // 4) Run when everything including images is loaded
    window.addEventListener('load', () => {
        updateFooterSpacing();
        if (lenis) lenis.resize();
    });

    // 5) BEST: ResizeObserver — fires whenever footer height changes
    if (window.ResizeObserver && footer) {
        const ro = new ResizeObserver(() => {
            updateFooterSpacing();
            if (lenis) lenis.resize();
        });
        ro.observe(footer);
    }

    // 6) On window resize (debounced)
    let footerResizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(footerResizeTimer);
        footerResizeTimer = setTimeout(() => {
            updateFooterSpacing();
            if (lenis) lenis.resize();
        }, 150);
    }, { passive: true });

    // =====================================================
    // 10. UNIFIED SCROLL HANDLER
    // =====================================================
    function onScroll() {
        updateProgress();
        updateParallax();
        updateActiveLink();
        updateBackToTop();
        updateNav();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // =====================================================
    // 11. ESC → go home
    // =====================================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && window.scrollY > 500) {
            if (lenis) lenis.scrollTo(0, { duration: 1.2 });
            else window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // =====================================================
    // Expose for debugging
    // =====================================================
    window.__scrollSystem = {
        lenis,
        refresh: () => {
            if (lenis) lenis.resize();
            updateFooterSpacing();
            onScroll();
        },
    };
})();