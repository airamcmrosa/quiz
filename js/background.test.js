import { Background } from './background.js'; // Seu import ES6

// Descreve o conjunto de testes para a classe Background
describe('Background Class', () => {
    let mockCanvasWidth;
    let mockCanvasHeight;

    beforeEach(() => {
        // Define dimensões mock para o canvas para cada teste
        mockCanvasWidth = 800;
        mockCanvasHeight = 600;
    });

    // Teste 1: Verifica se o Background inicializa com o número correto de estrelas
    it('deve inicializar com o número correto de estrelas após o resize', () => {
        const starCount = 200;
        const background = new Background(starCount);

        // CHAMA O RESIZE AQUI! É o resize que cria as estrelas.
        background.resize(mockCanvasWidth, mockCanvasHeight);

        expect(background.stars).toBeDefined(); // Verifica se background.stars existe
        expect(background.stars.length).toBe(starCount); // Verifica o número de estrelas
    });

    // Teste 2: Verifica se cada estrela tem as propriedades essenciais
    it('deve ter estrelas com as propriedades essenciais (x, y, size, opacity)', () => {
        const background = new Background(1); // Cria um background com 1 estrela para facilitar

        // CHAMA O RESIZE AQUI!
        background.resize(mockCanvasWidth, mockCanvasHeight);

        const star = background.stars[0];

        expect(star).toBeDefined(); // Garante que a estrela existe
        expect(star).toHaveProperty('x');
        expect(typeof star.x).toBe('number');
        expect(star).toHaveProperty('y');
        expect(typeof star.y).toBe('number');
        expect(star).toHaveProperty('size');
        expect(typeof star.size).toBe('number');
        expect(star).toHaveProperty('opacity');
        expect(typeof star.opacity).toBe('number');
    });

    // Você pode adicionar mais testes aqui para os métodos update e draw se desejar.
});