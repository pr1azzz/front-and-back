// Валидация формы контактов с улучшенной доступностью
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const notification = document.getElementById('notification');
    const closeModal = document.querySelector('.close-modal');
    const closeNotificationBtn = document.getElementById('close-notification-btn');
    const submitBtn = document.getElementById('submit-btn');

    let previousActiveElement;
    let isModalOpen = false;

    // Инициализация формы
    function initForm() {
        // Добавляем ARIA-атрибуты для обязательных полей
        const requiredFields = contactForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.setAttribute('aria-required', 'true');
        });

        // Валидация в реальном времени
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearError);
            input.addEventListener('keydown', handleFieldKeydown);
        });

        // Управление фокусом в форме
        contactForm.addEventListener('keydown', handleFormNavigation);
    }

    // Валидация поля
    function validateField(e) {
        const field = e.target;
        const errorElement = document.getElementById(`${field.id}-error`);
        
        clearError({ target: field });

        if (field.validity.valueMissing) {
            showError(field, errorElement, 'Это поле обязательно для заполнения');
        } else if (field.type === 'email' && field.validity.typeMismatch) {
            showError(field, errorElement, 'Введите корректный email адрес');
        } else if (field.validity.tooShort) {
            showError(field, errorElement, `Минимальная длина: ${field.minLength} символов`);
        } else if (field.validity.tooLong) {
            showError(field, errorElement, `Максимальная длина: ${field.maxLength} символов`);
        } else if (field.validity.patternMismatch) {
            showError(field, errorElement, 'Неверный формат email адреса');
        }
    }

    function showError(field, errorElement, message) {
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', `${field.id}-hint ${field.id}-error`);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        field.classList.add('error');
    }

    function clearError(e) {
        const field = e.target;
        const errorElement = document.getElementById(`${field.id}-error`);
        
        if (field.validity.valid) {
            field.setAttribute('aria-invalid', 'false');
            errorElement.textContent = '';
            errorElement.style.display = 'none';
            field.classList.remove('error');
        }
    }

    // Навигация по форме с клавиатуры
    function handleFormNavigation(e) {
        if (e.key === 'Escape') {
            // Сброс формы по Escape
            contactForm.reset();
            clearAllErrors();
        }
    }

    function handleFieldKeydown(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            // Переход к следующему полю по Enter
            const formElements = Array.from(contactForm.elements);
            const currentIndex = formElements.indexOf(e.target);
            const nextElement = formElements[currentIndex + 1];
            
            if (nextElement) {
                nextElement.focus();
            }
        }
    }

    function clearAllErrors() {
        const errors = contactForm.querySelectorAll('.form-error');
        const fields = contactForm.querySelectorAll('input, textarea');
        
        errors.forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
        
        fields.forEach(field => {
            field.setAttribute('aria-invalid', 'false');
            field.classList.remove('error');
        });
    }

    // Проверка всей формы
    function validateForm() {
        let isValid = true;
        const inputs = contactForm.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            const event = new Event('blur');
            input.dispatchEvent(event);
            if (input.getAttribute('aria-invalid') === 'true') {
                isValid = false;
                // Фокус на первое поле с ошибкой
                if (isValid) {
                    input.focus();
                }
            }
        });

        return isValid;
    }

    // Управление модальным окном
    function openNotification() {
        previousActiveElement = document.activeElement;
        notification.classList.remove('hidden');
        isModalOpen = true;
        
        // Скрываем основной контент от скринридера
        document.querySelectorAll('body > *:not(.modal)').forEach(el => {
            if (!el.contains(notification)) {
                el.setAttribute('aria-hidden', 'true');
            }
        });
        
        // Фокус на кнопке закрытия
        closeNotificationBtn.focus();
        
        // Добавляем обработчик Escape
        document.addEventListener('keydown', handleEscape);
        
        // Захват фокуса внутри модалки
        notification.addEventListener('keydown', trapFocus);
    }

    function closeNotification() {
        notification.classList.add('hidden');
        isModalOpen = false;
        
        // Возвращаем видимость основному контенту
        document.querySelectorAll('[aria-hidden="true"]').forEach(el => {
            el.removeAttribute('aria-hidden');
        });
        
        // Возвращаем фокус на предыдущий элемент
        if (previousActiveElement) {
            previousActiveElement.focus();
        }
        
        // Убираем обработчики
        document.removeEventListener('keydown', handleEscape);
        notification.removeEventListener('keydown', trapFocus);
    }

    function handleEscape(e) {
        if (e.key === 'Escape' && isModalOpen) {
            closeNotification();
        }
    }

    function trapFocus(e) {
        if (e.key === 'Tab') {
            const focusableElements = notification.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    // Обработка отправки формы
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        submitBtn.setAttribute('aria-busy', 'true');
        submitBtn.textContent = 'Отправка...';
        
        // Имитация задержки отправки
        setTimeout(() => {
            if (validateForm()) {
                openNotification();
            }
            
            submitBtn.removeAttribute('aria-busy');
            submitBtn.textContent = 'Отправить сообщение';
        }, 1000);
    });

    // Обработка сброса формы
    contactForm.addEventListener('reset', function() {
        clearAllErrors();
        // Анонсируем сброс формы для скринридеров
        announceToScreenReader('Форма очищена');
    });

    // Функция для объявлений скринридера
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Закрытие модального окна
    if (closeModal) {
        closeModal.addEventListener('click', closeNotification);
        closeModal.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                closeNotification();
            }
        });
    }

    if (closeNotificationBtn) {
        closeNotificationBtn.addEventListener('click', closeNotification);
        closeNotificationBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                closeNotification();
            }
        });
    }
    
    notification.addEventListener('click', function(e) {
        if (e.target === notification) {
            closeNotification();
        }
    });

    // Инициализация
    initForm();
});