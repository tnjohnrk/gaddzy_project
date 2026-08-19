// Search autocomplete setup
const globalSearchInputs = [
    { input: document.getElementById('global-search-input'), dropdown: document.getElementById('search-dropdown-results') },
    { input: document.getElementById('mobile-global-search-input'), dropdown: document.getElementById('mobile-search-dropdown-results') }
];

globalSearchInputs.forEach(group => {
    if (!group.input || !group.dropdown) return;
    
    group.input.addEventListener('input', function() {
        if (this.value.trim().length > 0) {
            group.dropdown.classList.add('active');
        } else {
            group.dropdown.classList.remove('active');
        }
    });
    
    document.addEventListener('click', function(e) {
        if (!group.input.contains(e.target) && !group.dropdown.contains(e.target)) {
            group.dropdown.classList.remove('active');
        }
    });
});

// Rotating placeholder rotator for mobile search input with smooth fade transition
function initPlaceholderRotator() {
    const input = document.getElementById('mobile-global-search-input');
    if (!input) return;

    const placeholders = [
        "Select your brand",
        "Search iPhone",
        "Search Samsung",
        "Search OnePlus",
        "Search Xiaomi"
    ];

    let currentIndex = 0;

    setInterval(() => {
        // Do not rotate if the input is focused or user has entered text
        if (document.activeElement === input || input.value.trim().length > 0) {
            return;
        }

        input.classList.add('ph-fade-out');

        setTimeout(() => {
            currentIndex = (currentIndex + 1) % placeholders.length;
            input.placeholder = placeholders[currentIndex];
            input.classList.remove('ph-fade-out');
        }, 300); // Match CSS transition duration
    }, 3500);
}

document.addEventListener('DOMContentLoaded', initPlaceholderRotator);

// Profile Menu Toggle
function toggleProfileMenu() {
    const menu = document.getElementById('profile-dropdown-menu');
    menu.classList.toggle('active');
}

document.addEventListener('click', function(e) {
    const profileBtn = document.getElementById('profile-menu-trigger');
    const menu = document.getElementById('profile-dropdown-menu');
    if (profileBtn && !profileBtn.contains(e.target) && menu && !menu.contains(e.target)) {
        menu.classList.remove('active');
    }
});

// Pincode Modal
function openPincodeModal() {
    document.getElementById('pincode-modal').classList.add('active');
}
function closePincodeModal() {
    document.getElementById('pincode-modal').classList.remove('active');
}
function savePincode() {
    const pin = document.getElementById('pincode-field').value.trim();
    if(pin.length === 6) {
        const desktopLoc = document.getElementById('selected-location-text');
        if (desktopLoc) desktopLoc.innerText = 'Pincode ' + pin;
        const mobileLoc = document.getElementById('selected-location-text-mobile');
        if (mobileLoc) mobileLoc.innerText = 'Pincode ' + pin;
        closePincodeModal();
    } else {
        alert('Please enter a valid 6-digit Indian Pincode.');
    }
}

// Valuation Modal
function openValuationModal(deviceName, price) {
    document.getElementById('val-device-name').innerText = deviceName;
    document.getElementById('val-device-price').innerText = '₹' + price.toLocaleString('en-IN');
    document.getElementById('valuation-modal').classList.add('active');
}
function closeValuationModal() {
    document.getElementById('valuation-modal').classList.remove('active');
}
function schedulePickupDemo() {
    alert('🎉 Pickup Scheduled Successfully! Our executive will contact you shortly.');
    closeValuationModal();
}

// Hero Search
function handleHeroSearch() {
    const val = document.getElementById('hero-model-input').value.trim();
    if (val.length > 3) {
        openValuationModal(val, Math.floor(Math.random() * 30000) + 15000);
    }
}

// Filter Brand Click
function filterBrand(brandName) {
    openValuationModal(brandName + ' Smartphone', Math.floor(Math.random() * 35000) + 20000);
}

// Carousel Horizontal Scroll & Infinite Looping Reset Checks
function scrollCarousel(id, offset) {
    const container = document.getElementById(id);
    if (!container) return;
    const track = container.querySelector('.carousel-track');
    if (!track) return;
    
    // Pause auto-scroll during navigation smooth scroll transition
    container.dataset.isAnimating = 'true';
    
    const originalWidth = track.scrollWidth / 3;
    const currentScroll = container.scrollLeft;
    const targetScroll = currentScroll + offset;
    
    if (offset > 0 && targetScroll > originalWidth * 2) {
        container.scrollLeft = currentScroll - originalWidth;
    } else if (offset < 0 && targetScroll < originalWidth - container.clientWidth) {
        container.scrollLeft = currentScroll + originalWidth;
    }
    
    container.scrollTo({ left: container.scrollLeft + offset, behavior: 'smooth' });
    
    // Clear animating flag after the smooth scroll completes (approx 450ms)
    if (container.scrollTimeout) clearTimeout(container.scrollTimeout);
    container.scrollTimeout = setTimeout(() => {
        container.dataset.isAnimating = 'false';
    }, 450);
}

