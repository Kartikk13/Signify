        // Generate word cards
        // const commonWords = [
        //     'Hello', 'Thank You', 'Please', 'Sorry', 'Yes', 'No',
        //     'Help', 'Friend', 'Family', 'Love', 'Peace', 'Good',
        //     'Bad', 'Happy', 'Sad', 'Beautiful', 'Welcome', 'Goodbye'
        // ];
        const commonWords = [
            'Hello', 'ThankYou', 'Please', 'Sorry', 'Yes', 'No',
            'Love', 'Happy', 'Beautiful', 'Cool', 'Applause',
            'Nice-To-Meet-You', 'Understand'
        ];
        const grid = document.getElementById('words-grid');

        commonWords.forEach((word, index) => {
            const card = document.createElement('div');
            card.className = 'sign-card';
            card.style.animationDelay = `${index * 0.05}s`;
            
            card.innerHTML = `
                <div class="sign-preview">${word}</div>
                <h4>${word}</h4>
            `;
            
            card.onclick = () => openModal(word);
            grid.appendChild(card);
        });

        // Modal functions
        function openModal(sign) {
            const modal = document.getElementById('signModal');
            const title = document.getElementById('modal-title');
            const gif = document.getElementById('modal-gif');
            
            title.textContent = `Word: ${sign}`;
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