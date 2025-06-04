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
        let selectedOption = this.selectedOption;


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

        console.log(`[Quiz.prepareNextQuestion] Pergunta ${this.currentQuestionIndex}:`, this.currentQuestion);
        console.log(`[Quiz.prepareNextQuestion] Opções para pergunta ${this.currentQuestionIndex}:`, JSON.parse(JSON.stringify(this.currentOptions)));

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
        console.log(`[Quiz.draw] Tentando desenhar. Pergunta Atual:`, this.currentQuestion ? this.currentQuestion.question : "Nenhuma");
        console.log(`[Quiz.draw] Opções Atuais (antes de desenhar):`, JSON.parse(JSON.stringify(this.currentOptions)));
        console.log(`[Quiz.draw] Layout do QuizPanel recebido:`, quizPanel ? "Sim" : "Não");

        if (!this.currentQuestion || !quizPanel || !quizPanel.questionTextRect || !quizPanel.questionTextRect.width) { // Adicionada verificação de width
            console.warn("[Quiz.draw] Não vai desenhar pergunta: Pergunta atual ou layout do painel da pergunta inválido.");
            return;
        }

        // --- Desenha a Pergunta ---
        const qRect = quizPanel.questionTextRect;
        const questionFontSize = Math.max(14, qRect.height / 6);
        ctx.fillStyle = this.colors.text;
        ctx.font = `500 ${questionFontSize}px "Quicksand"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        this.wrapText(ctx, this.currentQuestion.question, qRect.x + qRect.width / 2, qRect.y + qRect.height / 2, qRect.width * 0.95, questionFontSize * 1.2);

        if (!this.currentOptions || this.currentOptions.length === 0) {
            console.warn("[Quiz.draw] Não vai desenhar opções: Sem opções atuais.");
            return;
        }

        this.currentOptions.forEach((option) => {

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

                // this.currentQuestionIndex++;
                // this.prepareNextQuestion();

                this.checkAnswer(option);
            }
        });
    }
    checkAnswer(option) {
        if (!this.currentQuestion) return;

        if (option.isCorrect) {
            console.log("Resposta CORRETA!", option.text);
            this.score++;
        } else {
            console.log("Resposta INCORRETA!", option.text, "A resposta correta era:", this.currentQuestion.answer);

        }


        this.currentQuestionIndex++;
        this.prepareNextQuestion();
    }


}