// Infinite Carousel Setup (Item cloning, boundary resetting, drag-to-scroll, and auto-scroll)
function initInfiniteCarousel(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const track = container.querySelector('.carousel-track');
    if (!track) return;
    
    const originalCards = Array.from(track.children);
    if (originalCards.length === 0) return;
    
    // Clone all cards and append them
    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });
    
    // Clone all cards and prepend them
    originalCards.slice().reverse().forEach(card => {
        const clone = card.cloneNode(true);
        track.insertBefore(clone, track.firstChild);
    });
    
    // Set initial scroll position to start of original items
    const originalWidth = track.scrollWidth / 3;
    requestAnimationFrame(() => {
        container.scrollLeft = originalWidth;
    });
    
    // Silent boundary reset on manual scroll, drag, or auto-scroll
    container.addEventListener('scroll', () => {
        const currentScroll = container.scrollLeft;
        const width = track.scrollWidth / 3;
        
        if (currentScroll < width - container.clientWidth) {
            container.scrollLeft = currentScroll + width;
        }
        else if (currentScroll > width * 2) {
            container.scrollLeft = currentScroll - width;
        }
    });
    
    // Continuous auto-scrolling mechanism
    const autoScrollSpeed = 0.5; // px per frame, premium slow marquee speed
    let isPaused = false;
    let isDragging = false;
    
    function autoScrollStep() {
        if (!isPaused && !isDragging && container.dataset.isAnimating !== 'true') {
            container.scrollLeft += autoScrollSpeed;
        }
        requestAnimationFrame(autoScrollStep);
    }
    requestAnimationFrame(autoScrollStep);
    
    // Pause auto-scroll on hover
    container.addEventListener('mouseenter', () => {
        isPaused = true;
    });
    
    // Resume auto-scroll on leave
    container.addEventListener('mouseleave', () => {
        if (!isDragging) {
            isPaused = false;
        }
    });
    
    // Touch events for mobile devices (pausing during interaction)
    container.addEventListener('touchstart', () => {
        isPaused = true;
    });
    container.addEventListener('touchend', () => {
        isPaused = false;
    });
    container.addEventListener('touchcancel', () => {
        isPaused = false;
    });
    
    // Drag-to-scroll functionality for mouse users
    let startX;
    let startScrollLeft;
    
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        isPaused = true;
        startX = e.pageX - container.offsetLeft;
        startScrollLeft = container.scrollLeft;
        container.style.cursor = 'grabbing';
    });
    
    container.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            isPaused = false;
            container.style.cursor = 'grab';
        }
    });
    
    container.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            isPaused = false;
            container.style.cursor = 'grab';
        }
    });
    
    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 1.5;
        container.scrollLeft = startScrollLeft - walk;
    });
    
    container.style.cursor = 'grab';
}

// Adjust redirection to pages/brand.html and initialize infinite carousels & mobile nav
document.addEventListener('DOMContentLoaded', () => {
    const mobileCategoryLink = document.getElementById('mobile-category-link');
    if (mobileCategoryLink) {
        mobileCategoryLink.setAttribute('href', 'pages/brand.html');
    }
    
    initInfiniteCarousel('models-slider');

    // Mobile Navigation Drawer Toggle
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    let backdrop = document.getElementById('nav-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'nav-backdrop';
        backdrop.className = 'nav-backdrop';
        document.body.appendChild(backdrop);
    }
    
    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const isActive = mainNav.classList.contains('active');
            document.body.classList.toggle('nav-open', isActive);
            backdrop.classList.toggle('active', isActive);
            const icon = mobileNavToggle.querySelector('i');
            if (isActive) {
                icon.classList.replace('fa-bars', 'fa-xmark');
            } else {
                icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });

        backdrop.addEventListener('click', () => {
            mainNav.classList.remove('active');
            document.body.classList.remove('nav-open');
            backdrop.classList.remove('active');
            const icon = mobileNavToggle.querySelector('i');
            icon.classList.replace('fa-xmark', 'fa-bars');
        });
    }

    window.closeMobileNav = function() {
        if (mainNav && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            document.body.classList.remove('nav-open');
            if (backdrop) backdrop.classList.remove('active');
            if (mobileNavToggle) {
                const icon = mobileNavToggle.querySelector('i');
                if (icon) icon.classList.replace('fa-xmark', 'fa-bars');
            }
        }
    };

    // Toggle sub-menus inside mobile navigation accordion
    const navLinks = document.querySelectorAll('.main-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                const parent = this.parentElement;
                const hasDropdown = parent.querySelector('.nav-dropdown');
                if (hasDropdown) {
                    e.preventDefault();
                    // Close other submenus first for a clean accordion experience
                    document.querySelectorAll('.main-nav .nav-item').forEach(item => {
                        if (item !== parent) item.classList.remove('open');
                    });
                    parent.classList.toggle('open');
                }
            }
        });
    });
});


/* ==========================================================================
   TRUE INFINITE CENTER-FOCUS CAROUSEL — Top Models
   ─────────────────────────────────────────────────────────────────────────
   Track layout:  [before-clones N]  [real cards N]  [after-clones N]
                   indices 0..N-1      N..2N-1          2N..3N-1

   currentFlatIdx  — the flat index that is currently centred.
   It starts at N  (first real card).

   When the user presses NEXT from position N + (N-1) = 2N-1 (last real):
     → animate to 2N-1 + 1 = 2N  (first after-clone → looks like card 0)
     → on transitionend: silently jump to N (real card 0)

   When the user presses PREV from position N (first real):
     → animate to N - 1 = N-1  (last before-clone → looks like card N-1)
     → on transitionend: silently jump to 2N-1 (real card N-1)

   For any other normal step the track stays in the real zone.
   ========================================================================== */
