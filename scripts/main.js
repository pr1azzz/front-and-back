// Функция для загрузки и отображения аватарки
document.addEventListener('DOMContentLoaded', function() {
    // Загрузка аватарки
    const avatarInput = document.getElementById('avatar-input');
    const avatarWrapper = document.getElementById('avatar-wrapper');
    
    // Функция для создания плейсхолдера
    function createNoPhotoPlaceholder() {
        const placeholder = document.createElement('div');
        placeholder.className = 'no-photo-placeholder';
        placeholder.innerHTML = `
            <div class="no-photo-icon">👤</div>
            <span class="no-photo-text">нет фотографии</span>
        `;
        return placeholder;
    }
    
    // Функция для создания элемента аватарки
    function createAvatarElement(src) {
        const avatar = document.createElement('img');
        avatar.className = 'hero-photo loaded';
        avatar.src = src;
        avatar.alt = 'Аватар студента';
        avatar.loading = 'eager';
        return avatar;
    }
    
    // Функция для отображения аватарки
    function displayAvatar(src) {
        avatarWrapper.innerHTML = '';
        const avatarElement = createAvatarElement(src);
        avatarWrapper.appendChild(avatarElement);
    }
    
    // Функция для отображения плейсхолдера
    function displayNoPhoto() {
        avatarWrapper.innerHTML = '';
        const placeholder = createNoPhotoPlaceholder();
        avatarWrapper.appendChild(placeholder);
    }
    
    // Инициализация аватарки при загрузке страницы
    function initializeAvatar() {
        const savedAvatar = localStorage.getItem('userAvatar');
        
        if (savedAvatar) {
            displayAvatar(savedAvatar);
        } else {
            // Показываем дефолтную аватарку
            const defaultAvatar = document.createElement('img');
            defaultAvatar.className = 'hero-photo';
            defaultAvatar.src = 'images/hero/hero-200.jpg';
            defaultAvatar.srcset = 'images/hero/hero-150.jpg 150w, images/hero/hero-200.jpg 200w, images/hero/hero-300.jpg 300w';
            defaultAvatar.sizes = '200px';
            defaultAvatar.width = '200';
            defaultAvatar.height = '200';
            defaultAvatar.alt = 'Портрет студента';
            defaultAvatar.fetchpriority = 'high';
            
            avatarWrapper.appendChild(defaultAvatar);
        }
    }
    
    // Инициализируем при загрузке
    initializeAvatar();
    
    // Обработчик загрузки файла
    if (avatarInput && avatarWrapper) {
        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Проверяем тип файла
                if (!file.type.match('image.*')) {
                    showNotification('Пожалуйста, выберите файл изображения (JPEG, PNG, etc.)', 'error');
                    return;
                }
                
                // Проверяем размер файла (максимум 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showNotification('Размер файла не должен превышать 5MB', 'error');
                    return;
                }
                
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    // Сохраняем в localStorage
                    localStorage.setItem('userAvatar', e.target.result);
                    
                    // Отображаем новую аватарку
                    displayAvatar(e.target.result);
                    
                    // Показываем уведомление
                    showNotification('Аватар успешно загружен!', 'success');
                }
                
                reader.onerror = function() {
                    showNotification('Ошибка при загрузке файла', 'error');
                }
                
                reader.readAsDataURL(file);
            }
        });
    }
    // Обработка формы контактов
    const contactForm = document.getElementById('contact-form');
    const notification = document.getElementById('notification');
    const closeNotification = document.querySelector('.close-notification');
    const closeNotificationBtn = document.getElementById('close-notification-btn');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // В реальном приложении здесь был бы код для отправки данных на сервер
            // Для демонстрации просто показываем уведомление
            
            // Показываем уведомление
            if (notification) {
                notification.classList.remove('hidden');
            }
            
            // Очищаем форму
            contactForm.reset();
        });
    }
    
    // Закрытие уведомления
    if (closeNotification) {
        closeNotification.addEventListener('click', function() {
            if (notification) {
                notification.classList.add('hidden');
            }
        });
    }
    
    if (closeNotificationBtn) {
        closeNotificationBtn.addEventListener('click', function() {
            if (notification) {
                notification.classList.add('hidden');
            }
        });
    }
    
    // Закрытие уведомления при клике вне его
    if (notification) {
        notification.addEventListener('click', function(e) {
            if (e.target === notification) {
                notification.classList.add('hidden');
            }
        });
    }
});

// Функция для показа уведомлений
function showNotification(message, type = 'success') {
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.setAttribute('role', 'status');
    notification.setAttribute('aria-live', 'polite');
    notification.innerHTML = `
        <div class="notification-toast-content">
            <div class="notification-icon">${icons[type]}</div>
            <div class="notification-message">${message}</div>
        </div>
    `;
    
    // Устанавливаем цвет в зависимости от типа
    notification.style.backgroundColor = colors[type];
    notification.style.borderLeftColor = colors[type];
    
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
            border-left: 4px solid;
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
            color: white;
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