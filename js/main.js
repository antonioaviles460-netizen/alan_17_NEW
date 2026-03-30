// main.js - Funcionalidades principales del sitio

class MainApp {
    constructor() {
        this.init();
    }
    
    init() {
        // Inicializar todas las funcionalidades
        this.setupSmoothScroll();
        this.setupNotificationButton();
        this.setupNewsletterForm();
        this.setupVideoPlayButton();
        this.setupScrollAnimations();
        this.setupLazyLoading();
        this.setupIntersectionObserver();
        this.setupProductionServices();
        this.setupStoreFunctionality();
    }
    
    // SCROLL SUAVE
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                    const targetPosition = target.offsetTop - headerHeight - 20; // 20px de margen adicional
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // BOTN DE NOTIFICACIONES
    setupNotificationButton() {
        const notifyButton = document.querySelector('.btn-notify');
        if (!notifyButton) return;
        
        notifyButton.addEventListener('click', function() {
            const originalText = this.innerHTML;
            
            // Mostrar estado de carga
            this.innerHTML = '🔔 Procesando...';
            this.disabled = true;
            
            // Simular peticin a servidor
            setTimeout(() => {
                this.innerHTML = '🔔 ¡Notificado!';
                this.classList.add('notified');
                this.disabled = false;
                
                // Restaurar despus de 3 segundos
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.classList.remove('notified');
                }, 3000);
            }, 1000);
        });
    }
    
    // FORMULARIO NEWSLETTER
    setupNewsletterForm() {
        const newsletterForm = document.querySelector('.newsletter-form');
        if (!newsletterForm) return;
        
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const submitButton = newsletterForm.querySelector('button[type="submit"]');
            const email = emailInput.value.trim();
            
            // Validacin bsica
            if (!this.validateEmail(email)) {
                this.showFormError(newsletterForm, 'Por favor, introduce un email vlido');
                return;
            }
            
            // Deshabilitar formulario durante el envo
            emailInput.disabled = true;
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            
            // Simular envo
            setTimeout(() => {
                newsletterForm.innerHTML = `
                    <div class="success-message">
                        ✔️ ¡Gracias por suscribirte! Te hemos enviado un correo de confirmación.
                    </div>
                `;
                
                // Guardar en localStorage (simulacin)
                this.saveSubscriber(email);
            }, 1500);
        });
    }
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    showFormError(form, message) {
        // Limpiar mensajes anteriores
        const existingError = form.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        // Crear nuevo mensaje de error
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.cssText = `
            color: #ff6b6b;
            padding: 10px;
            margin-block-start: 10px;
            background: rgba(255, 107, 107, 0.1);
            border-radius: 8px;
            text-align: center;
        `;
        errorElement.textContent = message;
        
        form.appendChild(errorElement);
        
        // Remover despus de 5 segundos
        setTimeout(() => errorElement.remove(), 5000);
    }
    
    saveSubscriber(email) {
        try {
            // Simular guardado en localStorage
            const subscribers = JSON.parse(localStorage.getItem('alan17_subscribers') || '[]');
            subscribers.push({
                email: email,
                date: new Date().toISOString()
            });
            localStorage.setItem('alan17_subscribers', JSON.stringify(subscribers));
            
            // Mostrar toast de xito
            this.showToast('? Te has suscrito exitosamente', 'success');
        } catch (error) {
            console.error('Error guardando suscriptor:', error);
        }
    }
    
    // BOTN DE PLAY DEL VIDEO
    setupVideoPlayButton() {
        const playButton = document.querySelector('.play-button');
        const videoIframe = document.querySelector('#visual iframe');
        
        if (!playButton || !videoIframe) return;
        
        playButton.addEventListener('click', () => {
            // Ocultar botn con animacin
            playButton.style.opacity = '0';
            playButton.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                playButton.style.display = 'none';
                
                // Activar autoplay en el iframe
                const currentSrc = videoIframe.src;
                if (!currentSrc.includes('autoplay=1')) {
                    const separator = currentSrc.includes('?') ? '&' : '?';
                    videoIframe.src = currentSrc + separator + 'autoplay=1';
                }
            }, 300);
        });
    }
    
    // ANIMACIONES AL SCROLL
    setupScrollAnimations() {
        // Configurar Intersection Observer para animaciones
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observar secciones
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }
    
    // LAZY LOADING PARA IMGENES
    setupLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.dataset.src || img.src;
                        
                        // Cargar imagen
                        img.src = src;
                        
                        // Cuando se cargue, agregar clase
                        img.addEventListener('load', () => {
                            img.classList.add('loaded');
                        });
                        
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => {
                if (img.dataset.src) {
                    imageObserver.observe(img);
                }
            });
        } else {
            // Fallback para navegadores que no soportan IntersectionObserver
            images.forEach(img => {
                const src = img.dataset.src || img.src;
                img.src = src;
            });
        }
    }
    
    // OBSERVER PARA EFECTOS ESPECIALES
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Efecto especial para cards
                    if (entry.target.classList.contains('card')) {
                        setTimeout(() => {
                            entry.target.classList.add('card-visible');
                        }, 100);
                    }
                    
                    // Efecto especial para time-box
                    if (entry.target.classList.contains('time-box')) {
                        const delay = Array.from(entry.target.parentElement.children)
                                          .indexOf(entry.target) * 100;
                        setTimeout(() => {
                            entry.target.classList.add('time-box-visible');
                        }, delay);
                    }
                }
            });
        }, {
            threshold: 0.2
        });
        
        // Observar elementos especiales
        document.querySelectorAll('.card, .time-box').forEach(el => {
            observer.observe(el);
        });
    }
    
    // SERVICIOS DE PRODUCCIN
    setupProductionServices() {
        const servicioButtons = document.querySelectorAll('.btn-servicio');
        
        servicioButtons.forEach(button => {
            button.addEventListener('click', function() {
                const servicioNombre = this.closest('.servicio-card')?.querySelector('h3')?.textContent || 'Servicio';
                const servicioPrecio = this.closest('.servicio-card')?.querySelector('.servicio-precio')?.textContent || '$0';
                
                // Mostrar modal de confirmación
                const modalHTML = `
                    <div class="modal-servicio">
                        <div class="modal-content">
                            <h3>Excelente elección! ??</h3>
                            <p>Has seleccionado: <strong>${servicioNombre}</strong></p>
                            <p>Valor: <strong>${servicioPrecio}</strong></p>
                            <p>Te contactaremos en menos de 24 horas para coordinar los detalles.</p>
                            <div class="modal-buttons">
                                <button class="btn btn-confirmar">Confirmar solicitud</button>
                                <button class="btn btn-cancelar">Cancelar</button>
                            </div>
                        </div>
                    </div>
                `;
                
                // Verificar si ya existe un modal
                if (document.querySelector('.modal-servicio')) {
                    return;
                }
                
                document.body.insertAdjacentHTML('beforeend', modalHTML);
                
                // Agregar estilos para el modal si no existen
                if (!document.getElementById('modal-servicio-styles')) {
                    const modalStyle = document.createElement('style');
                    modalStyle.id = 'modal-servicio-styles';
                    modalStyle.textContent = `
                        .modal-servicio {
                            position: fixed;
                            inset-block-start: 0;
                            inset-inline-start: 0;
                            inline-size: 100%;
                            block-size: 100%;
                            background: rgba(0, 0, 0, 0.8);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            z-index: 1000;
                            animation: fadeIn 0.3s ease;
                        }
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        .modal-content {
                            background: linear-gradient(135deg, #0a192f 0%, #050505 100%);
                            padding: 40px;
                            border-radius: 20px;
                            border: 2px solid var(--azul-neon);
                            max-inline-size: 500px;
                            inline-size: 90%;
                            text-align: center;
                            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
                        }
                        .modal-content h3 {
                            color: var(--azul-neon);
                            margin-block-end: 20px;
                            font-size: 1.5rem;
                        }
                        .modal-content p {
                            margin-block-end: 15px;
                            color: var(--gris-claro);
                            line-height: 1.5;
                        }
                        .modal-buttons {
                            display: flex;
                            gap: 15px;
                            justify-content: center;
                            margin-block-start: 25px;
                            flex-wrap: wrap;
                        }
                        .btn-confirmar {
                            background: var(--gradiente-azul);
                        }
                        .btn-cancelar {
                            background: transparent;
                            border: 2px solid var(--gris-medio);
                            color: var(--gris-medio);
                        }
                        @media (max-inline-size: 480px) {
                            .modal-content {
                                padding: 25px;
                            }
                            .modal-buttons {
                                flex-direction: column;
                            }
                        }
                    `;
                    document.head.appendChild(modalStyle);
                }
                
                // Event listeners para botones del modal
                document.querySelector('.btn-confirmar').addEventListener('click', function() {
                    alert('? Solicitud enviada. Te contactaremos pronto.');
                    document.querySelector('.modal-servicio').remove();
                });
                
                document.querySelector('.btn-cancelar').addEventListener('click', function() {
                    document.querySelector('.modal-servicio').remove();
                });
                
                // Cerrar modal al hacer clic fuera
                document.querySelector('.modal-servicio').addEventListener('click', function(e) {
                    if (e.target === this) {
                        this.remove();
                    }
                });
            });
        });
    }
    
    // FUNCIONALIDAD TIENDA
    setupStoreFunctionality() {
        // Selección de tallas
        const tallaButtons = document.querySelectorAll('.talla-btn');
        tallaButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.producto-card');
                productCard?.querySelectorAll('.talla-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
            });
        });
        
        // Selección de colores
        const colorButtons = document.querySelectorAll('.color-btn');
        colorButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.producto-card');
                productCard?.querySelectorAll('.color-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
            });
        });
        
        // Botones de compra
        const comprarButtons = document.querySelectorAll('.btn-comprar');
        comprarButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productName = this.closest('.producto-info')?.querySelector('h4')?.textContent || 'Producto';
                alert(`?? ${productName} agregado al carrito! Próximamente habilitaremos el checkout.`);
            });
        });
        
        // Formulario de notificacin
        const notificacionForms = document.querySelectorAll('.notificacion-form');
        notificacionForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const emailInput = this.querySelector('input[type="email"]');
                const button = this.querySelector('.btn-notificar');
                
                if (!emailInput || !button) return;
                
                const email = emailInput.value.trim();
                
                if (email && this.validateEmail(email)) {
                    button.textContent = 'Enviando...';
                    button.disabled = true;
                    
                    setTimeout(() => {
                        button.textContent = '? Notificado!';
                        button.style.background = '#4CAF50';
                        button.style.borderColor = '#4CAF50';
                        alert(`Te notificaremos cuando el producto est disponible. Email registrado: ${email}`);
                    }, 1000);
                } else {
                    alert('Por favor, introduce un email vlido.');
                }
            }.bind(this)); // Bind para usar validateEmail
        });
    }
    
    // MTODO PARA ACTUALIZAR ESTADSTICAS (EJEMPLO)
    updateStats() {
        // Esto podra conectarse a una API en el futuro
        const stats = {
            youtubeViews: 15000,
            spotifyListeners: 2500,
            instagramFollowers: 5000
        };
        
        // Actualizar elementos del DOM si existen
        const youtubeStat = document.querySelector('.stat:nth-child(1)');
        if (youtubeStat) {
            youtubeStat.textContent = `?? ${this.formatNumber(stats.youtubeViews)} vistas`;
        }
    }
    
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
    
    // MTODO PARA MOSTRAR MENSAJES TOAST
    showToast(message, type = 'info') {
        // Crear toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            inset-block-end: 20px;
            inset-inline-end: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 1000;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            max-inline-size: 300px;
            font-weight: 500;
        `;
        
        document.body.appendChild(toast);
        
        // Animar entrada
        setTimeout(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        }, 10);
        
        // Remover despus de 4 segundos
        setTimeout(() => {
            toast.style.transform = 'translateY(100px)';
            toast.style.opacity = '0';
            
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 4000);
    }
}

// Inicializar aplicacin cuando el DOM est listo
document.addEventListener('DOMContentLoaded', () => {
    try {
        const app = new MainApp();
        
        // Hacer disponible globalmente para debugging
        window.alan17App = app;
        
        // Configurar tecla Escape para cerrar modales
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.querySelector('.modal-servicio');
                if (modal) {
                    modal.remove();
                }
            }
        });
        
        console.log('? Alan 17 - Aplicacin inicializada correctamente');
    } catch (error) {
        console.error('? Error al inicializar la aplicacin:', error);
    }
});

// Exportar para uso modular (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MainApp;
}



