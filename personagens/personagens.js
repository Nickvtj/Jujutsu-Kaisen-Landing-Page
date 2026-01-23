// Script para a página de personagens
// Será preenchido conforme necessário

document.addEventListener('DOMContentLoaded', () => {
    console.log('Página de Personagens carregada');
    
    // Script para partículas com delays aleatórios
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle) => {
        const randomDelay = Math.random() * 10;
        particle.style.animationDelay = randomDelay + 's';
    });
});

// Script para manter o vídeo de background contínuo
window.addEventListener('beforeunload', () => {
    const video = document.querySelector('.video-background');
    if (video) {
        sessionStorage.setItem('videoTime', video.currentTime);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const video = document.querySelector('.video-background');
    if (video) {
        const savedTime = sessionStorage.getItem('videoTime');
        if (savedTime) {
            video.currentTime = parseFloat(savedTime);
        }
    }
});
