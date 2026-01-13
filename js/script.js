// ============================================
// GLOBAL FUNCTIONALITY
// ============================================

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    initLoadingScreen();
    initStickyHeader();
    initBackToTop();
    initMobileMenu();
    initPortfolio();
    initPortfolioItem();
    initPricingSearch();
    initScrollAnimations();
    initNavigation();
    initPricingScroll();
});

// ============================================
// LOADING SCREEN
// ============================================

function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (!loadingScreen) return;
    
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const promises = [];
    
    // Wait for window to fully load (all resources)
    const windowLoadPromise = new Promise((resolve) => {
        if (document.readyState === 'complete') {
            resolve();
        } else {
            window.addEventListener('load', resolve);
        }
    });
    promises.push(windowLoadPromise);
    
    // Wait for fonts to load
    if (document.fonts && document.fonts.ready) {
        promises.push(document.fonts.ready);
    }
    
    // Page-specific critical image loading
    if (currentPage === 'index.html' || window.location.pathname === '/' || window.location.pathname === '/index.html') {
        // Preload hero background image
        const heroImage = new Image();
        heroImage.src = '/assets/gallery/nathon-oski-EW_rqoSdDes-unsplash.jpg';
        promises.push(new Promise((resolve) => {
            heroImage.onload = resolve;
            heroImage.onerror = resolve; // Resolve even on error to not block
        }));
    }
    
    // Preload logo for all pages
    const logo = new Image();
    logo.src = '/assets/logo.png';
    promises.push(new Promise((resolve) => {
        logo.onload = resolve;
        logo.onerror = resolve;
    }));
    
    // Wait for all critical assets to load
    Promise.all(promises).then(() => {
        // Additional delay for smooth transition
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            // Remove from DOM after animation completes
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 300);
    });
    
    // Fallback: hide loading screen after max 4 seconds even if assets fail
    setTimeout(() => {
        if (!loadingScreen.classList.contains('hidden')) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 4000);
}

// ============================================
// STICKY HEADER
// ============================================

function initStickyHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ============================================
// BACK TO TOP BUTTON
// ============================================

function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // Smooth scroll to top on click
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// MOBILE MENU
// ============================================

function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (!mobileToggle || !nav) return;

    mobileToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            mobileToggle.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!nav.contains(event.target) && !mobileToggle.contains(event.target)) {
            nav.classList.remove('active');
            mobileToggle.classList.remove('active');
        }
    });
}

// ============================================
// PORTFOLIO FILTER & GALLERY
// ============================================