(function () {
    'use strict';

    /* ── Product data ── */
    const PRODUCTS = [
        { name: 'iPhone 15 Pro Max',  price: 88500, label: 'Get Up to \u20b988,500', img: 'static/images/All-Brand-Mobile-Image/Apple/apple-iphone-15-pro-max.png',    alt: 'iPhone 15 Pro Max'  },
        { name: 'Galaxy S24 Ultra',   price: 79000, label: 'Get Up to \u20b979,000', img: 'static/images/All-Brand-Mobile-Image/Samsung/samsung-galaxy-s24-ultra.png', alt: 'Galaxy S24 Ultra'   },
        { name: 'OnePlus 12 5G',      price: 44000, label: 'Get Up to \u20b944,000', img: 'static/images/All-Brand-Mobile-Image/Oneplus/oneplus-12.png',                alt: 'OnePlus 12 5G'      },
        { name: 'Pixel 8 Pro',        price: 42500, label: 'Get Up to \u20b942,500', img: 'static/images/All-Brand-Mobile-Image/Google/google-pixel-8-pro.png',        alt: 'Pixel 8 Pro'        },
        { name: 'Xiaomi 14 Pro',      price: 38000, label: 'Get Up to \u20b938,000', img: 'static/images/All-Brand-Mobile-Image/Xiaomi/xiaomi-14.png',                  alt: 'Xiaomi 14 Pro'      },
        { name: 'Vivo X100 Pro',      price: 45000, label: 'Get Up to \u20b945,000', img: 'static/images/All-Brand-Mobile-Image/Vivo/vivo-x300-pro.png',               alt: 'Vivo X100 Pro'      },
        { name: 'Realme GT 6',        price: 32000, label: 'Get Up to \u20b932,000', img: 'static/images/All-Brand-Mobile-Image/Realme/realme-gt-6.png',               alt: 'Realme GT 6'        },
        { name: 'Nothing Phone 2',    price: 34000, label: 'Get Up to \u20b934,000', img: 'static/images/All-Brand-Mobile-Image/Nothing/nothing-phone-2.png',          alt: 'Nothing Phone 2'    },
    ];

    /* ── DOM refs ── */
    const track    = document.getElementById('top-models-track');
    const viewport = document.getElementById('top-models-viewport');
    const dotsWrap = document.getElementById('top-models-dots');
    const prevBtn  = document.getElementById('top-models-prev');
    const nextBtn  = document.getElementById('top-models-next');

    if (!track || !viewport) return;

    const N   = PRODUCTS.length;
    const GAP = 24;   // must match CSS gap (px)

    /* ── State ── */
    let currentFlatIdx = N;     // starts at first real card
    let isAnimating    = false;
    let cardWidth      = 220;
    var animationTimeout = null;
    var dragging       = false; // exposed to autoplay check
    var isHovered      = false;

    /* ── Autoplay ── */
    var autoplayInterval = null;
    const AUTOPLAY_DELAY = 2000;

    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(function () {
            stepNext();
        }, AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }

    function resetAutoplay() {
        if (!isHovered && !dragging) {
            startAutoplay();
        }
    }

    /* ── Helpers ── */
    function realIdxFromFlat(flat) {
        return ((flat % N) + N) % N;
    }

    function offsetForFlat(flat) {
        const vpCentre  = viewport.offsetWidth / 2;
        const cardStart = flat * (cardWidth + GAP);
        return vpCentre - cardStart - cardWidth / 2;
    }

    function setTranslate(x, instant) {
        if (instant) {
            track.classList.add('no-transition');
            track.style.transform = 'translateX(' + x + 'px)';
            void track.offsetWidth;               // force reflow
            track.classList.remove('no-transition');
        } else {
            track.style.transform = 'translateX(' + x + 'px)';
            if (animationTimeout) clearTimeout(animationTimeout);
            animationTimeout = setTimeout(function () {
                isAnimating = false;
            }, 350);
        }
    }

    /* ── Focus classes ── */
    function refreshClasses(centreFlat) {
        const allCards = Array.from(track.children);
        allCards.forEach(function (card, i) {
            card.classList.remove('is-active', 'is-near');
            const d = Math.abs(i - centreFlat);
            if (d === 0) card.classList.add('is-active');
            else if (d === 1) card.classList.add('is-near');
        });
    }

    /* ── Dot indicators ── */
    function refreshDots(realIdx) {
        dotsWrap.querySelectorAll('.inf-dot').forEach(function (d, i) {
            d.classList.toggle('is-active', i === realIdx);
        });
    }

    /* ── Build a single card element ── */
    function buildCard(p, realIdx) {
        const card = document.createElement('div');
        card.className = 'inf-model-card';
        card.dataset.realIdx = realIdx;
        card.innerHTML =
            '<div class="inf-model-image-holder">' +
                '<img src="' + p.img + '" alt="' + p.alt + '" loading="lazy">' +
            '</div>' +
            '<div class="inf-model-name">' + p.name + '</div>' +
            '<div class="inf-model-price">' + p.label + '</div>';
        
        card.addEventListener('click', function () {
            if (isAnimating) return;
            var cards = Array.from(track.children);
            var indexInTrack = cards.indexOf(card);
            
            if (indexInTrack === currentFlatIdx) {
                // center card → open modal
                if (typeof openValuationModal === 'function') {
                    openValuationModal(p.name, p.price);
                }
            } else if (indexInTrack === currentFlatIdx - 1) {
                // left card clicked → slide right (previous)
                stepPrev();
            } else if (indexInTrack === currentFlatIdx + 1) {
                // right card clicked → slide left (next)
                stepNext();
            }
        });
        return card;
    }

    /* ── Populate track: before-clones | real cards | after-clones ── */
    function populateTrack() {
        track.innerHTML = '';
        // before-clones  (flat 0 … N-1)
        for (var i = 0; i < N; i++) track.appendChild(buildCard(PRODUCTS[i], i));
        // real cards      (flat N … 2N-1)
        for (var i = 0; i < N; i++) track.appendChild(buildCard(PRODUCTS[i], i));
        // after-clones    (flat 2N … 3N-1)
        for (var i = 0; i < N; i++) track.appendChild(buildCard(PRODUCTS[i], i));
    }

    /* ── Build dot buttons ── */
    function buildDots() {
        dotsWrap.innerHTML = '';
        for (var i = 0; i < N; i++) {
            (function (idx) {
                var btn = document.createElement('button');
                btn.className = 'inf-dot' + (idx === 0 ? ' is-active' : '');
                btn.setAttribute('aria-label', 'Go to ' + PRODUCTS[idx].name);
                btn.dataset.idx = idx;
                btn.addEventListener('click', function () {
                    jumpToReal(idx);
                });
                dotsWrap.appendChild(btn);
            })(i);
        }
    }

    /* ── Navigate forward one step ── */
    function stepNext() {
        if (isAnimating) return;
        isAnimating = true;
        resetAutoplay();

        var targetFlat = currentFlatIdx + 1;
        currentFlatIdx = targetFlat;

        refreshClasses(targetFlat);
        refreshDots(realIdxFromFlat(targetFlat));
        setTranslate(offsetForFlat(targetFlat));
    }

    /* ── Navigate backward one step ── */
    function stepPrev() {
        if (isAnimating) return;
        isAnimating = true;
        resetAutoplay();

        var targetFlat = currentFlatIdx - 1;
        currentFlatIdx = targetFlat;

        refreshClasses(targetFlat);
        refreshDots(realIdxFromFlat(targetFlat));
        setTranslate(offsetForFlat(targetFlat));
    }

    /* ── Jump directly to a real index (for dot clicks) ── */
    function jumpToReal(realIdx) {
        var targetFlat = N + realIdx;
        if (targetFlat === currentFlatIdx) return;
        if (isAnimating) return;
        resetAutoplay();
        currentFlatIdx = targetFlat;
        refreshClasses(targetFlat);
        refreshDots(realIdx);
        setTranslate(offsetForFlat(targetFlat));
        isAnimating = true;
    }

    /* ── After each CSS transition: silently correct if in clone zone ── */
    track.addEventListener('transitionend', function (e) {
        if (e.target !== track) return;
        if (e.propertyName !== 'transform') return;
        isAnimating = false;
        if (animationTimeout) {
            clearTimeout(animationTimeout);
            animationTimeout = null;
        }

        // If we ended up in the after-clone zone (>= 2N), jump back to real zone
        if (currentFlatIdx >= N * 2) {
            currentFlatIdx = currentFlatIdx - N;   // wrap back
            setTranslate(offsetForFlat(currentFlatIdx), true /* instant */);
            refreshClasses(currentFlatIdx);
        }
        // If we ended up in the before-clone zone (< N), jump forward to real zone
        else if (currentFlatIdx < N) {
            currentFlatIdx = currentFlatIdx + N;   // wrap forward
            setTranslate(offsetForFlat(currentFlatIdx), true /* instant */);
            refreshClasses(currentFlatIdx);
        }
    });

    /* ── Arrow buttons ── */
    if (prevBtn) prevBtn.addEventListener('click', stepPrev);
    if (nextBtn) nextBtn.addEventListener('click', stepNext);

    /* ── Touch / swipe & Mouse drag ── */
    (function () {
        var startX = 0, startY = 0, movedX = 0;
        var THRESHOLD = 50;

        function handleDragStart(clientX, clientY) {
            stopAutoplay();
            if (isAnimating) return false;
            startX = clientX;
            startY = clientY;
            dragging = true;
            movedX = 0;
            track.classList.add('no-transition');
            return true;
        }

        function handleDragMove(clientX, clientY, isTouch, preventDefaultFn) {
            if (!dragging) return;
            movedX = clientX - startX;

            if (isTouch) {
                var movedY = clientY - startY;
                if (Math.abs(movedY) > Math.abs(movedX) + 15) {
                    handleDragEnd(true);
                    return;
                }
            }

            if (typeof preventDefaultFn === 'function') {
                preventDefaultFn();
            }

            var currentOffset = offsetForFlat(currentFlatIdx);
            track.style.transform = 'translateX(' + (currentOffset + movedX) + 'px)';
        }

        function handleDragEnd(cancel) {
            if (!dragging) return;
            dragging = false;
            track.classList.remove('no-transition');

            if (cancel) {
                setTranslate(offsetForFlat(currentFlatIdx), true);
                startAutoplay();
                return;
            }

            if (movedX < -THRESHOLD) {
                stepNext();
            } else if (movedX > THRESHOLD) {
                stepPrev();
            } else {
                setTranslate(offsetForFlat(currentFlatIdx), false);
            }
            startAutoplay();
        }

        viewport.addEventListener('touchstart', function (e) {
            handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });

        viewport.addEventListener('touchmove', function (e) {
            handleDragMove(e.touches[0].clientX, e.touches[0].clientY, true, function () {
                if (e.cancelable) e.preventDefault();
            });
        }, { passive: false });

        viewport.addEventListener('touchend', function () {
            handleDragEnd(false);
        });

        viewport.addEventListener('touchcancel', function () {
            handleDragEnd(true);
        });

        viewport.addEventListener('mousedown', function (e) {
            if (e.button !== 0) return;
            if (handleDragStart(e.clientX, e.clientY)) {
                e.preventDefault();
            }
        });

        document.addEventListener('mousemove', function (e) {
            handleDragMove(e.clientX, e.clientY, false);
        });

        document.addEventListener('mouseup', function () {
            handleDragEnd(false);
        });

        viewport.addEventListener('mouseenter', function () {
            isHovered = true;
            stopAutoplay();
        });

        viewport.addEventListener('mouseleave', function () {
            isHovered = false;
            startAutoplay();
        });
    })();

    /* ── Keyboard ── */
    document.addEventListener('keydown', function (e) {
        var activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT')) {
            return;
        }

        var rect = viewport.getBoundingClientRect();
        var inViewport = (rect.top < window.innerHeight && rect.bottom > 0);
        if (!inViewport) return;

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            stepPrev();
        }
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            stepNext();
        }
    });

    /* ── Measure card width from DOM (respects CSS breakpoints) ── */
    function measureCard() {
        var first = track.children[0];
        if (first) cardWidth = first.offsetWidth;
    }

    /* ── Initialise ── */
    function init() {
        populateTrack();
        buildDots();
        measureCard();

        currentFlatIdx = N;
        setTranslate(offsetForFlat(N), true);
        refreshClasses(N);
        refreshDots(0);

        startAutoplay();
    }

    /* ── Resize handler ── */
    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            measureCard();
            setTranslate(offsetForFlat(currentFlatIdx), true);
        }, 150);
    });

    window.addEventListener('load', function () {
        measureCard();
        setTranslate(offsetForFlat(currentFlatIdx), true);
        refreshClasses(currentFlatIdx);
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
// ==========================================================================
//  AUTOMATIC 3-STEP PROCESS CONTROLLER (Step 1 -> Step 2 -> Step 3 -> Step 1)
// ==========================================================================
document.addEventListener('DOMContentLoaded', function initRoadmap() {
    'use strict';

    // ── Config ──────────────────────────────────────────────────────────────
    const TOTAL_STEPS   = 3;
    const HOLD_MS       = 2500;   // 2.5 seconds hold time per step
    const TRANS_MS      = 500;    // 0.5s smooth transition

    // ── DOM refs ─────────────────────────────────────────────────────────────
    const wrapper  = document.getElementById('roadmap-wrapper');
    const sticky   = document.getElementById('roadmap-sticky');
    const header   = document.getElementById('roadmap-header');
    const stepCards = [null,
        document.getElementById('step-card-1'),
        document.getElementById('step-card-2'),
        document.getElementById('step-card-3')
    ];

    if (!wrapper || !sticky) return;

    // ── State ────────────────────────────────────────────────────────────────
    let activeStep  = 1;
    let cycleTimer  = null;   // holds the pending setTimeout ID
    let isRunning   = false;

    // ── Core: activate a specific step (1-indexed) ────────────────────────────
    function setActiveStep(step) {
        activeStep = step;

        // -- Step cards: toggle .is-active --
        for (let i = 1; i <= TOTAL_STEPS; i++) {
            const card = stepCards[i];
            if (!card) continue;
            if (i === step) {
                card.classList.add('is-active');
            } else {
                card.classList.remove('is-active');
            }
        }
    }

    // ── Cycle: advance one step at a time, loop infinitely ───────────────────
    function advanceToStep(step) {
        if (!isRunning) return;

        let nextStep = step;
        if (nextStep > TOTAL_STEPS) {
            nextStep = 1;
        }

        // Activate step
        setActiveStep(nextStep);

        // Schedule next step after HOLD_MS + TRANS_MS
        cycleTimer = setTimeout(() => {
            advanceToStep(nextStep + 1);
        }, HOLD_MS + TRANS_MS);
    }

    // ── Start / Stop the auto-cycle ──────────────────────────────────────────
    function startCycle() {
        if (isRunning) return;
        isRunning = true;

        if (header) header.classList.add('is-visible');

        // Start with Step 1 active immediately
        setActiveStep(1);

        // Kick off loop to advance to Step 2
        cycleTimer = setTimeout(() => {
            advanceToStep(2);
        }, HOLD_MS + TRANS_MS);
    }

    function stopCycle() {
        isRunning = false;
        if (cycleTimer) {
            clearTimeout(cycleTimer);
            cycleTimer = null;
        }
    }

    // ── IntersectionObserver: start when section is visible ────────────────
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCycle();
            } else {
                stopCycle();
            }
        });
    }, {
        threshold: 0.15
    });

    io.observe(sticky);
});

