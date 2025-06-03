export class Menu {
    constructor() {
        this.title = 'Quiz du Zodiaque';
        this.buttonTextPlay = 'Lancer le Quiz';
        this.buttonTextTraduction = 'Pt-Br';


        this.colors = {
            gold: '#FFD700',
            peach: '#FFCBA4',
            text: '#F5F5F5',
            textDark: '#4a4a4a'
        };


        this.titleFontSize = {};
        this.buttonTextPlayGame = {};
        this.buttonTextTraduction = {};
        this.titlePosition = {};
        this.playButton = {};
        this.traductionButton = {};
    }

    resize(canvasWidth, canvasHeight) {
        // O cálculo do tamanho da fonte do título, agora responsivo
        this.titleFontSize = Math.max(50, canvasWidth / 25);
        this.buttonFontSize = Math.max(18, this.titleFontSize / 2.5);

        const titleY = canvasHeight / 2 - 80;
        const buttonY = titleY + this.titleFontSize; // Posição do botão relativa ao título

        this.titlePosition = { x: canvasWidth / 2, y: titleY };

        // Lógica do botão para ser sempre centralizado e responsivo
        const btnWidth = Math.min(canvasWidth * 0.6, 350);
        const btnHeight = 80;

        this.playButton = {
            width: btnWidth,
            height: btnHeight,
            x: (canvasWidth / 2) - (btnWidth / 2),
            y: buttonY,
            text: this.buttonText,
            cornerRadius: 20 // Raio dos cantos arredondados
        };
    }

    draw(ctx) {
        if (!this.playButton.width) return; // Não desenha se o resize ainda não rodou

        const btn = this.playButton;

        // --- Desenha o Título ---
        ctx.fillStyle = this.colors.text;
        ctx.font = `bold ${this.titleFontSize}px "Dancing Script"`; // Usa a nova fonte
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.title, this.titlePosition.x, this.titlePosition.y);

        // --- Desenha o Botão ---
        // Adiciona um efeito de brilho sutil ao botão
        ctx.shadowColor = this.colors.gold;
        ctx.shadowBlur = 15;

        // Desenha o botão com cantos arredondados
        ctx.fillStyle = this.colors.peach;
        ctx.beginPath();
        ctx.roundRect(btn.x, btn.y, btn.width, btn.height, btn.cornerRadius);
        ctx.fill();

        ctx.shadowBlur = 0;

        ctx.fillStyle = this.colors.textDark;
        ctx.font = `500 ${this.buttonFontSize}px "Quicksand"`;
        ctx.fillText(btn.text, this.titlePosition.x, btn.y + btn.height / 2);
    }
}