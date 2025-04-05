import { Scene } from 'excalibur';

export interface LevelType extends Scene {
    isImmortalMode: boolean;
    incrementScore: () => void;
    gameOver: () => void;
    isPaused: boolean;
}