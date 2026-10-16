// ==========================================
// BANCO DE PERGUNTAS (6º ANO)
// ==========================================
const perguntas = [
    {
        pergunta: "Quanto é 15 x 4?",
        opcoes: ["45", "60", "54", "75"],
        correta: 1 
    },
    {
        pergunta: "O Mordecai tem 48 chaves de fenda para guardar em 6 caixas. Quantas chaves ficam em cada caixa?",
        opcoes: ["6", "7", "8", "9"],
        correta: 2 
    },
    {
        pergunta: "Se o Benson tem 24 tarefas e já concluiu 1/3 delas, quantas ainda faltam?",
        opcoes: ["8", "12", "16", "18"],
        correta: 2 
    },
    {
        pergunta: "Se o Rigby come 3 hambúrgueres em 15 minutos, quantos hambúrgueres ele comerá em 45 minutos?",
        opcoes: ["6", "9", "12", "15"],
        correta: 1 
    },
    {
        pergunta: "Se 2 kg de sementes custam R$ 10,00, quanto custarão 5 kg?",
        opcoes: ["R$ 20,00", "R$ 25,00", "R$ 30,00", "R$ 15,00"],
        correta: 1 
    }
];

// ==========================================
// VARIÁVEIS DE ESTADO DO JOGO
// ==========================================
let indicePerguntaAtual = 0;
let pontuacao = 0;
let vidas = 3;

// ==========================================
// ELEMENTOS DO DOM
// ==========================================
const telaInicio = document.getElementById('tela-inicio');
const telaQuiz = document.getElementById('tela-quiz');
const telaFim = document.getElementById('tela-fim');
const btnIniciar = document.getElementById('btn-iniciar');
const btnReiniciar = document.getElementById('btn-reiniciar');
const textoPergunta = document.getElementById('texto-pergunta');
const opcoesContainer = document.getElementById('opcoes-resposta');
const displayPontuacao = document.getElementById('pontuacao');
const displayVidas = document.getElementById('vidas');
const tituloFim = document.getElementById('titulo-fim');
const mensagemFim = document.getElementById('mensagem-fim');
const imgFim = document.getElementById('img-fim');
const barraProgresso = document.getElementById('progresso');

// ==========================================
// FUNÇÕES PRINCIPAIS
// ==========================================

function mudarTela(telaAtiva) {
    [telaInicio, telaQuiz, telaFim].forEach(tela => tela.classList.add('escondida'));
    telaAtiva.classList.remove('escondida');
}

function iniciarJogo() {
    indicePerguntaAtual = 0;
    pontuacao = 0;
    vidas = 3;
    atualizarPlacar();
    atualizarProgresso();
    mudarTela(telaQuiz);
    carregarPergunta();
}

function atualizarPlacar() {
    displayPontuacao.textContent = `Pontos: ${pontuacao}`;
    let coracoes = "❤️".repeat(vidas);
    if (vidas === 0) coracoes = "💔";
    displayVidas.textContent = `Vidas: ${coracoes}`;
}

function atualizarProgresso() {
    if(barraProgresso) {
        const porcentagem = (indicePerguntaAtual / perguntas.length) * 100;
        barraProgresso.style.width = `${porcentagem}%`;
    }
}

function carregarPergunta() {
    if (indicePerguntaAtual >= perguntas.length) {
        finalizarJogo(true);
        return;
    }

    const perguntaAtual = perguntas[indicePerguntaAtual];
    textoPergunta.textContent = perguntaAtual.pergunta;
    opcoesContainer.innerHTML = ''; 

    perguntaAtual.opcoes.forEach((opcao, index) => {
        const botao = document.createElement('button');
        botao.textContent = opcao;
        botao.classList.add('btn-opcao');
        botao.addEventListener('click', () => verificarResposta(index, botao));
        opcoesContainer.appendChild(botao);
    });
}

function verificarResposta(indiceSelecionado, botaoClicado) {
    const perguntaAtual = perguntas[indicePerguntaAtual];
    
    const botoes = opcoesContainer.querySelectorAll('.btn-opcao');
    botoes.forEach(btn => btn.disabled = true);

    if (indiceSelecionado === perguntaAtual.correta) {
        botaoClicado.classList.add('correto');
        pontuacao += 10;
        tocarSom('acerto');
    } else {
        botaoClicado.classList.add('errado');
        botoes[perguntaAtual.correta].classList.add('correto');
        vidas--;
        tocarSom('erro');
        shakeTela();
    }

    atualizarPlacar();

    setTimeout(() => {
        if (vidas <= 0) {
            finalizarJogo(false);
        } else {
            indicePerguntaAtual++;
            atualizarProgresso();
            carregarPergunta();
        }
    }, 1500);
}

// Função para finalizar o jogo
function finalizarJogo(vitoria) {
    mudarTela(telaFim);
    if (vitoria) {
        tituloFim.textContent = "Parabéns! Vocês salvaram o Parque!";
        mensagemFim.textContent = `Você fez ${pontuacao} pontos! O Benson está orgulhoso (ou quase).`;
        // ALTERAÇÃO AQUI: Agora usa a imagem do Mordecai e Rigby juntos
        imgFim.src = "img/mordecai_rigby.png"; 
        imgFim.alt = "Mordecai e Rigby comemorando a vitória";
        tocarSom('vitoria');
    } else {
        tituloFim.textContent = "Game Over!";
        mensagemFim.textContent = `Você fez ${pontuacao} pontos. O Benson vai te demitir!`;
        imgFim.src = "img/benson.png";
        imgFim.alt = "Benson bravo";
        tocarSom('derrota');
    }
}

// ==========================================
// EFEITOS SONOROS (AGORA COM ARQUIVOS LOCAIS)
// ==========================================
function tocarSom(tipo) {
    // Caminhos relativos para a pasta 'audio' que você vai criar
    let audioUrl = '';
    if (tipo === 'acerto') audioUrl = 'audio/acerto.mp3';
    if (tipo === 'erro') audioUrl = 'audio/erro.mp3';
    if (tipo === 'vitoria') audioUrl = 'audio/vitoria.mp3';
    if (tipo === 'derrota') audioUrl = 'audio/derrota.mp3';

    if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.volume = 0.6; // Volume agradável
        // O .catch() impede que o jogo quebre se o arquivo não for encontrado
        audio.play().catch(e => console.log("Arquivo de áudio não encontrado ou bloqueado pelo navegador: " + audioUrl));
    }
}

function shakeTela() {
    const main = document.querySelector('main');
    main.classList.add('shake');
    setTimeout(() => {
        main.classList.remove('shake');
    }, 500);
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================
btnIniciar.addEventListener('click', iniciarJogo);
btnReiniciar.addEventListener('click', iniciarJogo);

mudarTela(telaInicio);