function initPortfolio() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    if (!portfolioGrid) return;

    // Portfolio data - barber shop styles (matched with actual gallery images)
    const portfolioItems = [
        { id: 1, image: '/assets/gallery/clasichair.jpg.avif', title: 'КЛАСИЧЕСКО ПОДСТРИГВАНЕ', category: 'КЛАСИЧЕСКИ', tags: ['short'], description: 'Класическото мъжко подстригване е безвременен стил, който подчертава естествените линии. Перфектно за всеки мъж, който иска елегантен и професионален вид. Запазете си час сега!', slug: 'класическо-подстригване' },
        { id: 2, image: '/assets/gallery/skinfade.jpg', title: 'SKIN FADE', category: 'FADE', tags: ['long'], description: 'Skin Fade е модерен стил с плавно преминаване от къса към гола кожа. Създава остр и стилен вид, перфектен за съвременния мъж. Запазете си час сега!', slug: 'skin-fade' },
        { id: 3, image: '/assets/gallery/lowfade.jpg', title: 'LOW FADE', category: 'FADE', tags: ['long'], description: 'Low Fade е универсален стил с плавно преминаване в долната част. Идеален за всеки тип коса и форма на глава. Запазете си час сега!', slug: 'low-fade' },
        { id: 4, image: '/assets/gallery/CLASSIC FADE.jpg', title: 'HIGH FADE', category: 'FADE', tags: ['long'], description: 'High Fade е смел и модерен стил с високо преминаване. Създава драматичен контраст и подчертава структурата на косата. Запазете си час сега!', slug: 'high-fade' },
        { id: 5, image: '/assets/gallery/undercut.avif', title: 'UNDERCUT', category: 'СРЕДНА ДЪЛЖИНА', tags: ['medium'], description: 'Undercut е стилен вариант с къса долна част и по-дълга горна. Перфектен за мъже, които искат модерен и елегантен вид. Запазете си час сега!', slug: 'undercut' },
        { id: 6, image: '/assets/gallery/MODERN POMPADOUR.jpg', title: 'POMPADOUR', category: 'СРЕДНА ДЪЛЖИНА', tags: ['medium'], description: 'Pompadour е класически стил с висок обем отпред. Създава уверен и професионален вид, подходящ за всеки случай. Запазете си час сега!', slug: 'pompadour' },
        { id: 7, image: '/assets/gallery/quiff.webp', title: 'QUIFF', category: 'СРЕДНА ДЪЛЖИНА', tags: ['medium'], description: 'Quiff е модерен стил с текстурирана горна част и къси страни. Идеален за активни мъже, които искат стил и лекота. Запазете си час сега!', slug: 'quiff' },
        { id: 8, image: '/assets/gallery/sidepart.jpg', title: 'SIDE PART', category: 'КЛАСИЧЕСКИ', tags: ['short'], description: 'Side Part е елегантен класически стил с страничен дял. Перфектен за официални събития и професионална среда. Запазете си час сега!', slug: 'side-part' },
        { id: 9, image: '/assets/gallery/texturedcrop.webp', title: 'TEXTURED CROP', category: 'КЛАСИЧЕСКИ', tags: ['short'], description: 'Textured Crop е модерен стил с къса текстурирана коса. Създава естествен и небрежен вид, перфектен за ежедневен стил. Запазете си час сега!', slug: 'textured-crop' },
        { id: 10, image: '/assets/gallery/frecnh crop.avif', title: 'FRENCH CROP', category: 'КЛАСИЧЕСКИ', tags: ['short'], description: 'French Crop е стилен вариант с къса коса и права челка. Модерен и практичен стил, подходящ за всеки мъж. Запазете си час сега!', slug: 'french-crop' },
        { id: 11, image: '/assets/gallery/classic-comb-over-haircut-men.webp', title: 'COMB OVER', category: 'СРЕДНА ДЪЛЖИНА', tags: ['medium'], description: 'Comb Over е класически стил с причесана на една страна коса. Елегантен и професионален вид за всеки случай. Запазете си час сега!', slug: 'comb-over' },
        { id: 12, image: '/assets/gallery/midfade.jpg', title: 'MID FADE', category: 'FADE', tags: ['long'], description: 'Mid Fade е балансиран стил с преминаване в средата. Универсален и стилен вариант за всеки тип коса. Запазете си час сега!', slug: 'mid-fade' },
        { id: 13, image: '/assets/gallery/buzzcut.jpg', title: 'BUZZ CUT', category: 'КЛАСИЧЕСКИ', tags: ['short'], description: 'Buzz Cut е минималистичен стил с еднакво къса коса навсякъде. Практичен и лесен за поддръжка, перфектен за активни мъже. Запазете си час сега!', slug: 'buzz-cut' },
        { id: 14, image: '/assets/gallery/IVY LEAGUE.jpg', title: 'IVY LEAGUE', category: 'СРЕДНА ДЪЛЖИНА', tags: ['medium'], description: 'Ivy League е класически стил с къса коса отстрани и по-дълга отгоре. Елегантен и професионален вид. Запазете си час сега!', slug: 'ivy-league' },
        { id: 15, image: '/assets/gallery/taperfade.webp', title: 'TAPER FADE', category: 'FADE', tags: ['long'], description: 'Taper Fade е стилен вариант с постепенно преминаване. Създава чист и професионален вид, подходящ за всеки случай. Запазете си час сега!', slug: 'taper-fade' },
        { id: 16, image: '/assets/gallery/CLASSIC FADE.jpg', title: 'CLASSIC FADE', category: 'FADE', tags: ['long'], description: 'Classic Fade е безвременен стил с плавно преминаване. Универсален и елегантен вариант за всеки мъж. Запазете си час сега!', slug: 'classic-fade' },
        { id: 17, image: '/assets/gallery/SLICKED BACK.webp', title: 'SLICKED BACK', category: 'СРЕДНА ДЪЛЖИНА', tags: ['medium'], description: 'Slicked Back е елегантен стил с причесана назад коса. Създава уверен и професионален вид. Запазете си час сега!', slug: 'slicked-back' },
        { id: 18, image: '/assets/gallery/MODERN POMPADOUR.jpg', title: 'MODERN POMPADOUR', category: 'СРЕДНА ДЪЛЖИНА', tags: ['medium'], description: 'Modern Pompadour е съвременна интерпретация на класическия стил. Смел и стилен вид за модерния мъж. Запазете си час сега!', slug: 'modern-pompadour' },
        { id: 19, image: '/assets/gallery/SHORT BACK & SIDES.jpg', title: 'SHORT BACK & SIDES', category: 'КЛАСИЧЕСКИ', tags: ['short'], description: 'Short Back & Sides е класически стил с къса коса отзад и отстрани. Практичен и професионален вид. Запазете си час сега!', slug: 'short-back-sides' },
        { id: 20, image: '/assets/gallery/TEXTURED FADE.webp', title: 'TEXTURED FADE', category: 'FADE', tags: ['long'], description: 'Textured Fade комбинира fade техника с текстурирана горна част. Модерен и стилен вариант. Запазете си час сега!', slug: 'textured-fade' },
        { id: 21, image: '/assets/gallery/CLASSIC CUT.jpg', title: 'CLASSIC CUT', category: 'КЛАСИЧЕСКИ', tags: ['short'], description: 'Classic Cut е традиционен стил с чисти линии и балансирана форма. Безвременен и елегантен вид. Запазете си час сега!', slug: 'classic-cut' },
        { id: 22, image: '/assets/gallery/CLASSIC FADE.jpg', title: 'FADE WITH DESIGN', category: 'FADE', tags: ['long'], description: 'Fade with Design е креативен стил с декоративни линии. Създава уникален и индивидуален вид. Запазете си час сега!', slug: 'fade-with-design' },
        { id: 23, image: '/assets/gallery/BUSINESS CUT.webp', title: 'BUSINESS CUT', category: 'СРЕДНА ДЪЛЖИНА', tags: ['medium'], description: 'Business Cut е професионален стил, подходящ за офис среда. Елегантен и консервативен вид. Запазете си час сега!', slug: 'business-cut' },
        { id: 24, image: '/assets/gallery/CONTEMPORARY FADE.webp', title: 'CONTEMPORARY FADE', category: 'FADE', tags: ['long'], description: 'Contemporary Fade е модерен стил с плавно преминаване и текстура. Перфектен за съвременния мъж. Запазете си час сега!', slug: 'contemporary-fade' }
    ];

    // Generate portfolio items
    function renderPortfolioItems(items) {
        portfolioGrid.innerHTML = '';
        
        items.forEach((item, index) => {
            const portfolioItem = document.createElement('div');
            portfolioItem.className = 'portfolio-item';
            portfolioItem.dataset.tags = item.tags.join(',');
            
            // Create placeholder if image doesn't exist
            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.title;
            img.onerror = function() {
                this.src = `data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22%3E%3Crect fill=%22%23f5f5f5%22 width=%22400%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2218%22 font-family=%22Arial%22%3E${encodeURIComponent(item.title)}%3C/text%3E%3C/svg%3E`;
            };
            
            const overlay = document.createElement('div');
            overlay.className = 'portfolio-overlay';
            
            const overlayContent = document.createElement('div');
            overlayContent.className = 'portfolio-overlay-content';
            
            const title = document.createElement('div');
            title.className = 'portfolio-overlay-title';
            title.textContent = item.title;
            
            overlayContent.appendChild(title);
            
            if (item.category) {
                const category = document.createElement('div');
                category.className = 'portfolio-overlay-category';
                // Map tags to display categories
                const displayCategory = item.tags.map(tag => {
                    if (tag === 'short') return 'КЛАСИЧЕСКИ';
                    if (tag === 'medium') return 'СРЕДНА ДЪЛЖИНА';
                    if (tag === 'long') return 'FADE';
                    return tag;
                }).join(' | ');
                category.textContent = displayCategory || item.category;
                overlayContent.appendChild(category);
            }
            overlay.appendChild(overlayContent);
            
            portfolioItem.appendChild(img);
            portfolioItem.appendChild(overlay);
            
            // Add click handler to navigate to detail page
            portfolioItem.addEventListener('click', function() {
                const slug = item.slug || item.title.toLowerCase().replace(/\s+/g, '-');
                window.location.href = `/portfolio-item/?id=${item.id}&slug=${slug}`;
            });
            
            portfolioGrid.appendChild(portfolioItem);
            
            // Trigger animation after a short delay
            setTimeout(() => {
                portfolioItem.classList.add('visible');
            }, index * 50);
        });
    }

    // Initialize with all items
    renderPortfolioItems(portfolioItems);

    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            // Filter items
            const items = portfolioGrid.querySelectorAll('.portfolio-item');
            items.forEach(item => {
                if (filter === 'all') {
                    item.classList.remove('hidden');
                    item.style.display = '';
                } else {
                    const tags = item.dataset.tags.split(',');
                    if (tags.includes(filter)) {
                        item.classList.remove('hidden');
                        item.style.display = '';
                    } else {
                        item.classList.add('hidden');
                        item.style.display = 'none';
                    }
                }
            });
        });
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe portfolio items (they handle their own animation, but this is a fallback)
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        observer.observe(item);
    });
}

