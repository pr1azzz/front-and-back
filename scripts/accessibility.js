// Общие функции доступности для всего сайта
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.addSkipLinkBehavior();
        this.enhanceExternalLinks();
        this.addFocusIndicators();
        this.handleReducedMotion();
    }

    // Обработка skip link
    addSkipLinkBehavior() {
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                    setTimeout(() => target.removeAttribute('tabindex'), 1000);
                }
            });
        }
    }

    // Улучшение внешних ссылок
    enhanceExternalLinks() {
        const externalLinks = document.querySelectorAll('a[target="_blank"]');
        externalLinks.forEach(link => {
            if (!link.querySelector('.sr-only')) {
                const srText = document.createElement('span');
                srText.className = 'sr-only';
                srText.textContent = ' (откроется в новой вкладке)';
                link.appendChild(srText);
            }
            
            link.setAttribute('rel', 'noopener noreferrer');
        });
    }

    // Добавление индикаторов фокуса
    addFocusIndicators() {
        // Уже реализовано в CSS через :focus-visible
    }

    // Обработка reduced motion
    handleReducedMotion() {
        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleReduceMotion = (matches) => {
            if (matches) {
                document.documentElement.style.setProperty('--animation-duration', '0.01ms');
            } else {
                document.documentElement.style.setProperty('--animation-duration', '0.3s');
            }
        };

        reducedMotionQuery.addEventListener('change', (e) => handleReduceMotion(e.matches));
        handleReduceMotion(reducedMotionQuery.matches);
    }

    // Функция для объявлений скринридера
    announceToScreenReader(message, priority = 'polite') {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', priority);
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (announcement.parentNode) {
                announcement.parentNode.removeChild(announcement);
            }
        }, 1000);
    }

    // Проверка поддержки клавиатуры
    isKeyboardUser() {
        return document.documentElement.classList.contains('keyboard-user');
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    window.a11yManager = new AccessibilityManager();
    
    // Обнаружение пользователей клавиатуры
    document.addEventListener('keydown', () => {
        document.documentElement.classList.add('keyboard-user');
    });
    
    document.addEventListener('mousedown', () => {
        document.documentElement.classList.remove('keyboard-user');
    });
});