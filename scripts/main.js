// Функция для загрузки и отображения аватарки
document.addEventListener('DOMContentLoaded', function() {
    // Загрузка аватарки
    const avatarInput = document.getElementById('avatar-input');
    const avatar = document.getElementById('avatar');
    
    if (avatarInput && avatar) {
        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    avatar.src = e.target.result;
                    // Сохраняем в localStorage для сохранения между страницами
                    localStorage.setItem('userAvatar', e.target.result);
                }
                
                reader.readAsDataURL(file);
            }
        });
        
        // Проверяем, есть ли сохраненная аватарка в localStorage
        const savedAvatar = localStorage.getItem('userAvatar');
        if (savedAvatar) {
            avatar.src = savedAvatar;
        }
    }
    
    // Фильтрация проектов
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card-large');
    
    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Убираем активный класс у всех кнопок
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Добавляем активный класс текущей кнопке
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                // Фильтруем проекты
                projectCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
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
            notification.classList.remove('hidden');
            
            // Очищаем форму
            contactForm.reset();
        });
    }
    
    // Закрытие уведомления
    if (closeNotification) {
        closeNotification.addEventListener('click', function() {
            notification.classList.add('hidden');
        });
    }
    
    if (closeNotificationBtn) {
        closeNotificationBtn.addEventListener('click', function() {
            notification.classList.add('hidden');
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