// ==========================================================================
//  INTERACTIVE WHY CHOOSE US EXPANDING SLIDER
// ==========================================================================
document.addEventListener('DOMContentLoaded', function initWhyUsSlider() {
    'use strict';

    const slider = document.getElementById('why-slider');
    if (!slider) return;

    const cards = Array.from(slider.querySelectorAll('.why-card'));
    const prevBtn = document.getElementById('why-prev-btn');
    const nextBtn = document.getElementById('why-next-btn');
    const sliderWrapper = document.querySelector('.why-slider-wrapper');

    let activeIndex = 0;
    let autoPlayInterval = null;
    let userInteractedTimeout = null;
    const AUTOPLAY_DELAY = 5000;   // 5 s auto-progress (desktop only)
    const RESUME_DELAY = 10000;    // 10 s inactivity before resuming

    // ── Dot indicator injection (mobile only) ─────────────────────────────
    let dotsContainer = null;

    function buildDots() {
        if (dotsContainer) return;
        dotsContainer = document.createElement('div');
        dotsContainer.className = 'why-mobile-dots';
        cards.forEach(function(_, i) {
            var dot = document.createElement('button');
            dot.className = 'why-mobile-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Go to card ' + (i + 1));
            dot.addEventListener('click', function() {
                setActiveCard(i);
                handleUserInteraction();
            });
            dotsContainer.appendChild(dot);
        });
        if (sliderWrapper && sliderWrapper.parentNode) {
            sliderWrapper.parentNode.insertBefore(dotsContainer, sliderWrapper.nextSibling);
        }
    }

    function updateDots(index) {
        if (!dotsContainer) return;
        Array.from(dotsContainer.children).forEach(function(dot, i) {
            dot.classList.toggle('active', i === index);
        });
    }

    function removeDots() {
        if (dotsContainer) {
            dotsContainer.remove();
            dotsContainer = null;
        }
    }

    // ── Card class assignment ─────────────────────────────────────────────
    function setActiveCard(index) {
        if (index < 0 || index >= cards.length) return;

        var prevActiveIndex = activeIndex;
        activeIndex = index;

        var nextIdx  = (index + 1) % cards.length;
        var next2Idx = (index + 2) % cards.length;
        var prevIdx  = (index - 1 + cards.length) % cards.length;

        cards.forEach(function(card, idx) {
            card.classList.remove('active', 'deck-next', 'deck-next-2', 'deck-prev', 'deck-prev-swiped');

            if (window.innerWidth <= 768) {
                if (idx === index) {
                    card.classList.add('active');
                } else if (idx === nextIdx) {
                    card.classList.add('deck-next');
                } else if (idx === next2Idx) {
                    card.classList.add('deck-next-2');
                } else if (idx === prevIdx) {
                    card.classList.add('deck-prev');
                } else if (idx === prevActiveIndex) {
                    card.classList.add('deck-prev-swiped');
                }
                // all others remain invisible (default CSS)
            } else {
                if (idx === index) {
                    card.classList.add('active');
                }
            }
        });

        updateDots(index);
    }

    function nextCard() { setActiveCard((activeIndex + 1) % cards.length); }
    function prevCard() { setActiveCard((activeIndex - 1 + cards.length) % cards.length); }

    // ── Autoplay ──────────────────────────────────────────────────────────
    function startAutoplay() {
        stopAutoplay();
        autoPlayInterval = setInterval(nextCard, AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
        if (autoPlayInterval) { clearInterval(autoPlayInterval); autoPlayInterval = null; }
    }

    function handleUserInteraction() {
        stopAutoplay();
        if (userInteractedTimeout) clearTimeout(userInteractedTimeout);
        userInteractedTimeout = setTimeout(startAutoplay, RESUME_DELAY);
    }

    // ── Desktop: click & hover ────────────────────────────────────────────
    cards.forEach(function(card, idx) {
        card.addEventListener('click', function() {
            setActiveCard(idx);
            handleUserInteraction();
        });
        card.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                setActiveCard(idx);
                handleUserInteraction();
            }
        });
    });

    if (prevBtn) prevBtn.addEventListener('click', function() { prevCard(); handleUserInteraction(); });
    if (nextBtn) nextBtn.addEventListener('click', function() { nextCard(); handleUserInteraction(); });

    // ── Mobile: horizontal swipe ──────────────────────────────────────────
    var touchStartX = 0;
    var touchStartY = 0;
    var isSwiping   = false;

    if (sliderWrapper) {
        sliderWrapper.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            isSwiping = false;
        }, { passive: true });

        sliderWrapper.addEventListener('touchmove', function(e) {
            if (window.innerWidth > 768) return;
            var dx = e.touches[0].clientX - touchStartX;
            var dy = e.touches[0].clientY - touchStartY;
            // Lock scroll only when horizontal swipe is dominant
            if (!isSwiping && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
                isSwiping = true;
            }
            if (isSwiping && e.cancelable) e.preventDefault();
        }, { passive: false });

        sliderWrapper.addEventListener('touchend', function(e) {
            if (window.innerWidth > 768) return;
            var endX = e.changedTouches[0].clientX;
            var endY = e.changedTouches[0].clientY;
            var dx = touchStartX - endX;
            var dy = Math.abs(endY - touchStartY);
            var threshold = 44;
            // Fire only when horizontal movement is dominant and passes threshold
            if (Math.abs(dx) > threshold && Math.abs(dx) > dy) {
                handleUserInteraction();
                if (dx > 0) {
                    nextCard(); // swipe left  → next card
                } else {
                    prevCard(); // swipe right → prev card
                }
            }
            isSwiping = false;
        }, { passive: true });
    }

    // ── Responsive init ───────────────────────────────────────────────────
    function init() {
        if (window.innerWidth <= 768) {
            buildDots();
        } else {
            removeDots();
        }
        setActiveCard(activeIndex);
    }

    init();

    window.addEventListener('resize', function() {
        init();
        startAutoplay();
    });

    // Start autoplay (desktop only — guarded in startAutoplay)
    startAutoplay();
});

