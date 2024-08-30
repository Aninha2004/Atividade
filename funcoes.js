// Função para carregar includes como cabeçalho e rodapé
function carregarIncludes() {
    fetch('includes/cabecalho.html')
        .then(response => response.text())
        .then(data => document.getElementById("cabecalho").innerHTML = data);

    fetch('includes/rodape.html')
        .then(response => response.text())
        .then(data => document.getElementById("rodape").innerHTML = data);
}

// Função para carregar dados do estacionamento JSON
const carregarDadosEstacionamento = () => {
    fetch('dados/estacionamento-dados.json')
        .then(response => response.json())
        .then(dados => {
            exibirOpcoesEstacionamento(dados);
        })
        .catch(erro => console.error('Erro ao carregar dados JSON:', erro));
};

// Função para exibir opções de estacionamento no select
const exibirOpcoesEstacionamento = (dados) => {
    const select = document.getElementById('selectEstacionamento');
    select.innerHTML = '<option value="">Selecione um estacionamento</option>';

    dados.opcoesEstacionamento.forEach(opcao => {
        const option = document.createElement('option');
        option.value = opcao.nome;
        option.textContent = `${opcao.nome} - R$${opcao.preco}/hora`;
        select.appendChild(option);
    });
};

// Função para calcular o valor do estacionamento
function calcularValor() {
    const estacionamento = document.getElementById('selectEstacionamento').value;
    const horas = parseInt(document.getElementById('inputHoras').value) || 0;
    const minutos = parseInt(document.getElementById('inputMinutos').value) || 0;

    if (estacionamento) {
        // Obtém o preço do estacionamento selecionado
        const precoHora = obterPrecoEstacionamento(estacionamento);
        const totalHoras = horas + minutos / 60;
        const valor = totalHoras * precoHora;
        document.getElementById('valor').value = `R$ ${valor.toFixed(2)}`;
    } else {
        document.getElementById('valor').value = '';
    }
}

// Função para obter o preço do estacionamento com base no nome
function obterPrecoEstacionamento(nome) {
    const precos = {
        'Estacionamento A': 10, 
        'Estacionamento B': 5   
    };
    return precos[nome] || 0;
}

// Função para gerar comprovante
function gerarComprovante(formato) {
    const select = document.getElementById('selectEstacionamento');
    const estacionamentoEscolhido = select.value;
    const horas = parseInt(document.getElementById('inputHoras').value) || 0;
    const minutos = parseInt(document.getElementById('inputMinutos').value) || 0;

    if (!estacionamentoEscolhido || (horas <= 0 && minutos < 0)) {
        alert("Por favor, selecione um estacionamento e insira o número de horas e minutos.");
        return;
    }

    const precoHora = obterPrecoEstacionamento(estacionamentoEscolhido);
    const totalHoras = horas + minutos / 60;
    const total = precoHora * totalHoras;

    const comprovante = {
        data: new Date().toISOString(),
        estacionamento: estacionamentoEscolhido,
        vaga: 'A1',
        duracaoHoras: horas,
        duracaoMinutos: minutos,
        total: total
    };

    const nomeArquivo = `comprovante_${new Date().toISOString().replace(/[:.]/g, '-')}.${formato}`;
    const conteudoArquivo = formato === 'json' ? JSON.stringify(comprovante, null, 2) : gerarXML(comprovante);

    baixarArquivo(nomeArquivo, conteudoArquivo, formato === 'json' ? 'application/json' : 'application/xml');
}

// Função para baixar o arquivo
function baixarArquivo(nomeArquivo, conteudo, tipoMIME) {
    const blob = new Blob([conteudo], { type: tipoMIME });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = nomeArquivo;
    link.click();
}

// Inicializa as funções após o carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
    carregarIncludes();
    carregarDadosEstacionamento();
    document.getElementById('inputHoras').addEventListener('change', calcularValor);
    document.getElementById('inputMinutos').addEventListener('change', calcularValor);
    document.getElementById('selectEstacionamento').addEventListener('change', calcularValor);
});
