const fs = require('fs');
const { exec } = require('child_process');
const { PNG } = require('pngjs');

const execAsync = async command => {
  return new Promise((resolve, reject) => {
    console.log(command);
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err + ' ' + stderr);
        return;
      }
      resolve(stdout);
    });
  });
};

const colors = {
  0: [156, 100, 52], // platform + wall
  1: [171, 82, 54], // wall
  2: [0, 228, 54], // platform
  3: [0, 135, 81], // old man
  4: [29, 43, 83], // pot,
  5: [95, 87, 79], // sign
  6: [194, 195, 199], //spikes
  7: [255, 241, 232], // wall block
  8: [255, 0, 77], //statue
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

const path = __dirname + '/map-template.png';
fs.createReadStream(path)
  .pipe(
    new PNG({
      // filterType: 4,
      colorType: 6,
      bgColor: {
        red: 255,
        green: 255,
        blue: 255,
      },
    })
  )
  .on('parsed', async function () {
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
    const path = __dirname + '/map-encoded.png';
    png.pack().pipe(fs.createWriteStream(path));
    console.log('wrote ' + path);
    await execAsync(
      `convert -depth 24 -composite -geometry -0+64 ${__dirname}/../res/packed.png ${__dirname}/map-encoded.png ${__dirname}/../res/packed.png`
    );
    await execAsync(`advpng -z -4 -f -i 3 ${__dirname}/../res/packed.png `);
    await execAsync(`rm -rf ${__dirname}/map-encoded.png`);
  });