// ==========================================================================
//  HERO BRAND SEARCH FIELD
// ==========================================================================
document.addEventListener('DOMContentLoaded', function initHeroBrandSearch() {
    'use strict';

    const wrapper   = document.getElementById('hero-brand-search-wrapper');
    const input     = document.getElementById('hero-brand-search-input');
    const dropdown  = document.getElementById('hero-brand-dropdown');
    const chevron   = document.getElementById('hero-brand-chevron');

    if (!wrapper || !input || !dropdown) return;

    // Static brand list — kept in sync with brand.html data source.
    // Extended when devices_db.json loads successfully (see fetch below).
    const fallbackBrands = [
        'Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Vivo', 'OPPO',
        'Realme', 'Motorola', 'Nothing', 'Google'
    ];

    let allBrands = [...fallbackBrands];

    // Try to fetch the full brand list from the same data source as brand.html
    fetch('data/devices_db.json')
        .then(r => r.json())
        .then(db => {
            const brands = [...new Set(db.map(d => d.brand))].sort();
            if (brands.length > 0) allBrands = brands;
        })
        .catch(() => { /* silently fall back to static list */ });

    // ── Helpers ──

    function getLogoSrc(brand) {
        const file = brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase() + '.avif';
        return 'static/images/Brand-Logo/' + file;
    }

    function openDropdown() {
        wrapper.classList.add('is-open');
        dropdown.classList.add('is-open');
    }

    function closeDropdown() {
        wrapper.classList.remove('is-open');
        dropdown.classList.remove('is-open');
    }

    function renderOptions(list) {
        if (list.length === 0) {
            dropdown.innerHTML = '<div class="hero-brand-no-results">No brands found</div>';
            return;
        }

        dropdown.innerHTML = list.map(brand => `
            <div class="hero-brand-option" data-brand="${brand}" role="option" tabindex="-1">
                <img src="${getLogoSrc(brand)}" alt="${brand}" onerror="this.style.display='none'">
                <span>${brand}</span>
            </div>
        `).join('');

        // Attach click handlers
        dropdown.querySelectorAll('.hero-brand-option').forEach(opt => {
            opt.addEventListener('click', () => selectBrandOption(opt.dataset.brand));
        });
    }

    function filterAndShow(term) {
        const q = term.trim().toLowerCase();
        const filtered = q
            ? allBrands.filter(b => b.toLowerCase().includes(q))
            : allBrands;
        renderOptions(filtered);
        openDropdown();
    }

    function selectBrandOption(brand) {
        input.value = brand;
        closeDropdown();
        // Navigate to the brand page — same route used by existing filterBrand() and brand.html
        window.location.href = 'pages/brand.html?brand=' + encodeURIComponent(brand);
    }

    // ── Events ──

    // Show all brands when the field gains focus (user clicks/tabs in)
    input.addEventListener('focus', () => filterAndShow(input.value));

    // Filter as user types
    input.addEventListener('input', () => filterAndShow(input.value));

    // Toggle dropdown on field click (already opened by focus; clicking again closes)
    wrapper.addEventListener('click', (e) => {
        if (e.target === input) return; // focus handler takes care of it
        if (dropdown.classList.contains('is-open')) {
            closeDropdown();
        } else {
            input.focus();
        }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) closeDropdown();
    });

    // Keyboard accessibility
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeDropdown();
            input.blur();
        }
        if (e.key === 'Enter') {
            const highlighted = dropdown.querySelector('.hero-brand-option.is-highlighted');
            if (highlighted) {
                selectBrandOption(highlighted.dataset.brand);
            }
        }
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const opts = Array.from(dropdown.querySelectorAll('.hero-brand-option'));
            if (!opts.length) return;
            let idx = opts.findIndex(o => o.classList.contains('is-highlighted'));
            opts.forEach(o => o.classList.remove('is-highlighted'));
            if (e.key === 'ArrowDown') idx = (idx + 1) % opts.length;
            else idx = (idx - 1 + opts.length) % opts.length;
            opts[idx].classList.add('is-highlighted');
            opts[idx].scrollIntoView({ block: 'nearest' });
        }
    });
});

