// Валидация формы контактов
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const notification = document.getElementById('notification');
    const closeModal = document.querySelector('.close-modal');
    const closeNotificationBtn = document.getElementById('close-notification-btn');

    // Валидация в реальном времени
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearError);
    });

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
        }
    }

    function showError(field, errorElement, message) {
        field.setAttribute('aria-invalid', 'true');
        errorElement.textContent = message;
        field.style.borderColor = '#dc3545';
    }

    function clearError(e) {
        const field = e.target;
        const errorElement = document.getElementById(`${field.id}-error`);
        
        field.setAttribute('aria-invalid', 'false');
        errorElement.textContent = '';
        field.style.borderColor = '';
    }

    // Обработка отправки формы
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
            const event = new Event('blur');
            input.dispatchEvent(event);
            if (input.getAttribute('aria-invalid') === 'true') {
                isValid = false;
            }
        });

        if (isValid) {
            // В реальном приложении здесь отправка на сервер
            notification.classList.remove('hidden');
            contactForm.reset();
        }
    });

    // Закрытие модального окна
    function closeNotification() {
        notification.classList.add('hidden');
    }

    if (closeModal) closeModal.addEventListener('click', closeNotification);
    if (closeNotificationBtn) closeNotificationBtn.addEventListener('click', closeNotification);
    
    notification.addEventListener('click', function(e) {
        if (e.target === notification) closeNotification();
    });
});