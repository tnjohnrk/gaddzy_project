(function() {
    // 1. Detect path prefix (handles /pages/ folder hierarchy)
    const pathPrefix = window.location.pathname.includes('/pages/') ? '../' : '';

    // Define search dropdown items HTML
    const searchDropdownHTML = `
        <div class="search-item" onclick="openValuationModal('Apple iPhone 15 Pro Max', 88500)">
            <div class="search-item-info">
                <i class="fa-solid fa-mobile-button"></i>
                <span>Apple iPhone 15 Pro Max</span>
            </div>
            <span class="search-item-price">Up to ₹88,500</span>
        </div>
        <div class="search-item" onclick="openValuationModal('Samsung Galaxy S24 Ultra', 79000)">
            <div class="search-item-info">
                <i class="fa-solid fa-mobile-button"></i>
                <span>Samsung Galaxy S24 Ultra</span>
            </div>
            <span class="search-item-price">Up to ₹79,000</span>
        </div>
        <div class="search-item" onclick="openValuationModal('OnePlus 12 5G', 44000)">
            <div class="search-item-info">
                <i class="fa-solid fa-mobile-button"></i>
                <span>OnePlus 12 5G</span>
            </div>
            <span class="search-item-price">Up to ₹44,000</span>
        </div>
        <div class="search-item" onclick="openValuationModal('Xiaomi 14 Pro', 38000)">
            <div class="search-item-info">
                <i class="fa-solid fa-mobile-button"></i>
                <span>Xiaomi 14 Pro</span>
            </div>
            <span class="search-item-price">Up to ₹38,000</span>
        </div>
    `;

    // 2. Build Global Header HTML
    const headerHTML = `
    <header class="top-header">
        <div class="container">
            <div class="header-content">
                <!-- GADDZY Logo -->
                <a href="${pathPrefix}index.html" class="logo" id="gaddzy-logo">
                    <img src="${pathPrefix}static/images/Gaddzy-Assets/logo2.png" alt="Gaddzy Logo" class="header-logo-img">
                </a>

                <!-- Search Bar -->
                <div class="search-container">
                    <div class="search-wrapper">
                        <i class="fa-solid fa-magnifying-glass search-icon"></i>
                        <input type="text" class="search-input" id="global-search-input"
                            placeholder="Search brand or model (e.g. iPhone 15, Galaxy S24)..." autocomplete="off">
                    </div>
                    <!-- Auto Search Live Dropdown -->
                    <div class="search-dropdown" id="search-dropdown-results">
                        ${searchDropdownHTML}
                    </div>
                </div>

                <!-- User Controls: Location Selector & User Profile Dropdown -->
                <div class="user-controls">
                    <!-- Location Selector with PINCODE -->
                    <button class="location-btn" id="location-btn" onclick="openPincodeModal()">
                        <i class="fa-solid fa-location-dot"></i>
                        <div class="location-text">
                            <span class="location-label">Deliver To</span>
                            <span class="location-val" id="selected-location-text">Mumbai 400001</span>
                        </div>
                        <i class="fa-solid fa-chevron-down" style="font-size: 0.7rem; color: var(--text-muted);"></i>
                    </button>

                    <!-- Profile Dropdown -->
                    <div class="profile-container">
                        <button class="profile-btn" id="profile-menu-trigger" onclick="toggleProfileMenu()">
                            <div class="avatar">JS</div>
                            <i class="fa-solid fa-chevron-down" style="font-size: 0.75rem; color: var(--text-muted);"></i>
                        </button>
                        <div class="profile-menu" id="profile-dropdown-menu">
                            <div class="profile-menu-header">
                                <div class="profile-name">John Smith</div>
                                <div class="profile-email">john.smith@example.com</div>
                            </div>
                            <a href="${pathPrefix}index.html#orders"><i class="fa-solid fa-box-open"></i> My Orders & Sales</a>
                            <a href="${pathPrefix}index.html#wallet"><i class="fa-solid fa-wallet"></i> GADDZY Wallet</a>
                            <a href="${pathPrefix}index.html#saved"><i class="fa-solid fa-heart"></i> Saved Devices</a>
                            <a href="${pathPrefix}index.html#help"><i class="fa-solid fa-headset"></i> Support & Claims</a>
                            <a href="#logout" style="color: #EF4444;"><i class="fa-solid fa-right-from-bracket"></i> Sign Out</a>
                        </div>
                    </div>

                    <!-- Mobile Header Actions: Search Icon + Profile Icon -->
                    <div class="mobile-header-actions">
                        <button class="mobile-header-action-btn" id="mobile-header-search-btn" onclick="triggerMobileSearchFocus()" aria-label="Search">
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </button>
                        <button class="mobile-header-action-btn" id="mobile-header-profile-btn" onclick="toggleMobileNav()" aria-label="Profile">
                            <i class="fa-solid fa-user"></i>
                        </button>
                    </div>

                    <!-- Mobile Menu Icon (Drawer Trigger) -->
                    <div class="mobile-menu-toggle" id="mobile-nav-toggle">
                        <i class="fa-solid fa-bars"></i>
                    </div>
                </div>
            </div>
        </div>
    </header>
    `;

    // 3. Build Global Main Navigation Drawer HTML
    const mainNavHTML = `
    <nav class="main-nav">
        <div class="container">
            <div class="nav-content">
                <!-- Mobile User Profile & Location inside navigation drawer -->
                <div class="mobile-nav-user-controls">
                    <div class="drawer-profile-header">
                        <div class="avatar">JS</div>
                        <div class="drawer-profile-info">
                            <div class="profile-name">John Smith</div>
                            <div class="profile-email">john.smith@example.com</div>
                        </div>
                    </div>
                    <button class="drawer-location-btn" onclick="openPincodeModal(); closeMobileNav();">
                        <i class="fa-solid fa-location-dot"></i>
                        <div class="location-text">
                            <span class="location-label">Deliver To</span>
                            <span class="location-val" id="selected-location-text-mobile">Mumbai 400001</span>
                        </div>
                        <i class="fa-solid fa-chevron-down" style="font-size: 0.7rem; color: var(--text-muted);"></i>
                    </button>
                    <div class="drawer-profile-links">
                        <a href="${pathPrefix}index.html#orders" onclick="closeMobileNav();"><i class="fa-solid fa-box-open"></i> My Orders & Sales</a>
                        <a href="${pathPrefix}index.html#wallet" onclick="closeMobileNav();"><i class="fa-solid fa-wallet"></i> GADDZY Wallet</a>
                        <a href="${pathPrefix}index.html#saved" onclick="closeMobileNav();"><i class="fa-solid fa-heart"></i> Saved Devices</a>
                        <a href="${pathPrefix}index.html#help" onclick="closeMobileNav();"><i class="fa-solid fa-headset"></i> Support & Claims</a>
                        <a href="#logout" onclick="closeMobileNav();" style="color: #EF4444;"><i class="fa-solid fa-right-from-bracket"></i> Sign Out</a>
                    </div>
                </div>

                <!-- Category 1: All -->
                <div class="nav-item">
                    <a href="#" class="nav-link active">
                        <i class="fa-solid fa-grid-2"></i> All Categories
                        <i class="fa-solid fa-chevron-down"></i>
                    </a>
                    <div class="nav-dropdown">
                        <div class="nav-dropdown-group">
                            <div class="nav-dropdown-title">Explore All Services</div>
                            <a href="${pathPrefix}index.html#brands">Sell Old Smartphone <i class="fa-solid fa-arrow-right"></i></a>
                            <a href="${pathPrefix}index.html#laptops">Sell Used Laptop <i class="fa-solid fa-arrow-right"></i></a>
                            <a href="${pathPrefix}index.html#tablets">Sell iPad & Tablet <i class="fa-solid fa-arrow-right"></i></a>
                            <a href="${pathPrefix}index.html#watches">Sell Smartwatch <i class="fa-solid fa-arrow-right"></i></a>
                            <a href="${pathPrefix}index.html#deals">Bulk Device Quote <i class="fa-solid fa-arrow-right"></i></a>
                        </div>
                    </div>
                </div>

                <!-- Category 2: Sell Phone -->
                <div class="nav-item">
                    <a href="${pathPrefix}index.html#brands" class="nav-link">
                        Sell Phone
                        <i class="fa-solid fa-chevron-down"></i>
                    </a>
                    <div class="nav-dropdown">
                        <div class="nav-dropdown-group">
                            <div class="nav-dropdown-title">Popular Phone Brands</div>
                            <a href="${pathPrefix}index.html#brands" onclick="closeMobileNav()">Sell Apple iPhone</a>
                            <a href="${pathPrefix}index.html#brands" onclick="closeMobileNav()">Sell Samsung Galaxy</a>
                            <a href="${pathPrefix}index.html#brands" onclick="closeMobileNav()">Sell OnePlus</a>
                            <a href="${pathPrefix}index.html#brands" onclick="closeMobileNav()">Sell Xiaomi / Mi</a>
                            <a href="${pathPrefix}index.html#brands" onclick="closeMobileNav()">Sell Vivo</a>
                            <a href="${pathPrefix}index.html#brands" onclick="closeMobileNav()">Sell OPPO</a>
                        </div>
                    </div>
                </div>

                <!-- Category 3: Sell Gadgets -->
                <div class="nav-item">
                    <a href="${pathPrefix}index.html#why-us" class="nav-link">
                        Sell Gadgets
                        <i class="fa-solid fa-chevron-down"></i>
                    </a>
                    <div class="nav-dropdown">
                        <div class="nav-dropdown-group">
                            <div class="nav-dropdown-title">Electronics & Wearables</div>
                            <a href="${pathPrefix}index.html#gadgets" onclick="closeMobileNav()"><i class="fa-solid fa-laptop" style="margin-right: 8px;"></i> Laptop</a>
                            <a href="${pathPrefix}index.html#gadgets" onclick="closeMobileNav()"><i class="fa-solid fa-tablet-screen-button" style="margin-right: 8px;"></i> Tablet</a>
                            <a href="${pathPrefix}index.html#gadgets" onclick="closeMobileNav()"><i class="fa-solid fa-stopwatch" style="margin-right: 8px;"></i> Smart Watch</a>
                            <a href="${pathPrefix}index.html#gadgets" onclick="closeMobileNav()"><i class="fa-solid fa-gamepad" style="margin-right: 8px;"></i> Gaming Consoles</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    `;

    // 4. Build Modals HTML
    const modalsHTML = `
    <!-- Pincode Modal -->
    <div class="modal-overlay" id="pincode-modal">
        <div class="modal-card">
            <div class="modal-close-btn" onclick="closePincodeModal()"><i class="fa-solid fa-xmark"></i></div>
            <h3 class="modal-title"><i class="fa-solid fa-location-dot" style="color: var(--primary);"></i> Enter Pincode</h3>
            <p style="font-size: 0.88rem; color: var(--text-muted);">Enter your 6-digit postal pincode to check instant doorstep pickup availability.</p>
            <div class="pincode-input-group">
                <input type="text" id="pincode-field" maxlength="6" placeholder="400001" value="400001">
                <button class="btn btn-primary" onclick="savePincode()">Check</button>
            </div>
            <p style="font-size: 0.78rem; color: var(--accent-green); font-weight: 600;">
                <i class="fa-solid fa-circle-check"></i> Free doorstep pickup available in your city!
            </p>
        </div>
    </div>

    <!-- Valuation Quote Modal -->
    <div class="modal-overlay" id="valuation-modal">
        <div class="modal-card">
            <div class="modal-close-btn" onclick="closeValuationModal()"><i class="fa-solid fa-xmark"></i></div>
            <span class="badge badge-green" style="margin-bottom: 12px;"><i class="fa-solid fa-check"></i> Instant Valuation Quote</span>
            <h3 class="modal-title" id="val-device-name">Apple iPhone 15 Pro Max</h3>
            <div style="background: var(--primary-soft); padding: 20px; border-radius: var(--radius-lg); margin: 20px 0; text-align: center;">
                <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">ESTIMATED RESALE VALUE</div>
                <div style="font-family: 'Outfit', sans-serif; font-size: 2.4rem; font-weight: 800; color: var(--primary);" id="val-device-price">₹88,500</div>
                <div style="font-size: 0.78rem; color: var(--accent-green); font-weight: 700;">Includes ₹3,000 Exchange Cash Bonus</div>
            </div>
            <button class="btn btn-primary" style="width: 100%; font-size: 1rem; padding: 14px;" onclick="schedulePickupDemo()">
                <i class="fa-solid fa-calendar-check"></i> Schedule Free Doorstep Pickup
            </button>
        </div>
    </div>
    `;

    // 5. Write synchronously into the DOM
    document.write(headerHTML + mainNavHTML + modalsHTML);

    // 6. Global Navigation Event Fallbacks
    window.openPincodeModal = window.openPincodeModal || function() {
        const modal = document.getElementById('pincode-modal');
        if (modal) modal.classList.add('is-open');
    };

    window.closePincodeModal = window.closePincodeModal || function() {
        const modal = document.getElementById('pincode-modal');
        if (modal) modal.classList.remove('is-open');
    };

    window.savePincode = window.savePincode || function() {
        const pin = document.getElementById('pincode-field').value;
        if (pin.length === 6) {
            const loc = document.getElementById('selected-location-text');
            const locMob = document.getElementById('selected-location-text-mobile');
            if (loc) loc.innerText = "Pincode " + pin;
            if (locMob) locMob.innerText = "Pincode " + pin;
            localStorage.setItem('gaddzy_pincode', pin);
            closePincodeModal();
        }
    };

    window.openValuationModal = window.openValuationModal || function(deviceName, price) {
        const vName = document.getElementById('val-device-name');
        const vPrice = document.getElementById('val-device-price');
        const modal = document.getElementById('valuation-modal');
        if (vName) vName.innerText = deviceName;
        if (vPrice) vPrice.innerText = '₹' + price.toLocaleString('en-IN');
        if (modal) modal.classList.add('active');
    };

    window.closeValuationModal = window.closeValuationModal || function() {
        const modal = document.getElementById('valuation-modal');
        if (modal) modal.classList.remove('active');
    };

    window.schedulePickupDemo = window.schedulePickupDemo || function() {
        alert('📅 Pickup Scheduled Successfully! Our executive will contact you shortly.');
        closeValuationModal();
    };

    window.toggleProfileMenu = window.toggleProfileMenu || function() {
        const menu = document.getElementById('profile-dropdown-menu');
        if (menu) menu.classList.toggle('is-open');
    };

    window.closeMobileNav = window.closeMobileNav || function() {
        const mainNav = document.querySelector('.main-nav');
        if (mainNav) mainNav.classList.remove('active');
    };

    // Initialize Event Listeners on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', function() {
        // Load Pincode
        const savedPin = localStorage.getItem('gaddzy_pincode') || '400001';
        const pincodeField = document.getElementById('pincode-field');
        if (pincodeField) pincodeField.value = savedPin;
        const locText = document.getElementById('selected-location-text');
        const locTextMob = document.getElementById('selected-location-text-mobile');
        if (locText) locText.innerText = "Mumbai " + savedPin;
        if (locTextMob) locTextMob.innerText = "Mumbai " + savedPin;

        // Drawer toggle click
        const mobileNavToggle = document.getElementById('mobile-nav-toggle');
        const mainNav = document.querySelector('.main-nav');
        if (mobileNavToggle && mainNav) {
            mobileNavToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                mainNav.classList.toggle('active');
            });
        }

        // Click outside profile dropdown to dismiss
        document.addEventListener('click', function(e) {
            const profileContainer = document.querySelector('.profile-container');
            if (profileContainer && !profileContainer.contains(e.target)) {
                const menu = document.getElementById('profile-dropdown-menu');
                if (menu) menu.classList.remove('is-open');
            }
        });

        // Typing animation for search placeholder
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) {
            const searchTerms = ['BRANDS', 'MODELS', 'IPHONE 13', 'GALAXY S24 ULTRA', 'ONEPLUS 12'];
            let termIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            
            function typePlaceholder() {
                if (searchInput === document.activeElement && searchInput.value.length > 0) {
                    // Pause animation if user is typing
                    setTimeout(typePlaceholder, 2000);
                    return;
                }
                
                const currentTerm = searchTerms[termIndex];
                let typingSpeed = isDeleting ? 50 : 100;
                
                if (!isDeleting && charIndex === currentTerm.length) {
                    isDeleting = true;
                    typingSpeed = 2000; // Pause at end of word
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    termIndex = (termIndex + 1) % searchTerms.length;
                    typingSpeed = 500; // Pause before next word
                }
                
                searchInput.setAttribute('placeholder', 'SEARCH FOR ' + currentTerm.substring(0, charIndex) + (isDeleting && charIndex === 0 ? '' : '|'));
                
                if (isDeleting) {
                    charIndex--;
                } else if (charIndex < currentTerm.length) {
                    charIndex++;
                }
                
                setTimeout(typePlaceholder, typingSpeed);
            }
            
            setTimeout(typePlaceholder, 1000);
        }

        // Search inputs autocomplete setup
        const globalSearchInputs = [
            { input: document.getElementById('global-search-input'), dropdown: document.getElementById('search-dropdown-results') }
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

        // Trigger search input focus on mobile
        window.triggerMobileSearchFocus = function() {
            const mobileSearch = document.getElementById('mobile-global-search-input') || document.getElementById('global-search-input');
            if (mobileSearch) {
                mobileSearch.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => mobileSearch.focus(), 300);
            }
        };
    });
})();