document.addEventListener('DOMContentLoaded', function initMobileBottomNav() {
    const profileBottomTrigger = document.getElementById('mobile-profile-bottom-trigger');
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (profileBottomTrigger && mobileNavToggle && mainNav) {
        profileBottomTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            if (!mainNav.classList.contains('active')) {
                mobileNavToggle.click();
            }
        });
    }

    const bottomNavItems = document.querySelectorAll('.mobile-bottom-nav-item');
    bottomNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Only toggle active style, let natural navigation or trigger handle action
            if (this.id === 'mobile-profile-bottom-trigger') return;
            bottomNavItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// Testimonials Slider Initialization
document.addEventListener('DOMContentLoaded', function initTestimonialsSlider() {
    const track = document.getElementById('testimonials-track');
    const container = document.querySelector('.testimonials-slider-container');
    if (!track || !container) return;

    const cards = Array.from(track.getElementsByClassName('testimonial-card'));
    const dots = Array.from(document.querySelectorAll('.testimonials-dots .dot'));
    if (cards.length === 0) return;

    let currentIndex = 0;

    function updateDeck() {
        cards.forEach((card, idx) => {
            card.classList.remove('active', 'prev', 'next', 'next-2');
            
            if (idx === currentIndex) {
                card.classList.add('active');
            } else if (idx === (currentIndex - 1 + cards.length) % cards.length) {
                card.classList.add('prev');
            } else if (idx === (currentIndex + 1) % cards.length) {
                card.classList.add('next');
            } else if (idx === (currentIndex + 2) % cards.length) {
                card.classList.add('next-2');
            }
        });

        dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Initialize first deck state
    updateDeck();

    // Dot click triggers
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            currentIndex = idx;
            updateDeck();
        });
    });

    // Touch gesture swipe handlers
    let startY = 0;
    let endY = 0;
    let startX = 0;
    let endX = 0;

    container.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        endY = e.changedTouches[0].clientY;
        endX = e.changedTouches[0].clientX;
        handleGesture();
    }, { passive: true });

    function handleGesture() {
        const diffY = startY - endY;
        const diffX = startX - endX;

        // Detect vertical swipe (UP/DOWN) or horizontal swipe (LEFT/RIGHT)
        if (Math.abs(diffY) > 40 && Math.abs(diffY) > Math.abs(diffX)) {
            if (diffY > 0) {
                currentIndex = (currentIndex + 1) % cards.length;
            } else {
                currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            }
            updateDeck();
        } else if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0) {
                currentIndex = (currentIndex + 1) % cards.length;
            } else {
                currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            }
            updateDeck();
        }
    }
});

