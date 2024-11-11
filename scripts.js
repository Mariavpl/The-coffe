const cartItems = JSON.parse(localStorage.getItem('cartItems')) || []; // Cargar artículos del carrito de localStorage
const cartNotification = document.querySelector(".cart-notification");
const orderButton = document.querySelector(".order-btn");
const cartIcon = document.getElementById("cart-icon");
const cartPopup = document.getElementById("cart-popup");
const closePopupButton = document.getElementById("close-popup");
const cartItemsList = document.getElementById("cart-items-list");

// Aseguramos que el pop-up del carrito esté oculto al cargar la página
cartPopup.style.display = "none";

// Control de tamaño en el carrusel
const sizeSelectors = document.querySelectorAll('.size-selector');
let currentIndex = 0;

// Muestra solo el elemento actual en el carrusel
function updateCarrusel() {
    sizeSelectors.forEach((selector, index) => {
        selector.classList.toggle('active', index === currentIndex);
        if (index === currentIndex) {
            selector.style.borderBottom = '2px solid white';
        } else {
            selector.style.borderBottom = '';
        }
    });
}

// Flechas para avanzar y retroceder en el carrusel
document.querySelectorAll('.fa-arrow-right').forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        currentIndex = (currentIndex + 1) % sizeSelectors.length;
        updateCarrusel();
        localStorage.setItem('selectedIndex', currentIndex); // Guarda el índice seleccionado en localStorage
    });
});

document.querySelectorAll('.fa-arrow-left').forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        currentIndex = (currentIndex - 1 + sizeSelectors.length) % sizeSelectors.length;
        updateCarrusel();
        localStorage.setItem('selectedIndex', currentIndex); // Guarda el índice seleccionado en localStorage
    });
});

// Inicializa el carrusel mostrando el primer elemento y carga la selección guardada
document.addEventListener('DOMContentLoaded', () => {
    currentIndex = parseInt(localStorage.getItem('selectedIndex')) || 0;
    updateCarrusel();
});

// Función para mostrar el pop-up solo cuando se haga clic en el icono del carrito
function showCartPopup() {
    cartPopup.style.display = "flex"; // Mostrar el pop-up
    document.body.style.overflow = "hidden"; // Evitar desplazamiento mientras el pop-up está abierto
}

// Función para cerrar el pop-up
function closeCartPopup() {
    cartPopup.style.display = "none"; // Ocultar el pop-up
    document.body.style.overflow = ""; // Restaurar desplazamiento
}

// Evento para abrir el pop-up al hacer clic en el icono del carrito
cartIcon.addEventListener("click", (event) => {
    event.stopPropagation(); // Asegura que solo se active con el clic en el icono del carrito
    renderCartItems(); // Renderizar artículos antes de mostrar el pop-up
    showCartPopup();
});

// Evento para cerrar el pop-up al hacer clic en el botón "Cerrar"
closePopupButton.addEventListener("click", (event) => {
    event.stopPropagation();
    closeCartPopup();
});

// También puedes cerrar el pop-up al hacer clic fuera del contenido del pop-up
cartPopup.addEventListener("click", (event) => {
    if (event.target === cartPopup) {
        closeCartPopup();
    }
});

// Función para actualizar la lista de artículos en el carrito
function renderCartItems() {
    cartItemsList.innerHTML = ""; // Limpiar el contenido actual

    // Iterar sobre los elementos del carrito
    cartItems.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.classList.add("cart-item");

        // Estructura del artículo en el carrito
        listItem.innerHTML = `
            <div class="item-info">
                <span>${item.quantity} x ${item.name} - ${item.size} - ${item.extras}</span> - €${(item.price * item.quantity).toFixed(2)}
            </div>
            <button class="remove-item" data-index="${index}">Eliminar</button>
        `;

        // Agregar el artículo a la lista
        cartItemsList.appendChild(listItem);
    });

    // Evento para eliminar cada artículo
    document.querySelectorAll(".remove-item").forEach(button => {
        button.addEventListener("click", (e) => {
            const itemIndex = e.target.getAttribute("data-index");
            cartItems.splice(itemIndex, 1); // Eliminar artículo del array
            localStorage.setItem("cartItems", JSON.stringify(cartItems)); // Actualizar localStorage
            updateCartNotification(); // Actualizar la notificación
            renderCartItems(); // Volver a renderizar los artículos
        });
    });
}


// Función para actualizar la notificación en el carrito
function updateCartNotification() {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartNotification.textContent = totalItems;
    cartNotification.style.display = totalItems > 0 ? "block" : "none";
}

