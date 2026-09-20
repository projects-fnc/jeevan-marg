/* =========================================================
   Jeevan Marg — Main Scripts
   ========================================================= */
(function () {
    'use strict';

    /* ---------- 1. AOS (Animate On Scroll) ---------- */
    if (window.AOS) {
        AOS.init({
            once: true,
            offset: 50,
            duration: 800,
            easing: 'ease-out-cubic',
        });
    }

    /* ---------- 2. Nav shadow on scroll ---------- */
    const nav = document.getElementById('mainNav');
    if (nav) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                nav.classList.add('shadow-lg');
                nav.classList.remove('shadow-sm');
            } else {
                nav.classList.add('shadow-sm');
                nav.classList.remove('shadow-lg');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // run once on load
    }

    /* ---------- 3. Mobile menu toggle ---------- */
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon   = menuToggle ? menuToggle.querySelector('i') : null;

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = !mobileMenu.classList.contains('hidden');
            mobileMenu.classList.toggle('hidden');

            if (menuIcon) {
                menuIcon.classList.toggle('ph-list', isOpen);
                menuIcon.classList.toggle('ph-x', !isOpen);
            }
        });

        // Close menu when any link is clicked
        mobileMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                if (menuIcon) {
                    menuIcon.classList.add('ph-list');
                    menuIcon.classList.remove('ph-x');
                }
            });
        });
    }

    /* ---------- 4. Dynamic year in footer ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    /* ---------- 5. Prayer request form ---------- */
    const prayerForm = document.getElementById('prayerForm');
    const formMsg    = document.getElementById('formMessage');

    if (prayerForm && formMsg) {
        prayerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name    = document.getElementById('prayerName').value.trim();
            const request = document.getElementById('prayerRequest').value.trim();

            if (!name || !request) {
                formMsg.textContent = 'कृपया दोनों फ़ील्ड भरें।';
                formMsg.classList.remove('hidden');
                formMsg.classList.add('text-red-600');
                return;
            }

            // In a real app this would POST to a backend.
            formMsg.textContent = `धन्यवाद, ${name}! आपका प्रार्थना अनुरोध प्राप्त हो गया है।`;
            formMsg.classList.remove('hidden', 'text-red-600');
            formMsg.classList.add('text-forest');

            prayerForm.reset();

            setTimeout(() => formMsg.classList.add('hidden'), 5000);
        });
    }
})();