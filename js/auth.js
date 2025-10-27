document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    // Find all relevant auth buttons
    const loginLinks = document.querySelectorAll('a[href="login.html"]');
    const signupLinks = document.querySelectorAll('a[href="signup.html"]');
    
    if (isLoggedIn) {
        // Hide all login and signup links
        loginLinks.forEach(link => link.style.display = 'none');
        signupLinks.forEach(link => link.style.display = 'none');

        // --- Create and append Logout button for Desktop view ---
        const desktopAuthContainer = document.querySelector('.flex.items-center.space-x-4');
        if (desktopAuthContainer && !document.getElementById('logout-btn-desktop')) {
            const logoutButtonDesktop = document.createElement('button');
            logoutButtonDesktop.id = 'logout-btn-desktop';
            logoutButtonDesktop.className = 'hidden sm:inline-block bg-transparent border border-brand-blue text-brand-blue px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-blue hover:text-brand-darker transition-all duration-300';
            logoutButtonDesktop.textContent = 'Logout';
            logoutButtonDesktop.onclick = () => {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('cart');
                window.location.href = 'login.html';
            };
            // Append it before the mobile menu button
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            if (mobileMenuButton) {
                desktopAuthContainer.insertBefore(logoutButtonDesktop, mobileMenuButton);
            }
        }

        // --- Create and append Logout button for Mobile view ---
        const mobileAuthContainer = document.querySelector('#mobile-menu .border-t');
        if (mobileAuthContainer && !document.getElementById('logout-btn-mobile')) {
            // Clear the container which holds login/signup
            mobileAuthContainer.innerHTML = ''; 

            const logoutButtonMobile = document.createElement('a');
            logoutButtonMobile.id = 'logout-btn-mobile';
            logoutButtonMobile.href = '#'; // Prevent navigation
            logoutButtonMobile.className = 'flex-1 text-center bg-brand-blue text-brand-darker px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-80 transition-all duration-300';
            logoutButtonMobile.textContent = 'Logout';
            logoutButtonMobile.onclick = (e) => {
                e.preventDefault();
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('cart');
                window.location.href = 'login.html';
            };
            mobileAuthContainer.appendChild(logoutButtonMobile);
        }

    }
});
