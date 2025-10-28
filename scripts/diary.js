// Функциональность для страницы дневника
document.addEventListener('DOMContentLoaded', function() {
    const addEntryBtn = document.getElementById('add-entry-btn');
    const addEntryModal = document.getElementById('add-entry-modal');
    const closeModal = document.querySelector('.close-modal');
    const cancelEntryBtn = document.getElementById('cancel-entry');
    const entryForm = document.getElementById('entry-form');
    const progressTimeline = document.getElementById('progress-timeline');
    
    // Открытие модального окна
    if (addEntryBtn && addEntryModal) {
        addEntryBtn.addEventListener('click', function() {
            addEntryModal.classList.remove('hidden');
            // Устанавливаем сегодняшнюю дату по умолчанию
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('entry-date').value = today;
            // Фокусируемся на первом поле
            document.getElementById('entry-date').focus();
        });
    }
    
    // Закрытие модального окна
    function closeEntryModal() {
        addEntryModal.classList.add('hidden');
        entryForm.reset();
        clearAllErrors();
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', closeEntryModal);
    }
    
    if (cancelEntryBtn) {
        cancelEntryBtn.addEventListener('click', closeEntryModal);
    }
    
    // Закрытие модального окна при клике вне его
    if (addEntryModal) {
        addEntryModal.addEventListener('click', function(e) {
            if (e.target === addEntryModal) {
                closeEntryModal();
            }
        });
    }
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !addEntryModal.classList.contains('hidden')) {
            closeEntryModal();
        }
    });
    
    // Валидация формы
    const formInputs = entryForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    function validateField(e) {
        const field = e.target;
        const errorElement = document.getElementById(`${field.id}-error`);
        
        clearFieldError({ target: field });
        
        if (field.validity.valueMissing) {
            showFieldError(field, errorElement, 'Это поле обязательно для заполнения');
        } else if (field.type === 'date' && field.validity.badInput) {
            showFieldError(field, errorElement, 'Введите корректную дату');
        }
    }
    
    function showFieldError(field, errorElement, message) {
        field.setAttribute('aria-invalid', 'true');
        errorElement.textContent = message;
        field.style.borderColor = '#dc3545';
    }
    
    function clearFieldError(e) {
        const field = e.target;
        const errorElement = document.getElementById(`${field.id}-error`);
        
        field.setAttribute('aria-invalid', 'false');
        errorElement.textContent = '';
        field.style.borderColor = '';
    }
    
    function clearAllErrors() {
        formInputs.forEach(input => {
            const errorElement = document.getElementById(`${input.id}-error`);
            input.setAttribute('aria-invalid', 'false');
            if (errorElement) errorElement.textContent = '';
            input.style.borderColor = '';
        });
    }
    
    // Обработка отправки формы
    if (entryForm && progressTimeline) {
        entryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Валидируем все поля
            let isValid = true;
            formInputs.forEach(input => {
                const event = new Event('blur');
                input.dispatchEvent(event);
                if (input.getAttribute('aria-invalid') === 'true') {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                // Фокусируемся на первом поле с ошибкой
                const firstError = entryForm.querySelector('[aria-invalid="true"]');
                if (firstError) {
                    firstError.focus();
                }
                return;
            }
            
            // Получаем данные из формы
            const date = document.getElementById('entry-date').value;
            const course = document.getElementById('entry-course').value;
            const task = document.getElementById('entry-task').value;
            const status = document.querySelector('input[name="entry-status"]:checked').value;
            
            // Форматируем дату
            const formattedDate = formatDate(date);
            
            // Создаем новую запись
            const newEntry = document.createElement('div');
            newEntry.className = `progress-item ${status === 'completed' ? 'completed' : 'in-progress'} new-item`;
            
            const statusIcon = status === 'completed' ? '✓' : 'in progress';
            newEntry.innerHTML = `
                <span class="date">${formattedDate}</span>
                <span class="task">${task} ${statusIcon}</span>
                <span class="course-tag">${course}</span>
            `;
            
            // Добавляем запись в начало списка
            progressTimeline.insertBefore(newEntry, progressTimeline.firstChild);
            
            // Обновляем прогресс курсов
            updateCourseProgress(course, status);
            
            // Закрываем модальное окно и очищаем форму
            closeEntryModal();
            
            // Показываем уведомление об успешном добавлении
            showNotification('Запись успешно добавлена в дневник!', 'success');
            
            // Прокручиваем к новой записи
            newEntry.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }
    
    // Функция для форматирования даты
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('ru-RU', { month: 'short' });
        return `${day} ${month}`;
    }
    
    // Функция для обновления прогресса курсов
    function updateCourseProgress(courseName, status) {
        // Находим карточку курса
        const courseCards = document.querySelectorAll('.course-card');
        courseCards.forEach(card => {
            const title = card.querySelector('.course-title').textContent;
            if (title === courseName) {
                const progressBar = card.querySelector('.progress');
                const progressText = card.querySelector('.progress-text');
                
                let currentProgress = parseInt(progressBar.style.width);
                if (isNaN(currentProgress)) currentProgress = 0;
                
                // Увеличиваем прогресс на 5% за выполненную задачу
                if (status === 'completed') {
                    const newProgress = Math.min(currentProgress + 5, 100);
                    progressBar.style.width = `${newProgress}%`;
                    progressBar.setAttribute('aria-valuenow', newProgress);
                    progressText.textContent = `${newProgress}%`;
                }
            }
        });
    }
    
    // Функция для показа уведомлений
    function showNotification(message, type = 'success') {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = 'notification-toast';
        notification.setAttribute('role', 'status');
        notification.setAttribute('aria-live', 'polite');
        notification.innerHTML = `
            <div class="notification-toast-content">
                <div class="notification-icon">${type === 'success' ? '✓' : '⚠'}</div>
                <div class="notification-message">${message}</div>
            </div>
        `;
        
        // Устанавливаем цвет в зависимости от типа
        if (type === 'success') {
            notification.style.backgroundColor = '#28a745';
            notification.style.borderLeftColor = '#28a745';
        } else {
            notification.style.backgroundColor = '#dc3545';
            notification.style.borderLeftColor = '#dc3545';
        }
        
        document.body.appendChild(notification);
        
        // Удаляем уведомление через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
});