// ==========================================================================
// HERO BANNER CAROUSEL LOGIC (Desktop & Mobile)
// ==========================================================================
function initHeroBannerCarousel() {
    const carousels = [
        document.getElementById('hero-banner-carousel'),
        document.getElementById('mobile-hero-banner-carousel')
    ];

    carousels.forEach(carousel => {
        if (!carousel) return;
        const track = carousel.querySelector('.banner-track');
        const prevBtn = carousel.querySelector('.banner-arrow-prev');
        const nextBtn = carousel.querySelector('.banner-arrow-next');
        const dotsContainer = carousel.querySelector('.banner-pagination');

        if (!track) return;

        const slides = Array.from(track.children);
        if (slides.length === 0) return;

        const dots = dotsContainer ? Array.from(dotsContainer.children) : [];
        let currentIndex = 0;
        let autoPlayTimer = null;
        let resumeTimer = null;
        const intervalTime = 4500;

        function goToSlide(index) {
            if (index < 0) {
                currentIndex = slides.length - 1;
            } else if (index >= slides.length) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }

            track.style.transform = `translateX(-${currentIndex * 100}%)`;

            dots.forEach((dot, i) => {
                if (i === currentIndex) {
                    dot.classList.add('active');
                    dot.setAttribute('aria-current', 'true');
                } else {
                    dot.classList.remove('active');
                    dot.removeAttribute('aria-current');
                }
            });
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentIndex - 1);
        }

        function startAutoPlay() {
            stopAutoPlay();
            autoPlayTimer = setInterval(nextSlide, intervalTime);
        }

        function stopAutoPlay() {
            if (autoPlayTimer) clearInterval(autoPlayTimer);
        }

        function pauseAndScheduleResume() {
            stopAutoPlay();
            if (resumeTimer) clearTimeout(resumeTimer);
            resumeTimer = setTimeout(startAutoPlay, 3000);
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                nextSlide();
                pauseAndScheduleResume();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                prevSlide();
                pauseAndScheduleResume();
            });
        }

        dots.forEach((dot, idx) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                goToSlide(idx);
                pauseAndScheduleResume();
            });
        });

        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);

        let startX = 0;
        let startY = 0;
        let isSwiping = false;

        carousel.addEventListener('touchstart', (e) => {
            stopAutoPlay();
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwiping = true;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            isSwiping = false;
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;

            if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0) nextSlide();
                else prevSlide();
            }
            pauseAndScheduleResume();
        }, { passive: true });

        goToSlide(0);
        startAutoPlay();
    });
}

