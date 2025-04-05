import { Actor, Collider, Color, vec, Vector } from 'excalibur';
import { Config } from './config';
import { LevelType } from './types';
import { Sounds } from './resources';

export class ScoreTrigger extends Actor {
    static isMoving = true;

    constructor(private level: LevelType, posY: number) {
        const gameScreen = level.engine.screen;

        super({
            name: 'ScoreTrigger',
            pos: vec(gameScreen.drawWidth, posY),
            anchor: Vector.Zero,
            width: Config.PipeWidth,
            height: Config.PipeGap,
            color: Color.Transparent,
            vel: vec(-Config.PipeSpeed, 0),
            z: -1,
        });

        this.on('exitviewport', () => this.kill());
    }

    override onCollisionStart(_self: Collider, other: Collider): void {
        if (other.owner.name === 'Bird') {
            this.level.incrementScore();
            Sounds.ScoreSound.play();
        }
    }

    override onPostUpdate(): void {
        if (!ScoreTrigger.isMoving) {
            this.#stop();
        } else {
            this.#start();
        }
    }

    #start() {  
        this.vel = vec(-Config.PipeSpeed, 0);
    }

    #stop() {
        this.vel = Vector.Zero;
    }
}