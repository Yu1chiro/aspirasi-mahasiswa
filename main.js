document.addEventListener('DOMContentLoaded', function () {
    // Smooth Scrolling
    const links = document.querySelectorAll('a[href^="#"]');

    for (const link of links) {
        link.addEventListener('click', function (event) {
            // Prevent default anchor click behavior
            event.preventDefault();

            // Get the target element
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Delay before starting the smooth scroll
                setTimeout(function () {
                    // Smooth scroll to the target element
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 200); // Adjust the delay time (200ms) as needed
            }
        });
    }

    // Close Navbar on Click Outside
    document.addEventListener('click', function (event) {
        const navbar = document.getElementById('navbar-default');
        const toggleButton = document.querySelector('[data-collapse-toggle="navbar-default"]');
        
        if (navbar.classList.contains('hidden')) return; // Navbar is already hidden

        if (!navbar.contains(event.target) && !toggleButton.contains(event.target)) {
            navbar.classList.add('hidden');
        }
    });

    // Toggle Navbar on Button Click
    const toggleButton = document.querySelector('[data-collapse-toggle="navbar-default"]');
    toggleButton.addEventListener('click', function () {
        const navbar = document.getElementById('navbar-default');
        navbar.classList.toggle('hidden');
    });
});
