/*
global
zzfx
*/

type sound = (number | undefined)[];

type soundCollection = { [key: string]: sound };

let model_sounds: soundCollection | null = null;

const loadSound = (soundMap: soundCollection, key: string, soundArr: sound) => {
  soundMap[key] = soundArr;
};

const G_model_loadSounds = () => {
  const soundMap = {};

  loadSound(soundMap, 'menuMove', [
    0.6,
    0,
    1248,
    0.04,
    ,
    0,
    2,
    2.23,
    99,
    0.8,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    0,
    0.05,
  ]);

  loadSound(soundMap, 'menuConfirm', [
    ,
    ,
    1469,
    ,
    ,
    0.08,
    ,
    0.14,
    56,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    0.04,
    ,
    0.04,
  ]);

  loadSound(soundMap, 'menuCancel', [
    ,
    ,
    1056,
    0.03,
    ,
    0.06,
    3,
    0.74,
    ,
    0.3,
    -38,
    0.04,
    ,
    ,
    6,
    ,
    ,
    ,
    0.03,
  ]);

  loadSound(soundMap, 'jump', [
    ,
    ,
    223,
    0.01,
    0.1,
    0.22,
    1,
    1.35,
    0.1,
    ,
    ,
    ,
    ,
    0.4,
    ,
    ,
    ,
    0.55,
    0.09,
  ]);

  loadSound(soundMap, 'explosion', [
    ,
    ,
    518,
    0.01,
    0.05,
    1.59,
    4,
    1.24,
    0.5,
    0.4,
    ,
    ,
    ,
    0.3,
    ,
    0.7,
    0.13,
    0.58,
    0.01,
  ]);

  loadSound(soundMap, 'actionStrike', [
    ,
    ,
    224,
    ,
    0.08,
    0.17,
    4,
    1.12,
    4.7,
    -4.2,
    ,
    ,
    ,
    1.6,
    -0.9,
    0.1,
    0.01,
    0.82,
    0.01,
  ]);

  loadSound(soundMap, 'actionCharge', [
    ,
    0,
    11,
    0.16,
    0.34,
    0.06,
    2,
    2.05,
    ,
    60,
    ,
    ,
    ,
    ,
    -1.2,
    0.5,
    ,
    ,
    0.01,
  ]);

  loadSound(soundMap, 'actionDefend', [
    ,
    ,
    1396,
    ,
    0.1,
    0.14,
    1,
    0.91,
    ,
    ,
    ,
    ,
    ,
    0.1,
    ,
    0.1,
    ,
    0.71,
    0.07,
  ]);

  loadSound(soundMap, 'turnChime', [
    ,
    0,
    750,
    0.08,
    0.05,
    0.09,
    1,
    0.01,
    ,
    ,
    ,
    ,
    0.02,
    ,
    ,
    ,
    0.15,
    0.4,
    0.03,
  ]);

  model_sounds = soundMap;
};

const G_view_playSound = (soundName: string) => {
  zzfx(...(model_sounds as soundCollection)[soundName]);
};
