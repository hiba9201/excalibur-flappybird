import { ImageSource, ImageWrapping, Sound } from 'excalibur'

export const Sounds = {
    /* Game Sounds */
    FailSound: new Sound('./sounds/fail.wav'),
    FlapSound: new Sound('./sounds/flap.wav'),
    ScoreSound: new Sound('./sounds/score.wav'),

    /* Background Sounds */
    BackgroundMusic: new Sound('./sounds/bg-music.ogg'),
} as const;

export const Resources = {
    /* Images */
    BirdImage: new ImageSource('./images/bird.png'),
    PipeImage: new ImageSource('./images/pipe.png', {
        wrapping: ImageWrapping.Clamp,
    }),
    GroundImage: new ImageSource('./images/ground.png', {
        wrapping: ImageWrapping.Repeat,
    }),
    MuteButtonImage: new ImageSource('./images/mute-button.png'),
    CloudImage: new ImageSource('./images/cloud.png'),

    ...Sounds,
} as const;