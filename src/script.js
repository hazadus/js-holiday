class VacationCountdown {
    constructor() {
        // Конфигурация дат
        const lastVacationEnd = '2025-08-24';
        const nextVacationStart = '2025-10-27';
        
        this.lastVacationEnd = new Date(lastVacationEnd);
        this.nextVacationStart = new Date(nextVacationStart);
        this.intervalId = null;
    }

    init() {
        this.updateDisplay();
        this.startTimer();
    }

    calculateTimeRemaining() {
        const now = new Date();
        const timeRemaining = this.nextVacationStart.getTime() - now.getTime();
        
        if (timeRemaining < 0) {
            return null;
        }
        
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        return { days, hours, minutes, seconds, total: timeRemaining };
    }

    calculateProgress() {
        const now = new Date();
        const totalPeriod = this.nextVacationStart.getTime() - this.lastVacationEnd.getTime();
        const elapsed = now.getTime() - this.lastVacationEnd.getTime();
        
        if (elapsed < 0) return 0;
        if (elapsed >= totalPeriod) return 100;
        
        return (elapsed / totalPeriod) * 100;
    }

    updateDisplay() {
        const countdownElement = document.getElementById('countdown-display');
        const progressBarElement = document.getElementById('progress-fill');
        const progressContainer = document.querySelector('.progress-section');
        const startDateElement = document.getElementById('start-date');
        const endDateElement = document.getElementById('end-date');
        
        const timeRemaining = this.calculateTimeRemaining();
        
        if (timeRemaining === null) {
            // Отпуск начался
            countdownElement.textContent = 'Отпуск начался!';
            progressBarElement.style.width = '100%';
            this.stopTimer();
        } else if (this.nextVacationStart.getTime() - new Date().getTime() > 365 * 24 * 60 * 60 * 1000) {
            // Следующий отпуск не задан (более года)
            countdownElement.textContent = 'До следующего отпуска ещё очень долго...';
            progressContainer.style.display = 'none';
        } else {
            // Нормальное состояние
            countdownElement.textContent = `${timeRemaining.days} дней, ${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}`;
            
            const progress = this.calculateProgress();
            progressBarElement.style.width = `${progress}%`;
            
            // Обновляем подписи дат
            startDateElement.textContent = this.lastVacationEnd.toLocaleDateString('ru-RU');
            endDateElement.textContent = this.nextVacationStart.toLocaleDateString('ru-RU');
        }
    }

    startTimer() {
        if (this.intervalId) {
            this.stopTimer();
        }
        
        this.intervalId = setInterval(() => {
            this.updateDisplay();
        }, 1000);
    }

    stopTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

// Инициализация приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const vacation = new VacationCountdown();
    vacation.init();
});