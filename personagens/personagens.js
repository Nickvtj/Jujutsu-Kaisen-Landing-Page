const personagensData = [
    {
        nome: 'Yuji Itadori',
        papel: 'Protagonista',
        descricao: 'Estudante que se tornou receptáculo de Sukuna após engolir um de seus dedos.',
        imagem: '../assets/images/ItadoriHome.png',
    },
    {
        nome: 'Satoru Gojo',
        papel: 'Feiticeiro Especial',
        descricao: 'O feiticeiro mais forte da atualidade, mestre de Yuji, Megumi e Nobara.',
        imagem: '../assets/images/Gojo-Historia.png',
    },
    {
        nome: 'Megumi Fushiguro',
        papel: 'Estudante',
        descricao: 'Discípulo de Gojo com a habilidade de invocar shikigamis das sombras.',
        imagem: '../assets/images/Megumi-Historia.png',
    },
    {
        nome: 'Yuta Okkotsu',
        papel: 'Feiticeiro Especial',
        descricao: 'Portador do espírito de Rika e um dos feiticeiros mais poderosos do mundo.',
        imagem: '../assets/images/Yuta-Historia.png',
    },
];

function criarCard(personagem) {
    const card = document.createElement('article');
    card.className = 'personagem-card';
    card.tabIndex = 0;

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

function initPersonagensGrid() {
    const grid = document.getElementById('personagensGrid');
    if (!grid) return;

    personagensData.forEach((personagem) => {
        grid.appendChild(criarCard(personagem));
    });
}

document.addEventListener('DOMContentLoaded', initPersonagensGrid);
