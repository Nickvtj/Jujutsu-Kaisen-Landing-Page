const personagensData = [
    {
        nome: 'Yuji Itadori',
        papel: 'Protagonista',
        descricao: 'Estudante que se tornou receptáculo de Sukuna após engolir um de seus dedos.',
        historia: 'Yuji Itadori possui força física sobre-humana e um coração altruista. Após engolir um dedo amaldiçoado de Sukuna para salvar seus amigos, tornou-se receptáculo do Rei das Maldições. Sob a tutela de Satoru Gojo, luta para salvar pessoas e coletar os dedos de Sukuna, enfrentando o peso moral de carregar o mal dentro de si enquanto mantém sua humanidade.',
        imagem: '../assets/images/ItadoriHome.png',
    },
    {
        nome: 'Satoru Gojo',
        papel: 'Feiticeiro Especial',
        descricao: 'O feiticeiro mais forte da atualidade, mestre de Yuji, Megumi e Nobara.',
        historia: 'Satoru Gojo é considerado o feiticeiro jujutsu mais forte do mundo graças aos Six Eyes e ao Limitless. Professor na Escola Técnica de Jujutsu de Tóquio, guia Yuji, Megumi e Nobara em missões perigosas. Sua confiança e poder escondem um passado marcado pela amizade com Suguru Geto e pela tragédia do Incidente de Shibuya, onde foi selado pelos vilões.',
        imagem: '../assets/images/Gojo-Historia.png',
    },
    {
        nome: 'Megumi Fushiguro',
        papel: 'Estudante',
        descricao: 'Discípulo de Gojo com a habilidade de invocar shikigamis das sombras.',
        historia: 'Megumi Fushiguro é discípulo de Gojo e herdeiro do estilo Zenin das Ten Sombras. Utiliza shikigamis invocados de sombras para combater maldições com estratégia e frieza. Protege sua irmã Tsumiki acima de tudo e carrega conflitos internos sobre o valor das vidas — especialmente quando precisa decidir quem salvar em meio ao caos.',
        imagem: '../assets/images/Megumi-Historia.png',
    },
    {
        nome: 'Yuta Okkotsu',
        papel: 'Feiticeiro Especial',
        descricao: 'Portador do espírito de Rika e um dos feiticeiros mais poderosos do mundo.',
        historia: 'Yuta Okkotsu foi assombrado por Rika Orimoto, transformada em maldição especial de nível após sua morte. Treinado por Gojo, aprendeu a controlar esse poder imenso e derrotou Suguru Geto no filme Jujutsu Kaisen 0. Após libertar Rika, tornou-se um dos feiticeiros especiais mais poderosos, retornando ao Japão nos momentos mais críticos da série.',
        imagem: '../assets/images/Yuta-Historia.png',
    },
];

let modalIndexAtual = 0;

function criarCard(personagem, index) {
    const card = document.createElement('article');
    card.className = 'personagem-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Ver detalhes de ${personagem.nome}`);
    card.dataset.index = index;

    card.innerHTML = `
        <span class="personagem-card-accent" aria-hidden="true"></span>
        <img class="personagem-card-image" src="${personagem.imagem}" alt="${personagem.nome}">
        <div class="personagem-card-body">
            <span class="personagem-card-role">${personagem.papel}</span>
            <h3>${personagem.nome}</h3>
            <p>${personagem.descricao}</p>
        </div>
    `;

    return card;
}

function atualizarConteudoModal(index) {
    const personagem = personagensData[index];
    const imagem = document.getElementById('modalImagem');
    const papel = document.getElementById('modalPapel');
    const nome = document.getElementById('modalNome');
    const historia = document.getElementById('modalHistoria');

    if (!personagem || !imagem || !papel || !nome || !historia) return;

    imagem.src = personagem.imagem;
    imagem.alt = personagem.nome;
    papel.textContent = personagem.papel;
    nome.textContent = personagem.nome;
    historia.textContent = personagem.historia;

    modalIndexAtual = index;
}

function abrirModal(index) {
    const modal = document.getElementById('personagemModal');
    if (!modal) return;

    atualizarConteudoModal(index);

    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    modal.querySelector('.personagem-modal-close')?.focus();
}

function fecharModal() {
    const modal = document.getElementById('personagemModal');
    if (!modal || modal.hidden) return;

    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
}

function navegarModal(direcao) {
    const total = personagensData.length;
    const proximoIndex = (modalIndexAtual + direcao + total) % total;
    atualizarConteudoModal(proximoIndex);
}

function initPersonagemModal() {
    const modal = document.getElementById('personagemModal');
    const btnPrev = document.getElementById('modalPrev');
    const btnNext = document.getElementById('modalNext');

    if (!modal) return;

    modal.querySelectorAll('[data-close-modal]').forEach((el) => {
        el.addEventListener('click', fecharModal);
    });

    btnPrev?.addEventListener('click', () => navegarModal(-1));
    btnNext?.addEventListener('click', () => navegarModal(1));

    document.addEventListener('keydown', (e) => {
        if (modal.hidden) return;

        if (e.key === 'Escape') {
            fecharModal();
            return;
        }

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            navegarModal(-1);
        }

        if (e.key === 'ArrowRight') {
            e.preventDefault();
            navegarModal(1);
        }
    });
}

function initPersonagensGrid() {
    const grid = document.getElementById('personagensGrid');
    if (!grid) return;

    personagensData.forEach((personagem, index) => {
        const card = criarCard(personagem, index);

        const abrir = () => abrirModal(index);

        card.addEventListener('click', abrir);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                abrir();
            }
        });

        grid.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initPersonagensGrid();
    initPersonagemModal();
});
