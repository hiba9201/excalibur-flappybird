import { Actor, Color, Engine, Screen, Sprite, vec } from 'excalibur';
import { Config } from './config';
import { Resources } from './resources';

export class Ground extends Actor {
    moving = false;

    constructor(private gameScreen: Screen) {
        super({
            name: 'Ground',
            pos: vec(0, gameScreen.drawHeight - Config.GroundHeight),
            anchor: vec(0, 0),
            width: gameScreen.drawWidth,
            height: Config.GroundHeight,
            color: Color.Brown,
            z: 1,
        });
    }

    override onInitialize(engine: Engine) {
        const sprite = new Sprite({
            image: Resources.GroundImage,
            width: engine.screen.drawWidth,
            height: Config.GroundHeight,
        });

        this.graphics.add('ground', sprite);
        this.graphics.use('ground');
    }

    override onPostUpdate(engine: Engine, elapsedMs: number): void {
        if (!this.moving) {
            return;
        }

        const groundSprite = this.graphics.getGraphic('ground') as Sprite;
        groundSprite.sourceView.x += Config.PipeSpeed * (elapsedMs / 1000);
        groundSprite.sourceView.x = groundSprite.sourceView.x % Resources.GroundImage.width;
    }

    reset() {
        this.#start();
    }

    #start() {
        this.moving = true;
    }

    stop() {
        this.moving = false;
    }
}