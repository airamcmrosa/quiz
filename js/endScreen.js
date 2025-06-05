export class EndScreen {
    constructor(colors, onRestartCallback, soundManager) {
        this.onRestart = onRestartCallback;
        this.colors = colors;

        this.titleFontSize = 0;
        this.buttonFontSize = 0;
        this.messageFontSize = 0;
        this.scoreFontSize = 0;
        this.reasonForGameOver = null;
        this.finalScore = 0;
        this.soundManager = soundManager;

        this.playAgainButton = {
            x: 0, y: 0, width: 0, height: 0,
            text: 'Jouer à nouveau!',
            cornerRadius: 20
        };

    }
    setGameOverInfo(score, reason) {
        this.finalScore = score;
        this.reasonForGameOver = reason;
        // console.log(`[EndScreen.setGameOverInfo] Score: ${this.finalScore}, Reason: ${this.reasonForGameOver}`);
    }


    resize(canvasWidth, canvasHeight) {

        this.messageFontSize = Math.max(30, canvasWidth / 28);
        this.scoreFontSize = Math.max(20, this.messageFontSize * 0.7);
        this.buttonFontSize = Math.max(18, this.messageFontSize / 2.2);


        const btnWidth = Math.min(canvasWidth * 0.55, 350);
        const btnHeight = Math.max(60, canvasHeight * 0.08);

        const messageAreaHeight = this.messageFontSize + this.scoreFontSize + 20;

        this.playAgainButton = {
            ...this.playAgainButton,
            width: btnWidth,
            height: btnHeight,
            x: canvasWidth / 2 - (btnWidth / 2),
            y: canvasHeight / 2 + messageAreaHeight / 2 + 20,
        };
    }

    draw (ctx, canvasWidth, canvasHeight) {

        if (!this.playAgainButton.width) return;


        ctx.fillStyle = this.colors.overlay;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        let mainMessage = '';
        let scoreMessage = `Score: ${this.finalScore}`;

        if (this.reasonForGameOver === 'no_hearts') {
            mainMessage = 'Oops...Fin de jeu!';
        } else if (this.reasonForGameOver === 'all_questions_answered') {
            mainMessage = 'Félicitations!';
        } else {
            mainMessage = 'Quiz Concluído!';
        }


        ctx.fillStyle = this.colors.text;
        ctx.font = `bold ${this.messageFontSize}px "Dancing Script"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(mainMessage, canvasWidth / 2, canvasHeight / 2 - this.messageFontSize * 0.8);

        ctx.font = `normal ${this.scoreFontSize}px "Quicksand"`;
        ctx.fillText(scoreMessage, canvasWidth / 2, canvasHeight / 2 - this.messageFontSize * 0.8 + this.messageFontSize * 0.9);


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
        if (btn.width &&
            x >= btn.x && x <= btn.x + btn.width &&
            y >= btn.y && y <= btn.y + btn.height) {
            if (this.soundManager) this.soundManager.playEffect('click');
            this.onRestart();
        }
    }
}