// responsive.js - Funcionalidades especficas para mviles

class ResponsiveManager {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        this.isDesktop = window.innerWidth > 1024;
        
        this.init();
    }
    
    init() {
        this.setupViewportDetection();
        this.setupTouchGestures();
        this.setupOrientationChange();
        this.setupMobileMenu();
    }
    
    setupViewportDetection() {
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
            this.isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
            this.isDesktop = window.innerWidth > 1024;
            
            // Emitir evento personalizado
            window.dispatchEvent(new CustomEvent('viewportChange', {
                detail: {
                    isMobile: this.isMobile,
                    isTablet: this.isTablet,
                    isDesktop : this.isDesktop
                }
            }));
        });
    }
    
    setupTouchGestures() {
        if ('ontouchstart' in window) {
            // Aadir clase touch al body
            document.body.classList.add('touch-device');
            
            // Mejorar experiencia tctil
            document.querySelectorAll('.btn, button').forEach(btn => {
                btn.style.minHeight = '44px';
                btn.style.minWidth = '44px';
            });
            
            // Deshabilitar hover en mviles
            document.querySelectorAll('*').forEach(el => {
                el.addEventListener('touchstart', () => {}, {passive: true});
            });
        }
    }
    
    setupOrientationChange() {
        window.addEventListener('orientationchange', () => {
            // Recargar carrusel u otros elementos sensibles
            setTimeout(() => {
                if (window.carouselInstance) {
                    window.carouselInstance.refresh();
                }
            }, 300);
        });
    }
    
    setupMobileMenu() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const mobileNav = document.querySelector('.mobile-nav');
        
        if (menuBtn && mobileNav) {
            menuBtn.addEventListener('click', () => {
                mobileNav.classList.toggle('active');
                menuBtn.innerHTML = mobileNav.classList.contains('active') 
                    ? '?' 
                    : '?';
            });
            
            // Cerrar men al hacer clic en enlace
            mobileNav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileNav.classList.remove('active');
                    menuBtn.innerHTML = '?';
                });
            });
        }
    }
    
    // Mtodo para cambiar imgenes segn dispositivo
    loadResponsiveImages() {
        const images = document.querySelectorAll('img[data-src-mobile]');
        
        images.forEach(img => {
            if (this.isMobile && img.dataset.srcMobile) {
                img.src = img.dataset.srcMobile;
            } else if (this.isTablet && img.dataset.srcTablet) {
                img.src = img.dataset.srcTablet;
            } else if (img.dataset.srcDesktop) {
                img.src = img.dataset.srcDesktop;
            }
        });
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    new ResponsiveManager();
});

