// Фильтрация проектов
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card-large');
    const projectsContainer = document.getElementById('projects-container');
    
    // Функция для фильтрации проектов
    function filterProjects(category) {
        projectCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                // Анимация появления
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                // Анимация исчезновения
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        // Показываем сообщение если нет проектов в категории
        showEmptyMessage(category);
    }
    
    // Функция для показа сообщения о пустой категории
    function showEmptyMessage(category) {
        // Удаляем предыдущее сообщение
        const existingMessage = document.querySelector('.empty-category-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Проверяем есть ли проекты в выбранной категории
        const visibleProjects = Array.from(projectCards).filter(card => {
            return card.style.display !== 'none';
        });
        
        if (visibleProjects.length === 0 && category !== 'all') {
            const message = document.createElement('div');
            message.className = 'empty-category-message';
            message.innerHTML = `
                <div class="empty-message-content">
                    <div class="empty-icon">📁</div>
                    <h3>Проектов в категории "${getCategoryName(category)}" пока нет</h3>
                    <p>Но скоро появятся интересные работы!</p>
                </div>
            `;
            projectsContainer.appendChild(message);
        }
    }
    
    // Функция для получения читаемого имени категории
    function getCategoryName(category) {
        const names = {
            'html': 'HTML/CSS',
            'js': 'JavaScript',
            'react': 'React'
        };
        return names[category] || category;
    }
    
    // Обработчики для кнопок фильтрации
    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Убираем активный класс у всех кнопок
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                
                // Добавляем активный класс текущей кнопке
                this.classList.add('active');
                this.setAttribute('aria-pressed', 'true');
                
                // Получаем категорию для фильтрации
                const filter = this.getAttribute('data-filter');
                
                // Применяем фильтрацию
                filterProjects(filter);
                
                // Сохраняем выбранный фильтр в localStorage
                localStorage.setItem('selectedProjectFilter', filter);
            });
        });
        
        // Восстанавливаем выбранный фильтр при загрузке страницы
        const savedFilter = localStorage.getItem('selectedProjectFilter') || 'all';
        const savedButton = document.querySelector(`[data-filter="${savedFilter}"]`);
        if (savedButton) {
            savedButton.click();
        }
    }
    
    // Добавляем анимации при загрузке страницы
    function initProjectAnimations() {
        projectCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 + index * 100);
        });
    }
    
    // Инициализируем анимации
    setTimeout(initProjectAnimations, 500);
    
    // Обработка изображений проектов
    const projectImages = document.querySelectorAll('.project-img');
    projectImages.forEach(img => {
        // Добавляем обработчик ошибки загрузки изображения
        img.addEventListener('error', function() {
            this.src = '../images/projects/placeholder.jpg';
            this.alt = 'Изображение проекта временно недоступно';
        });
        
        // Ленивая загрузка с intersection observer
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });
            
            observer.observe(img);
        }
    });
});

// Функция для поиска проектов (дополнительная функциональность)
function searchProjects(query) {
    const projectCards = document.querySelectorAll('.project-card-large');
    const searchTerm = query.toLowerCase().trim();
    
    projectCards.forEach(card => {
        const title = card.querySelector('.project-card-title').textContent.toLowerCase();
        const description = card.querySelector('.project-card-description').textContent.toLowerCase();
        const tech = card.querySelector('.project-card-tech').textContent.toLowerCase();
        
        const matches = title.includes(searchTerm) || 
                       description.includes(searchTerm) || 
                       tech.includes(searchTerm);
        
        if (matches || searchTerm === '') {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}