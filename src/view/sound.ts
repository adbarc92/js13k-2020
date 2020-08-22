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
    ,
    ,
    1964,
    ,
    ,
    0.08,
    1,
    2.14,
    ,
    ,
    462,
    0.01,
    ,
    ,
    ,
    ,
    ,
    ,
    0.02,
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
    484,
    0.04,
    ,
    0.08,
    3,
    0.12,
    74,
    ,
    57,
    0.2,
    ,
    ,
    -8.8,
    ,
    ,
    ,
    0.02,
  ]);

  loadSound(soundMap, 'menuCancel', [
    ,
    ,
    889,
    ,
    ,
    0.09,
    ,
    1.47,
    3.7,
    ,
    16,
    0.12,
    -0.01,
    ,
    -7,
    0.1,
    ,
    0.74,
    0.01,
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
    ,
    978,
    0.06,
    0.47,
    0.82,
    ,
    1.45,
    9.6,
    ,
    23,
    0.03,
    0.1,
    ,
    ,
    0.1,
    ,
    0.92,
    0.08,
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

  model_sounds = soundMap;
};

const G_view_playSound = (soundName: string) => {
  zzfx(...(model_sounds as soundCollection)[soundName]);
};
