// Фильтрация проектов - упрощенная версия для 4 проектов
document.addEventListener('DOMContentLoaded', function() {
    console.log('Скрипт фильтрации проектов загружен!');
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card-large');
    
    console.log('Найдено кнопок фильтрации:', filterButtons.length);
    console.log('Найдено карточек проектов:', projectCards.length);
    
    // Функция фильтрации
    function filterProjects(category) {
        console.log('Фильтруем по категории:', category);
        
        let visibleCount = 0;
        
        projectCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
                visibleCount++;
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        console.log('Видимых карточек:', visibleCount);
    }
    
    // Назначаем обработчики на кнопки
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Клик по кнопке:', this.textContent);
            
            // Снимаем активный класс со всех кнопок
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Добавляем активный класс нажатой кнопке
            this.classList.add('active');
            
            // Получаем категорию для фильтрации
            const filterCategory = this.getAttribute('data-filter');
            
            // Запускаем фильтрацию
            filterProjects(filterCategory);
        });
    });
    
    // Автоматически запускаем фильтрацию "Все" при загрузке
    filterProjects('all');
});