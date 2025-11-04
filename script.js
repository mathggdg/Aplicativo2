// Telas
const telaInicial = document.getElementById('tela-inicial');
const telaLembretes = document.getElementById('tela-lembretes');
const telaContas = document.getElementById('tela-contas');

// Botões voltar
const voltarLembretes = document.getElementById('voltar-inicial-lembretes');
const voltarContas = document.getElementById('voltar-inicial-contas');

function abrirTela(tela) {
    telaInicial.style.display = 'none';
    telaLembretes.style.display = 'none';
    telaContas.style.display = 'none';
    tela.style.display = 'block';
}

// Menu inicial
document.getElementById('opcao-lembretes').addEventListener('click', () => abrirTela(telaLembretes));
document.getElementById('opcao-contas').addEventListener('click', () => abrirTela(telaContas));

// Voltar
voltarLembretes.addEventListener('click', () => abrirTela(telaInicial));
voltarContas.addEventListener('click', () => abrirTela(telaInicial));

/* ================== LEMBRETES ================== */
const listaLembretes = document.getElementById('lista-lembretes');
const formLembrete = document.getElementById('form-lembrete');
const filtroMesLembretes = document.getElementById('filtro-mes-lembretes');

document.getElementById('btn-adicionar-lembrete').addEventListener('click', () => formLembrete.classList.remove('form-hidden'));
document.getElementById('cancelar-lembrete').addEventListener('click', () => formLembrete.classList.add('form-hidden'));

// Salvar lembrete
document.getElementById('salvar-lembrete').addEventListener('click', () => {
    const titulo = document.getElementById('titulo-lembrete').value.trim();
    const desc = document.getElementById('descricao-lembrete').value.trim();
    const data = document.getElementById('data-lembrete').value;
    const prioridade = document.getElementById('prioridade-lembrete').value;
    if(titulo && desc && data){
        const li = document.createElement('li');
        li.dataset.data = data;
        li.dataset.prioridade = prioridade;
        li.textContent = `${titulo} - ${desc} - ${data} - ${prioridade}`;
        li.classList.add('slide-in');
        listaLembretes.appendChild(li);
        formLembrete.classList.add('form-hidden');
        document.getElementById('titulo-lembrete').value = '';
        document.getElementById('descricao-lembrete').value = '';
        document.getElementById('data-lembrete').value = '';
        document.getElementById('prioridade-lembrete').value = 'normal';
        salvarNoStorage();
        enviarNotificacao("📋 Novo lembrete", `${titulo} - ${desc}`);
        filtrarLembretes();
    }
});

// Filtro por mês
filtroMesLembretes.addEventListener('change', filtrarLembretes);
function filtrarLembretes(){
    const mes = filtroMesLembretes.value;
    Array.from(listaLembretes.children).forEach(li => {
        li.style.display = li.dataset.data.startsWith(mes) ? 'flex' : 'none';
    });
}

/* ================== CONTAS ================== */
const listaContas = document.getElementById('lista-contas');
const formConta = document.getElementById('form-conta');
const totalGasto = document.getElementById('total-gasto');
const totalPago = document.getElementById('total-pago');
const totalPendente = document.getElementById('total-pendente');
const filtroMesContas = document.getElementById('filtro-mes-contas');

document.getElementById('btn-adicionar-conta').addEventListener('click', () => formConta.classList.remove('form-hidden'));
document.getElementById('cancelar-conta').addEventListener('click', () => formConta.classList.add('form-hidden'));

// Salvar conta
document.getElementById('salvar-conta').addEventListener('click', () => {
    const nome = document.getElementById('nome-conta').value.trim();
    const valor = parseFloat(document.getElementById('valor-conta').value);
    const status = document.getElementById('status-conta').value;
    const vencimento = document.getElementById('vencimento-conta').value;
    if(nome && valor && vencimento){
        const li = document.createElement('li');
        li.dataset.data = vencimento;
        li.dataset.status = status;
        li.textContent = `${nome} - ${valor.toFixed(2)} - ${status} - ${vencimento}`;
        li.classList.add('slide-in');
        listaContas.appendChild(li);
        atualizarResumo();
        formConta.classList.add('form-hidden');
        document.getElementById('nome-conta').value = '';
        document.getElementById('valor-conta').value = '';
        document.getElementById('status-conta').value = 'nao-paga';
        document.getElementById('vencimento-conta').value = '';
        salvarNoStorage();
        enviarNotificacao("💰 Nova conta", `${nome} - ${valor.toFixed(2)} - ${status}`);
        filtrarContas();
    }
});

// Filtro por mês
filtroMesContas.addEventListener('change', filtrarContas);
function filtrarContas(){
    const mes = filtroMesContas.value;
    Array.from(listaContas.children).forEach(li => {
        li.style.display = li.dataset.data.startsWith(mes) ? 'flex' : 'none';
    });
    atualizarResumo();
}

// Atualizar resumo financeiro
function atualizarResumo(){
    let total=0, pago=0, pendente=0;
    Array.from(listaContas.children).forEach(li => {
        if(li.style.display === 'none') return;
        const partes = li.textContent.split(' - ');
        const valor = parseFloat(partes[1]);
        total += valor;
        if(partes[2]==='paga') pago += valor;
        else pendente += valor;
    });
    totalGasto.textContent = total.toFixed(2);
    totalPago.textContent = pago.toFixed(2);
    totalPendente.textContent = pendente.toFixed(2);
}

/* ================== LOCALSTORAGE ================== */
function salvarNoStorage(){
    const lembretes = Array.from(listaLembretes.children).map(li=>({
        texto: li.textContent,
        data: li.dataset.data,
        prioridade: li.dataset.prioridade
    }));
    const contas = Array.from(listaContas.children).map(li=>({
        texto: li.textContent,
        data: li.dataset.data,
        status: li.dataset.status
    }));
    localStorage.setItem('lembretes', JSON.stringify(lembretes));
    localStorage.setItem('contas', JSON.stringify(contas));
}

function carregarDoStorage(){
    const lembretesSalvos = JSON.parse(localStorage.getItem('lembretes') || '[]');
    lembretesSalvos.forEach(obj => {
        const li = document.createElement('li');
        li.textContent = obj.texto;
        li.dataset.data = obj.data;
        li.dataset.prioridade = obj.prioridade;
        li.classList.add('slide-in');
        listaLembretes.appendChild(li);
    });
    const contasSalvas = JSON.parse(localStorage.getItem('contas') || '[]');
    contasSalvas.forEach(obj => {
        const li = document.createElement('li');
        li.textContent = obj.texto;
        li.dataset.data = obj.data;
        li.dataset.status = obj.status;
        li.classList.add('slide-in');
        listaContas.appendChild(li);
    });
    filtrarLembretes();
    filtrarContas();
}

window.addEventListener('load', carregarDoStorage);

/* ================== NOTIFICAÇÕES ================== */
function enviarNotificacao(titulo, mensagem){
    if(Notification.permission === 'granted'){
        new Notification(titulo, { body: mensagem });
    } else {
        Notification.requestPermission();
    }
}
