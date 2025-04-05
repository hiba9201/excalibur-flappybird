import { Actor, Color, Engine, Random, Sprite, vec, Vector } from 'excalibur';

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

    override onInitialize(engine: Engine) {
        // const sprite = new Sprite({
        //     image: Resources.GroundImage,
        //     width: engine.screen.drawWidth,
        //     height: Config.GroundHeight,
        // });

        // this.graphics.add('ground', sprite);
        // this.graphics.use('ground');
    }

    override onPostUpdate(engine: Engine, elapsed: number): void {
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