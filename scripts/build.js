const { exec } = require('child_process');
const fs = require('fs');
const minifyHtml = require('html-minifier').minify;

const outputDirName = process.argv[2];

const CLIENT_FILES = ['../main.js'];

console.log('Client Files', CLIENT_FILES);

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

const build = async () => {
  console.log('Concat files...');

  let htmlFile = fs
    .readFileSync(`${__dirname}/../index.html`)
    .toString()
    .replace('src/main.js', 'main.js');
  const mainFile = (
    CLIENT_FILES.reduce((prev, curr) => {
      return (
        prev +
        '\n' +
        fs
          .readFileSync(__dirname + '/../' + outputDirName + '/' + curr)
          .toString()
      );
    }, '(() => {\n') + '\n})()'
  ).replace(/res\//g, '');

  await execAsync(
    `rm -rf ${__dirname}/../.build ${__dirname}/../${outputDirName}.zip`
  );
  await execAsync(`mkdir -p ${__dirname}/../.build`);
  await execAsync(
    `cp -r ${__dirname}/../res/*.png ${__dirname}/../.build/ || :`
  );
  await execAsync(
    `cp -r ${__dirname}/../index.html ${__dirname}/../.build/ || :`
  );
  await execAsync(`rm -rf ${__dirname}/../${outputDirName}/*.map`);

  console.log('Write tmp files...');
  fs.writeFileSync(`${__dirname}/../.build/main.tmp.js`, mainFile);
  fs.writeFileSync(`${__dirname}/../.build/index.tmp.html`, htmlFile);

  const terserArgs = [
    'passes=3',
    'pure_getters',
    'unsafe',
    'unsafe_math',
    'hoist_funs',
    'toplevel',
    'pure_funcs=[console.info,console.log,console.debug,console.warn]',
    'ecma=9',
  ];

  console.log('Minify code...');
  await execAsync(
    `${__dirname}/../node_modules/.bin/terser --compress ${terserArgs.join(
      ','
    )} --mangle -o ${__dirname}/../.build/main.js -- ${__dirname}/../.build/main.tmp.js`
  );
  console.log('minify html...');
  fs.writeFileSync(
    '.build/index.html',
    minifyHtml(htmlFile, {
      removeAttributeQuotes: true,
      collapseWhitespace: true,
      html5: true,
      minifyCSS: true,
      minifyJS: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeTagWhitespace: true,
      removeComments: true,
      useShortDoctype: true,
    })
  );
  await execAsync(
    `mkdir -p dist && cp .build/index.html dist && cp .build/main.js dist && cp .build/*.png dist`
  );
  await execAsync(
    `cd .build && zip -9 ${__dirname}/../${outputDirName}.zip index.html main.js *.png`
  );
  try {
    await execAsync(`advzip -z -4 ${__dirname}/../${outputDirName}.zip`);
  } catch (e) {
    console.log('advzip is not installed, cannot zip build');
    return;
  }
  const result = await execAsync(
    `stat -c '%n %s' ${__dirname}/../${outputDirName}.zip`
  );
  await execAsync(`mv src.zip dist/dist.zip`);
  const bytes = parseInt(result.split(' ')[1]);
  const kb13 = 13312;
  console.log(`${bytes}b of ${kb13}b (${((bytes * 100) / kb13).toFixed(2)}%)`);
};

build();
