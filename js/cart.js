document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSummaryContainer = document.getElementById('cart-summary-container');
    const cartBadge = document.getElementById('cart-badge');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCartBadge() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartBadge) {
            cartBadge.textContent = totalItems;
        }
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        renderCart();
    }

    function renderCart() {
        if (!cartItemsContainer || !cartSummaryContainer) return;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="bg-brand-dark border border-slate-700 rounded-lg p-8 text-center">
                    <h2 class="text-2xl font-semibold text-white mb-4">Your cart is empty</h2>
                    <p class="text-slate-400 mb-6">Looks like you haven't added any gear yet.</p>
                    <a href="products.html" class="inline-block bg-brand-blue text-brand-darker font-bold py-3 px-8 rounded-lg hover:bg-opacity-80 transition-all duration-300">
                        Start Shopping
                    </a>
                </div>
            `;
            cartSummaryContainer.style.display = 'none';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="flex flex-col sm:flex-row items-center bg-brand-dark border border-slate-700 rounded-lg p-4 shadow-md">
                    <img src="${item.image}" alt="${item.name}" class="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-6">
                    <div class="flex-1 mb-4 sm:mb-0 text-center sm:text-left">
                        <h3 class="text-xl font-semibold text-white">${item.name}</h3>
                        <p class="text-lg text-brand-blue font-medium">₹${item.price}</p>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="flex items-center border border-slate-700 rounded-lg">
                            <button class="w-8 h-8 text-lg text-slate-300 hover:bg-slate-700 rounded-l-lg" onclick="updateQuantity('${item.id}', -1)">-</button>
                            <input type="number" value="${item.quantity}" min="1" class="w-12 h-8 text-center bg-brand-dark text-white font-bold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" readonly>
                            <button class="w-8 h-8 text-lg text-slate-300 hover:bg-slate-700 rounded-r-lg" onclick="updateQuantity('${item.id}', 1)">+</button>
                        </div>
                        <button class="text-red-500 hover:text-red-400" onclick="removeFromCart('${item.id}')">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
            `).join('');

            const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const shipping = subtotal < 2000 ? 200 : 0;
            const tax = subtotal * 0.08; // 8% tax
            const total = subtotal + tax + shipping;

            // Message to encourage free shipping on orders >= ₹2000
            const shippingMessage = shipping === 0
                ? '<p class="text-sm text-green-400">Shipping is free on orders above ₹2000!</p>'
                : `<p class="text-sm text-yellow-300">Add ₹${(2000 - subtotal).toFixed(2)} more to get free shipping.</p>`;

            cartSummaryContainer.style.display = 'block';
            cartSummaryContainer.innerHTML = `
                <div class="bg-brand-dark border border-slate-700 rounded-lg p-6 shadow-lg sticky top-24">
                    <h2 class="text-2xl font-semibold text-white border-b border-slate-700 pb-4 mb-4">Order Summary</h2>
                    <div class="space-y-3">
                        <div class="flex justify-between text-slate-300">
                            <span>Subtotal</span>
                            <span>₹${subtotal.toFixed(2)}</span>
                        </div>
                        <div class="flex justify-between text-slate-300">
                            <span>Shipping</span>
                            <span>${shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                        </div>
                        <div class="flex justify-between text-slate-300">
                            <span>Gst. Tax</span>
                            <span>₹${tax.toFixed(2)}</span>
                        </div>
                        <div class="border-t border-slate-700 pt-4 mt-4">
                            <div class="flex justify-between text-white text-xl font-bold">
                                <span>Total</span>
                                <span>₹${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4">
                        ${shippingMessage}
                    </div>
                    <button id="checkout-btn" class="w-full bg-brand-blue text-brand-darker font-bold py-3 rounded-lg mt-6 hover:bg-opacity-80 transition-all duration-300 shadow-md hover:shadow-glow-blue-sm">
                        Proceed to Checkout
                    </button>
                </div>
            `;

            const checkoutBtn = document.getElementById('checkout-btn');
            if (checkoutBtn) {
                checkoutBtn.addEventListener('click', () => {
                    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                    if (!isLoggedIn) {
                        // If not logged in, save the intent to redirect back to cart later
                        localStorage.setItem('redirectAfterLogin', 'cart.html');
                        // Redirect to the login page
                        window.location.href = 'login.html';
                        return;
                    }

                    // Build order / purchase object
                    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
                    const shipping = subtotal < 2000 ? 200 : 0;
                    const tax = subtotal * 0.08; // 8% tax
                    const total = subtotal + tax + shipping;

                    const order = {
                        id: 'ORD' + Date.now(),
                        date: new Date().toISOString(),
                        items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
                        subtotal: +subtotal.toFixed(2),
                        shipping: +shipping.toFixed(2),
                        tax: +tax.toFixed(2),
                        total: +total.toFixed(2)
                    };

                    // Save to purchase history in localStorage
                    const purchases = JSON.parse(localStorage.getItem('purchases')) || [];
                    purchases.push(order);
                    localStorage.setItem('purchases', JSON.stringify(purchases));

                    // Clear cart and re-render
                    cart = [];
                    saveCart();

                    // Show confirmation and link to orders
                    const confirmed = confirm(`Purchase successful!\nOrder ID: ${order.id}\nTotal: ₹${order.total}\n\nView order history now?`);
                    if (confirmed) {
                        window.location.href = 'purchase-history.html';
                    }
                });
            }
        }
        lucide.createIcons();
    }

    window.updateQuantity = (productId, change) => {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                cart = cart.filter(item => item.id !== productId);
            }
            saveCart();
        }
    };

    window.removeFromCart = (productId) => {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
    };

    renderCart();
    updateCartBadge();
});
