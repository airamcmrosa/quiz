
export class ProgressDisplay {
    constructor(colors, quiz) {
        this.colors = colors;
        this.quiz = null;

        this.layout = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            fontSize: 0,
            textAlign: 'center'
        };

    }
    setQuizInstance(quiz) {
        this.quiz = quiz;
    }

    resize(containerRect) {
        if (!containerRect || !containerRect.width || !containerRect.height) {
            console.warn("QuizProgressDisplay.resize: containerRect inválido.");
            this.layout.fontSize = 0;
            return;
        }

        this.layout.x = containerRect.x;
        this.layout.y = containerRect.y;
        this.layout.width = containerRect.width;
        this.layout.height = containerRect.height;

        this.layout.fontSize = Math.max(10, containerRect.height * 0.5);


    }
    draw(ctx) {

        if (!this.quiz || !this.quiz.gameQuestions || !this.layout.fontSize || this.quiz.currentQuestion === null) {
            return;
        }

        const currentIndex = this.quiz.currentQuestionIndex + 1;
        const totalQuestions = this.quiz.gameQuestions.length;

        if (totalQuestions === 0) return;

        const progressText = `Question ${currentIndex}/${totalQuestions}`;

        ctx.fillStyle = this.colors.text || '#F5EFFF';
        ctx.font = `500 ${this.layout.fontSize}px "Quicksand"`;
        ctx.textAlign = this.layout.textAlign;
        ctx.textBaseline = 'middle';


        let textX = this.layout.x + this.layout.width;
        if (this.layout.textAlign === 'center') {
            textX = this.layout.x + this.layout.width / 2;
        } else if (this.layout.textAlign === 'left') {
            textX = this.layout.x;
        }

        const textY = this.layout.y + this.layout.height / 2;

        ctx.fillText(progressText, textX, textY);
    }
}