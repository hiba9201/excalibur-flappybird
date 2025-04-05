import { Engine, Color, DisplayMode, Loader } from 'excalibur';

import { Level } from './level';
import { Resources } from './resources';

const game = new Engine({
    backgroundColor: Color.fromHex('#5797ff'),
    pixelArt: true,
    pixelRatio: 2,
    displayMode: DisplayMode.FillContainer,
    canvasElementId: 'canvas',
    scenes: {
        Level,
    }
});

const loader = new Loader(Object.values(Resources));

game.start(loader).then(() => {
    game.goToScene('Level');
});