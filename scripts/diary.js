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
        });
    }
    
    // Закрытие модального окна
    function closeEntryModal() {
        addEntryModal.classList.add('hidden');
        entryForm.reset();
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
    
    // Обработка отправки формы
    if (entryForm && progressTimeline) {
        entryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
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
                <span class="task">${course}: ${task} ${statusIcon}</span>
            `;
            
            // Добавляем запись в начало списка
            progressTimeline.insertBefore(newEntry, progressTimeline.firstChild);
            
            // Обновляем прогресс курсов
            updateCourseProgress(course, status);
            
            // Закрываем модальное окно и очищаем форму
            closeEntryModal();
            
            // Показываем уведомление об успешном добавлении
            showNotification('Запись успешно добавлена в дневник!');
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
        // В реальном приложении здесь была бы логика обновления прогресса
        // Для демонстрации просто показываем уведомление
        console.log(`Обновление прогресса для курса: ${courseName}, статус: ${status}`);
    }
    
    // Функция для показа уведомлений
    function showNotification(message) {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = 'notification-toast';
        notification.innerHTML = `
            <div class="notification-toast-content">
                <div class="notification-icon">✓</div>
                <div class="notification-message">${message}</div>
            </div>
        `;
        
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
    
    // Добавляем стили для анимации уведомления
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #28a745;
                color: white;
                padding: 0;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1001;
                animation: slideInRight 0.3s ease-out;
                min-width: 300px;
                border-left: 4px solid #1e7e34;
            }
            
            .notification-toast-content {
                display: flex;
                align-items: center;
                padding: 15px 20px;
            }
            
            .notification-icon {
                background: rgba(255, 255, 255, 0.2);
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 15px;
                font-weight: bold;
                font-size: 1.1rem;
            }
            
            .notification-message {
                flex: 1;
                font-weight: 500;
                font-size: 0.95rem;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
});