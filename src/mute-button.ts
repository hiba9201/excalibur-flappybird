import { Color, ScreenElement, SpriteSheet, vec } from 'excalibur';

import { LevelType } from './types';
import { Resources, Sounds } from './resources';

const BUTTON_SIZE = 48;

export class MuteButton extends ScreenElement {
    isMuted = false;
    #spriteSheet!: SpriteSheet;

    constructor(level: LevelType) {
        super({
            name: 'MuteButton',
            pos: vec(5, level.engine.screen.drawHeight - BUTTON_SIZE - 5),
            width: BUTTON_SIZE,
            height: BUTTON_SIZE,
            color: Color.White,
            z: 100,
        });

        this.collider.useCircleCollider(BUTTON_SIZE / 2, vec(BUTTON_SIZE / 2, BUTTON_SIZE / 2));
    }

    onInitialize(): void {
        this.#spriteSheet = SpriteSheet.fromImageSource({
            image: Resources.MuteButtonImage,
            grid: {
                rows: 1,
                columns: 2,
                spriteWidth: 32,
                spriteHeight: 32
            }
        });
        const onSprite = this.#spriteSheet.getSprite(0, 0);
        const offSprite = this.#spriteSheet.getSprite(1, 0);
        onSprite.destSize = {
            width: this.width,
            height: this.height,
        };
        offSprite.destSize = {
            width: this.width,
            height: this.height,
        }
        this.graphics.add('on', onSprite);
        this.graphics.add('off', offSprite);
        this.graphics.use('on');

        this.on('pointerup', () => {
            this.isMuted = !this.isMuted;

            if (this.isMuted) {
                Object.values(Sounds).forEach((sound) => {
                    sound.volume = 0;
                });
            } else {
                Object.values(Sounds).forEach((sound) => {
                    sound.volume = 1;
                });
            }
        });
    }

    override onPostUpdate(): void {
        if (this.isMuted) {
            this.graphics.use('off');
        } else {
            this.graphics.use('on');
        }
    }
}