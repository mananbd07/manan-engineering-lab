/* =========================================================
   Manan Engineering Lab - interactions
   Progressive enhancement: the page is fully usable without JS.
   ========================================================= */
(function () {
    'use strict';

    var root = document.documentElement;
    var reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Mobile navigation ---------- */
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.getElementById('nav-menu');

    function closeMenu() {
        if (!toggle || !menu) return;
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('is-open');
    }

    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            var isOpen = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!isOpen));
            menu.classList.toggle('is-open', !isOpen);
        });

        // Close after choosing a destination
        menu.addEventListener('click', function (event) {
            if (event.target.closest('a')) closeMenu();
        });

        // Close on Escape and return focus to the toggle, only when the menu is open
        document.addEventListener('keydown', function (event) {
            if (event.key !== 'Escape') return;
            if (toggle.getAttribute('aria-expanded') !== 'true') return;
            closeMenu();
            toggle.focus();
        });

        // Reset menu state when resizing up to desktop
        window.addEventListener('resize', function () {
            if (window.innerWidth > 820) closeMenu();
        }, { passive: true });
    }

    /* ---------- Header shadow on scroll ---------- */
    var header = document.querySelector('.site-header');
    if (header) {
        var onScroll = function () {
            header.classList.toggle('is-scrolled', window.scrollY > 8);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ---------- Graceful image fallback ---------- */
    var imgs = document.querySelectorAll('.card-img');
    Array.prototype.forEach.call(imgs, function (img) {
        var showFallback = function () {
            var media = img.closest('.card-media');
            if (media) media.classList.add('img-error');
        };
        img.addEventListener('error', showFallback);
        // Catch images that already failed before this script ran
        if (img.complete && img.naturalWidth === 0) showFallback();
    });

    /* ---------- Reveal on scroll ---------- */
    var reveals = document.querySelectorAll('.reveal');
    if (reveals.length) {
        var revealAll = function () {
            Array.prototype.forEach.call(reveals, function (el) {
                el.classList.add('is-visible');
            });
        };

        if (reduceMotion || !('IntersectionObserver' in window)) {
            // No animation available/desired: make sure everything is visible.
            // The 'js' class (which hides .reveal) is intentionally NOT added here.
            revealAll();
        } else {
            // Enable the hidden start state only now that we can safely reveal it.
            root.classList.add('js');

            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

            Array.prototype.forEach.call(reveals, function (el) {
                observer.observe(el);
            });

            // Safety net: never leave content permanently hidden.
            window.setTimeout(revealAll, 2500);
        }
    }

    /* ---------- Footer year ---------- */
    var year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
})();
