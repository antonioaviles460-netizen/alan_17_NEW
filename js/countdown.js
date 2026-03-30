// countdown.js - Lgica del contador regresivo

class Countdown {
    constructor() {
        this.launchDate = new Date("Apr 4, 2026 00:00:00 ").getTime();
        this.countdownElement = document.getElementById("countdown");
        this.daysElement = document.getElementById("days");
        this.hoursElement = document.getElementById("hours");
        this.minutesElement = document.getElementById("minutes");
        this.secondsElement = document.getElementById("seconds");
        this.countdownInterval = null;
        
        this.init();
    }
    
    init() {
        // Verificar que los elementos existan
        if (!this.countdownElement) {
            console.error('Elemento countdown no encontrado');
            return;
        }
        
        this.updateCountdown();
        this.startCountdown();
    }
    
    updateCountdown() {
        const now = new Date().getTime();
        const distance = this.launchDate - now;
        
        // Si el tiempo ha expirado
        if (distance < 0) {
            this.handleCountdownComplete();
            return;
        }
        
        // Calcular das, horas, minutos, segundos
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Actualizar elementos DOM con animacin
        this.updateElementWithAnimation(this.daysElement, days);
        this.updateElementWithAnimation(this.hoursElement, hours);
        this.updateElementWithAnimation(this.minutesElement, minutes);
        this.updateElementWithAnimation(this.secondsElement, seconds);
    }
    
    updateElementWithAnimation(element, value) {
        if (!element) return;
        
        const currentValue = parseInt(element.textContent) || 0;
        
        // Solo animar si el valor cambi
        if (currentValue !== value) {
            element.classList.add('changing');
            
            // Actualizar valor
            element.textContent = value.toString().padStart(2, '0');
            
            // Remover clase de animacin despus de un tiempo
            setTimeout(() => {
                element.classList.remove('changing');
            }, 300);
        } else {
            element.textContent = value.toString().padStart(2, '0');
        }
    }
    
    handleCountdownComplete() {
        // Detener el intervalo
        this.stopCountdown();
        
        // Mostrar mensaje de disponibilidad
        this.countdownElement.innerHTML = `
            <div class="available-message">
                <h3>?? YA DISPONIBLE!</h3>
                <p>Escucha "Morena" ahora en todas las plataformas</p>
                <a href="#music" class="btn">Escuchar ahora</a>
            </div>
        `;
        
        // Actualizar accesibilidad
        this.countdownElement.setAttribute('aria-label', 'Lanzamiento disponible');
    }
    
    startCountdown() {
        this.stopCountdown(); // Asegurarse de que no hay intervalos duplicados
        this.countdownInterval = setInterval(() => this.updateCountdown(), 1000);
    }
    
    stopCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    }
    
    // Mtodo para cambiar la fecha de lanzamiento dinmicamente
    setLaunchDate(dateString) {
        this.launchDate = new Date(dateString).getTime();
        this.stopCountdown();
        this.updateCountdown();
        this.startCountdown();
    }
}

// Inicializar countdown cuando el DOM est listo
document.addEventListener('DOMContentLoaded', () => {
    new Countdown();
});

