// DOM Elements
const productItems = document.querySelectorAll('.product-item');
const categoryBtns = document.querySelectorAll('.category-btn');
const fullscreenView = document.querySelector('.fullscreen-view');
const fullscreenImage = document.querySelector('.fullscreen-image');
const fullscreenName = document.querySelector('.fullscreen-name');
const closeFullscreenBtn = document.querySelector('.close-fullscreen');
const prevBtn = document.querySelector('.nav-arrow.prev');
const nextBtn = document.querySelector('.nav-arrow.next');
const navLinks = document.querySelectorAll('.nav-links a');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-links');
const pages = document.querySelectorAll('.page');
const logo = document.querySelector('.logo');
const contactForm = document.querySelector('.contact-form');

// Current image index for fullscreen navigation
let currentImageIndex = 0;
let filteredItems = Array.from(productItems);

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Handle image loading
    productItems.forEach(item => {
        const img = item.querySelector('.product-image');

        if (img.complete) {
            item.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                item.classList.add('loaded');
            });

            // Fallback in case image fails to load
            img.addEventListener('error', () => {
                item.classList.add('loaded');
            });
        }
    });

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Navigation between pages
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page') + '-page';

            // Update active navigation link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Show selected page
            pages.forEach(page => {
                page.classList.remove('active');
                if (page.id === pageId) {
                    page.classList.add('active');
                }
            });
        });
    });

    // Logo click goes to home
    logo.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        navLinks[0].classList.add('active');

        pages.forEach(page => {
            page.classList.remove('active');
            if (page.id === 'home-page') {
                page.classList.add('active');
            }
        });
    });

    // Contact form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message. We will respond within 24 hours.');
        contactForm.reset();
    });
});

// Category filtering (only on home page)
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Only filter if we're on home page
        const homePage = document.getElementById('home-page');
        if (!homePage.classList.contains('active')) return;

        // Update active button
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.dataset.category;

        // Show/hide items based on category
        productItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });

        // Update filtered items for fullscreen navigation
        if (category === 'all') {
            filteredItems = Array.from(productItems).filter(item => item.style.display !== 'none');
        } else {
            filteredItems = Array.from(productItems).filter(item =>
                item.dataset.category === category && item.style.display !== 'none'
            );
        }
    });
});

// Fullscreen functionality
productItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        // Find the index within filtered items
        const imgSrc = item.querySelector('.product-image').src;
        const productName = item.querySelector('.product-name').textContent;

        currentImageIndex = filteredItems.findIndex(filteredItem =>
            filteredItem.querySelector('.product-image').src === imgSrc
        );

        // Update and show fullscreen view
        fullscreenImage.src = imgSrc;
        fullscreenName.textContent = productName;
        fullscreenView.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Update navigation buttons visibility
        updateNavButtons();
    });
});

// Close fullscreen view
closeFullscreenBtn.addEventListener('click', () => {
    fullscreenView.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Close fullscreen when clicking on background
fullscreenView.addEventListener('click', (e) => {
    if (e.target === fullscreenView) {
        fullscreenView.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Fullscreen navigation
prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateFullscreen(-1);
});

nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateFullscreen(1);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!fullscreenView.classList.contains('active')) return;

    if (e.key === 'Escape') {
        fullscreenView.classList.remove('active');
        document.body.style.overflow = 'auto';
    } else if (e.key === 'ArrowLeft') {
        navigateFullscreen(-1);
    } else if (e.key === 'ArrowRight') {
        navigateFullscreen(1);
    }
});

// Navigation function
function navigateFullscreen(direction) {
    currentImageIndex += direction;

    // Loop around if at the beginning or end
    if (currentImageIndex < 0) {
        currentImageIndex = filteredItems.length - 1;
    } else if (currentImageIndex >= filteredItems.length) {
        currentImageIndex = 0;
    }

    // Update image and name
    const newImgSrc = filteredItems[currentImageIndex].querySelector('.product-image').src;
    const newProductName = filteredItems[currentImageIndex].querySelector('.product-name').textContent;

    fullscreenImage.src = newImgSrc;
    fullscreenName.textContent = newProductName;

    // Update navigation buttons visibility
    updateNavButtons();
}

// Update navigation button visibility
function updateNavButtons() {
    // Always show buttons if more than one item
    prevBtn.style.display = filteredItems.length > 1 ? 'flex' : 'none';
    nextBtn.style.display = filteredItems.length > 1 ? 'flex' : 'none';
}

// Initialize filtered items
filteredItems = Array.from(productItems);
// Add to DOM Elements at the top
