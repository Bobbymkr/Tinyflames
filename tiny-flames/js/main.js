/**
 * Tiny Flames — Main JavaScript
 * Handles interactions, animations, and dynamic features
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initAnnouncementBar();
    initHeaderScroll();
    initMobileMenu();
    initAnimations();
    initCustomizationPreview();
    initFAQAccordion();
    initDeliveryWidget();
    initCurrencySelector();
});

/**
 * Announcement Bar
 * Rotates messages and allows closing
 */
function initAnnouncementBar() {
    const announcementBar = document.getElementById('announcementBar');
    const closeBtn = announcementBar?.querySelector('.announcement-close');
    const items = announcementBar?.querySelectorAll('.announcement-item');
    
    if (!announcementBar || !items.length) return;
    
    // Close functionality
    closeBtn?.addEventListener('click', () => {
        announcementBar.style.display = 'none';
        sessionStorage.setItem('announcementClosed', 'true');
    });
    
    // Check if already closed
    if (sessionStorage.getItem('announcementClosed') === 'true') {
        announcementBar.style.display = 'none';
    }
    
    // Rotate announcements
    let currentIndex = 0;
    setInterval(() => {
        items.forEach((item, index) => {
            item.classList.toggle('active', index === currentIndex);
        });
        currentIndex = (currentIndex + 1) % items.length;
    }, 5000);
}

/**
 * Header Scroll Effect
 * Adds shadow when scrolling
 */
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Mobile Menu
 * Toggle open/close functionality
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuClose = mobileMenu?.querySelector('.mobile-menu-close');
    const menuLinks = mobileMenu?.querySelectorAll('a');
    
    if (!menuToggle || !mobileMenu) return;
    
    // Open menu
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close menu
    const closeMenu = () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    menuClose?.addEventListener('click', closeMenu);
    
    // Close on link click
    menuLinks?.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close on outside click
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            closeMenu();
        }
    });
}

/**
 * Scroll Animations
 * Trigger fade-up animations when elements come into view
 */
function initAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .fade-up');
    
    if (!animatedElements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

/**
 * Customization Preview
 * Live preview of name on candle label
 */
function initCustomizationPreview() {
    const nameInput = document.getElementById('namePreview');
    const candleLabel = document.getElementById('candleLabel');
    
    if (!nameInput || !candleLabel) return;
    
    nameInput.addEventListener('input', (e) => {
        const name = e.target.value.trim();
        const labelName = candleLabel.querySelector('.label-name');
        
        if (name) {
            labelName.textContent = name;
        } else {
            labelName.textContent = 'Your Name';
        }
    });
}

/**
 * FAQ Accordion
 * Toggle FAQ answers open/close
 */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question?.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/**
 * Delivery Widget
 * Show delivery estimates based on country selection
 */
function initDeliveryWidget() {
    const countrySelect = document.getElementById('countrySelect');
    const checkBtn = document.getElementById('checkDeliveryBtn');
    const resultDiv = document.getElementById('deliveryResult');
    
    if (!countrySelect || !checkBtn || !resultDiv) return;
    
    const deliveryTimes = {
        'US': { production: '3-5 business days', shipping: '7-12 business days', note: 'Customs clearance may add 2-3 days' },
        'GB': { production: '3-5 business days', shipping: '6-10 business days', note: 'Customs clearance may add 2-3 days' },
        'AE': { production: '3-5 business days', shipping: '5-8 business days', note: 'Free shipping on orders above $150' },
        'AU': { production: '3-5 business days', shipping: '8-14 business days', note: 'Customs clearance may add 2-3 days' },
        'CA': { production: '3-5 business days', shipping: '7-12 business days', note: 'Customs clearance may add 2-3 days' },
        'DE': { production: '3-5 business days', shipping: '6-10 business days', note: 'EU customs included in price' },
        'FR': { production: '3-5 business days', shipping: '6-10 business days', note: 'EU customs included in price' },
        'SG': { production: '3-5 business days', shipping: '5-8 business days', note: 'No customs for orders under SGD 400' },
        'IN': { production: '3-5 business days', shipping: '3-7 business days', note: 'Free shipping on orders above ₹999' }
    };
    
    checkBtn.addEventListener('click', () => {
        const country = countrySelect.value;
        
        if (!country) {
            resultDiv.innerHTML = '<p style="color: var(--color-accent);">Please select a country</p>';
            return;
        }
        
        const info = deliveryTimes[country];
        if (info) {
            resultDiv.innerHTML = `
                <div style="text-align: left;">
                    <p><strong>Production Time:</strong> ${info.production}</p>
                    <p><strong>Shipping Time:</strong> ${info.shipping}</p>
                    <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin-top: 8px;">${info.note}</p>
                </div>
            `;
        }
    });
}

/**
 * Currency Selector
 * Handle currency changes (placeholder for real implementation)
 */
function initCurrencySelector() {
    const currencySelect = document.getElementById('currencySelect');
    
    if (!currencySelect) return;
    
    currencySelect.addEventListener('change', (e) => {
        const currency = e.target.value;
        console.log(`Currency changed to: ${currency}`);
        
        // In a real implementation, this would:
        // 1. Call an API to get conversion rates
        // 2. Update all prices on the page
        // 3. Save preference to localStorage
        // 4. Refresh cart/checkout with new currency
        
        alert(`Currency will be updated to ${currency}. This is a demo - in production, all prices would update automatically.`);
    });
}

/**
 * Wishlist Functionality
 * Toggle wishlist items
 */
function initWishlist() {
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            btn.textContent = btn.textContent === '♡' ? '♥' : '♡';
            btn.style.color = btn.textContent === '♥' ? 'var(--color-accent)' : '';
        });
    });
}

/**
 * Product Quick View
 * Placeholder for quick view modal
 */
function initQuickView() {
    // Implementation for product quick view modal
    console.log('Quick view initialized');
}

/**
 * Smooth Scroll for Anchor Links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

/**
 * Lazy Loading Images
 * Improve performance by loading images as they come into view
 */
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

/**
 * Cart Count Update
 * Placeholder for cart functionality
 */
function updateCartCount(count) {
    const cartCounts = document.querySelectorAll('.cart-count');
    cartCounts.forEach(el => {
        el.textContent = count;
        if (count > 0) {
            el.style.display = 'flex';
        } else {
            el.style.display = 'none';
        }
    });
}

// Initialize wishlist
initWishlist();
