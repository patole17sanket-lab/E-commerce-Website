
document.addEventListener('DOMContentLoaded', () => {
    const products = document.querySelectorAll('.product');
    const cartBadge = document.getElementById('cart-badge');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCartBadge() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartBadge) {
            cartBadge.textContent = totalItems;
        }
    }

    function addToCart(productId, name, price, image) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id: productId, name, price, image, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        
        // Give visual feedback
        const productElement = document.querySelector(`[data-id='${productId}']`);
        if (productElement) {
            const button = productElement.querySelector('.add-to-cart-btn');
            if (button) {
                const originalText = button.innerHTML;
                button.innerHTML = 'Added!';
                setTimeout(() => {
                    button.innerHTML = originalText;
                }, 1000);
            }
        }
    }

    products.forEach(product => {
        const button = product.querySelector('.add-to-cart-btn');
        if (button) {
            button.addEventListener('click', () => {
                const id = product.dataset.id;
                const name = product.dataset.name;
                const price = parseFloat(product.dataset.price);
                const image = product.dataset.image;
                addToCart(id, name, price, image);
            });
        }
    });

    updateCartBadge();
});
