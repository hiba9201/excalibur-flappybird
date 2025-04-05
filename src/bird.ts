import {
    Actor,
    Animation,
    AnimationStrategy,
    clamp,
    Collider,
    CollisionContact,
    Color,
    Engine,
    Keys,
    Side,
    Sprite,
    SpriteSheet,
    vec,
    Vector,
} from 'excalibur';

import { Config } from './config';
import { LevelType } from './types';
import { Resources, Sounds } from './resources';

const BIRD_SIZE = 32;

export class Bird extends Actor {
    #jumping = false;

    startSprite: Sprite;
    upAnimation: Animation;
    downAnimation: Animation;

    constructor(private level: LevelType) {
        const gameScreen = level.engine.screen;
        const birdX = gameScreen.halfDrawWidth
        const birdY = gameScreen.halfDrawHeight;

        super({
            name: 'Bird',
            pos: vec(birdX, birdY),
            width: BIRD_SIZE,
            height: BIRD_SIZE,
            color: Color.Yellow
        });

        this.collider.useCircleCollider(BIRD_SIZE / 2, Vector.Half);
    }

    get isImmortalMode() {
        return this.level.isImmortalMode;
    }

    override onInitialize(engine: Engine): void {
        const spriteSheet = SpriteSheet.fromImageSource({
            image: Resources.BirdImage,
            grid: {
                rows: 1,
                columns: 4,
                spriteWidth: BIRD_SIZE,
                spriteHeight: BIRD_SIZE
            }
        });

        // spriteSheet.sprites.forEach(sprite => {
        //     sprite.destSize = {
        //         width: BIRD_SIZE * 2,
        //         height: BIRD_SIZE * 2,
        //     };
        // });

        this.startSprite = spriteSheet.getSprite(1, 0);

        this.upAnimation = Animation.fromSpriteSheet(
            spriteSheet,
            [2, 1, 0],
            150,
            AnimationStrategy.Freeze,
        );
        this.downAnimation = Animation.fromSpriteSheet(
            spriteSheet,
            [0, 1, 2],
            150,
            AnimationStrategy.Freeze,
        );

        this.graphics.add('start', this.startSprite);
        this.graphics.add('up', this.upAnimation);
        this.graphics.add('down', this.downAnimation);

        this.graphics.use('start');

        this.on('exitviewport', () => this.level.gameOver());
    }

    override onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
        if (other.owner.name === 'Pipe' && this.isImmortalMode && side !== Side.Bottom) {
            this.stop(true);

            return;
        }

        if ( ['Ground', 'Pipe'].includes(other.owner.name)) {
            this.stop();

            if (!this.isImmortalMode) {
                this.level.gameOver();   
            }
        }
    }

    override onCollisionEnd(self: Collider, other: Collider, side: Side, lastContact: CollisionContact): void {
        if (['Ground', 'Pipe'].includes(other.owner.name)) {
            this.#start();
        }
    }

    reset() {
        this.pos = vec(this.level.engine.screen.halfDrawWidth, this.level.engine.screen.halfDrawHeight);
        this.#start();
        this.graphics.use('start');
    }

    #start() {  
        this.acc = vec(0, Config.BirdAcceleration);
    }

    stop(canFall = false) {
        this.vel = vec(0, 0);

        if (!canFall) {
            this.acc = vec(0, 0);   
        }
    }
 
    #isJumpingActive(engine: Engine) {
        if (engine.input.keyboard.isHeld(Keys.Space)) {
            return true;
        }

        const isPointerEvent = engine.input.pointers.isDown(0);

        if (!isPointerEvent) {
             return false;
        }

        const muteButton = this.level.actors.find(actor => actor.name === 'MuteButton');
        const pointerCoords = engine.input.pointers.primary.lastScreenPos;

        return !muteButton?.collider.bounds.contains(pointerCoords);

    }

    override onPostUpdate(engine: Engine) {
        const sreenHeight = this.level.engine.screen.drawHeight;

        if (this.level.isPaused) {
            return;
        }

        if (!this.#jumping && this.#isJumpingActive(engine)) {
            this.vel.y -= Config.BirdJumpVelocity;
            this.#jumping = true;

            Sounds.FlapSound.play();
            this.graphics.use('up');
            this.downAnimation.reset();
        }

        if (this.#jumping && !this.#isJumpingActive(engine)) {
            this.#jumping = false;

            this.graphics.use('down');
            this.upAnimation.reset();
        }

        // keep velocity from getting too big
        this.vel.y = clamp(this.vel.y, -sreenHeight, sreenHeight);

        // The "speed" the bird will move relative to pipes
        this.rotation = vec(200, this.vel.y).toAngle();
    }
}