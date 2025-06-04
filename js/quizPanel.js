export class QuizPanel {
    constructor(colors) {
        this.colors = colors;

        this.panelRect = { x: 0, y: 0, width: 0, height: 0, cornerRadius: 30 };

        this.heartsArea = { x: 0, y: 0, width: 0, height: 0 };
        this.questionCounterArea = { x: 0, y: 0, width: 0, height: 0 };
        this.questionTextRect = { x: 0, y: 0, width: 0, height: 0 };
        this.answerOptionRects = [];
    }

    resize(canvasWidth, canvasHeight) {
        // --- Painel Principal ---
        // Ocupa uma boa parte da tela, mas deixa margens
        const panelWidth = canvasWidth * 0.85;
        const panelHeight = canvasHeight * 0.75;
        const panelX = (canvasWidth - panelWidth) / 2;
        const panelY = (canvasHeight - panelHeight) / 2;
        this.panelRect = { x: panelX, y: panelY, width: panelWidth, height: panelHeight, cornerRadius: 30 };

        // --- Elementos Internos (posições relativas ao painel) ---
        const padding = panelWidth * 0.05; // Espaçamento interno

        // Área dos Corações (Topo Esquerdo do Painel)
        this.heartsArea = {
            x: panelX + padding,
            y: panelY + padding,
            width: panelWidth * 0.2,
            height: panelHeight * 0.1
        };

        // Área do Contador de Perguntas (Topo Direito do Painel)
        this.questionCounterArea = {
            x: panelX + panelWidth - (panelWidth * 0.25) - padding,
            y: panelY + padding,
            width: panelWidth * 0.25,
            height: panelHeight * 0.1
        };

        // Área da Pergunta (Abaixo dos corações/contador)
        const questionAreaY = this.heartsArea.y + this.heartsArea.height + padding;
        this.questionTextRect = {
            x: panelX + padding,
            y: questionAreaY,
            width: panelWidth - (padding * 2),
            height: panelHeight * 0.25
        };

        // Áreas das Opções de Resposta (Abaixo da pergunta)
        const answerOptionY = this.questionTextRect.y + this.questionTextRect.height + padding * 1.5;
        const answerOptionWidth = panelWidth - (padding * 2);
        const answerOptionHeight = (panelHeight - (answerOptionY - panelY) - (padding * 3)) / 3 - padding * 0.7; // Divide o espaço restante para 3 respostas

        this.answerOptionRects = [];
        for (let i = 0; i < 3; i++) {
            this.answerOptionRects.push({
                x: panelX + padding,
                y: answerOptionY + i * (answerOptionHeight + padding * 0.7),
                width: answerOptionWidth,
                height: answerOptionHeight,
                cornerRadius: 15
            });
        }
    }

    draw(ctx) {
        if (!this.panelRect.width) return;

        // --- Desenha o Painel Principal ---
        ctx.save();


        ctx.shadowColor = this.colors.highlight1;
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;


        ctx.fillStyle = this.colors.overlay;
        ctx.beginPath();
        ctx.roundRect(this.panelRect.x, this.panelRect.y, this.panelRect.width, this.panelRect.height, this.panelRect.cornerRadius);
        ctx.fill();


        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.restore();

        // --- (Opcional) Desenha placeholders para as áreas internas ---

        ctx.strokeStyle = this.colors.highlight2;
        ctx.lineWidth = 1;
        ctx.strokeRect(this.heartsArea.x, this.heartsArea.y, this.heartsArea.width, this.heartsArea.height);
        ctx.strokeRect(this.questionCounterArea.x, this.questionCounterArea.y, this.questionCounterArea.width, this.questionCounterArea.height);
        ctx.strokeRect(this.questionTextRect.x, this.questionTextRect.y, this.questionTextRect.width, this.questionTextRect.height);
        this.answerOptionRects.forEach(rect => {
            ctx.beginPath();
            ctx.roundRect(rect.x, rect.y, rect.width, rect.height, rect.cornerRadius);
            ctx.stroke();
        });
    }
}