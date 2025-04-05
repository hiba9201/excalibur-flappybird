import { Actor, Color, Engine, Random, SpriteSheet, vec, Vector } from 'excalibur';

import { Config } from './config';
import { LevelType } from './types';
import { Resources } from './resources';

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
            anchor: Vector.Zero,
            width: cloudWidth,
            height: cloudHeight,
            color: Color.White,
            vel: vec(-Config.PipeSpeed, 0),
            z: -2,
        });

        this.on('exitviewport', () => this.kill());
    }

    override onInitialize(): void {
        const spriteSheet = SpriteSheet.fromImageSource({
            image: Resources.CloudImage,
            grid: {
                rows: 1,
                columns: 2,
                spriteHeight: 22,
                spriteWidth: 60,
            },
        });

        const cloudSprite1 = spriteSheet.getSprite(0, 0);
        const cloudSprite2 = spriteSheet.getSprite(1, 0);
        cloudSprite1.destSize = {
            width: this.width,
            height: this.height,
        };
        cloudSprite2.destSize = {
            width: this.width,
            height: this.height,
        };

        const clouds = [cloudSprite1, cloudSprite2];

        this.graphics.use(clouds[Math.round(Math.random())]);
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