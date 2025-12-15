        // Generate number cards
        const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        const grid = document.getElementById('numbers-grid');

        numbers.forEach((number, index) => {
            const card = document.createElement('div');
            card.className = 'sign-card';
            card.style.animationDelay = `${index * 0.08}s`;
            
            card.innerHTML = `
                <div class="sign-preview">${number}</div>
                <h4>${number}</h4>
            `;
            
            card.onclick = () => openModal(number);
            grid.appendChild(card);
        });

        // Modal functions
        function openModal(sign) {
            const modal = document.getElementById('signModal');
            const title = document.getElementById('modal-title');
            const gif = document.getElementById('modal-gif');
            
            title.textContent = `Number: ${sign}`;
            gif.innerHTML = `<img src="img/${sign}.gif" alt="Sign ${sign}">`;
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            const modal = document.getElementById('signModal');
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        // Close modal on outside click
        document.getElementById('signModal').addEventListener('click', (e) => {
            if (e.target.id === 'signModal') {
                closeModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });

        // Page load
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });