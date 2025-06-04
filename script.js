document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM completamente cargado y parseado.');

    // Botones del menú y secciones
    const allMenuButtons = document.querySelectorAll('.menu-button, .submenu-item, .header-btn[data-target]');
    const contentSections = document.querySelectorAll('.content-section');
    console.log('Botones de menú/sección encontrados:', allMenuButtons.length);
    console.log('Secciones de contenido encontradas:', contentSections.length);

    // Formulario de Registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        console.log('Formulario de registro encontrado.');
    } else {
        console.error('¡ERROR! Formulario de registro NO encontrado.');
    }

    // Elementos del Carrito
    const addToCartButtons = document.querySelectorAll('.add-to-cart-button');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    let cart = [];
    console.log('Botones "Agregar al carrito" encontrados:', addToCartButtons.length);
    if (!cartItemsContainer) console.error("¡ERROR! Contenedor cart-items NO encontrado.");
    if (!cartTotalSpan) console.error("¡ERROR! Span cart-total NO encontrado.");


    // --- Funciones para Mostrar/Ocultar Secciones y Submenús ---
    function showSection(targetId) {
        console.log('Intentando mostrar sección:', targetId);
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        const activeSection = document.getElementById(targetId);
        if (activeSection) {
            activeSection.classList.add('active');
            console.log('Sección', targetId, 'ahora activa.');
        } else {
            console.error(`¡ERROR! Sección con ID "${targetId}" no encontrada en showSection.`);
        }
    }

    function hideAllSubmenus() {
        console.log('Ocultando todos los submenús.');
        document.querySelectorAll('.menu-item .submenu').forEach(submenu => { // Más específico al submenú dentro de menu-item
            submenu.style.display = 'none';
        });
    }
    
    document.addEventListener('click', function(event) {
        // Cierra submenús si el clic es fuera de elementos interactivos del menú que los gestionan
        const isInteractiveMenuElement = event.target.closest('.menu-button, .submenu-item, .header-btn[data-target], .submenu');
        if (!isInteractiveMenuElement) {
            console.log('Clic fuera de elementos interactivos del menú, ocultando submenús.');
            hideAllSubmenus();
        }
    });

    allMenuButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            console.log('Botón de menú/sección clickeado:', button);
            const targetId = button.getAttribute('data-target');
            const parentMenuItem = button.closest('.menu-item');
            const submenu = parentMenuItem ? parentMenuItem.querySelector('.submenu') : null;

            if (targetId) {
                console.log('Botón tiene data-target:', targetId);
                showSection(targetId);
                // Es importante ocultar submenús aquí también, si se navega a una sección
                // Solo oculta si el botón actual no es el que abre/cierra su PROPIO submenú (que no tendría data-target)
                 if (!submenu || (submenu && submenu.style.display !== 'block')) {
                    hideAllSubmenus();
                }

            } else if (submenu) {
                console.log('Botón abre/cierra submenú:', submenu);
                const isSubmenuVisible = submenu.style.display === 'block';
                // Ocultar OTROS submenús primero
                document.querySelectorAll('.menu-item .submenu').forEach(otherSubmenu => {
                    if (otherSubmenu !== submenu) {
                        otherSubmenu.style.display = 'none';
                    }
                });
                // Alternar la visibilidad del submenú actual
                submenu.style.display = isSubmenuVisible ? 'none' : 'block';
                console.log('Submenú ahora:', submenu.style.display);
            } else {
                console.warn('Botón clickeado sin data-target ni submenú manejable:', button);
            }
        });
    });

    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault(); 
            console.log('Formulario de registro enviado.');
            const name = document.getElementById('regName').value;
            const username = document.getElementById('regUsername').value;
            const email = document.getElementById('regEmail').value;
            const phone = document.getElementById('regPhone').value; 

            console.log('Datos de Registro:', { name, username, email, phone });
            alert(`¡Gracias por registrarte, ${name}! Te hemos enviado un correo a ${email}.`);
            
            showSection('contenido-inicio'); 
            registerForm.reset(); 
        });
    }


    function updateCartDisplay() {
        console.log('Actualizando display del carrito. Carrito actual:', JSON.parse(JSON.stringify(cart)));
        if (!cartItemsContainer) {
            console.error("updateCartDisplay: cartItemsContainer no existe.");
            return;
        }
        cartItemsContainer.innerHTML = ''; 
        let totalGeneral = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
        } else {
            cart.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>Precio unitario: $${item.price.toFixed(2)} MX</p>
                    </div>
                    <div class="cart-item-actions">
                        Cantidad: 
                        <input type="number" class="cart-item-quantity-input" value="${item.quantity}" min="0" data-index="${index}">
                        Subtotal: <strong style="min-width: 80px; display: inline-block;">$${(item.quantity * item.price).toFixed(2)} MX</strong>
                        <button class="remove-from-cart-button" data-index="${index}" title="Eliminar producto">Eliminar</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
                totalGeneral += item.quantity * item.price;
            });
        }
        if (cartTotalSpan) {
            cartTotalSpan.textContent = `$${totalGeneral.toFixed(2)} MX`;
        } else {
            console.error("updateCartDisplay: cartTotalSpan no existe.");
        }
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('Botón "Agregar al carrito" clickeado:', button);
            const productId = button.getAttribute('data-product-id');
            const productName = button.getAttribute('data-product-name');
            const productPrice = parseFloat(button.getAttribute('data-product-price'));
            console.log('Producto a agregar:', { productId, productName, productPrice });

            if (!productId || !productName || isNaN(productPrice)) {
                console.error('Error: Datos del producto incompletos o inválidos.', { productId, productName, productPrice });
                alert('Hubo un error al obtener la información del producto. Por favor, inténtalo de nuevo.');
                return;
            }

            const existingItemIndex = cart.findIndex(item => item.id === productId);

            if (existingItemIndex > -1) {
                console.log('Producto ya existe en el carrito, incrementando cantidad.');
                cart[existingItemIndex].quantity += 1;
            } else {
                console.log('Producto nuevo, agregando al carrito.');
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    quantity: 1
                });
            }
            updateCartDisplay();
            alert(`"${productName}" ha sido agregado al carrito.`);
        });
    });
    
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove-from-cart-button')) {
                const indexToRemove = parseInt(event.target.getAttribute('data-index'));
                console.log('Intentando eliminar ítem del carrito, índice:', indexToRemove);
                if (!isNaN(indexToRemove) && indexToRemove >= 0 && indexToRemove < cart.length) {
                    cart.splice(indexToRemove, 1); 
                    updateCartDisplay(); 
                } else {
                    console.warn('Índice para eliminar inválido o fuera de rango.');
                }
            }
        });

        cartItemsContainer.addEventListener('change', (event) => {
            if (event.target.classList.contains('cart-item-quantity-input')) {
                const indexToUpdate = parseInt(event.target.getAttribute('data-index'));
                const newQuantity = parseInt(event.target.value);
                console.log('Cambiando cantidad de ítem en carrito, índice:', indexToUpdate, 'nueva cantidad:', newQuantity);

                if (!isNaN(indexToUpdate) && indexToUpdate >= 0 && indexToUpdate < cart.length) {
                    if (!isNaN(newQuantity) && newQuantity > 0) {
                        cart[indexToUpdate].quantity = newQuantity;
                    } else if (!isNaN(newQuantity) && newQuantity <= 0) {
                        console.log('Nueva cantidad es 0 o menos, eliminando ítem.');
                        cart.splice(indexToUpdate, 1);
                    } else {
                        console.warn('Nueva cantidad inválida. No se actualizó.', event.target.value);
                         // Podrías revertir el valor del input al valor anterior en cart si es inválido
                        event.target.value = cart[indexToUpdate].quantity; // Revertir
                    }
                    updateCartDisplay();
                } else {
                     console.warn('Índice para actualizar cantidad inválido o fuera de rango.');
                }
            }
        });
    } else {
        console.error("El contenedor del carrito (cartItemsContainer) no se encontró. Los listeners para eliminar/cambiar cantidad no se añadirán.");
    }

    console.log('Mostrando sección de inicio por defecto.');
    showSection('contenido-inicio');
    console.log('Actualizando display del carrito por defecto.');
    updateCartDisplay();

    console.log('Script cargado y event listeners configurados (con depuración).');
});
