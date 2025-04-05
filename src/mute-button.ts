import { Color, ScreenElement, SpriteSheet, vec } from 'excalibur';

import { LevelType } from './types';
import { Resources, Sounds } from './resources';

const BUTTON_SIZE = 32;

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
                spriteWidth: BUTTON_SIZE,
                spriteHeight: BUTTON_SIZE
            }
        });
        this.graphics.add('on', this.#spriteSheet.getSprite(0, 0));
        this.graphics.add('off', this.#spriteSheet.getSprite(1, 0));
        this.graphics.use('on');

        this.on('pointerdown', (event) => {
            event.nativeEvent.preventDefault();
        });
        this.on('pointerup', (event) => {
            event
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