import  {Background} from "./background.js";
import {Footer} from "./footer.js"
import {Menu} from "./menu.js"

window.onload = function() {

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const starCount = 200;
    const background = new Background(starCount);
    const footer = new Footer();
    const menu = new Menu();

    let gameState = 'menu';
    let game = null;

    const colors = {
        background: '#030208',
        overlay: 'rgba(10, 8, 31, 0.85)',
        text: '#F5EFFF',
        darkcolor2: '#232c53',
        shadow: '#3c4475',
        highlightPeach: '#92719c',
        highlightGold: '#B0A8D0',
        textDark: '#ecd5dd'
    };

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

        // Define o estado inicial do botão
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
        // endScreen.resize(canvas.width, canvas.height);

        // if (gameState === 'playing' || gameState === 'gameOver') {
        //     if(game) game.resize(canvas.width, canvas.height);
        // }
    }

    window.addEventListener('resize', resize);
    resize()

    function animate() {

        ctx.fillStyle = '#0d0a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);


        background.update();
        background.draw(ctx);

        if (gameState === 'menu') {
            menu.draw(ctx);
        }
        // } else if (gameState === 'playing' && game) {
        //     game.draw(ctx);
        // } else if (gameState === 'gameOver') {
        //
        //     game.draw(ctx);
        //     endScreen.draw(ctx, canvas.width, canvas.height);
        // }
        footer.draw(ctx);
        requestAnimationFrame(animate);
    }

    animate();

};