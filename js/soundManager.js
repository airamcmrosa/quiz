export class SoundManager {
    constructor(soundIds) {
        this.sounds = {};

        for (const key in soundIds) {
            const element = document.getElementById(soundIds[key]);
            if (element) {
                this.sounds[key] = element;
            } else {
                console.warn(`Elemento de áudio com ID '${soundIds[key]}' não encontrado.`);
            }
        }
    }

    play(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.currentTime = 0; // Permite que o som seja tocado rapidamente em sequência
            sound.play();
        } else {
            console.warn(`Som chamado '${soundName}' não encontrado no SoundManager.`);
        }
    }

}