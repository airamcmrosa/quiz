export class HeartsDisplay {
    constructor(colors, totalHearts = 3) {
        this.colors = colors;
        this.totalHearts = totalHearts;
        this.currentHearts = totalHearts;

        this.heartImage = new Image();
        this.heartImage.src = 'media/heart.png';
        this.imageLoaded = false;
        this.heartImage.onload = () => {
            this.imageLoaded = true;
        };
        this.heartImage.onerror = () => {
            console.error("Erro ao carregar a imagem do coração. Verifique o caminho: " + this.heartImage.src);
        };


        this.layout = {
            startX: 0,
            y: 0,
            size: 0,
            spacing: 0
        };
    }

    resize(containerRect) {

        if (!containerRect || !containerRect.width || !containerRect.height || containerRect.width <= 0 || containerRect.height <= 0) {
            console.warn("HeartsDisplay.resize: containerRect inválido ou com dimensões zero/negativas.");
            this.layout.size = 0;
            return;
        }


        let heartSizeBasedOnHeight = containerRect.height * 0.7; // Usa 70% da altura do container para o coração
        let heartSizeBasedOnWidth = (containerRect.width - ( (this.totalHearts -1) * (heartSizeBasedOnHeight * 0.2) ) ) / this.totalHearts;

        this.layout.size = Math.max(15, Math.min(heartSizeBasedOnHeight, heartSizeBasedOnWidth));
        this.layout.spacing = this.layout.size * 0.2;

        const totalWidthOfHearts = (this.totalHearts * this.layout.size) + ((this.totalHearts - 1) * this.layout.spacing);

        // Centraliza os corações dentro do containerRect
        this.layout.startX = containerRect.x + (containerRect.width - totalWidthOfHearts) / 2;
        this.layout.y = containerRect.y + (containerRect.height - this.layout.size) / 2;

    }


    draw(ctx) {

        if (!this.imageLoaded || !this.layout.size || this.layout.size <= 0) {
            return;
        }

        for (let i = 0; i < this.totalHearts; i++) {
            const heartX = this.layout.startX + i * (this.layout.size + this.layout.spacing);

            ctx.save();
            if (i >= this.currentHearts) {
                ctx.globalAlpha = 0.3;
            }

            ctx.drawImage(this.heartImage, heartX, this.layout.y, this.layout.size, this.layout.size);
            ctx.restore();
        }
    }

    loseHeart() {
        if (this.currentHearts > 0) {
            this.currentHearts--;
            console.log("Coração perdido. Restantes:", this.currentHearts);
        }
    }

    resetHearts() {
        this.currentHearts = this.totalHearts;
        console.log("Corações resetados:", this.currentHearts);
    }

    getCurrentHearts() {
        return this.currentHearts;
    }
}