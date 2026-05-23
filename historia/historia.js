const historiaData = [
    {
        titulo: "Arco 1: Escola de Jujutsu",
        tag: "Special Grade",
        logo: "../assets/images/Jujutsu-Kaisen-0-Logo.png",
        descricao: "A história foca em Yuta Okkotsu, um jovem assombrado pelo espírito poderosíssimo de sua amiga de infância, Rika. Ele entra para a escola Jujutsu, aprende a controlar esse poder e derrota o vilão Suguru Geto, que queria extinguir os humanos comuns. No fim, Yuta liberta a alma de Rika e se torna um dos feiticeiros mais fortes da atualidade.",
        imagem: "../assets/images/Yuta-Historia.png"
    },
    {
        titulo: "Arco 2: Incidente de Tóquio",
        tag: "Temporada 1",
        logo: "../assets/images/Jujutsu-Kaisen-Logo.png",
        descricao: "O jovem Yuji Itadori engole um dedo de Sukuna, o Rei das Maldições, e vira seu receptáculo. Para evitar sua execução imediata, ele se junta a Megumi e Nobara sob a tutela de Gojo para encontrar os outros dedos. A temporada mostra o trio amadurecendo em missões perigosas enquanto maldições de nível especial começam a se organizar para um ataque em massa.",
        imagem: "../assets/images/Itadori-Hitoria.png"
    },
    {
        titulo: "Arco 3: Viagem de Treino",
        tag: "Shibuya",
        logo: "../assets/images/Jujutsu-Kaisen-Shibuya-Logo.png",
        descricao: "Após mostrar o passado de Gojo e Geto, a história volta para o presente no massacre de Shibuya. O plano dos vilões dá certo: Satoru Gojo é selado, deixando a humanidade indefesa. O arco é um caos total, com Sukuna assumindo o corpo de Yuji para destruir a cidade e vários personagens importantes morrendo ou sendo derrotados. O Japão entra em colapso e Yuji termina isolado e caçado.",
        imagem: "../assets/images/Gojo-Historia.png"
    },
    {
        titulo: "Arco 4: Incidente de Shibuya",
        tag: "Colônias",
        logo: "../assets/images/Jujutsu-Kaisen-Abate-Logo.png",
        descricao: "Após o selamento de Gojo, o Japão se torna o palco de um \"battle royale\" mortal arquitetado por Kenjaku. Feiticeiros novos e antigos são forçados a lutar em colônias isoladas para acumular pontos. O objetivo de Yuji e seus aliados é entrar no jogo para resgatar Gojo, proteger os civis e impedir a fusão que ameaça a existência da humanidade.",
        imagem: "../assets/images/Megumi-Historia.png"
    }
];

const TRANSITION_MS = 300;
const HISTORIA_ELEMENT_IDS = ['historiaLogo', 'historiaTitle', 'historiaText', 'historiaImageMain', 'historiaTag'];

let transitionTimeoutId = null;

function getHistoriaElements() {
    return HISTORIA_ELEMENT_IDS.map((id) => document.getElementById(id));
}

function aplicarFade(elementos, isOut) {
    elementos.forEach((el) => {
        if (!el) return;
        el.classList.add('historia-fade');
        el.classList.toggle('out', isOut);
    });
}

function setWheelActive(index) {
    document.querySelectorAll('.wheel-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}

function atualizarHistoria(index) {
    const data = historiaData[index];
    const [logo, titulo, texto, imagem, tag] = getHistoriaElements();
    const elementos = [logo, titulo, texto, imagem, tag];

    if (transitionTimeoutId) {
        clearTimeout(transitionTimeoutId);
    }

    aplicarFade(elementos, true);

    transitionTimeoutId = setTimeout(() => {
        if (!logo || !titulo || !texto || !imagem || !tag) return;

        logo.src = data.logo;
        titulo.textContent = data.titulo;
        texto.textContent = data.descricao;
        imagem.src = data.imagem;
        tag.textContent = data.tag;
        aplicarFade(elementos, false);
    }, TRANSITION_MS);

    setWheelActive(index);
}

function initHistoriaWheel() {
    document.querySelectorAll('.wheel-item').forEach((item) => {
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');

        const selectArc = () => {
            atualizarHistoria(parseInt(item.dataset.index, 10));
        };

        item.addEventListener('click', selectArc);
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectArc();
            }
        });
    });

    atualizarHistoria(0);
}

document.addEventListener('DOMContentLoaded', initHistoriaWheel);
