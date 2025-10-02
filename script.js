let isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

function fazerLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    console.log('Tentando login...');
    console.log('Username digitado:', username);
    console.log('Username esperado:', LOGIN_CREDENTIALS.username);
    console.log('Senha correta?', password === LOGIN_CREDENTIALS.password);

    if (username === LOGIN_CREDENTIALS.username && password === LOGIN_CREDENTIALS.password) {
        console.log('Login bem-sucedido!');
        sessionStorage.setItem('isLoggedIn', 'true');
        isLoggedIn = true;

        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';

        errorDiv.textContent = '';

        carregarArquivoAutomatico();
    } else {
        console.log('Login falhou!');
        // Login falhou
        errorDiv.textContent = ' Usuário ou senha incorretos!';

        document.getElementById('password').value = '';

        const loginContainer = document.querySelector('.login-container');
        loginContainer.style.animation = 'shake 0.5s';
        setTimeout(() => {
            loginContainer.style.animation = 'slideUp 0.5s ease-out';
        }, 500);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    if (isLoggedIn) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';

        carregarArquivoAutomatico();
    } else {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('mainContent').style.display = 'none';
    }
});

let todosAlunos = [];
let cursoSelecionado = null;
let alunoSelecionado = null;

function mostrarCursos() {
    document.getElementById('cardInicial').style.display = 'none';
    document.getElementById('cursosSection').style.display = 'block';
}

function voltarInicial() {
    document.getElementById('cursosSection').style.display = 'none';
    document.getElementById('cardInicial').style.display = 'flex';
}


function sair() {
    sessionStorage.removeItem('isLoggedIn');
    location.reload();
}

function carregarArquivoAutomatico() {
    try {
        console.log('Carregando dados dos alunos...');

        if (typeof DADOS_MAILS === 'undefined') {
            throw new Error('DADOS_MAILS não está definido');
        }

        // Decodificar dados ofuscados
        const jsonString = atob(DADOS_MAILS);
        const dadosAlunos = JSON.parse(jsonString);

        console.log(`Total de alunos carregados: ${dadosAlunos.length}`);

        // Processar dados
        todosAlunos = dadosAlunos.map(aluno => ({
            nome: aluno.nome,
            sobrenome: aluno.sobrenome,
            nomeCompleto: `${aluno.nome} ${aluno.sobrenome}`,
            email: aluno.email,
            curso: aluno.curso,
            mensagem: criarMensagem(aluno.nome, aluno.sobrenome, aluno.email)
        }));

        atualizarContadores();
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('⚠️ Erro ao carregar dados dos alunos.\n\n' + error.message);
    }
}

function criarMensagem(nome, sobrenome, email) {
    return `Olá, ${nome} ${sobrenome}! 👋

Seguem seus dados de acesso ao e-mail institucional da UNIVAG:

📧 *E-mail:* ${email}
🔑 *Senha Padrão:* @univag25#
🌐 *Acesso Portal:* https://portal.office.com

ℹ️ *Importante:*
Com a conta de e-mail você consegue baixar o pacote Microsoft Office gratuitamente.

🎓 *Benefício Azure Dev Tools for Teaching:*
https://azureforeducation.microsoft.com/devtools

Qualquer dúvida, estamos à disposição!`;
}

function atualizarContadores() {
    const contadores = {
        'TAD': todosAlunos.filter(a => a.curso === 'TAD').length,
        'SIS': todosAlunos.filter(a => a.curso === 'SIS').length,
        'ENS': todosAlunos.filter(a => a.curso === 'ENS').length
    };
    
    document.getElementById('total-TAD').textContent = `${contadores.TAD} alunos`;
    document.getElementById('total-SIS').textContent = `${contadores.SIS} alunos`;
    document.getElementById('total-ENS').textContent = `${contadores.ENS} alunos`;
}

function selecionarCurso(curso) {
    cursoSelecionado = curso;
    document.getElementById('cursosSection').style.display = 'none';
    document.getElementById('alunosSection').classList.add('show');
    document.getElementById('cursoAtual').textContent = `Alunos - ${curso}`;

    renderizarAlunos();
}

function voltarCursos() {
    document.getElementById('cursosSection').style.display = 'block';
    document.getElementById('alunosSection').classList.remove('show');
    document.getElementById('searchAluno').value = '';
    cursoSelecionado = null;
}


function renderizarAlunos(filtro = '') {
    const alunosDoCurso = todosAlunos.filter(a => 
        a.curso === cursoSelecionado &&
        (filtro === '' || 
        a.nomeCompleto.toLowerCase().includes(filtro.toLowerCase()) ||
        a.email.toLowerCase().includes(filtro.toLowerCase()))
    );
    
    const lista = document.getElementById('alunosList');
    
    if (alunosDoCurso.length === 0) {
        lista.innerHTML = '<div class="no-results"><h3>Nenhum aluno encontrado</h3></div>';
        return;
    }
    
    lista.innerHTML = alunosDoCurso.map((aluno) => {
        const index = todosAlunos.indexOf(aluno);
        return `
            <div class="aluno-item" onclick="abrirModal(${index})">
                <div class="aluno-nome">${aluno.nomeCompleto}</div>
                <div class="aluno-email">${aluno.email}</div>
            </div>
        `;
    }).join('');
}


function abrirModal(index) {
    alunoSelecionado = todosAlunos[index];
    document.getElementById('modalNome').textContent = alunoSelecionado.nomeCompleto;
    document.getElementById('modalEmail').textContent = alunoSelecionado.email;
    document.getElementById('modalMensagem').textContent = alunoSelecionado.mensagem;
    document.getElementById('modal').classList.add('show');
}


function fecharModal(event) {
    if (!event || event.target.id === 'modal') {
        document.getElementById('modal').classList.remove('show');
    }
}

function copiarMensagem() {
    navigator.clipboard.writeText(alunoSelecionado.mensagem).then(() => {
        mostrarToast();
    }).catch(err => {
        console.error('Erro ao copiar:', err);
        // Fallback para navegadores antigos
        const textarea = document.createElement('textarea');
        textarea.value = alunoSelecionado.mensagem;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        mostrarToast();
    });
}



function mostrarToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

document.getElementById('searchAluno').addEventListener('input', (e) => {
    renderizarAlunos(e.target.value);
});


document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        fecharModal({ target: { id: 'modal' } });
    }
});