import fs from 'fs';
import {dropInConfigs} from './drop-in.config';
import {exec} from 'child_process';

dropInConfigs.forEach(config => {
  const {mode, theme} = config;
  fs.writeFileSync(`./drop-ins/${mode}-${theme}.js`,
`
import dropIn from '../src/drop-in';

require('brace/mode/${mode}');
require('brace/theme/${theme}');

export default dropIn('${mode}', '${theme}');
`
  );
});

const buildCmd = (filename) =>
  `NODE_ENV=production COMPRESS=1 ./node_modules/.bin/webpack drop-ins/${filename}.js build/global/react-repl-drop-in-${filename}.min.js --config webpack.config.drop-in.js`;

console.log(`building ${dropInConfigs.length} variations (this might take a while)...`);

function build(config, i, total) {
  const filename = `${config.mode}-${config.theme}`;
  const cmd = buildCmd(filename);
  console.log(`building ${filename} (${i+1} of ${total})`);
  console.log(cmd);
  exec(cmd, () => {
    console.log(` -> completed ${i+1} of ${total}`);
    if (dropInConfigs.length) build(dropInConfigs.pop(), i+1, total);
  })
}

build(dropInConfigs.pop(), 0, dropInConfigs.length+1);
