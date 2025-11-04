// =====================
// Seleção de telas
// =====================
const telaInicial = document.getElementById('tela-inicial');
const telaLembretes = document.getElementById('tela-lembretes');
const telaContas = document.getElementById('tela-contas');

const btnVoltarLembretes = document.getElementById('voltar-inicial-lembretes');
const btnVoltarContas = document.getElementById('voltar-inicial-contas');

function abrirTela(tela) {
    telaInicial.style.display = 'none';
    telaLembretes.style.display = 'none';
    telaContas.style.display = 'none';
    tela.style.display = 'block';
}

document.getElementById('opcao-lembretes').addEventListener('click', () => abrirTela(telaLembretes));
document.getElementById('opcao-contas').addEventListener('click', () => abrirTela(telaContas));
btnVoltarLembretes.addEventListener('click', () => abrirTela(telaInicial));
btnVoltarContas.addEventListener('click', () => abrirTela(telaInicial));

// =====================
// Lembretes
// =====================
const listaLembretes = document.getElementById('lista-lembretes');
const formLembrete = document.getElementById('form-lembrete');

document.getElementById('btn-adicionar-lembrete').addEventListener('click', () => formLembrete.classList.remove('form-hidden'));
document.getElementById('cancelar-lembrete').addEventListener('click', () => formLembrete.classList.add('form-hidden'));

document.getElementById('salvar-lembrete').addEventListener('click', () => {
    const titulo = document.getElementById('titulo-lembrete').value.trim();
    const desc = document.getElementById('descricao-lembrete').value.trim();
    const data = document.getElementById('data-lembrete').value;
    const status = document.getElementById('status-lembrete').value;
    if(titulo && desc && data){
        const li = document.createElement('li');
        li.textContent = `${titulo} - ${desc} - ${data}`;
        li.dataset.status = status;
        li.classList.add('slide-in', status);
        li.addEventListener('click', () => {
            li.dataset.status = li.dataset.status === 'realizado' ? 'nao-realizado' : 'realizado';
            li.classList.toggle('realizado');
            li.classList.toggle('nao-realizado');
            salvarNoStorage();
        });
        listaLembretes.appendChild(li);
        formLembrete.classList.add('form-hidden');
        limparFormLembrete();
        salvarNoStorage();
        enviarNotificacao("📋 Novo lembrete", `${titulo} - ${desc}`);
    }
});

function limparFormLembrete(){
    document.getElementById('titulo-lembrete').value = '';
    document.getElementById('descricao-lembrete').value = '';
    document.getElementById('data-lembrete').value = '';
    document.getElementById('status-lembrete').value = 'nao-realizado';
}

// =====================
// Contas
// =====================
const listaContas = document.getElementById('lista-contas');
const formConta = document.getElementById('form-conta');
const totalGasto = document.getElementById('total-gasto');
const totalPago = document.getElementById('total-pago');
const totalPendente = document.getElementById('total-pendente');

document.getElementById('btn-adicionar-conta').addEventListener('click', () => formConta.classList.remove('form-hidden'));
document.getElementById('cancelar-conta').addEventListener('click', () => formConta.classList.add('form-hidden'));

document.getElementById('salvar-conta').addEventListener('click', () => {
    const nome = document.getElementById('nome-conta').value.trim();
    const valor = parseFloat(document.getElementById('valor-conta').value);
    const status = document.getElementById('status-conta').value;
    const vencimento = document.getElementById('vencimento-conta').value;
    if(nome && valor && vencimento){
        const li = document.createElement('li');
        li.textContent = `${nome} - ${valor.toFixed(2)} - ${status} - ${vencimento}`;
        li.dataset.status = status;
        li.classList.add('slide-in');
        li.addEventListener('click', () => {
            li.dataset.status = li.dataset.status === 'paga' ? 'nao-paga' : 'paga';
            atualizarResumo();
            salvarNoStorage();
        });
        listaContas.appendChild(li);
        atualizarResumo();
        formConta.classList.add('form-hidden');
        limparFormConta();
        salvarNoStorage();
        enviarNotificacao("💰 Nova conta", `${nome} - R$${valor.toFixed(2)} - ${status}`);
    }
});

function limparFormConta(){
    document.getElementById('nome-conta').value = '';
    document.getElementById('valor-conta').value = '';
    document.getElementById('vencimento-conta').value = '';
    document.getElementById('status-conta').value = 'nao-paga';
}

// =====================
// Resumo financeiro
// =====================
function atualizarResumo(){
    let total=0, pago=0, pendente=0;
    Array.from(listaContas.children).forEach(li=>{
        const partes = li.textContent.split(' - ');
        const valor = parseFloat(partes[1]);
        total += valor;
        if(li.dataset.status === 'paga') pago += valor;
        else pendente += valor;
    });
    totalGasto.textContent = total.toFixed(2);
    totalPago.textContent = pago.toFixed(2);
    totalPendente.textContent = pendente.toFixed(2);
}

// =====================
// LocalStorage
// =====================
function salvarNoStorage(){
    const lembretes = Array.from(listaLembretes.children).map(li => ({ texto: li.textContent, status: li.dataset.status }));
    const contas = Array.from(listaContas.children).map(li => ({ texto: li.textContent, status: li.dataset.status }));
    localStorage.setItem('lembretes', JSON.stringify(lembretes));
    localStorage.setItem('contas', JSON.stringify(contas));
}

function carregarDoStorage(){
    const lembretesSalvos = JSON.parse(localStorage.getItem('lembretes') || '[]');
    lembretesSalvos.forEach(obj=>{
        const li = document.createElement('li');
        li.textContent = obj.texto;
        li.dataset.status = obj.status;
        li.classList.add('slide-in', obj.status);
        li.addEventListener('click', () => {
            li.dataset.status = li.dataset.status === 'realizado' ? 'nao-realizado' : 'realizado';
            li.classList.toggle('realizado');
            li.classList.toggle('nao-realizado');
            salvarNoStorage();
        });
        listaLembretes.appendChild(li);
    });

    const contasSalvas = JSON.parse(localStorage.getItem('contas') || '[]');
    contasSalvas.forEach(obj=>{
        const li = document.createElement('li');
        li.textContent = obj.texto;
        li.dataset.status = obj.status;
        li.addEventListener('click', () => {
            li.dataset.status = li.dataset.status === 'paga' ? 'nao-paga' : 'paga';
            atualizarResumo();
            salvarNoStorage();
        });
        listaContas.appendChild(li);
    });
    atualizarResumo();
}

window.addEventListener('load', carregarDoStorage);

// =====================
// Notificações
// =====================
function enviarNotificacao(titulo, mensagem){
    if(Notification.permission === 'granted'){
        new Notification(titulo, { body: mensagem });
    } else {
        Notification.requestPermission();
    }
}

// =====================
// Filtros por mês
// =====================
document.getElementById('filtro-mes-lembretes').addEventListener('input', e => {
    const mes = e.target.value;
    Array.from(listaLembretes.children).forEach(li => {
        li.style.display = li.textContent.includes(mes) ? 'flex' : 'none';
    });
});

document.getElementById('filtro-mes-contas').addEventListener('input', e => {
    const mes = e.target.value;
    Array.from(listaContas.children).forEach(li => {
        li.style.display = li.textContent.includes(mes) ? 'flex' : 'none';
    });
});
