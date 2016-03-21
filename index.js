"use strict";

const child_process = require('child_process');

let path = process.argv[2] || 'melody';
let options = {name: path};

let SAMPLES = 'Klarnet';
const TMP = '.tmp';

let lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(`${path}.snc`)
});

lineReader.on('line', (line) => {
  parse(line);
});

let melody = [];

function parse(line) {
  if (!options.tempo && line.indexOf('TEMPO') > -1) {
    options.tempo = parseFloat(`0${line.substring(line.indexOf('.'))}`);
  } else if(!options.instrument && line.indexOf('INSTRUMENT') > -1 ) {
    options.instrument = line.substring(line.indexOf('=') + 1);
  } else {
    line = line.split(' ');
    // if (line[0].length == 1)
    //   line[0] += '1';
    melody.push({snd: line[0], duration: parseFloat(`0${line[1]}`), art: line[2] || 's' });
  }
}

lineReader.on('close', () => {
  console.log(melody);
  combine();
});


function combine() {
  const BMP_FACTOR = options.tempo * 160;
  let cmd = '';
  let it = 0;
  melody.map(note => {
    const time = note.art == 'l' ? 0.05 : 0.0;
    cmd += `sox ${SAMPLES}/${note.snd}.wav ${TMP}/${it}.wav trim ${0.0 + time } ${note.duration * BMP_FACTOR + time} && `;
    it++;
  });
  cmd += 'sox ';
  for (let i = 0; i < it; i++) {
    cmd += `${TMP}/${i}.wav `;
  }
  cmd += `${TMP}/${options.name}.wav`;
  child_process.exec(cmd, (err, stdout, stderr) => {
      console.log(cmd);
  });
}
