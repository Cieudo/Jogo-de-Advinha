// Configurações do jogo (7 bits = números de 1 a 127)
const TOTAL_BITS = 7;
let bitAtual = 0;
let somaTotal = 0;
let respostasUsuario = []; // Guarda quais potências foram escolhidas

// Referências aos elementos da tela
const telaInicio = document.getElementById('tela-inicio');
const telaJogo = document.getElementById('tela-jogo');
const telaResultado = document.getElementById('tela-resultado');

const indicadorCartao = document.getElementById('indicador-cartao');
const progressFill = document.getElementById('progress-fill');
const gradeNumeros = document.getElementById('grade-numeros');
const numeroRevelado = document.getElementById('numero-revelado');
const tabelaBits = document.getElementById('tabela-bits');
const equacaoSoma = document.getElementById('equacao-soma');

// Botões
document.getElementById('btn-iniciar').addEventListener('click', iniciarJogo);
document.getElementById('btn-sim').addEventListener('click', () => responder(true));
document.getElementById('btn-nao').addEventListener('click', () => responder(false));
document.getElementById('btn-reiniciar').addEventListener('click', iniciarJogo);

// Alterna entre as seções HTML
function mostrarTela(tela) {
    telaInicio.classList.remove('active');
    telaJogo.classList.remove('active');
    telaResultado.classList.remove('active');
    tela.classList.add('active');
}

// Reinicia variáveis e começa do Cartão 1
function iniciarJogo() {
    bitAtual = 0;
    somaTotal = 0;
    respostasUsuario = new Array(TOTAL_BITS).fill(false);
    mostrarTela(telaJogo);
    renderizarCartao();
}

// Gera os 64 números que possuem o bit atual ligado (1)
function gerarNumerosDoCartao(bitIndex) {
    const numeros = [];
    const potencia = 1 << bitIndex; // Equivale a 2^bitIndex (1, 2, 4, 8, 16, 32, 64)

    for (let num = 1; num <= 127; num++) {
        // Operação bitwise AND: verifica se o bit está ativo neste número
        if ((num & potencia) !== 0) {
            numeros.push(num);
        }
    }
    return numeros;
}

// Atualiza a grade visual com o cartão atual
function renderizarCartao() {
    indicadorCartao.textContent = `Cartão ${bitAtual + 1} de ${TOTAL_BITS}`;
    progressFill.style.width = `${((bitAtual + 1) / TOTAL_BITS) * 100}%`;

    const numeros = gerarNumerosDoCartao(bitAtual);
    gradeNumeros.innerHTML = '';

    numeros.forEach((num) => {
        const div = document.createElement('div');
        div.className = 'num-item';
        div.textContent = num;
        gradeNumeros.appendChild(div);
    });
}

// Processa a resposta "Sim" ou "Não"
function responder(estaNoCartao) {
    if (estaNoCartao) {
        const valorCartao = 1 << bitAtual; // 2^bitAtual
        somaTotal += valorCartao;
        respostasUsuario[bitAtual] = true;
    }

    bitAtual++;

    if (bitAtual < TOTAL_BITS) {
        renderizarCartao();
    } else {
        exibirResultado();
    }
}

// Mostra o número adivinhado e a explicação binária
function exibirResultado() {
    mostrarTela(telaResultado);
    numeroRevelado.textContent = somaTotal;

    // Monta a visualização dos 7 bits (do maior peso 64 até o 1)
    tabelaBits.innerHTML = '';
    const parcelasSoma = [];

    for (let i = TOTAL_BITS - 1; i >= 0; i--) {
        const peso = 1 << i;
        const ativo = respostasUsuario[i];

        if (ativo) {
            parcelasSoma.unshift(peso); // Mantém em ordem crescente para a equação
        }

        const cell = document.createElement('div');
        cell.className = `bit-cell ${ativo ? 'ativo' : ''}`;
        cell.innerHTML = `
            <span class="bit-valor">Cartão ${peso}</span>
            <span class="bit-digito">${ativo ? '1' : '0'}</span>
        `;
        tabelaBits.appendChild(cell);
    }

    if (parcelasSoma.length > 0) {
        equacaoSoma.textContent = `Soma: ${parcelasSoma.join(' + ')} = ${somaTotal}`;
    } else {
        equacaoSoma.textContent = 'Você respondeu "Não" para todos os cartões (0).';
    }
}