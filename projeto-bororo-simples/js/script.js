// ===== FUNÇÕES DE APOIO =====
const ler = chave => JSON.parse(localStorage.getItem(chave)) || [];               // lê uma lista salva no navegador
const salvar = (chave, lista) => localStorage.setItem(chave, JSON.stringify(lista)); // salva uma lista no navegador
const hoje = () => new Date().toLocaleDateString("en-CA");                          // data de hoje: "AAAA-MM-DD"
const escapar = texto => String(texto).replace(/[&<>"]/g, c =>                      // impede que alguém injete HTML
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function mensagem(texto, cor) {                                                     // aviso colorido no formulário
    document.getElementById("mensagem").innerHTML = `<p class="w3-panel w3-round ${cor}">${escapar(texto)}</p>`;
}


// ===== CADASTRO DE ORGANIZADOR =====
function cadastrar(evento) {
    evento.preventDefault();
    const form = evento.target;
    const email = form.email.value.trim().toLowerCase();
    const organizadores = ler("organizadores");

    if (organizadores.some(o => o.email === email)) {
        return mensagem("Este e-mail já está cadastrado.", "w3-pale-red");
    }

    organizadores.push({ nome: form.nome.value.trim(), email, telefone: form.telefone.value.trim() });
    salvar("organizadores", organizadores);
    form.reset();
    mensagem("Cadastro feito! Agora você já pode publicar eventos.", "w3-pale-green");
}


// ===== PUBLICAR EVENTO =====
function publicar(evento) {
    evento.preventDefault();
    const form = evento.target;
    const email = form.email.value.trim().toLowerCase();

    if (!ler("organizadores").some(o => o.email === email)) {
        return mensagem("E-mail não encontrado. Faça seu cadastro primeiro.", "w3-pale-red");
    }

    const eventos = ler("eventos");
    eventos.push({
        titulo: form.titulo.value.trim(), categoria: form.categoria.value, data: form.data.value,
        local: form.local.value.trim(), descricao: form.descricao.value.trim()
    });
    salvar("eventos", eventos);
    form.reset();
    mensagem("Evento publicado! Ele já aparece na página Eventos.", "w3-pale-green");
}


// ===== LISTA DE EVENTOS =====
const EXEMPLOS = [
    { titulo: "Feira do Produtor Rural", categoria: "Feira", data: "2026-12-12", local: "Praça da Matriz", descricao: "Frutas, verduras e doces caseiros direto do produtor." },
    { titulo: "Cantata de Natal", categoria: "Show", data: "2026-12-19", local: "Igreja Matriz", descricao: "Coral municipal com músicas natalinas para toda a família." },
    { titulo: "Oficina de Cerâmica", categoria: "Cultura", data: "2027-01-10", local: "Casa de Cultura", descricao: "Aprenda técnicas de modelagem com artesãos da região." }
];
const CORES = { Feira: "w3-amber", Show: "w3-red", Cultura: "w3-teal", Outro: "w3-blue-grey" };

function mostrarEventos() {
    if (ler("eventos").length === 0) salvar("eventos", EXEMPLOS);      // site nunca começa vazio
    const categoria = document.getElementById("filtro").value;

    const lista = ler("eventos")
        .filter(e => e.data >= hoje() && (categoria === "Todas" || e.categoria === categoria)) // próximos + categoria
        .sort((a, b) => a.data.localeCompare(b.data));                                       // ordem de data

    document.getElementById("lista-eventos").innerHTML = lista.map(e => `
        <article class="w3-card w3-round-large w3-padding cartao">
            <span class="w3-tag w3-round ${CORES[e.categoria] || CORES.Outro}">${escapar(e.categoria)}</span>
            <h2>${escapar(e.titulo)}</h2>
            <p><b>Data:</b> ${escapar(e.data.split("-").reverse().join("/"))}<br><b>Local:</b> ${escapar(e.local)}</p>
            <p>${escapar(e.descricao)}</p>
        </article>`).join("") || "<p>Nenhum evento encontrado.</p>";
}


// ===== AO ABRIR A PÁGINA =====
if (document.getElementById("lista-eventos")) mostrarEventos();               // página Eventos
const campoData = document.querySelector("input[type=date]");
if (campoData) campoData.min = hoje();                                         // página Publicar: bloqueia datas passadas