// ============================================
// PORTFOLIO ITEM DETAIL PAGE
// ============================================

function initPortfolioItem() {
    // Check if we're on the portfolio item detail page
    if (!document.getElementById('itemTitle')) return;

    // Get portfolio items data (same as in initPortfolio)
    const portfolioItems = [
        { id: 1, image: '/assets/gallery/clasichair.jpg.avif', title: 'КЛАСИЧЕСКО ПОДСТРИГВАНЕ', category: 'КЛАСИЧЕСКИ', tags: ['short'], description: 'Класическото мъжко подстригване е безвременен стил, който подчертава естествените линии. Перфектно за всеки мъж, който иска елегантен и професионален вид. Запазете си час сега!', slug: 'класическо-подстригване' },
        { id: 2, image: '/assets/gallery/skinfade.jpg', title: 'SKIN FADE', category: 'FADE', tags: ['long'], description: 'Skin Fade е модерен стил с плавно преминаване от къса към гола кожа. Създава остр и стилен вид, перфектен за съвременния мъж. Запазете си час сега!', slug: 'skin-fade' },
        { id: 3, image: '/assets/gallery/lowfade.jpg', title: 'LOW FADE', category: 'FADE', tags: ['long'], description: 'Low Fade е универсален стил с плавно преминаване в долната част. Идеален за всеки тип коса и форма на глава. Запазете си час сега!', slug: 'low-fade' },
        { id: 4, image: '/assets/gallery/CLASSIC FADE.jpg', title: 'HIGH FADE', category: 'FADE', tags: ['long'], description: 'High Fade е смел и модерен стил с високо преминаване. Създава драматичен контраст и подчертава структурата на косата. Запазете си час сега!', slug: 'high-fade' },
        { id: 5, image: '/assets/gallery/undercut.avif', title: 'UNDERCUT', category: 'СРЕДНА ДЪЛЖИНА', tags: ['medium'], description: 'Undercut е стилен вариант с къса долна част и по-дълга горна. Перфектен за мъже, които искат модерен и елегантен вид. Запазете си час сега!', slug: 'undercut' },
        { id: 6, image: '/assets/gallery/MODERN POMPADOUR.jpg', title: 'POMPADOUR', category: 'СРЕДНА ДЪЛЖИНА', tags: ['medium'], description: 'Pompadour е класически стил с висок обем отпред. Създава уверен и професионален вид, подходящ за всеки случай. Запазете си час сега!', slug: 'pompadour' },
        { id: 7, image: '/assets/gallery/quiff.webp', title: 'QUIFF', category: 'СРЕДНА ДЪЛЖИНА', tags: ['medium'], description: 'Quiff е модерен стил с текстурирана горна част и къси страни. Идеален за активни мъже, които искат стил и лекота. Запазете си час сега!', slug: 'quiff' },
        { id: 8, image: '/assets/gallery/sidepart.jpg', title: 'SIDE PART', category: 'КЛАСИЧЕСКИ', tags: ['short'], description: 'Side Part е елегантен класически стил с страничен дял. Перфектен за официални събития и професионална среда. Запазете си час сега!', slug: 'side-part' },
        { id: 9, image: '/assets/gallery/texturedcrop.webp', title: 'TEXTURED CROP', category: 'КЛАСИЧЕСКИ', tags: ['short'], description: 'Textured Crop е модерен стил с къса текстурирана коса. Създава естествен и небрежен вид, перфектен за ежедневен стил. Запазете си час сега!', slug: 'textured-crop' },
        { id: 10, image: '/assets/gallery/frecnh crop.avif', title: 'FRENCH CROP', category: 'КЛАСИЧЕСКИ', tags: ['short'], description: 'French Crop е стилен вариант с къса коса и права челка. Модерен и практичен стил, подходящ за всеки мъж. Запазете си час сега!', slug: 'french-crop' },
        { id: 11, image: '/assets/gallery/classic-comb-over-haircut-men.webp', title: 'COMB OVER', category: 'СРЕДНА ДЪЛЖИНА', tags: ['medium'], description: 'Comb Over е класически стил с причесана на една страна коса. Елегантен и професионален вид за всеки случай. Запазете си час сега!', slug: 'comb-over' },
        { id: 12, image: '/assets/gallery/midfade.jpg', title: 'MID FADE', category: 'FADE', tags: ['long'], description: 'Mid Fade е балансиран стил с преминаване в средата. Универсален и стилен вариант за всеки тип коса. Запазете си час сега!', slug: 'mid-fade' },
        { id: 13, image: '/assets/gallery/buzzcut.jpg', title: 'BUZZ CUT', category: 'КЛАСИЧЕСКИ', tags: ['short'], description: 'Buzz Cut е минималистичен стил с еднакво къса коса навсякъде. Практичен и лесен за поддръжка, перфектен за активни мъже. Запазете си час сега!', slug: 'buzz-cut' },
        { id: 14, image: '/assets/gallery/IVY LEAGUE.jpg', title: 'IVY LEAGUE', category: 'СРЕДНА ДЪЛЖИНА', tags: ['medium'], description: 'Ivy League е класически стил с къса коса отстрани и по-дълга отгоре. Елегантен и професионален вид. Запазете си час сега!', slug: 'ivy-league' },
        { id: 15, image: '/assets/gallery/taperfade.webp', title: 'TAPER FADE', category: 'FADE', tags: ['long'], description: 'Taper Fade е стилен вариант с постепенно преминаване. Създава чист и професионален вид, подходящ за всеки случай. Запазете си час сега!', slug: 'taper-fade' },
        { id: 16, image: '/assets/gallery/CLASSIC FADE.jpg', title: 'CLASSIC FADE', category: 'FADE', tags: ['long'], description: 'Classic Fade е безвременен стил с плавно преминаване. Универсален и елегантен вариант за всеки мъж. Запазете си час сега!', slug: 'classic-fade' },
        { id: 17, image: '/assets/gallery/SLICKED BACK.webp', title: 'SLICKED BACK', category: 'СРЕДНА ДЪЛЖИНА', tags: ['medium'], description: 'Slicked Back е елегантен стил с причесана назад коса. Създава уверен и професионален вид. Запазете си час сега!', slug: 'slicked-back' },
        { id: 18, image: '/assets/gallery/MODERN POMPADOUR.jpg', title: 'MODERN POMPADOUR', category: 'СРЕДНА ДЪЛЖИНА', tags: ['medium'], description: 'Modern Pompadour е съвременна интерпретация на класическия стил. Смел и стилен вид за модерния мъж. Запазете си час сега!', slug: 'modern-pompadour' },
        { id: 19, image: '/assets/gallery/SHORT BACK & SIDES.jpg', title: 'SHORT BACK & SIDES', category: 'КЛАСИЧЕСКИ', tags: ['short'], description: 'Short Back & Sides е класически стил с къса коса отзад и отстрани. Практичен и професионален вид. Запазете си час сега!', slug: 'short-back-sides' },
        { id: 20, image: '/assets/gallery/TEXTURED FADE.webp', title: 'TEXTURED FADE', category: 'FADE', tags: ['long'], description: 'Textured Fade комбинира fade техника с текстурирана горна част. Модерен и стилен вариант. Запазете си час сега!', slug: 'textured-fade' },
        { id: 21, image: '/assets/gallery/CLASSIC CUT.jpg', title: 'CLASSIC CUT', category: 'КЛАСИЧЕСКИ', tags: ['short'], description: 'Classic Cut е традиционен стил с чисти линии и балансирана форма. Безвременен и елегантен вид. Запазете си час сега!', slug: 'classic-cut' },
        { id: 22, image: '/assets/gallery/CLASSIC FADE.jpg', title: 'FADE WITH DESIGN', category: 'FADE', tags: ['long'], description: 'Fade with Design е креативен стил с декоративни линии. Създава уникален и индивидуален вид. Запазете си час сега!', slug: 'fade-with-design' },
        { id: 23, image: '/assets/gallery/BUSINESS CUT.webp', title: 'BUSINESS CUT', category: 'СРЕДНА ДЪЛЖИНА', tags: ['medium'], description: 'Business Cut е професионален стил, подходящ за офис среда. Елегантен и консервативен вид. Запазете си час сега!', slug: 'business-cut' },
        { id: 24, image: '/assets/gallery/CONTEMPORARY FADE.webp', title: 'CONTEMPORARY FADE', category: 'FADE', tags: ['long'], description: 'Contemporary Fade е модерен стил с плавно преминаване и текстура. Перфектен за съвременния мъж. Запазете си час сега!', slug: 'contemporary-fade' }
    ];

    // Get item ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = parseInt(urlParams.get('id')) || 1;
    
    // Find the item
    const currentItem = portfolioItems.find(item => item.id === itemId) || portfolioItems[0];
    
    // Update page title
    document.title = `${currentItem.title} - ClearSite BARBER SHOP`;
    
    // Populate the detail page
    document.getElementById('itemTitle').textContent = currentItem.title;
    document.getElementById('itemMainImage').src = currentItem.image;
    document.getElementById('itemMainImage').alt = currentItem.title;
    document.getElementById('itemDescription').textContent = currentItem.description;
    
    // Set category
    const categoryText = currentItem.category || '';
    document.getElementById('itemCategory').textContent = categoryText;
    
    // Set tags
    const tagsText = currentItem.tags.map(tag => {
        if (tag === 'short') return 'КЛАСИЧЕСКИ';
        if (tag === 'medium') return 'СРЕДНА ДЪЛЖИНА';
        if (tag === 'long') return 'FADE';
        return tag;
    }).join(', ') || 'стилове';
    document.getElementById('itemTags').textContent = tagsText;
    
    // Load related items (exclude current item)
    const relatedItems = portfolioItems.filter(item => item.id !== currentItem.id).slice(0, 4);
    const moreWorksGrid = document.getElementById('moreWorksGrid');
    
    if (moreWorksGrid) {
        moreWorksGrid.innerHTML = '';
        relatedItems.forEach(item => {
            const workItem = document.createElement('div');
            workItem.className = 'more-works-item';
            workItem.addEventListener('click', function() {
                window.location.href = `/portfolio-item/?id=${item.id}&slug=${item.slug}`;
            });
            
            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.title;
            img.onerror = function() {
                this.src = `data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22%3E%3Crect fill=%22%23f5f5f5%22 width=%22400%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2218%22 font-family=%22Arial%22%3E${encodeURIComponent(item.title)}%3C/text%3E%3C/svg%3E`;
            };
            
            workItem.appendChild(img);
            moreWorksGrid.appendChild(workItem);
        });
    }
}