// Función para seleccionar el ítem del menú
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', (event) => {
        // Eliminar la clase 'selected' de todos los ítems del menú
        document.querySelectorAll('.menu-item').forEach(menuItem => {
            menuItem.classList.remove('selected');
        });

        // Agregar la clase 'selected' al ítem clicado
        event.currentTarget.classList.add('selected');

        // Guardar el nombre del ítem seleccionado en localStorage
        const itemName = event.target.textContent.trim();
        localStorage.setItem('selectedItemName', itemName);
    });
});

// Mantener el ítem seleccionado al recargar la página
window.addEventListener('load', () => {
    const selectedItemName = localStorage.getItem('selectedItemName');
    if (selectedItemName) {
        document.querySelectorAll('.menu-item').forEach(item => {
            // Comparar el texto del ítem con el que está en localStorage
            if (item.textContent.trim() === selectedItemName) {
                item.classList.add('selected'); // Añadir clase 'selected' al ítem guardado
            }
        });
    }
});



// Guardar el nombre de la bebida seleccionada en localStorage al hacer clic
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', (event) => {
        const itemName = event.target.textContent.trim();
        localStorage.setItem('selectedItemName', itemName); // Guarda el nombre en localStorage

    });
});

// Función para agregar un artículo al carrito
function addToCart(item) {
    const selectedItemName = localStorage.getItem('selectedItemName') || "Mocha"; // Obtener el nombre desde localStorage o usar "Mocha" como predeterminado
    const existingItem = cartItems.find(cartItem => cartItem.name === selectedItemName && cartItem.extras === item.extras);

    // Capturar el valor del extra
    const extraElement = document.querySelector('input[name="extra"]:checked'); // Captura el input seleccionado
    const extras = extraElement ? extraElement.value : "Ninguno"; // Si no se selecciona nada, se asigna "Ninguno"

    console.log("Extra seleccionado:", extras); // Verifica que el extra esté siendo capturado correctamente

    // Verificación para agregar o actualizar el artículo en el carrito
    if (existingItem) {
        existingItem.quantity += item.quantity;
    } else {
        // Si no existe, agregar el nuevo artículo con el extra capturado
        cartItems.push({
            name: selectedItemName, // Asigna el nombre correcto
            quantity: item.quantity,
            size: item.size,
            extras: extras, // Asigna el extra capturado
            price: 2.5 // Precio de la bebida
        });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Guarda el carrito actualizado
    updateCartNotification(); // Actualiza la notificación
}


// Evento para el botón de pedido
orderButton.addEventListener("click", () => {
    const quantity = parseInt(document.querySelector(".quantity input").value);
    const size = document.querySelector(".size-selector.active") ? document.querySelector(".size-selector.active").textContent : "No seleccionado";
    const extras = document.querySelector(".extras-selector") ? document.querySelector(".extras-selector").value : "Ninguno";

    const selectedItem = { 
        name: "", // Se define más adelante al agregar al carrito
        quantity: quantity,
        size: size,
        extras: extras
    };

    addToCart(selectedItem); // Agrega el artículo al carrito con el nombre y precio correctos
});


// Control de cantidad y precio en el menú de pedido
document.addEventListener("DOMContentLoaded", () => {
    const priceElement = document.querySelector(".price");
    const quantityInput = document.querySelector(".quantity input");
    const minusButton = document.querySelector(".btn-minus");
    const plusButton = document.querySelector(".btn-plus");

    const basePrice = 2.5;

    // Función para actualizar el precio total
    function updatePrice() {
        const quantity = parseInt(quantityInput.value);
        const totalPrice = (basePrice * quantity).toFixed(2);
        priceElement.textContent = `€${totalPrice}`;
    }

    minusButton.addEventListener("click", () => {
        let currentQuantity = parseInt(quantityInput.value);
        if (currentQuantity > 1) {
            quantityInput.value = currentQuantity - 1;
            updatePrice();
        }
    });

    plusButton.addEventListener("click", () => {
        let currentQuantity = parseInt(quantityInput.value);
        if (currentQuantity < 100) {
            quantityInput.value = currentQuantity + 1;
            updatePrice();
        }
    });

    quantityInput.addEventListener("input", () => {
        let value = parseInt(quantityInput.value);
        if (isNaN(value) || value < 1) {
            quantityInput.value = 1;
        } else if (value > 100) {
            quantityInput.value = 100;
        }
        updatePrice();
    });

    updatePrice();
});

// Inicializar la notificación del carrito
updateCartNotification();
