// app.js
document.addEventListener('DOMContentLoaded', () => {
    // Código comum a todas as páginas, como a gestão do menu
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }
});