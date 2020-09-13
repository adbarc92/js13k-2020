const { exec } = require('child_process');
const fs = require('fs');
const minifyHtml = require('html-minifier').minify;

const DIRNAME = __dirname.replace(/\\/g, '/');

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
    .readFileSync(`${DIRNAME}/../index.html`)
    .toString()
    .replace('src/main.js', 'main.js');
  const mainFile = (
    CLIENT_FILES.reduce((prev, curr) => {
      return (
        prev +
        '\n' +
        fs
          .readFileSync(DIRNAME + '/../' + outputDirName + '/' + curr)
          .toString()
      );
    }, '(() => {\n') + '\n})()'
  ).replace(/res\//g, '');

  await execAsync(
    `rm -rf ${DIRNAME}/../.build ${DIRNAME}/../${outputDirName}.zip`
  );
  // await execAsync(`mkdir -p "${DIRNAME}/../.build"`);
  fs.mkdirSync(`${DIRNAME}/../.build`, { recursive: true });
  await execAsync(`cp -r ${DIRNAME}/../res/*.png ${DIRNAME}/../.build/ || :`);
  await execAsync(`cp -r ${DIRNAME}/../index.html ${DIRNAME}/../.build/ || :`);
  await execAsync(`rm -rf ${DIRNAME}/../${outputDirName}/*.map`);

  console.log('Write tmp files...');
  fs.writeFileSync(
    `${DIRNAME}/../.build/main.tmp.js`,
    mainFile.replace(/const /g, 'let ')
  );
  fs.writeFileSync(`${DIRNAME}/../.build/index.tmp.html`, htmlFile);

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
    `${DIRNAME}/../node_modules/.bin/terser --compress ${terserArgs.join(
      ','
    )} --mangle -o ${DIRNAME}/../.build/main.js -- ${DIRNAME}/../.build/main.tmp.js`
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
  fs.mkdirSync(`${DIRNAME}/../dist`, { recursive: true });
  await execAsync(
    `cp .build/index.html dist && cp .build/main.js dist && cp .build/*.png dist`
  );
  await execAsync(
    `cd .build && zip -9 ${DIRNAME}/../${outputDirName}.zip index.html main.js *.png`
  );
  try {
    await execAsync(`advzip -z -4 ${DIRNAME}/../${outputDirName}.zip`);
  } catch (e) {
    console.log('advzip is not installed, cannot zip build');
    return;
  }
  let result;
  if (process.platform === 'darwin') {
    result = await execAsync(`stat -f%z ${DIRNAME}/../${outputDirName}.zip`);
    const bytes = parseInt(result.split(' ')[0]);
    const kb13 = 13312;
    console.log(
      `${bytes}b of ${kb13}b (${((bytes * 100) / kb13).toFixed(2)}%)`
    );
  } else {
    result = await execAsync(
      `stat -c '%n %s' ${DIRNAME}/../${outputDirName}.zip`
    );
    const bytes = parseInt(result.split(' ')[1]);
    const kb13 = 13312;
    console.log(
      `${bytes}b of ${kb13}b (${((bytes * 100) / kb13).toFixed(2)}%)`
    );
  }
  await execAsync(`mv src.zip dist/dist.zip`);
};

build();
