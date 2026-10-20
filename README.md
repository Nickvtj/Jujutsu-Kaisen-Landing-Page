<img width="1280" height="324" alt="Jujutsu-Kaisen-Logo-PNG-HD-Image" src="https://github.com/user-attachments/assets/e2acd40e-1c3e-4265-ba32-cef865763295" />

#  Jujutsu Kaisen Landing Page


> Projeto desenvolvido como estudo/prática, inspirado em [frontweek-hollowknight](https://frontweek-hollowknight.netlify.app/).

---


## 🧾 Informações do Projeto

| 🔖 | Detalhe |
|----|--------|
| 💻 **Projeto** | Jujutsu Kaisen Landing Page |
| 🛠 **Tecnologias** | HTML, CSS, JavaScript (sem frameworks) |
| 🔗 **Demo** | [Netlify](https://6973addd1abde73bf4907834--effortless-travesseiro-8838aa.netlify.app/) |
| 📚 **Referência / Desafio** | [Frontweek Hollow Knight](https://frontweek-hollowknight.netlify.app/) |


---


## 👀 Preview

<img width="884" height="494" alt="Screenshot 2026-01-23 141358" src="https://github.com/user-attachments/assets/8a1ac926-f1dc-4910-bc8d-817800aa7cb1" />


---


## 📌 Sobre o Projeto

Landing page temática inspirada no anime Jujutsu Kaisen, desenvolvida como desafio pessoal para aprimorar habilidades em HTML, CSS e JavaScript, com foco em layout, identidade visual e experiência do usuário.

### Seções (página única)

- **Início**: hero com o Yuji em arte colorida do mangá e uma faixa animada.
- **Universo**: resumo da obra e números do mangá e do anime em painéis de papel.
- **Arcos**: os 4 arcos do anime (JJK 0, Temporada 1, Incidente de Shibuya e Jogo do Abate), cada um com a capa de um volume do mangá.
- **Personagens**: 14 personagens com busca, filtro por categoria e ficha completa (grau, técnica, afiliação e história).
- **Rodapé**: citação do Gojo, créditos e links.

### Destaques

- Todas as imagens seguem o mesmo padrão: arte colorida oficial do mangá, sem fundo.
- Link direto para qualquer ficha: `#personagem-gojo`, `#personagem-sukuna` etc.
- Ficha em `<dialog>` nativo: foco gerenciado, `Esc` fecha, setas `←` `→` e swipe no celular navegam.
- Abas dos arcos acessíveis pelo teclado (setas, `Home` e `End`) e menu que destaca a seção visível.
- Responsivo do celular ao desktop e respeito a `prefers-reduced-motion`.
- Assets otimizados em WebP e vídeo comprimido.


---

## 🗂 Estrutura

```
├── index.html            # Página única com todas as seções
├── 404.html
├── css/style.css         # Design system e estilos de todas as seções
├── js/
│   ├── main.js           # Loader, partículas, vídeo, menu e animações
│   ├── arcos.js          # Abas dos arcos
│   └── personagens.js    # Grade, busca, filtros e ficha
├── data/
│   ├── personagens.js    # Dados dos personagens
│   └── arcos.js          # Dados dos arcos
└── assets/
    ├── img/personagens/  # Painéis 3:4 dos personagens
    ├── img/capas/        # Capas dos volumes
    └── media/            # Vídeo de fundo
```

Para adicionar um personagem ou arco, basta incluir um objeto em `data/personagens.js` ou `data/arcos.js`.

## ▶️ Rodando localmente

Por ser um site estático, basta servir a pasta:

```bash
python -m http.server 8000
# acesse http://localhost:8000
```

---

## ⚙️ Tecnologias e Ferramentas

### 🧱 HTML5
- Estrutura semântica (`header`, `main`, `nav`, `dialog`, `figure`)

### 🎨 CSS3
- Design tokens com variáveis CSS
- Grid, Flexbox e responsividade com `clamp()`
- Texto vertical japonês com `writing-mode`
- Animações e microinterações

### ⚡ JavaScript
- Renderização a partir de dados
- Busca e filtros, modal e abas acessíveis
- `IntersectionObserver` para animações ao rolar

### 🖌 Figma
- Criação do UI Design
- Protótipos e assets visuais

## 🧠 O que eu aprendi com esse projeto

- ✔ Organização de código
- ✔ Animações e microinterações
- ✔ Acessibilidade e navegação por teclado
- ✔ Boas práticas de UI/UX

---

> Projeto de fã sem fins lucrativos. Jujutsu Kaisen © Gege Akutami / Shueisha, Jujutsu Kaisen Project.
