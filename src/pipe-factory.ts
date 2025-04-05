import { Random, Timer, Vector } from 'excalibur';
import { Config } from './config';
import { Pipe } from './pipe';
import { ScoreTrigger } from './score-trigger';
import { LevelType } from './types';

export class PipeFactory {
    #timer: Timer
    constructor(
        private level: LevelType,
        private random: Random,
        msInterval: number,
    ) { 
        this.#timer = new Timer({
            interval: msInterval,
            repeats: true,
            action: () => this.#spawnPipes()
        });

        this.level.add(this.#timer);
    }

    #spawnPipes() {
        const pipePosition = this.random.floating(0 , this.level.engine.screen.drawHeight - Config.PipeGap - Config.GroundHeight);

        const bottomPipe = new Pipe(
            this.level,
            pipePosition + Config.PipeGap,
            'bottom',
        );
        this.level.add(bottomPipe);

        const topPipe = new Pipe(
            this.level,
            pipePosition,
            'top',
        );
        this.level.add(topPipe);

        const scoreTrigger = new ScoreTrigger(
            this.level,
            pipePosition,
        );
        this.level.add(scoreTrigger);
    }

    start() {
        this.#timer.start();

        ScoreTrigger.isMoving = true;
        Pipe.isMoving = true;
    }

    stop() {
        this.#timer.stop();

        ScoreTrigger.isMoving = false;
        Pipe.isMoving = false;
    }

    reset() {
        for (const actor of this.level.actors) {
            if (['Pipe', 'ScoreTrigger'].includes(actor.name)) {
                actor.kill();
            }
        }
    }
}