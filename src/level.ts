import { Color, Font, Label, PointerEvent, Random, Scene, TextAlign, vec } from 'excalibur';

import { Bird } from './bird';
import { Ground } from './ground';
import { PipeFactory } from './pipe-factory';
import { Config } from './config';
import { Sounds } from './resources';
import { MuteButton } from './mute-button';
import { CloudFactory } from './cloud-factory';

export class Level extends Scene {
    #random = new Random();
    #pipeFactory = new PipeFactory(this, this.#random, Config.PipeInterval);
    #cloudFactory = new CloudFactory(this, new Random());
    #cloudFactory2 = new CloudFactory(this, new Random());
    #ground!: Ground;
    #bird!: Bird;
    #muteButton!: MuteButton;
    score: number = 0;
    best: number = 0 ;
    isImmortalMode = false;
    isPaused = true;
    
    scoreLabel = new Label({
        text: 'Score: 0',
        pos: vec(5, 5),
        z: 1,
        font: new Font({
            size: 20,
            color: Color.White,
        }),
    });
    bestLabel!: Label;
    startInstructions!: Label;

    override onInitialize(): void {
        this.#bird = new Bird(this);
        this.add(this.#bird);
        
        this.#ground = new Ground(this.engine.screen);
        this.add(this.#ground);

        this.#muteButton = new MuteButton(this);
        this.add(this.#muteButton);

        this.add(this.scoreLabel);

        this.bestLabel = new Label({
            text: 'Best: 0',
            pos: vec(this.engine.screen.drawWidth - 5, 5),
            z: 1,
            font: new Font({
                size: 20,
                color: Color.White,
                textAlign: TextAlign.Right,
            }),
        });
        this.add(this.bestLabel);

        this.best = parseInt(localStorage.getItem('best') || '0');
        this.updateBestScore();

        const gameScreen = this.engine.screen;
        const instructionsX = gameScreen.halfDrawWidth
        const instructionsY = gameScreen.halfDrawHeight;

        this.startInstructions = new Label({
            text: 'Tap to start',
            pos: vec(instructionsX, instructionsY),
            z: 2,
            font: new Font({
                size: 50,
                color: Color.White,
                textAlign: TextAlign.Center,
            }),
        });
        this.add(this.startInstructions);

        this.showStartInstructions();
    }

    override onActivate(): void {
        Sounds.BackgroundMusic.loop = true;
        Sounds.BackgroundMusic.play();
    }

    showStartInstructions() {
        this.startInstructions.graphics.isVisible = true;

        this.engine.input.keyboard.once('hold', () => {
            this.#restartGame();
        });

        this.engine.input.pointers.once('down', (event) => {
            this.#onMouseDown(event);
        });
    }

    #onMouseDown(event: PointerEvent) {
        if (this.#muteButton.collider.bounds.contains(event.coordinates.screenPos)) {
            this.engine.input.pointers.once('down', (event) => {
                this.#onMouseDown(event);
            });

            return;
        }

        this.#restartGame();
    }

    #restartGame() {
        this.reset();

        this.startInstructions.graphics.isVisible = false;
        this.#pipeFactory.start();
        this.#cloudFactory.start();
        this.#cloudFactory2.start();
        this.isPaused = false;
    }

    incrementScore() {
        this.score++;
        this.scoreLabel.text = `Score: ${this.score}`;
    }

    updateBestScore() {
        if (this.score > this.best) {
            localStorage.setItem('best', this.score.toString());
            this.best = this.score;
        }

        this.bestLabel.text = `Best: ${this.best}`;
    }

    reset() {
        this.#bird.reset();
        this.#pipeFactory.reset();
        this.#cloudFactory.reset();
        this.#cloudFactory2.reset();
        this.#ground.reset();
        this.score = 0;
        this.scoreLabel.text = `Score: ${this.score}`;
    }

    gameOver() {
        Sounds.FailSound.play();

        this.#pipeFactory.stop();
        this.#cloudFactory.stop();
        this.#cloudFactory2.stop();
        this.#bird.stop();
        this.#ground.stop();
        this.showStartInstructions();
        this.isPaused = true;
        this.updateBestScore();
    }
}