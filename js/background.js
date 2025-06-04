
class Star {
    constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 2 + 1;

        this.opacity = Math.random();
        this.twinkleSpeed = Math.random() * 0.05;
        this.twinkleDirection = 1;
    }

    update() {
        this.opacity += this.twinkleDirection * this.twinkleSpeed;

        if (this.opacity > 1) {
            this.opacity = 1;
            this.twinkleDirection = -1;
        } else if (this.opacity < 0) {
            this.opacity = 0;
            this.twinkleDirection = 1;
        }
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}


export class Background {
    constructor(starCount) {
        this.starCount = starCount;
        this.stars = [];

        this.canvasWidth = 0;
        this.canvasHeight = 0;
    }


    resize(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        if (this.stars.length === 0) {
            for (let i = 0; i < this.starCount; i++) {
                this.stars.push(new Star(this.canvasWidth, this.canvasHeight));
            }
            console.log('Estrelas criadas:', this.stars.length);
        }
    }

    update() {

        this.stars.forEach(star => {
            star.update(this.canvasWidth);
        });
    }

    draw(ctx) {
        this.stars.forEach(star => {
            star.draw(ctx);
        });
    }
}