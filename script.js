const SESSION_KEYS = {
    siteVisited: 'siteVisitado',
    videoTime: 'videoTime',
};

const LOADER = {
    displayDurationMs: 3000,
    fadeDurationMs: 500,
};

const PARTICLE_DELAY_MAX_S = 10;

const CURSOR = {
    assetPath: 'assets/images/Cursor.png',
    sizePx: 44,
    hotspotX: 6,
    hotspotY: 4,
};

function getAssetUrl(pathFromRoot) {
    const script = document.querySelector('script[src*="script.js"]');
    if (!script) return pathFromRoot;
    return new URL(pathFromRoot, script.src).href;
}

function initCustomCursor() {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.setAttribute('aria-hidden', 'true');

    const img = document.createElement('img');
    img.src = getAssetUrl(CURSOR.assetPath);
    img.alt = '';
    img.draggable = false;
    cursor.appendChild(img);
    document.body.appendChild(cursor);
    document.documentElement.classList.add('custom-cursor-active');

    let isVisible = false;

    const moveCursor = (event) => {
        const x = event.clientX - CURSOR.hotspotX;
        const y = event.clientY - CURSOR.hotspotY;
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;

        if (!isVisible) {
            cursor.classList.add('is-visible');
            isVisible = true;
        }
    };

    const hideCursor = () => {
        cursor.classList.remove('is-visible');
        isVisible = false;
    };

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', hideCursor);
}

function initLoader() {
    const loader = document.querySelector('.Loader');
    if (!loader) return;

    if (sessionStorage.getItem(SESSION_KEYS.siteVisited)) {
        loader.style.display = 'none';
        return;
    }

    sessionStorage.setItem(SESSION_KEYS.siteVisited, 'true');

    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.transition = `opacity ${LOADER.fadeDurationMs}ms ease-out`;
        setTimeout(() => {
            loader.style.display = 'none';
        }, LOADER.fadeDurationMs);
    }, LOADER.displayDurationMs);
}

function initParticles() {
    document.querySelectorAll('.particle').forEach((particle) => {
        const delay = Math.random() * PARTICLE_DELAY_MAX_S;
        particle.style.animationDelay = `${delay}s`;
    });
}

function initVideoPersistence() {
    const video = document.querySelector('.video-background');
    if (!video) return;

    const savedTime = sessionStorage.getItem(SESSION_KEYS.videoTime);
    if (savedTime) {
        video.currentTime = parseFloat(savedTime);
    }
}

function saveVideoTime() {
    const video = document.querySelector('.video-background');
    if (video) {
        sessionStorage.setItem(SESSION_KEYS.videoTime, video.currentTime);
    }
}

function initActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav-link').forEach((link) => {
        const href = link.getAttribute('href') || '';
        const linkPage = href.split('/').pop();
        const isHome = (currentPage === 'index.html' || currentPage === '') && linkPage === 'index.html';
        const isMatch = linkPage === currentPage;

        if (isHome || isMatch) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const navList = document.getElementById('navList');
    if (!toggle || !navList) return;

    const closeMenu = () => {
        toggle.setAttribute('aria-expanded', 'false');
        navList.classList.remove('is-open');
        document.body.classList.remove('nav-open');
    };

    toggle.addEventListener('click', () => {
        const isOpen = navList.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
        document.body.classList.toggle('nav-open', isOpen);
    });

    navList.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navList.classList.contains('is-open')) {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initParticles();
    initVideoPersistence();
    initActiveNav();
    initMobileNav();
    initCustomCursor();
});

window.addEventListener('beforeunload', saveVideoTime);
