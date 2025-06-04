export class EndScreen {
    constructor(colors, onRestartCallback) {
        this.onRestart = onRestartCallback;
        this.colors = colors;

        this.titleFontSize = 0;
        this.buttonFontSize = 0;

        this.playAgainButton = {
            x: 0, y: 0, width: 0, height: 0,
            text: 'Jouer à nouveau!',
            cornerRadius: 20
        };

        this.message = 'Félicitations!';
    }

    resize(canvasWidth, canvasHeight) {

        this.titleFontSize = Math.max(40, canvasWidth / 22);
        this.buttonFontSize = Math.max(18, this.titleFontSize / 2.5);


        const btnWidth = Math.min(canvasWidth * 0.55, 380);
        const btnHeight = Math.max(65, canvasHeight * 0.09);

        this.playAgainButton = {
            ...this.playAgainButton,
            width: btnWidth,
            height: btnHeight,
            x: canvasWidth / 2 - (btnWidth / 2),
            y: canvasHeight / 2 + this.titleFontSize * 0.5,
        };
    }

    draw (ctx, canvasWidth, canvasHeight) {
        if (!this.playAgainButton.width) return;


        ctx.fillStyle = this.colors.overlay;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);


        ctx.fillStyle = this.colors.text;
        ctx.font = `bold ${this.titleFontSize}px "Dancing Script"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.message, canvasWidth / 2, canvasHeight / 2 - this.titleFontSize * 0.7);


        const btn = this.playAgainButton;


        ctx.shadowColor = this.colors.highlight1;
        ctx.shadowBlur = 15;

        ctx.fillStyle = this.colors.highlight2;
        ctx.beginPath();
        ctx.roundRect(btn.x, btn.y, btn.width, btn.height, btn.cornerRadius);
        ctx.fill();

        ctx.shadowBlur = 0;


        ctx.fillStyle = this.colors.darkcolor2;
        ctx.font = `500 ${this.buttonFontSize}px "Quicksand"`;
        ctx.fillText(btn.text, canvasWidth / 2, btn.y + btn.height / 2);
    }

    handleInput(x, y) {
        const btn = this.playAgainButton;
        if (btn.width && // Garante que o botão foi inicializado pelo resize
            x >= btn.x && x <= btn.x + btn.width &&
            y >= btn.y && y <= btn.y + btn.height) {
            this.onRestart();
        }
    }
}