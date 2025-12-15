        // ============================================
        // HEADER SCROLL EFFECT
        // ============================================
        const header = document.getElementById('header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // ============================================
        // SCROLL REVEAL ANIMATIONS
        // ============================================
        const sections = document.querySelectorAll('.section');
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        sections.forEach(section => sectionObserver.observe(section));

        // ============================================
        // PAGE FADE IN ON LOAD
        // ============================================
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });

        // ============================================
        // HIGHLIGHT ACTIVE NAV LINK
        // ============================================
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });