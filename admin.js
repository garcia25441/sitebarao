// Verificar se o usuário está autenticado
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se estamos em uma página protegida (admin.html)
    if (window.location.pathname.includes('admin.html')) {
        if (!isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }
        setupAdminPage();
    }

    // Setup para a página de login
    if (window.location.pathname.includes('login.html')) {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
    }

    // Setup para a página de cadastro
    if (window.location.pathname.includes('cadastro.html')) {
        const cadastroForm = document.getElementById('cadastroForm');
        if (cadastroForm) {
            cadastroForm.addEventListener('submit', handleCadastro);
        }
    }

    // Botão de logout
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});

// Verificar se o usuário está autenticado
function isAuthenticated() {
    return localStorage.getItem('adminUser') !== null;
}

// Fazer login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginMessage = document.getElementById('loginMessage');
    
    // Obter usuários cadastrados
    const users = JSON.parse(localStorage.getItem('adminUsers')) || [];
    
    // Verificar credenciais
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Armazenar usuário logado
        localStorage.setItem('adminUser', JSON.stringify({
            name: user.name,
            email: user.email
        }));
        
        // Redirecionar para o painel
        window.location.href = 'admin.html';
    } else {
        loginMessage.innerHTML = '<div class="alert alert-danger">Email ou senha incorretos.</div>';
    }
}

// Cadastrar novo usuário
function handleCadastro(e) {
    e.preventDefault();
    
    const name = document.getElementById('nome').value;
    const email = document.getElementById('emailCadastro').value;
    const password = document.getElementById('passwordCadastro').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const codigoAcesso = document.getElementById('codigoAcesso').value;
    const cadastroMessage = document.getElementById('cadastroMessage');
    
    // Código de acesso (simulando uma proteção)
    const CODIGO_ACESSO_CORRETO = "barao123"; // Na prática, isso deveria ser validado no servidor
    
    if (codigoAcesso !== CODIGO_ACESSO_CORRETO) {
        cadastroMessage.innerHTML = '<div class="alert alert-danger">Código de acesso inválido.</div>';
        return;
    }
    
    if (password !== confirmPassword) {
        cadastroMessage.innerHTML = '<div class="alert alert-danger">As senhas não coincidem.</div>';
        return;
    }
    
    // Obter usuários existentes
    const users = JSON.parse(localStorage.getItem('adminUsers')) || [];
    
    // Verificar se o email já está em uso
    if (users.some(u => u.email === email)) {
        cadastroMessage.innerHTML = '<div class="alert alert-danger">Este email já está em uso.</div>';
        return;
    }
    
    // Adicionar novo usuário
    users.push({
        name,
        email,
        password // Em uma aplicação real, a senha deveria ser criptografada
    });
    
    // Salvar usuários
    localStorage.setItem('adminUsers', JSON.stringify(users));
    
    // Mostrar mensagem de sucesso
    cadastroMessage.innerHTML = '<div class="alert alert-success">Cadastro realizado com sucesso! Redirecionando...</div>';
    
    // Redirecionar após 2 segundos
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

// Fazer logout
function logout() {
    localStorage.removeItem('adminUser');
    window.location.href = 'login.html';
}

// Configurar a página administrativa
function setupAdminPage() {
    // Mostrar nome do administrador
    const adminUser = JSON.parse(localStorage.getItem('adminUser'));
    const adminNameElement = document.getElementById('adminName');
    if (adminNameElement && adminUser) {
        adminNameElement.textContent = adminUser.name;
    }
    
    // Carregar depoimentos
    loadDepoimentos();
    
    // Configurar modal para responder
    setupResponderModal();
}

// Carregar depoimentos
function loadDepoimentos() {
    const depoimentos = JSON.parse(localStorage.getItem('depoimentos')) || [];
    const depoimentosList = document.getElementById('depoimentosList');
    const depoimentosRespondidos = document.getElementById('depoimentosRespondidos');
    
    if (depoimentosList) {
        // Filtrar depoimentos não respondidos
        const naoRespondidos = depoimentos.filter(d => !d.resposta);
        
        if (naoRespondidos.length === 0) {
            depoimentosList.innerHTML = '<div class="alert alert-info">Não há depoimentos pendentes.</div>';
        } else {
            depoimentosList.innerHTML = '';
            naoRespondidos.forEach((item, index) => {
                const card = document.createElement('div');
                card.className = 'card mb-3';
                card.innerHTML = `
                    <div class="card-body">
                        <h6 class="card-subtitle mb-2 text-muted">De: ${item.nome} - ${item.data}</h6>
                        <p class="card-text">${item.depoimento}</p>
                        <button class="btn btn-primary btn-sm responder-btn" data-index="${index}" data-bs-toggle="modal" data-bs-target="#responderModal">
                            Responder
                        </button>
                    </div>
                `;
                depoimentosList.appendChild(card);
            });
        }
    }
    
    if (depoimentosRespondidos) {
        // Filtrar depoimentos respondidos
        const respondidos = depoimentos.filter(d => d.resposta);
        
        if (respondidos.length === 0) {
            depoimentosRespondidos.innerHTML = '<div class="alert alert-info">Não há depoimentos respondidos.</div>';
        } else {
            depoimentosRespondidos.innerHTML = '';
            respondidos.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card mb-3';
                card.innerHTML = `
                    <div class="card-body">
                        <h6 class="card-subtitle mb-2 text-muted">De: ${item.nome} - ${item.data}</h6>
                        <p class="card-text">${item.depoimento}</p>
                        <div class="border-top pt-2 mt-2">
                            <h6>Sua resposta:</h6>
                            <p>${item.resposta}</p>
                            <small class="text-muted">Respondido em: ${item.dataResposta}</small>
                        </div>
                    </div>
                `;
                depoimentosRespondidos.appendChild(card);
            });
        }
    }
}

// Configurar modal para responder depoimentos
function setupResponderModal() {
    // Referência ao modal e elementos
    const depoimentoCliente = document.getElementById('depoimentoCliente');
    const depoimentoIdInput = document.getElementById('depoimentoId');
    const respostaInput = document.getElementById('resposta');
    const btnEnviarResposta = document.getElementById('btnEnviarResposta');
    
    // Adicionar evento para os botões de responder
    document.querySelectorAll('.responder-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.dataset.index;
            const depoimentos = JSON.parse(localStorage.getItem('depoimentos')) || [];
            const depoimento = depoimentos[index];
            
            depoimentoCliente.textContent = depoimento.depoimento;
            depoimentoIdInput.value = index;
        });
    });
    
    // Enviar resposta
    if (btnEnviarResposta) {
        btnEnviarResposta.addEventListener('click', function() {
            const index = depoimentoIdInput.value;
            const resposta = respostaInput.value;
            
            if (resposta.trim() === '') {
                alert('Por favor, digite uma resposta.');
                return;
            }
            
            // Atualizar o depoimento com a resposta
            const depoimentos = JSON.parse(localStorage.getItem('depoimentos')) || [];
            depoimentos[index].resposta = resposta;
            depoimentos[index].dataResposta = new Date().toLocaleDateString();
            
            // Salvar depoimentos atualizados
            localStorage.setItem('depoimentos', JSON.stringify(depoimentos));
            
            // Fechar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('responderModal'));
            modal.hide();
            
            // Recarregar depoimentos
            loadDepoimentos();
        });
    }
} 