// Fade appear effect implementation using Intersection Observer API
class FadeAppearEffect {
    constructor(options = {}) {
        this.options = {
            selector: '.engine-info-item-container',
            threshold: 0.1,
            rootMargin: '0px',
            ...options
        };

        this.observer = null;
        this.init();
    }

    init() {
        // Create intersection observer
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('appeared');
                        // Unobserve after animation is triggered
                        this.observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: this.options.threshold,
                rootMargin: this.options.rootMargin
            }
        );

        // Start observing elements
        this.observeElements();
    }

    observeElements() {
        const elements = document.querySelectorAll(this.options.selector);
        
        if (elements.length === 0) {
            console.warn('No elements found with selector:', this.options.selector);
            return;
        }

        elements.forEach(element => {
            this.observer.observe(element);
        });
    }

    // Method to observe new elements that might be added dynamically
    observeNewElements() {
        this.observeElements();
    }
}

// Initialize the effect when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.fadeAppearEffect = new FadeAppearEffect();
});
