export class QuizPanel {
    constructor(colors) {
        this.colors = colors;

        this.panelRect = { x: 0, y: 0, width: 0, height: 0, cornerRadius: 30 };


        this.heartsArea = { x: 0, y: 0, width: 0, height: 0, cornerRadius: 15 };
        this.questionCounterArea = { x: 0, y: 0, width: 0, height: 0, cornerRadius: 15 };
        this.questionTextRect = { x: 0, y: 0, width: 0, height: 0, cornerRadius: 15 };
        this.answerOptionRects = [];
    }

    resize(canvasWidth, canvasHeight) {
        // --- Painel Principal ---
        const minPanelWidth = 300;
        const minPanelHeight = 450;

        let initialPanelWidth = canvasWidth/2 ;
        let initialPanelHeight = canvasHeight * 0.80;

        this.panelRect.width = Math.max(minPanelWidth, initialPanelWidth);
        this.panelRect.height = Math.max(minPanelHeight, initialPanelHeight);
        this.panelRect.x = (canvasWidth - this.panelRect.width) / 2;
        this.panelRect.y = (canvasHeight - this.panelRect.height) / 2;
        this.panelRect.cornerRadius = 30;


        const padding = this.panelRect.width * 0.05; // Padding interno ao painel

        this.heartsArea = {
            ...this.heartsArea,
            x: this.panelRect.x + padding,
            y: this.panelRect.y + padding,
            width: this.panelRect.width * 0.25,
            height: this.panelRect.height * 0.08,
        };

        // Área do Contador de Perguntas (Topo Direito do Painel)
        this.questionCounterArea = {
            ...this.questionCounterArea,
            width: this.panelRect.width * 0.3,
            height: this.panelRect.height * 0.08,
            x: this.panelRect.x + this.panelRect.width - (this.panelRect.width * 0.3) - padding,
            y: this.panelRect.y + padding,
        };

        // Área da Pergunta (Abaixo dos corações/contador)
        const questionAreaY = this.heartsArea.y + this.heartsArea.height + padding;
        this.questionTextRect = {
            ...this.questionTextRect,
            x: this.panelRect.x + padding,
            y: questionAreaY,
            width: this.panelRect.width - (padding * 2),
            height: this.panelRect.height * 0.25,
        };

        // Áreas das Opções de Resposta (Abaixo da pergunta)
        const answerOptionStartY = this.questionTextRect.y + this.questionTextRect.height + padding * 1.5;
        const spaceForAnswersBlock = (this.panelRect.y + this.panelRect.height - padding) - answerOptionStartY;
        const gapBetweenAnswers = padding * 0.5;

        // Altura total disponível para os itens de resposta (sem os vãos)
        const totalHeightForAnswerItems = spaceForAnswersBlock - (gapBetweenAnswers * 2);
        const answerOptionHeight = Math.max(40, totalHeightForAnswerItems / 3);
        const answerOptionWidth = this.panelRect.width - (padding * 2);

        this.answerOptionRects = [];
        for (let i = 0; i < 3; i++) {
            this.answerOptionRects.push({
                x: this.panelRect.x + padding,
                y: answerOptionStartY + i * (answerOptionHeight + gapBetweenAnswers),
                width: answerOptionWidth,
                height: answerOptionHeight,
                cornerRadius: 15
            });
        }
        console.log("[QuizPanel.resize] Valores calculados:",
            "panelRect:", JSON.parse(JSON.stringify(this.panelRect)),
            "questionTextRect:", JSON.parse(JSON.stringify(this.questionTextRect))
        );

    }

    draw(ctx) {
        if (!this.panelRect.width) return;
        console.log("tem panelRect");

        ctx.save();

        ctx.shadowColor = this.colors.highlight1ß;
        ctx.shadowBlur = 20;
        ctx.fillStyle = this.colors.overlay;
        ctx.beginPath();
        ctx.roundRect(this.panelRect.x, this.panelRect.y, this.panelRect.width, this.panelRect.height, this.panelRect.cornerRadius);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();

        // --- Desenha placeholders para as áreas internas com bordas arredondadas ---

        ctx.strokeStyle = this.colors.highlight2;
        ctx.lineWidth = 2;

        // Placeholder para HeartsArea
        ctx.beginPath();
        ctx.roundRect(this.heartsArea.x, this.heartsArea.y, this.heartsArea.width, this.heartsArea.height, this.heartsArea.cornerRadius);
        ctx.stroke();

        // Placeholder para QuestionCounterArea
        ctx.beginPath();
        ctx.roundRect(this.questionCounterArea.x, this.questionCounterArea.y, this.questionCounterArea.width, this.questionCounterArea.height, this.questionCounterArea.cornerRadius);
        ctx.stroke();

        // Placeholder para QuestionTextRect
        ctx.beginPath();
        ctx.roundRect(this.questionTextRect.x, this.questionTextRect.y, this.questionTextRect.width, this.questionTextRect.height, this.questionTextRect.cornerRadius);
        ctx.stroke();

        // Placeholders para AnswerOptionRects
        this.answerOptionRects.forEach(rect => {
            ctx.beginPath();
            ctx.roundRect(rect.x, rect.y, rect.width, rect.height, rect.cornerRadius);
            ctx.stroke();
        });
    }
}