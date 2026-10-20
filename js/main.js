/* =========================================================
   JUJUTSU KAISEN: comportamento geral da página
   ========================================================= */

const SESSION_KEYS = {
    siteVisited: 'jjk:visited',
    videoTime: 'jjk:videoTime',
};

const LOADER = {
    minDisplayMs: 1200,
    maxDisplayMs: 4000,
    fadeMs: 600,
};

const PARTICLES = {
    count: 12,
    colors: ['#d0283f', '#c9a961', '#8b6fc0', '#e8d5a3'],
};

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* sessionStorage pode lançar exceção (modo privado, cookies bloqueados) */
const storage = {
    get(key) {
        try { return sessionStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
        try { sessionStorage.setItem(key, value); } catch { /* ignora */ }
    },
};

const revealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 })
    : null;

/* Utilitários compartilhados com os outros scripts */
const JJK = {
    personagens: () => window.JJK_PERSONAGENS || [],
    arcos: () => window.JJK_ARCOS || [],
    findPersonagem: (slug) => JJK.personagens().find((p) => p.slug === slug),
    prefersReducedMotion: () => prefersReducedMotion.matches,

    lockScroll(locked) {
        document.body.classList.toggle('is-locked', locked);
    },

    observeReveal(root = document) {
        const items = root.querySelectorAll('.reveal:not(.is-visible)');
        if (!revealObserver || prefersReducedMotion.matches) {
            items.forEach((el) => el.classList.add('is-visible'));
            return;
        }
        items.forEach((el) => revealObserver.observe(el));
    },
};

window.JJK = JJK;

/* ===== LOADER: aparece só na primeira visita da sessão ===== */
function initLoader() {
    const loader = document.querySelector('.loader');
    if (!loader) return;

    // Visitas seguintes: o script inline do <head> já escondeu o loader
    if (document.documentElement.classList.contains('is-returning')) {
        loader.remove();
        return;
    }

    storage.set(SESSION_KEYS.siteVisited, 'true');

    const startedAt = performance.now();
    let hidden = false;

    const hide = () => {
        if (hidden) return;
        hidden = true;
        loader.classList.add('is-hidden');
        setTimeout(() => loader.remove(), LOADER.fadeMs);
    };

    const hideAfterMinimum = () => {
        const elapsed = performance.now() - startedAt;
        setTimeout(hide, Math.max(0, LOADER.minDisplayMs - elapsed));
    };

    if (document.readyState === 'complete') hideAfterMinimum();
    else window.addEventListener('load', hideAfterMinimum, { once: true });

    // Um vídeo lento nunca deve prender o usuário no loader
    setTimeout(hide, LOADER.maxDisplayMs);
}

/* ===== PARTÍCULAS DE ENERGIA AMALDIÇOADA ===== */
function initParticles() {
    if (prefersReducedMotion.matches) return;

    const container = document.createElement('div');
    container.className = 'particles-container';
    container.setAttribute('aria-hidden', 'true');

    for (let i = 0; i < PARTICLES.count; i += 1) {
        const particle = document.createElement('span');
        particle.className = 'particle';
        particle.style.left = `${(i / PARTICLES.count) * 100 + Math.random() * 6}%`;
        particle.style.setProperty('--particle-color', PARTICLES.colors[i % PARTICLES.colors.length]);
        particle.style.setProperty('--particle-duration', `${11 + Math.random() * 9}s`);
        particle.style.setProperty('--particle-delay', `${-Math.random() * 14}s`);
        container.append(particle);
    }

    document.body.prepend(container);
}

/* ===== VÍDEO DE FUNDO ===== */
function initVideoBackground() {
    const video = document.querySelector('.video-background');
    if (!video) return;

    if (prefersReducedMotion.matches) {
        video.removeAttribute('autoplay');
        video.pause();
        return;
    }

    // Retoma de onde parou ao recarregar a página
    const savedTime = parseFloat(storage.get(SESSION_KEYS.videoTime));
    if (Number.isFinite(savedTime)) {
        const restore = () => {
            if (savedTime < video.duration) video.currentTime = savedTime;
        };
        if (video.readyState >= 1) restore();
        else video.addEventListener('loadedmetadata', restore, { once: true });
    }

    window.addEventListener('pagehide', () => {
        storage.set(SESSION_KEYS.videoTime, String(video.currentTime));
    });

    // Economiza bateria quando a aba não está visível
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) video.pause();
        else video.play().catch(() => {});
    });
}

/* ===== HEADER: estado ao rolar, menu mobile e seção ativa ===== */
function initHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const updateScrolled = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    updateScrolled();
    window.addEventListener('scroll', updateScrolled, { passive: true });

    const toggle = header.querySelector('.nav-toggle');
    const navList = header.querySelector('.nav-list');

    const setOpen = (open) => {
        navList.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
        JJK.lockScroll(open);
    };
    const isOpen = () => navList.classList.contains('is-open');

    toggle.addEventListener('click', () => setOpen(!isOpen()));
    navList.addEventListener('click', (e) => {
        if (e.target.closest('.nav-link')) setOpen(false);
    });
    document.addEventListener('click', (e) => {
        if (isOpen() && !header.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen()) {
            setOpen(false);
            toggle.focus();
        }
    });
    window.matchMedia('(min-width: 861px)').addEventListener('change', (e) => {
        if (e.matches && isOpen()) setOpen(false);
    });

    initScrollSpy(navList);
}

/* Destaca no menu a seção que está no meio da tela */
function initScrollSpy(navList) {
    const links = [...navList.querySelectorAll('.nav-link')];
    const sections = links
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);
    if (!('IntersectionObserver' in window) || !sections.length) return;

    const setActive = (id) => {
        links.forEach((link) => {
            const active = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('is-active', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(entry.target.id);
        });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach((section) => observer.observe(section));
    setActive(sections[0].id);
}

function initFooterYear() {
    document.querySelectorAll('[data-current-year]').forEach((el) => {
        el.textContent = new Date().getFullYear();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initParticles();
    initVideoBackground();
    initHeader();
    initFooterYear();
    JJK.observeReveal();
});
