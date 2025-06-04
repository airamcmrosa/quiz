import  {Background} from "./background.js";
import {Footer} from "./footer.js"

window.onload = function() {

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const starCount = 200;
    const background = new Background(starCount);

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;


        background.resize(canvas.width, canvas.height);
        footer.resize(canvas.width, canvas.height);
        // menu.resize(canvas.width, canvas.height);
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

        // if (gameState === 'menu') {
        //     menu.draw(ctx);
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