/* =========================================================
   PERSONAGENS: grade com busca e filtro, ficha em <dialog>.
   O link direto usa o hash #personagem-<slug> (ex.: #personagem-gojo).
   ========================================================= */

const HASH_PREFIX = 'personagem-';
const MODAL_SWAP_MS = 200;
const SWIPE_MIN_PX = 50;

const charState = {
    categoria: 'todos',
    busca: '',
    visiveis: [],
    atual: null,
};

const charEl = (id) => document.getElementById(id);

/* Busca sem acentos e sem diferenciar maiúsculas: "Técnica" vira "tecnica" */
function normalizar(texto) {
    return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function createText(tag, className, text, lang) {
    const el = document.createElement(tag);
    el.className = className;
    el.textContent = text;
    if (lang) el.lang = lang;
    return el;
}

/* ===== GRADE ===== */
function createCharacterCard(personagem) {
    const card = document.createElement('a');
    card.className = 'char-card';
    card.href = `#${HASH_PREFIX}${personagem.slug}`;
    card.dataset.slug = personagem.slug;
    card.setAttribute('aria-label', `${personagem.nome}, ${personagem.papel}. Ver ficha completa`);

    const img = document.createElement('img');
    img.src = personagem.imagem;
    img.alt = '';
    img.width = 720;
    img.height = 960;
    img.loading = 'lazy';
    img.decoding = 'async';

    const body = document.createElement('div');
    body.className = 'char-card-body';
    body.append(
        createText('span', 'char-card-kanji', personagem.kanji, 'ja'),
        createText('h3', 'char-card-name', personagem.nome),
        createText('span', 'char-card-role', personagem.papel),
    );

    card.append(img, body);
    return card;
}

function renderGrid() {
    const grid = charEl('personagensGrid');

    JJK.personagens().forEach((personagem, i) => {
        const item = document.createElement('li');
        item.className = 'reveal';
        item.dataset.slug = personagem.slug;
        item.style.setProperty('--reveal-delay', `${(i % 4) * 70}ms`);
        item.append(createCharacterCard(personagem));
        grid.append(item);
    });
}

function renderFilters() {
    const group = charEl('charFilters');
    const opcoes = { todos: 'Todos', ...window.JJK_CATEGORIAS };

    Object.entries(opcoes).forEach(([valor, rotulo]) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'filter-chip';
        chip.dataset.categoria = valor;
        chip.textContent = rotulo;
        chip.setAttribute('aria-pressed', String(valor === charState.categoria));
        group.append(chip);
    });

    group.addEventListener('click', (e) => {
        const chip = e.target.closest('.filter-chip');
        if (!chip) return;
        charState.categoria = chip.dataset.categoria;
        group.querySelectorAll('.filter-chip').forEach((c) => {
            c.setAttribute('aria-pressed', String(c === chip));
        });
        applyFilters();
    });
}

function matches(personagem) {
    if (charState.categoria !== 'todos' && personagem.categoria !== charState.categoria) return false;
    if (!charState.busca) return true;
    const alvo = normalizar([personagem.nome, personagem.papel, personagem.tecnica, personagem.afiliacao].join(' '));
    return alvo.includes(charState.busca);
}

function applyFilters({ inicial = false } = {}) {
    charState.visiveis = JJK.personagens().filter(matches);
    const visiveis = new Set(charState.visiveis.map((p) => p.slug));

    charEl('personagensGrid').querySelectorAll('li').forEach((item) => {
        const visivel = visiveis.has(item.dataset.slug);
        item.hidden = !visivel;
        // Depois de filtrar, os cards aparecem na hora, sem esperar a animação de rolagem
        if (visivel && !inicial) item.classList.add('is-visible');
    });

    const total = charState.visiveis.length;
    charEl('charCount').textContent = total === 1 ? '1 personagem' : `${total} personagens`;
    charEl('charEmpty').hidden = total > 0;
}

function initFilters() {
    renderFilters();

    let debounceId = null;
    charEl('charSearch').addEventListener('input', (e) => {
        clearTimeout(debounceId);
        debounceId = setTimeout(() => {
            charState.busca = normalizar(e.target.value.trim());
            applyFilters();
        }, 120);
    });

    charEl('charReset').addEventListener('click', () => {
        charEl('charSearch').value = '';
        charState.busca = '';
        charEl('charFilters').querySelector('[data-categoria="todos"]').click();
    });

    applyFilters({ inicial: true });
}

/* ===== FICHA (MODAL) ===== */
const getModal = () => charEl('personagemModal');

/* As setas percorrem apenas os personagens visíveis no filtro atual */
function listaNavegavel() {
    return charState.visiveis.length ? charState.visiveis : JJK.personagens();
}

