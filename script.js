// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Back to Top Button
document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('back-to-top');
    
    // Show/hide back to top button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    });
    
    // Scroll to top when button is clicked
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// Handle testimonials
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('depoimentoForm');
    const depoimentosLista = document.getElementById('depoimentosLista');
    
    // Load existing testimonials from localStorage
    let depoimentos = JSON.parse(localStorage.getItem('depoimentos')) || [];
    renderDepoimentos();

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value;
            const depoimento = document.getElementById('depoimento').value;
            
            // Add new testimonial
            depoimentos.unshift({
                nome: nome,
                depoimento: depoimento,
                data: new Date().toLocaleDateString()
            });
            
            // Save to localStorage
            localStorage.setItem('depoimentos', JSON.stringify(depoimentos));
            
            // Clear form
            form.reset();
            
            // Update display
            renderDepoimentos();
        });
    }

    function renderDepoimentos() {
        if (!depoimentosLista) return;
        
        depoimentosLista.innerHTML = '';
        
        if (depoimentos.length === 0) {
            depoimentosLista.innerHTML = '<div class="alert alert-info">Ainda não há depoimentos. Seja o primeiro a compartilhar sua experiência!</div>';
            return;
        }
        
        depoimentos.forEach(item => {
            const depoimentoEl = document.createElement('div');
            depoimentoEl.className = 'depoimento-item';
            
            let html = `
                <p>${item.depoimento}</p>
                <div class="depoimento-autor">${item.nome}</div>
                <small class="text-muted">${item.data}</small>
            `;
            
            // Se houver resposta do admin, mostra
            if (item.resposta) {
                html += `
                    <div class="admin-resposta mt-2 pt-2 border-top">
                        <p class="mb-1"><i class="bi bi-reply-fill text-primary"></i> <span class="fw-bold">Resposta:</span> ${item.resposta}</p>
                        <small class="text-muted">Respondido em: ${item.dataResposta}</small>
                    </div>
                `;
            }
            
            depoimentoEl.innerHTML = html;
            depoimentosLista.appendChild(depoimentoEl);
        });
    }
}); 