// ============================================
// PRICING SEARCH FUNCTIONALITY
// ============================================

function initPricingSearch() {
    // Search for haircut table
    const haircutSearch = document.getElementById('pricingSearch');
    const haircutTable = document.getElementById('haircutTable');
    
    if (haircutSearch && haircutTable) {
        haircutSearch.addEventListener('input', function() {
            filterTable(haircutTable, this.value);
        });
    }

    // Search for manicure table
    const manicureSearch = document.getElementById('manicureSearch');
    const manicureTable = document.getElementById('manicureTable');
    
    if (manicureSearch && manicureTable) {
        manicureSearch.addEventListener('input', function() {
            filterTable(manicureTable, this.value);
        });
    }

    // Search for therapies table
    const therapiesSearch = document.getElementById('therapiesSearch');
    const therapiesTable = document.getElementById('therapiesTable');
    
    if (therapiesSearch && therapiesTable) {
        therapiesSearch.addEventListener('input', function() {
            filterTable(therapiesTable, this.value);
        });
    }

    // Search for facial list
    const facialSearch = document.getElementById('facialSearch');
    const facialList = document.getElementById('facialList');
    
    if (facialSearch && facialList) {
        facialSearch.addEventListener('input', function() {
            filterList(facialList, this.value);
        });
    }
}

