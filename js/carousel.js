// carousel.js - Funcionalidad del carrusel de galera

class Carousel {
    constructor() {
        this.track = document.querySelector('.carousel-track');
        this.slides = Array.from(this.track.children);
        this.nextButton = document.querySelector('.next');
        this.prevButton = document.querySelector('.prev');
        this.dots = Array.from(document.querySelectorAll('.dot'));
        this.currentSlideElement = document.getElementById('current-slide');
        this.totalSlidesElement = document.getElementById('total-slides');
        this.galleryButtons = document.querySelectorAll('.gallery-btn');
        
        this.currentSlide = 0;
        this.slideWidth = this.slides[0]?.getBoundingClientRect().width || 0;
        this.totalSlides = this.slides.length;
        this.autoSlideInterval = null;
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        // Inicializar
        this.totalSlidesElement.textContent = this.totalSlides;
        this.updateSlidePosition();
        this.updateDots();
        
        // Organizar slides
        this.slides.forEach((slide, index) => {
            slide.style.left = this.slideWidth * index + 'px';
        });
        
        // Event Listeners
        this.nextButton?.addEventListener('click', () => this.next());
        this.prevButton?.addEventListener('click', () => this.prev());
        
        // Navegacin por dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Botones de filtro
        this.galleryButtons.forEach(button => {
            button.addEventListener('click', (e) => this.filterGallery(e));
        });
        
        // Auto slide
        this.startAutoSlide();
        
        // Pausar auto-slide al hacer hover
        const carousel = document.querySelector('.carousel');
        carousel?.addEventListener('mouseenter', () => this.stopAutoSlide());
        carousel?.addEventListener('mouseleave', () => this.startAutoSlide());
        
        // Navegacin por teclado
        document.addEventListener('keydown', (e) => this.handleKeyNavigation(e));
        
        // Soporte tctil
        this.setupTouchEvents();
        
        // Actualizar en resize
        window.addEventListener('resize', () => this.handleResize());

        // Exponer instancia para otros módulos (ej. responsive.js)
        window.carouselInstance = this;
    }
    
    next() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlidePosition();
        this.updateDots();
    }
    
    prev() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlidePosition();
        this.updateDots();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlidePosition();
        this.updateDots();
    }
    
    updateSlidePosition() {
        this.track.style.transform = `translateX(-${this.slideWidth * this.currentSlide}px)`;
        this.currentSlideElement.textContent = this.currentSlide + 1;
    }
    
    updateDots() {
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    filterGallery(event) {
        const filter = event.currentTarget.dataset.filter;
        
        // Actualizar botn activo
        this.galleryButtons.forEach(btn => btn.classList.remove('active'));
        event.currentTarget.classList.add('active');
        
        // Filtrar slides
        this.slides.forEach((slide, index) => {
            if (filter === 'all' || slide.dataset.category === filter) {
                slide.style.display = 'block';
            } else {
                slide.style.display = 'none';
            }
        });
        
        // Reiniciar a la primera slide visible
        this.currentSlide = 0;
        this.updateSlidePosition();
        this.updateDots();
    }
    
    startAutoSlide() {
        this.stopAutoSlide();
        this.autoSlideInterval = setInterval(() => {
            this.next();
        }, 5000);
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    
    handleKeyNavigation(event) {
        if (event.key === 'ArrowRight') {
            this.next();
        } else if (event.key === 'ArrowLeft') {
            this.prev();
        }
    }
    
    setupTouchEvents() {
        let startX = 0;
        let endX = 0;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swipe izquierda - siguiente
                this.next();
            } else {
                // Swipe derecha - anterior
                this.prev();
            }
        }
    }
    
    handleResize() {
        this.refresh();
    }

    refresh() {
        this.slideWidth = this.slides[0]?.getBoundingClientRect().width || 0;
        this.slides.forEach((slide, index) => {
            slide.style.left = this.slideWidth * index + 'px';
        });
        this.updateSlidePosition();
        this.updateDots();
    }
}

// Inicializar carrusel cuando el DOM est listo
document.addEventListener('DOMContentLoaded', () => {
    new Carousel();
});

