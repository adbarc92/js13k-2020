// A Rect is [x1, y1, x2, y2] (not (x, y, w, h))
type Rect = [number, number, number, number];
type Point = [number, number];

// 4 Points where each point represents the TOP, BOTTOM, LEFT, RIGHT of a rect
type CollisionPoints = [Point, Point, Point, Point];

type CollisionSide = 0 | 1 | 2 | 3;
const G_COLLISION_BOTTOM = 0;
const G_COLLISION_TOP = 1;
const G_COLLISION_LEFT = 2;
const G_COLLISION_RIGHT = 3;

const G_utils_to2d = (i: number, width: number) => {
  return [i % width, Math.floor(i / width)];
};
const G_utils_to1d = (x: number, y: number, width: number) => {
  return y * width + x;
};
const G_utils_getSign = (v: number): 1 | -1 => {
  return (Math.abs(v) / v) as 1 | -1;
};

const G_utils_floorNearestMultiple = (
  num: number,
  multipleOf: number
): number => {
  return Math.floor((num + multipleOf / 2) / multipleOf) * multipleOf;
};

const G_utils_createRect = (
  x: number,
  y: number,
  w: number,
  h: number
): Rect => {
  return [x, y, x + w, y + h];
};

const G_utils_createPoint = (x: number, y: number): Point => {
  return [x, y];
};

const G_utils_pointRectCollides = (a: Point, b: Rect) => {
  const [x, y] = a;
  const [bx, by, bx2, by2] = b;
  return x > bx && x < bx2 && y > by && y < by2;
};

const G_utils_getCollisionsWithRect = (
  pts: CollisionPoints,
  rect: Rect
): CollisionSide[] => {
  return pts
    .map((pt, i) => {
      return G_utils_pointRectCollides(pt, rect) ? i : -1;
    })
    .filter(collisionSide => {
      return collisionSide > -1;
    }) as CollisionSide[];
};

// given a rect, returns 4 Points where each point represents the BOTTOM, TOP, LEFT, RIGHT of the given rect
const G_utils_rectToCollisionPoints = (rect: Rect): CollisionPoints => {
  const [x1, y1, x2, y2] = rect;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const cx = x1 + dx / 2;
  const cy = y1 + dy / 2;
  return [
    G_utils_createPoint(cx, y2), // bottom
    G_utils_createPoint(cx, y1), // top
    G_utils_createPoint(x1 + dx / 4, cy), // left
    G_utils_createPoint(x2 - dx / 4, cy), // right
  ];
};

const G_utils_areAllUnitsDead = (units: Unit[]): boolean => {
  return units.reduce((everyoneIsDead: boolean, unit: Unit) => {
    return everyoneIsDead && unit.cS.hp === 0;
  }, true);
};

const G_utils_getRandNum = (max: number): number => {
  return Math.floor(Math.random() * Math.floor(max));
};

const G_utils_getRandArrElem = (arr: any[]): any => {
  return arr[G_utils_getRandNum(arr.length)];
};

const G_utils_isAlly = (battle: Battle, unit: Unit): boolean => {
  return battle.allies.includes(unit);
};

const G_utils_windowGetHeight = () => {
  return window.innerHeight;
};
const G_utils_windowGetWidth = () => {
  return window.innerWidth;
};

const G_utils_waitMs = async (ms: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};