function filterTable(table, searchTerm) {
    const rows = table.querySelectorAll('tbody tr');
    const term = searchTerm.toLowerCase().trim();
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(term)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function filterList(list, searchTerm) {
    const items = list.querySelectorAll('.pricing-list-item');
    const term = searchTerm.toLowerCase().trim();
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(term)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// ============================================
// NAVIGATION ACTIVE STATE
// ============================================

function initNavigation() {
    // Get current page name
    const path = window.location.pathname;
    let currentPageId = 'index';
    
    if (path === '/' || path === '/index.html') {
        currentPageId = 'index';
    } else if (path.startsWith('/pricing/')) {
        currentPageId = 'pricing';
    } else if (path.startsWith('/portfolio/')) {
        currentPageId = 'portfolio';
    } else if (path.startsWith('/portfolio-item/')) {
        currentPageId = 'portfolio';
    } else if (path.startsWith('/contacts/')) {
        currentPageId = 'contacts';
    }
    
    // Remove all active classes
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page link
    const activeLink = document.querySelector(`.nav-link[data-page="${currentPageId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// ============================================
// PRICING SECTION SMOOTH SCROLL
// ============================================

function initPricingScroll() {
    // Handle pricing dropdown links
    document.querySelectorAll('.nav-dropdown-item').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Check if we're on the pricing page
            if (window.location.pathname.includes('/pricing/')) {
                e.preventDefault();
                const hash = href.split('#')[1];
                if (hash) {
                    const target = document.getElementById(hash);
                    if (target) {
                        const headerOffset = 100; // Account for sticky header
                        const elementPosition = target.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });
    
    // Handle hash links on page load (for direct links)
    if (window.location.hash) {
        setTimeout(() => {
            const hash = window.location.hash.substring(1);
            const target = document.getElementById(hash);
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        // Skip if it's a pricing dropdown item (handled separately)
        if (this.classList.contains('nav-dropdown-item')) {
            return;
        }
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});