function fillModal(personagem) {
    const img = charEl('modalImagem');
    img.src = personagem.imagem;
    img.alt = `${personagem.nome}, arte colorida do mangá`;

    charEl('modalKanji').textContent = personagem.kanji;
    charEl('modalPapel').textContent = personagem.papel;
    charEl('modalNome').textContent = personagem.nome;
    charEl('modalGrau').textContent = personagem.grau;
    charEl('modalTecnica').textContent = personagem.tecnica;
    charEl('modalAfiliacao').textContent = personagem.afiliacao;
    charEl('modalHistoria').textContent = personagem.historia;

    const lista = listaNavegavel();
    const pos = lista.findIndex((p) => p.slug === personagem.slug);
    charEl('modalPosicao').textContent = pos >= 0 ? `${pos + 1} / ${lista.length}` : '';

    getModal().querySelector('.char-modal-body').scrollTop = 0;
}

function showPersonagem(slug, { animate = true } = {}) {
    const personagem = JJK.findPersonagem(slug);
    if (!personagem) return;

    const modal = getModal();
    charState.atual = personagem.slug;

    if (!modal.open) {
        fillModal(personagem);
        modal.showModal();
        JJK.lockScroll(true);
        return;
    }

    if (!animate || JJK.prefersReducedMotion()) {
        fillModal(personagem);
        return;
    }

    const inner = modal.querySelector('.char-modal-inner');
    inner.classList.add('is-swapping');
    setTimeout(() => {
        fillModal(personagem);
        inner.classList.remove('is-swapping');
    }, MODAL_SWAP_MS);
}

function setHash(slug) {
    history.replaceState(null, '', slug ? `#${HASH_PREFIX}${slug}` : '#personagens');
}

function navegar(direcao) {
    const lista = listaNavegavel();
    const pos = lista.findIndex((p) => p.slug === charState.atual);
    const proximo = lista[(pos + direcao + lista.length) % lista.length];
    setHash(proximo.slug);
    showPersonagem(proximo.slug);
}

function slugFromHash() {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    return hash.startsWith(HASH_PREFIX) ? hash.slice(HASH_PREFIX.length) : null;
}

function initModal() {
    const modal = getModal();
    let cardOrigem = null;

    ['modalImagem', 'modalPapel', 'modalNome', 'modalHistoria', 'modalKanji'].forEach((id) => charEl(id).classList.add('swap'));
    modal.querySelector('.char-facts').classList.add('swap');

    // Clique no card: abre a ficha sem pular a página até o hash
    charEl('personagensGrid').addEventListener('click', (e) => {
        const card = e.target.closest('.char-card');
        if (!card) return;
        e.preventDefault();
        cardOrigem = card;
        setHash(card.dataset.slug);
        showPersonagem(card.dataset.slug);
    });

    // Link direto colado na barra de endereço ou vindo de outro lugar
    window.addEventListener('hashchange', () => {
        const slug = slugFromHash();
        if (JJK.findPersonagem(slug)) showPersonagem(slug);
        else if (modal.open) modal.close();
    });

    charEl('modalClose').addEventListener('click', () => modal.close());
    charEl('modalPrev').addEventListener('click', () => navegar(-1));
    charEl('modalNext').addEventListener('click', () => navegar(1));

    // Clique no fundo escuro fecha
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.close();
    });

    modal.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') navegar(-1);
        if (e.key === 'ArrowRight') navegar(1);
    });

    // Swipe horizontal no celular (gestos verticais continuam rolando o texto)
    let touchStart = null;
    modal.addEventListener('touchstart', (e) => {
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });
    modal.addEventListener('touchend', (e) => {
        if (!touchStart) return;
        const dx = e.changedTouches[0].clientX - touchStart.x;
        const dy = e.changedTouches[0].clientY - touchStart.y;
        touchStart = null;
        if (Math.abs(dx) >= SWIPE_MIN_PX && Math.abs(dx) > Math.abs(dy) * 1.5) navegar(dx < 0 ? 1 : -1);
    }, { passive: true });

    modal.addEventListener('close', () => {
        // Devolve o foco ao card que abriu a ficha (ou ao do último personagem visto, se veio por link)
        const ultimo = charEl('personagensGrid').querySelector(`.char-card[data-slug="${charState.atual}"]`);
        const alvo = cardOrigem?.isConnected ? cardOrigem : ultimo;
        JJK.lockScroll(false);
        charState.atual = null;
        cardOrigem = null;
        if (slugFromHash()) setHash(null);
        alvo?.focus({ preventScroll: true });
    });

    const inicial = slugFromHash();
    if (JJK.findPersonagem(inicial)) {
        charEl('personagens').scrollIntoView();
        showPersonagem(inicial, { animate: false });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!charEl('personagensGrid')) return;
    renderGrid();
    initFilters();
    initModal();
    JJK.observeReveal(charEl('personagensGrid'));
});
