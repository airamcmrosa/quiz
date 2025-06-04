import  {Background} from "./background.js";
import {Footer} from "./footer.js"
import {Menu} from "./menu.js"
import {QuizPanel} from "./quizPanel.js"
import {Quiz} from "./quiz.js"

window.onload = function() {

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = {
        background: '#030208',
        overlay: 'rgba(10, 8, 31, 0.85)',
        text: '#F5EFFF',
        darkcolor2: '#232c53',
        shadow: '#3c4475',
        highlight1: '#92719c',
        highlight2: '#B0A8D0',
        textDark: '#ecd5dd'
    };

    const starCount = 200;
    const background = new Background(starCount);
    const footer = new Footer(colors);
    const menu = new Menu();
    const quizPanel = new QuizPanel(colors);

    let gameState = 'menu';
    let game = null;



    const music = document.getElementById('background-music');
    const musicButton = document.getElementById('music-toggle-btn');

    if (music && musicButton) {
        music.volume = 0.3;

        function updateButtonAppearance() {
            if (music.paused) {
                musicButton.classList.add('paused');
                musicButton.textContent = '♫';
            } else {
                musicButton.classList.remove('paused');
                musicButton.textContent = '❚❚';
            }
        }

        updateButtonAppearance();

        musicButton.addEventListener('click', () => {
            if (music.paused) {
                music.play().then(() => {
                    // O ideal é atualizar a aparência DEPOIS que a promessa de play() é resolvida,
                    // mas para simplificar, e como o estado 'paused' geralmente atualiza rápido,
                    // podemos chamar diretamente.
                    updateButtonAppearance();
                }).catch(error => {
                    // Lidar com erros se a música não puder ser tocada (ex: interação do usuário necessária)
                    console.error("Erro ao tocar música:", error);
                    updateButtonAppearance(); // Garante que o botão reflita o estado real
                });
            } else {
                music.pause();
                updateButtonAppearance(); // A pausa é síncrona, então podemos atualizar imediatamente
            }
        });
    } else {
        console.warn("Elementos de controle de música não encontrados no HTML.");
    }


    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;


        background.resize(canvas.width, canvas.height);
        footer.resize(canvas.width, canvas.height);
        menu.resize(canvas.width, canvas.height);
        quizPanel.resize(canvas.width, canvas.height);
        // endScreen.resize(canvas.width, canvas.height);

        if (gameState === 'playing' && game) {

            game.resize(quizPanel);
        }
    }

    window.addEventListener('resize', resize);
    resize()

    function isClickInside(button, x, y) {
        if (!button || !button.width) return false;
        return x >= button.x && x <= button.x + button.width &&
            y >= button.y && y <= button.y + button.height;
    }

    function startGame() {
        console.log("Iniciando o Quiz do main.js!");
        // --- 2. Instanciar a classe Quiz ---
        // Passamos as cores e uma função de callback para quando o quiz terminar (a ser implementada)
        game = new Quiz(colors, () => {
            console.log("Callback de fim de quiz chamado!");
            gameState = 'gameOver'; // Ou 'endScreen', dependendo do seu estado
            // endScreen.setScore(game.score); // Exemplo para o futuro
        });
        gameState = 'playing';
        resize(); // Garante que o layout do quiz seja calculado
    }

    function handleInteraction(event) {
        event.preventDefault();
        const rect = canvas.getBoundingClientRect();
        let mouseX, mouseY;

        if (event.touches && event.touches.length > 0) {
            mouseX = event.touches[0].clientX - rect.left;
            mouseY = event.touches[0].clientY - rect.top;
        } else {
            mouseX = event.clientX - rect.left;
            mouseY = event.clientY - rect.top;
        }

        if (gameState === 'menu') {
            if (menu.playButton && menu.playButton.width && isClickInside(menu.playButton, mouseX, mouseY)) {
                startGame();
            }
        } else if (gameState === 'playing' && game) {
            console.log("Clique na tela do quiz (QuizPanel visível)");
            game.handleInput(mouseX, mouseY)
        }
        if (footer.footerArea && footer.footerArea.width && isClickInside(footer.footerArea, mouseX, mouseY)) {
            footer.handleInput(mouseX, mouseY);
        }
    }

    canvas.addEventListener('click', handleInteraction);
    canvas.addEventListener('touchstart', handleInteraction);


    function animate() {

        ctx.fillStyle = '#0d0a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);


        background.update();
        background.draw(ctx);

        if (gameState === 'menu') {
            menu.draw(ctx);
        } else if (gameState === 'playing' && game) {
            quizPanel.draw(ctx);
            game.draw(ctx, quizPanel);

        }
        footer.draw(ctx);
        requestAnimationFrame(animate);
    }

    animate();

};