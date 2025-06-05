import  {Background} from "./background.js";
import {Footer} from "./footer.js"
import {Menu} from "./menu.js"
import {QuizPanel} from "./quizPanel.js"
import {Quiz} from "./quiz.js"
import { HeartsDisplay } from "./heartsDisplay.js";
import { EndScreen } from "./endScreen.js";
import { SoundManager } from "./soundManager.js";

window.onload = function() {

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

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
    const soundManager = new SoundManager(
        {
            click: 'card-flip',
            match: 'match-sound'
        },
        'background-music',
        'music-toggle-btn'
    );

    const menu = new Menu(colors, soundManager);
    const quizPanel = new QuizPanel(colors);


    let gameState = 'menu';
    let game = null;

    const heartsDisplay = new HeartsDisplay(colors);
    const endScreen = new EndScreen(colors, startGame, soundManager);



    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;


        background.resize(canvas.width, canvas.height);
        footer.resize(canvas.width, canvas.height);


        if(gameState === 'menu') {
            // console.log("resize ok em", gameState)
            menu.resize(canvas.width, canvas.height);
        } else if (gameState === 'playing' && game) {
            // console.log("resize ok do", gameState)
            quizPanel.resize(canvas.width, canvas.height);
            game.resize(quizPanel);
            if (quizPanel.heartsArea && quizPanel.heartsArea.width > 0) {
                heartsDisplay.resize(quizPanel.heartsArea);
            } else {
                console.warn("main.js resize: quizPanel.heartsArea NÃO está pronto ou tem largura zero. Não chamando heartsDisplay.resize.");
            }
        } else if (gameState === 'gameOver') {
            // console.log("resize ok do", gameState)
            quizPanel.resize(canvas.width, canvas.height);
            if (game) {
                game.resize(quizPanel);
            }
            endScreen.resize(canvas.width, canvas.height);
        } else {
            console.warn("rezise not working");
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
        game = new Quiz(colors, (scoreValue, reason) => {
            console.log("Callback de fim de quiz chamado!");
            gameState = 'gameOver';
            if (endScreen) {
                endScreen.setGameOverInfo(scoreValue, reason || 'all_questions_answered');
            }
            resize();
        }, heartsDisplay, soundManager);
        gameState = 'playing';
        resize();
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
                if (soundManager) soundManager.playEffect('click');
                startGame();
            }
        } else if (gameState === 'playing' && game) {
            game.handleInput(mouseX, mouseY);

        } else if (gameState === 'gameOver') {

        endScreen.handleInput(mouseX, mouseY);
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
        footer.draw(ctx);

        if (gameState === 'menu') {
            menu.draw(ctx);
        } else if (gameState === 'playing' && game) {
            quizPanel.draw(ctx);
            heartsDisplay.draw(ctx);
            game.draw(ctx, quizPanel);

        } else if (gameState === 'gameOver') {

            if (game) game.draw(ctx, quizPanel);
            if (endScreen) {
                console.log("[Main.animate] Desenhando EndScreen. Reason:", endScreen.reasonForGameOver);
                endScreen.draw(ctx, canvas.width, canvas.height);
            } else {
                console.error("[Main.animate] Instância de EndScreen não encontrada para desenhar!");
            }


        }
        requestAnimationFrame(animate);


    }
    animate();
};