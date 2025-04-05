import { Actor, Collider, Color, Engine, Side, Sprite, vec, Vector } from 'excalibur';
import { Config } from './config';
import { LevelType } from './types';
import { ScoreTrigger } from './score-trigger';
import { Resources } from './resources';

const PIPE_HEIGHT_COEF = 2;

export class Pipe extends Actor {
    static isMoving = true;

    constructor(private level: LevelType, posY: number, public type: 'top' | 'bottom') {
        const gameScreen = level.engine.screen;

        super({
            name: 'Pipe',
            pos: vec(gameScreen.drawWidth, posY),
            anchor: type === 'bottom' ? Vector.Zero : Vector.Down,
            width: Config.PipeWidth,
            height: gameScreen.drawHeight * PIPE_HEIGHT_COEF,
            color: Color.Green,
            vel: vec(-Config.PipeSpeed, 0),
            z: -1,
        });

        this.on('exitviewport', () => this.kill());
    }

    override onInitialize(engine: Engine) {
        const sprite = new Sprite({
            image: Resources.PipeImage,
            width: Config.PipeWidth,
            height: engine.screen.drawHeight * PIPE_HEIGHT_COEF,
        });

        if (this.type === 'top') {
            sprite.flipVertical = true;
        }

        this.graphics.use(sprite);
    }

    get isImmortalMode() {
        return this.level.isImmortalMode;
    }

    override onCollisionStart(_self: Collider, other: Collider, side: Side) {
        if (other.owner.name === 'Bird' && (!this.isImmortalMode || [Side.Left, Side.Right].includes(side))) {
            Pipe.isMoving = false;
            ScoreTrigger.isMoving = false;
        }
    }
 
    override onCollisionEnd(_self: Collider, other: Collider): void {
        if (other.owner.name === 'Bird') {
            Pipe.isMoving = true;
            ScoreTrigger.isMoving = true;
        }
    }

    override onPostUpdate(): void {
        if (!Pipe.isMoving) {
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