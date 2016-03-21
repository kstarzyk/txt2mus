"use strict";

const cp = require('child_process');
const path = process.argv[2] || 'melody';
const Samples = require('./instrument');

const SAMPLES_PATH = 'samples';
const TMP = '.tmp';

let options = {name: path};


const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(`${path}.snc`)
});

lineReader.on('line', line => {
  if (!options.tempo && line.indexOf('TEMPO') > -1) {
    options.tempo = parseFloat(`0${line.substring(line.indexOf('.'))}`);
  } else if(!options.instrument && line.indexOf('INSTRUMENT') > -1 ) {
    options.instrument = line.substring(line.indexOf('=') + 1);
  } else {
    line = line.split(' ');
    melody.push({snd: line[0], duration: parseFloat(`0${line[1]}`), art: line[2] || 's' });
  }
});


lineReader.on('close', () => {
  console.log(melody);
  combine();
});


let melody = [];

function combine() {
  const BMP_FACTOR = options.tempo * 160;
  let instrument = new Samples(options.instrument);
  let cmd = '';
  let it = 0;
  melody.map(note => {
    const time = note.art == 'l' ? 0.05 : 0.0;
    // cmd += `sox ${SAMPLES_PATH}/${options.instrument}/${note.snd}.wav ${TMP}/${it}.wav trim ${0.0 + time } ${note.duration * BMP_FACTOR + time} && `;
    cmd += `sox ${instrument.getFullPath(note.snd)} ${TMP}/${it}.wav trim ${0.0 + time } ${note.duration * BMP_FACTOR + time} && `;
    it++;
  });
  cmd += 'sox ';
  for (let i = 0; i < it; i++) {
    cmd += `${TMP}/${i}.wav `;
  }
  cmd += `${options.name}.wav`;
  cp.exec(cmd, (err, stdout, stderr) => {
      console.log(cmd);
  });
}
