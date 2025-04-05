import { Random, Timer } from 'excalibur';
import { LevelType } from './types';
import { Cloud } from './cloud';
import { Config } from './config';

export class CloudFactory {
    #timer: Timer
    constructor(
        private level: LevelType,
        private random: Random,
    ) { 
        this.#timer = new Timer({
            random,
            randomRange: [0, Config.CloudIntervalMax],
            interval: Config.CloudIntervalMin,
            repeats: true,
            action: () => this.#spawnClouds()
        });

        this.level.add(this.#timer);
    }

    #spawnClouds() {
        const cloud = new Cloud(this.level, this.random);

        this.level.add(cloud);
    }

    start() {
        this.#timer.start();
        Cloud.isMoving = true;
    }

    stop() {
        this.#timer.stop();

        Cloud.isMoving = false;
    }

    reset() {
        for (const actor of this.level.actors) {
            if (['Cloud'].includes(actor.name)) {
                actor.kill();
            }
        }
    }
}