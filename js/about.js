        // Scroll reveal animations
        const sections = document.querySelectorAll('.section');
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        sections.forEach(section => sectionObserver.observe(section));

        // Page load
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });