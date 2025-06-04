import { questions as allQuestionsData } from './questions.js';

export class Quiz {
    constructor(colors, onQuizEndCallback) {
        this.colors = colors;
        this.onQuizEnd = onQuizEndCallback;

        this.allQuestions = [...allQuestionsData];
        this.gameQuestions = [];
        this.currentQuestionIndex = 0;
        this.currentQuestion = null;
        this.currentOptions = [];

        this.hearts = 3;
        this.score = 0;

        this.quizPanelLayout = null;

        this.selectGameQuestions();
        this.prepareNextQuestion();
    }

    selectGameQuestions() {

        const shuffled = this.allQuestions.sort(() => 0.5 - Math.random());
        this.gameQuestions = shuffled.slice(0, 10);
        this.currentQuestionIndex = 0;
    }

    prepareNextQuestion() {
        if (this.currentQuestionIndex >= this.gameQuestions.length) {

            console.log("Quiz terminado! Pontuação:", this.score);
            this.currentQuestion = null;
            if (this.onQuizEnd) this.onQuizEnd(this.score);
            return false;
        }

        this.currentQuestion = this.gameQuestions[this.currentQuestionIndex];
        const correctAnswer = this.currentQuestion.answer;


        let incorrectOptionsPool = this.allQuestions
            .map(q => q.answer)
            .filter(ans => ans !== correctAnswer);

        // Embaralha as respostas incorretas e pega duas
        incorrectOptionsPool.sort(() => 0.5 - Math.random());
        const twoIncorrectAnswers = incorrectOptionsPool.slice(0, 2);


        this.currentOptions = [
            { text: correctAnswer, isCorrect: true },
            { text: twoIncorrectAnswers[0], isCorrect: false },
            { text: twoIncorrectAnswers[1], isCorrect: false }
        ].sort(() => 0.5 - Math.random());

        if (this.quizPanelLayout && this.quizPanelLayout.answerOptionRects) {
            this.currentOptions.forEach((option, index) => {
                if (this.quizPanelLayout.answerOptionRects[index]) {
                    option.rect = this.quizPanelLayout.answerOptionRects[index];
                }
            });
        }

        return true;
    }


    resize(quizPanel) {

        this.quizPanelLayout = quizPanel;

        if (!this.currentQuestion || !this.quizPanelLayout || !this.quizPanelLayout.answerOptionRects) return;


        this.currentOptions.forEach((option, index) => {
            if (this.quizPanelLayout.answerOptionRects[index]) {
                option.rect = this.quizPanelLayout.answerOptionRects[index];
            }
        });
    }

    draw(ctx, quizPanel) {
        if (!this.currentQuestion || !quizPanel.questionTextRect) return;

        // --- Desenha a Pergunta ---
        const qRect = quizPanel.questionTextRect;
        const questionFontSize = Math.max(14, qRect.height / 6);
        ctx.fillStyle = this.colors.text;
        ctx.font = `500 ${questionFontSize}px "Quicksand"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        this.wrapText(ctx, this.currentQuestion.question, qRect.x + qRect.width / 2, qRect.y + qRect.height / 2, qRect.width * 0.95, questionFontSize * 1.2);

        if (!this.currentOptions || this.currentOptions.length === 0) return;

        this.currentOptions.forEach(option => {
            if (!option.rect || typeof option.rect.height === 'undefined') {
                console.warn("Rect da opção não está pronto para desenhar:", option);
                return;
            }

            // --- Desenha as Opções de Resposta ---
            const optRect = option.rect;
            const optionFontSize = Math.max(16, this.currentOptions[0].rect.height / 3.5);
            ctx.font = `500 ${optionFontSize}px "Quicksand"`;

            // Desenha o fundo do botão da opção
            ctx.fillStyle = this.colors.highlight2;
            ctx.beginPath();
            ctx.roundRect(optRect.x, optRect.y, optRect.width, optRect.height, optRect.cornerRadius || 15);
            ctx.fill();

            // Desenha o texto da opção
            ctx.fillStyle = this.colors.darkcolor2;
            this.wrapText(ctx, option.text, optRect.x + optRect.width / 2, optRect.y + optRect.height / 2, optRect.width * 0.9, optionFontSize * 1.2);
        });
    }


    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let currentY = y - ( (text.split('\n').length -1) * lineHeight / 2) ;

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, currentY);
    }


    handleInput(x, y) {

        if (!this.currentOptions || this.currentOptions.length === 0) return;

        this.currentOptions.forEach(option => {
            if (option.rect &&
                x >= option.rect.x && x <= option.rect.x + option.rect.width &&
                y >= option.rect.y && y <= option.rect.y + option.rect.height) {
                console.log("Opção clicada:", option.text, "Correta?", option.isCorrect);
                // Aqui virá a lógica de checkAnswer e hearts
                // Por enquanto, vamos apenas para a próxima pergunta para teste
                this.currentQuestionIndex++;
                this.prepareNextQuestion();
            }
        });
    }
}