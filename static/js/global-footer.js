(function() {
    // 1. Detect path prefix (handles /pages/ folder hierarchy)
    const pathPrefix = window.location.pathname.includes('/pages/') ? '../' : '';

    // Determine active classes
    const isSellActive = window.location.pathname.includes('brand.html') || window.location.pathname.includes('model.html') || window.location.pathname.includes('varient.html') || window.location.pathname.includes('price.html') ? 'active' : '';
    const isHomeActive = !isSellActive ? 'active' : '';

    // 2. Build bottom navigation bar HTML
    const bottomNavHTML = `
    <div class="mobile-bottom-nav">
        <a href="${pathPrefix}index.html" class="mobile-bottom-nav-item ${isHomeActive}">
            <i class="fa-solid fa-house"></i>
            <span>Home</span>
        </a>
        <a href="${pathPrefix}pages/brand.html" class="mobile-bottom-nav-item ${isSellActive}">
            <i class="fa-solid fa-tags"></i>
            <span>Sell</span>
        </a>
        <a href="${pathPrefix}index.html#profile" class="mobile-bottom-nav-item" id="mobile-profile-bottom-trigger">
            <i class="fa-solid fa-user"></i>
            <span>Profile</span>
        </a>
    </div>
    `;

    // 3. Write synchronously into the DOM
    document.write(bottomNavHTML);

    // 4. Initialize Profile link fallback trigger on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', function() {
        const profileBottomTrigger = document.getElementById('mobile-profile-bottom-trigger');
        const mobileNavToggle = document.getElementById('mobile-nav-toggle');
        const mainNav = document.querySelector('.main-nav');
        if (profileBottomTrigger && mobileNavToggle && mainNav) {
            profileBottomTrigger.addEventListener('click', function(e) {
                e.preventDefault();
                if (!mainNav.classList.contains('active')) {
                    mobileNavToggle.click();
                }
            });
        }
    });
})();
