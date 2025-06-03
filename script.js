document.addEventListener('DOMContentLoaded', () => {
    // Selecciona todos los botones principales del menú y los ítems del submenú
    const menuButtons = document.querySelectorAll('.menu-button');
    const submenuItems = document.querySelectorAll('.submenu-item');
    const contentSections = document.querySelectorAll('.content-section');

    // Función para ocultar todas las secciones y mostrar la activa
    function showSection(targetId) {
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        const activeSection = document.getElementById(targetId);
        if (activeSection) {
            activeSection.classList.add('active');
        }
    }

    // Ocultar todos los submenús
    function hideAllSubmenus() {
        document.querySelectorAll('.submenu').forEach(submenu => {
            submenu.style.display = 'none';
        });
    }

    // Ocultar todos los submenús al hacer clic fuera del área del menú
    document.addEventListener('click', (event) => {
        // Si el clic no fue dentro del elemento con la clase 'main-nav'
        if (!event.target.closest('.main-nav')) {
            hideAllSubmenus();
        }
    });

    // Manejar clics en los botones principales del menú
    menuButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Previene el comportamiento por defecto del enlace

            const targetId = button.getAttribute('data-target');
            const parentItem = button.closest('.menu-item');
            const submenu = parentItem ? parentItem.querySelector('.submenu') : null;

            // Si el botón tiene un 'data-target', significa que es para mostrar una sección
            if (targetId) {
                showSection(targetId);
                hideAllSubmenus(); // Oculta cualquier submenú abierto
            } else if (submenu) {
                // Si no tiene 'data-target' pero tiene un submenú, es para desplegar/ocultar el submenú
                
                // Oculta otros submenús si están abiertos
                document.querySelectorAll('.submenu').forEach(otherSubmenu => {
                    if (otherSubmenu !== submenu) {
                        otherSubmenu.style.display = 'none';
                    }
                });

                // Alterna la visibilidad del submenú actual
                submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
            }
        });
    });

    // Manejar clics en los ítems de los submenús
    submenuItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault(); // Previene el comportamiento por defecto del enlace
            const targetId = item.getAttribute('data-target'); // Obtener el id de la sección a mostrar
            if (targetId) {
                showSection(targetId); // Muestra la sección correspondiente
                hideAllSubmenus(); // Oculta todos los submenús después de seleccionar un ítem
            }
        });
    });
});
