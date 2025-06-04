import { questions as allQuestionsData } from './questions.js';

export class Quiz {
    constructor(colors, onQuizEndCallback, heartsDisplayInstance) {
        this.colors = colors;
        this.onQuizEnd = onQuizEndCallback;
        this.heartsDisplay = heartsDisplayInstance;

        this.allQuestions = [...allQuestionsData];
        this.gameQuestions = [];
        this.currentQuestionIndex = 0;
        this.currentQuestion = null;
        this.currentOptions = [];

        this.hearts = 3;
        this.score = 0;

        this.quizPanelLayout = null;
        this.userSelectedOption = null;
        this.correctOption = null;
        this.feedbackActive = false;

        this.selectGameQuestions();
        this.initializeNewQuizRound();
        this.prepareNextQuestion();
    }

    selectGameQuestions() {

        const shuffled = this.allQuestions.sort(() => 0.5 - Math.random());
        this.gameQuestions = shuffled.slice(0, 10);

    }

    initializeNewQuizRound() {
        this.selectGameQuestions();
        this.currentQuestionIndex = 0;
        this.hearts = 3;
        this.score = 0;
        if (this.heartsDisplay) {
            this.heartsDisplay.resetHearts();
        }
        this.prepareNextQuestion();
    }

    prepareNextQuestion() {
        this.userSelectedOption = null;
        this.correctOption = null;
        this.feedbackActive = false;

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

        console.log(`[Quiz.prepareNextQuestion] Pergunta ${this.currentQuestionIndex}:`, this.currentQuestion);
        console.log(`[Quiz.prepareNextQuestion] Opções para pergunta ${this.currentQuestionIndex}:`, JSON.parse(JSON.stringify(this.currentOptions)));

        return true;
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
    checkAnswer(selectedOption) {
        if (!this.currentQuestion  || this.feedbackActive) return;

        this.feedbackActive = true;
        this.userSelectedOption = selectedOption;
        this.correctOption = this.currentOptions.find(opt => opt.isCorrect);
        let gameShouldEndByNoHearts = false;

        if (selectedOption.isCorrect) {
            console.log("Resposta CORRETA!", selectedOption.text);
            this.score++;
        } else {
            console.log("Resposta INCORRETA!", selectedOption.text, "A resposta correta era:", this.currentQuestion.answer);
            this.hearts--;

            if (this.heartsDisplay) {
                this.heartsDisplay.loseHeart();
            }
            console.log(`Corações restantes: ${this.hearts}`);
            if (this.hearts <= 0) {
                console.log("FIM DE JOGO - Sem corações restantes!");
                gameShouldEndByNoHearts = true;
            }

        }

        const feedbackDuration = 1800;
        setTimeout(() => {
            if (gameShouldEndByNoHearts) {
                this.currentQuestion = null; // Para não tentar desenhar mais nada
                if (this.onQuizEnd) this.onQuizEnd(this.score, 'no_hearts');
            } else {
                this.currentQuestionIndex++;
                this.prepareNextQuestion(); // Isso também chamará onQuizEnd se as perguntas acabarem
            }
        }, feedbackDuration);
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

        if (!this.currentQuestion || !quizPanel || !quizPanel.questionTextRect || !quizPanel.questionTextRect.width) {
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

            ctx.save();

            if (this.feedbackActive && option === this.userSelectedOption && !option.isCorrect) {
                ctx.globalAlpha = 0.4;
            }

            // Desenha o fundo do botão da opção
            ctx.fillStyle = this.colors.highlight2;
            ctx.beginPath();
            ctx.roundRect(optRect.x, optRect.y, optRect.width, optRect.height, optRect.cornerRadius || 15);
            ctx.fill();

            if (this.feedbackActive && !(option === this.userSelectedOption && !option.isCorrect)) {
                ctx.globalAlpha = 1.0;
            }


            if (this.feedbackActive && option === this.correctOption) {

                ctx.shadowColor = this.colors.highlight1 || this.colors.gold || '#FFD700';
                ctx.shadowBlur = 30;


                ctx.beginPath();
                ctx.roundRect(optRect.x, optRect.y, optRect.width, optRect.height, optRect.cornerRadius || 15);
                ctx.stroke();

                ctx.shadowBlur = 0;

                ctx.fillStyle = this.colors.highlight1;
                ctx.beginPath();
                ctx.roundRect(optRect.x, optRect.y, optRect.width, optRect.height, optRect.cornerRadius || 15);
                ctx.fill();
            }

            if (this.feedbackActive && option === this.userSelectedOption && !option.isCorrect) {
                // globalAlpha já está 0.4 do início do bloco
            } else {
                ctx.globalAlpha = 1.0; // Garante que outros textos não fiquem opacos
            }

            // Desenha o texto da opção
            ctx.fillStyle = this.colors.darkcolor2;
            ctx.font = `500 ${optionFontSize}px "Quicksand"`;
            this.wrapText(ctx, option.text, optRect.x + optRect.width / 2, optRect.y + optRect.height / 2, optRect.width * 0.9, optionFontSize * 1.2);

            ctx.restore();

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


}