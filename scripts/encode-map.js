const fs = require('fs');
const { PNG } = require('pngjs');

const colors = {
  0: [156, 100, 52], // grass+dirt
  1: [171, 82, 54], // dirt
  2: [0, 228, 54], // grass platform
  // ... to be added later
  15: [0, 0, 0], // nothing
};

const mapArray = fs
  .readFileSync(__dirname + '/../scratch/map.csv')
  .toString()
  .replace(/\r*\n/g, ',')
  .split(',')
  .filter(v => !!v);

console.log('MAP ARRAY', mapArray);

const path = __dirname + '/../scratch/map.template.png';
fs.createReadStream(path)
  .pipe(
    new PNG({
      filterType: 4,
      colorType: 2,
      bgColor: {
        red: 255,
        green: 255,
        blue: 255,
      },
    })
  )
  .on('parsed', function () {
    const png = this;
    for (let y = 0; y < png.height; y++) {
      for (let x = 0; x < png.width; x++) {
        let i = y * png.width + x;
        let mapIndex = mapArray[i];
        let idx = (png.width * y + x) << 2;

        if (!colors[mapIndex]) {
          console.log(
            'UNKNOWN INDEX',
            mapIndex,
            i,
            png.width,
            png.height,
            x,
            y,
            mapArray.length,
            mapArray.slice(-3)
          );
          continue;
        }

        const [r, g, b] = colors[mapIndex];
        // console.log(mapIndex, i, r, g, b);
        png.data[idx] = r;
        png.data[idx + 1] = g;
        png.data[idx + 2] = b;
        png.data[idx + 3] = 255;
      }
    }
    const path = __dirname + '/../scratch/map.encoded.png';
    png.pack().pipe(fs.createWriteStream(path));
    console.log('wrote ' + path);
  });
