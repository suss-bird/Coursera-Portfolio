// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all JS functionality
    initMobileMenu();
    initSmoothScrolling();
    initProjectFilters();
    initProjectLightbox();
    initFormValidation();
    initDynamicTagline();
});

/**
 * Mobile Menu Functionality
 * Toggles the visibility of the navigation menu on mobile devices
 */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Update ARIA attributes for accessibility
            const isExpanded = hamburger.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close the menu when a link is clicked
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

/**
 * Smooth Scrolling Functionality
 * Enables smooth scrolling for navigation links that point to sections within the page
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default for links that point to sections on the page
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Calculate header height to offset scroll position
                    const headerHeight = document.querySelector('header').offsetHeight;
                    
                    // Get the distance from the top of the page to the target element
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    
                    // Scroll to the target with an offset for the header
                    window.scrollTo({
                        top: targetPosition - headerHeight,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * Project Filters Functionality
 * Allows filtering projects by category
 */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterButtons.length && projectCards.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Show/hide projects based on filter
                projectCards.forEach(card => {
                    if (filterValue === 'all') {
                        card.style.display = 'block';
                        // Add animation for smooth appearance
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else if (card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        // Add animation for smooth appearance
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
}

/**
 * Project Lightbox Functionality
 * Creates a lightbox/modal effect for project images when clicked
 */
function initProjectLightbox() {
    const projectImages = document.querySelectorAll('.project-img');
    
    if (projectImages.length) {
        // Create lightbox elements
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="close-lightbox">&times;</span>
                <img class="lightbox-image" src="" alt="Project image in lightbox">
                <div class="lightbox-caption"></div>
            </div>
        `;
        document.body.appendChild(lightbox);
        
        // Add CSS for lightbox
        const style = document.createElement('style');
        style.textContent = `
            .lightbox {
                display: none;
                position: fixed;
                z-index: 1100;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: rgba(0, 0, 0, 0.9);
            }
            .lightbox-content {
                margin: 5% auto;
                padding: 20px;
                max-width: 80%;
                position: relative;
            }
            .close-lightbox {
                color: #fff;
                position: absolute;
                top: -40px;
                right: 0;
                font-size: 35px;
                font-weight: bold;
                cursor: pointer;
            }
            .lightbox-image {
                display: block;
                max-width: 100%;
                max-height: 80vh;
                margin: 0 auto;
            }
            .lightbox-caption {
                color: #fff;
                text-align: center;
                padding: 10px 0;
                font-size: 1rem;
            }
        `;
        document.head.appendChild(style);
        
        // Get lightbox elements
        const lightboxElement = document.querySelector('.lightbox');
        const lightboxImg = document.querySelector('.lightbox-image');
        const lightboxCaption = document.querySelector('.lightbox-caption');
        const closeLightbox = document.querySelector('.close-lightbox');
        
        // Add click event to project images
        projectImages.forEach(img => {
            img.addEventListener('click', function() {
                lightboxImg.src = this.src;
                lightboxCaption.textContent = this.alt;
                lightboxElement.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
            });
        });
        
        // Close lightbox when clicking the close button
        closeLightbox.addEventListener('click', function() {
            lightboxElement.style.display = 'none';
            document.body.style.overflow = ''; // Re-enable scrolling
        });
        
        // Close lightbox when clicking outside of the image
        lightboxElement.addEventListener('click', function(e) {
            if (e.target === lightboxElement) {
                lightboxElement.style.display = 'none';
                document.body.style.overflow = ''; // Re-enable scrolling
            }
        });
        
        // Close lightbox with ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightboxElement.style.display === 'block') {
                lightboxElement.style.display = 'none';
                document.body.style.overflow = ''; // Re-enable scrolling
            }
        });
    }
}

/**
 * Form Validation Functionality
 * Validates the contact form before submission and provides real-time feedback
 */
function initFormValidation() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');
        
        const nameError = document.getElementById('name-error');
        const emailError = document.getElementById('email-error');
        const subjectError = document.getElementById('subject-error');
        const messageError = document.getElementById('message-error');
        
        // Validation functions
        const validators = {
            name: (value) => {
                if (!value.trim()) return 'Name is required';
                if (value.trim().length < 2) return 'Name must be at least 2 characters';
                return '';
            },
            email: (value) => {
                if (!value.trim()) return 'Email is required';
                // Simple email validation regex
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return 'Please enter a valid email address';
                return '';
            },
            subject: (value) => {
                if (!value.trim()) return 'Subject is required';
                if (value.trim().length < 3) return 'Subject must be at least 3 characters';
                return '';
            },
            message: (value) => {
                if (!value.trim()) return 'Message is required';
                if (value.trim().length < 10) return 'Message must be at least 10 characters';
                return '';
            }
        };
        
        // Helper to display error messages
        function showError(input, errorElement, message) {
            if (message) {
                errorElement.textContent = message;
                input.classList.add('error');
                input.setAttribute('aria-invalid', 'true');
            } else {
                errorElement.textContent = '';
                input.classList.remove('error');
                input.setAttribute('aria-invalid', 'false');
            }
        }
        
        // Add real-time validation on input
        nameInput.addEventListener('input', function() {
            const error = validators.name(this.value);
            showError(this, nameError, error);
        });
        
        emailInput.addEventListener('input', function() {
            const error = validators.email(this.value);
            showError(this, emailError, error);
        });
        
        subjectInput.addEventListener('input', function() {
            const error = validators.subject(this.value);
            showError(this, subjectError, error);
        });
        
        messageInput.addEventListener('input', function() {
            const error = validators.message(this.value);
            showError(this, messageError, error);
        });
        
        // Add form submission handler
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields
            const nameErrorMsg = validators.name(nameInput.value);
            const emailErrorMsg = validators.email(emailInput.value);
            const subjectErrorMsg = validators.subject(subjectInput.value);
            const messageErrorMsg = validators.message(messageInput.value);
            
            // Show all errors
            showError(nameInput, nameError, nameErrorMsg);
            showError(emailInput, emailError, emailErrorMsg);
            showError(subjectInput, subjectError, subjectErrorMsg);
            showError(messageInput, messageError, messageErrorMsg);
            
            // If no errors, form is valid
            if (!nameErrorMsg && !emailErrorMsg && !subjectErrorMsg && !messageErrorMsg) {
                // Here you would typically send the form data to a server
                // For this example, we'll just show a success message
                
                // Create success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Your message has been sent successfully!';
                successMessage.style.cssText = `
                    background-color: #4CAF50;
                    color: white;
                    padding: 15px;
                    margin-top: 20px;
                    border-radius: 4px;
                    text-align: center;
                `;
                
                // Add success message below the form
                contactForm.appendChild(successMessage);
                
                // Reset the form
                contactForm.reset();
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }
        });
    }
}

/**
 * Dynamic Tagline Effect
 * Rotates through an array of taglines in the Hero section.
 */
function initDynamicTagline() {
    const taglineElement = document.querySelector('.hero-title');
    const taglines = [
        'Transforming Ideas Into Reality',
        'Building the Future of Web',
        'Crafting Digital Masterpieces',
        'Empowering Your Online Presence'
    ];
    let currentIndex = 0;

    if (taglineElement) {
        setInterval(() => {
            currentIndex = (currentIndex + 1) % taglines.length;
            taglineElement.textContent = taglines[currentIndex];
        }, 3000); // Change tagline every 3 seconds
    }
}

// Add scroll event for header shadow effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 0) {
            header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    }
});

// Add animation for revealing elements when scrolling
window.addEventListener('DOMContentLoaded', function() {
    const revealElements = document.querySelectorAll('section');
    
    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('revealed');
            }
        });
    }
    
    // Add CSS for reveal animation
    const style = document.createElement('style');
    style.textContent = `
        section {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 1s ease, transform 1s ease;
        }
        section.revealed {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    // Initial check for elements in view
    revealOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', revealOnScroll);
});