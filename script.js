const SESSION_KEYS = {
    siteVisited: 'siteVisitado',
    videoTime: 'videoTime',
};

const LOADER = {
    displayDurationMs: 3000,
    fadeDurationMs: 500,
};

const PARTICLE_DELAY_MAX_S = 10;

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

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initParticles();
    initVideoPersistence();
    initActiveNav();
});

window.addEventListener('beforeunload', saveVideoTime);
