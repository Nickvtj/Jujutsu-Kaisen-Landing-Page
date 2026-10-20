/* =========================================================
   ARCOS: abas acessíveis (padrão WAI-ARIA) com a capa de cada arco
   ========================================================= */

const ARC_SWAP_MS = 260;

const arcState = {
    index: -1,
    swapTimeoutId: null,
};

const arcEl = (id) => document.getElementById(id);

function getArcTabs() {
    return [...document.querySelectorAll('.arc-tab')];
}

function renderArcTabs() {
    const tablist = arcEl('arcTabs');

    JJK.arcos().forEach((arco, i) => {
        const tab = document.createElement('button');
        tab.type = 'button';
        tab.className = 'arc-tab';
        tab.id = `tab-${arco.slug}`;
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-controls', 'arcPanel');
        tab.setAttribute('aria-selected', 'false');
        tab.tabIndex = -1;

        const num = document.createElement('span');
        num.className = 'arc-tab-num';
        num.lang = 'ja';
        num.setAttribute('aria-hidden', 'true');
        num.textContent = arco.numero;

        const name = document.createElement('span');
        name.className = 'arc-tab-name';
        name.textContent = arco.nome;

        const meta = document.createElement('span');
        meta.className = 'arc-tab-meta';
        meta.textContent = `${arco.formato} · ${arco.ano}`;

        tab.append(num, name, meta);
        tab.addEventListener('click', () => selectArc(i));
        tablist.append(tab);
    });

    tablist.addEventListener('keydown', (e) => {
        const total = JJK.arcos().length;
        const keys = {
            ArrowDown: arcState.index + 1,
            ArrowRight: arcState.index + 1,
            ArrowUp: arcState.index - 1,
            ArrowLeft: arcState.index - 1,
            Home: 0,
            End: total - 1,
        };
        if (!(e.key in keys)) return;
        e.preventDefault();
        selectArc((keys[e.key] + total) % total, { focusTab: true });
    });
}

function fillArcPanel(arco, index) {
    const total = JJK.arcos().length;
    const pad = (n) => String(n).padStart(2, '0');

    arcEl('arcCover').src = arco.capa;
    arcEl('arcCover').alt = `Capa do ${arco.capaLegenda.toLowerCase()} do mangá`;
    arcEl('arcCoverCaption').textContent = `Capa do ${arco.capaLegenda.toLowerCase()}`;
    arcEl('arcMeta').textContent = [arco.formato, arco.ano, arco.detalhe].filter(Boolean).join(' · ');
    arcEl('arcTitle').textContent = arco.nome;
    arcEl('arcText').textContent = arco.descricao;
    arcEl('arcCounter').textContent = `${pad(index + 1)} / ${pad(total)}`;
}

function selectArc(index, { focusTab = false, animate = true } = {}) {
    const arco = JJK.arcos()[index];
    if (!arco) return;

    if (index === arcState.index) {
        if (focusTab) getArcTabs()[index]?.focus();
        return;
    }
    arcState.index = index;

    getArcTabs().forEach((tab, i) => {
        const selected = i === index;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        if (!selected) return;
        arcEl('arcPanel').setAttribute('aria-labelledby', tab.id);
        if (focusTab) tab.focus();
        // Mantém a aba visível no scroller horizontal (mobile) sem mexer na rolagem da página
        const list = tab.parentElement;
        if (list.scrollWidth > list.clientWidth) {
            list.scrollTo({ left: tab.offsetLeft - 16, behavior: animate ? 'smooth' : 'auto' });
        }
    });

    const panel = arcEl('arcPanel');
    clearTimeout(arcState.swapTimeoutId);

    if (!animate || JJK.prefersReducedMotion()) {
        fillArcPanel(arco, index);
        return;
    }

    panel.classList.add('is-swapping');
    arcState.swapTimeoutId = setTimeout(() => {
        fillArcPanel(arco, index);
        panel.classList.remove('is-swapping');
    }, ARC_SWAP_MS);
}

function preloadArcCovers() {
    JJK.arcos().forEach((arco) => {
        const img = new Image();
        img.src = arco.capa;
    });
}

function initArcos() {
    if (!arcEl('arcPanel')) return;

    renderArcTabs();

    const total = JJK.arcos().length;
    arcEl('arcPrev').addEventListener('click', () => selectArc((arcState.index - 1 + total) % total));
    arcEl('arcNext').addEventListener('click', () => selectArc((arcState.index + 1) % total));

    selectArc(0, { animate: false });

    // Pré-carrega as capas só quando a seção estiver perto de aparecer
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return;
            preloadArcCovers();
            observer.disconnect();
        }, { rootMargin: '400px 0px' });
        observer.observe(arcEl('arcPanel'));
    } else {
        preloadArcCovers();
    }
}

document.addEventListener('DOMContentLoaded', initArcos);