document.addEventListener('DOMContentLoaded', initHeroBannerCarousel);

// ==========================================================================
// DYNAMIC HERO TITLE SYNCHRONIZED MORPH ANIMATION (Zigzag Motion - Mobile)
// ==========================================================================
function initDynamicHeadingAnimation() {
    const yourOnElem = document.getElementById('morph-your-on');
    const getDzyElem = document.getElementById('morph-get-dzy');

    if (!yourOnElem || !getDzyElem) return;

    let isStateB = false;

    setInterval(() => {
        // Step 1: Slide OUT in opposite directions (Word 1 DOWN, Word 2 UP)
        yourOnElem.classList.add('morph-out');
        getDzyElem.classList.add('morph-out');

        setTimeout(() => {
            // Step 2: Swap Text Values
            if (!isStateB) {
                yourOnElem.textContent = 'On';
                getDzyElem.textContent = 'dzy';
                isStateB = true;
            } else {
                yourOnElem.textContent = 'Your';
                getDzyElem.textContent = 'get';
                isStateB = false;
            }

            // Step 3: Remove morph-out and apply morph-in-start (starting positions: Word 1 TOP, Word 2 BOTTOM)
            yourOnElem.classList.remove('morph-out');
            getDzyElem.classList.remove('morph-out');

            yourOnElem.classList.add('morph-in-start');
            getDzyElem.classList.add('morph-in-start');

            // Force browser reflow
            void yourOnElem.offsetWidth;
            void getDzyElem.offsetWidth;

            // Step 4: Animate smoothly to center position
            yourOnElem.classList.remove('morph-in-start');
            getDzyElem.classList.remove('morph-in-start');
        }, 320);
    }, 3500);
}

document.addEventListener('DOMContentLoaded', initDynamicHeadingAnimation);
