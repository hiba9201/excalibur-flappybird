import { Actor, Color, Random, vec, Vector } from 'excalibur';

import { Config } from './config';
import { LevelType } from './types';

export class Cloud extends Actor {
    static isMoving = true;
    moving = false;

    constructor(level: LevelType, random: Random) {
        const gameScreen = level.engine.screen;

        const cloudWidth = random.floating(Config.CloudMinWidth, Config.CloudMaxWidth);
        const cloudHeight = random.floating(Config.CloudMinHeight, Config.CloudMaxHeight);
        const cloudYPos = random.floating(cloudHeight + 10, gameScreen.halfDrawHeight + gameScreen.halfDrawHeight / 2);
        
        super({
            name: 'Cloud',
            pos: vec(gameScreen.drawWidth, cloudYPos),
            width: cloudWidth,
            height: cloudHeight,
            color: Color.White,
            vel: vec(-Config.PipeSpeed, 0),
            z: -2,
        });

        this.on('exitviewport', () => this.kill());
    }

    override onPostUpdate(): void {
        if (!Cloud.isMoving) {
            this.stop();
        } else {
            this.#start();
        }
    }

    #start() {  
        this.vel = vec(-Config.PipeSpeed + 20, 0);
    }

    stop() {
        this.vel = Vector.Zero;
    }
}