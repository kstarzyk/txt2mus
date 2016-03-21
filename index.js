"use strict";

const cp = require('child_process');
const path = process.argv[2] || 'melody';
const Samples = require('./instrument');

const SAMPLES_PATH = 'samples';
const TMP = '.tmp';

let options = {name: path};


const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(`${path}`)
});

lineReader.on('line', _line => {
  const line = _line.split(' ');
  if (!options.tempo && line.indexOf('TEMPO') > -1) {
    options.tempo = parseFloat(`0${line[2]}`);
    options.BMP_FACTOR = options.tempo * 160;;
  } else if(!options.instrument && line.indexOf('INSTRUMENT') > -1 ) {
    options.instrument = line[2];
  } else if(line[0] == 'chord') {
    const chord_parts = line.slice(2, line.length-2);
    melody.push({
      chord: true,
      snd: chord_parts,
      duration: parseFloat(`0${line[7]}`)
    });
  } else {
    melody.push({snd: line[0], duration: parseFloat(`0${line[1]}`), art: line[2] || 's', chord: false});
  }
});


lineReader.on('close', () => {
  // console.log("MELODY");
  // console.log(melody);
  combine();
});


function line2sox(note, it, instrument) {
  if (note.chord) {
    let cmd = 'sox -m ';
    note.snd.map(x => {
      cmd += ` ${instrument.getFullPath(x)} `;
    });
    const time = 0.0;
    cmd += ` ${TMP}/${it}.wav  trim ${0.0 + time } ${note.duration * options.BMP_FACTOR} && `;
    // console.log(cmd);
    return cmd;
  }
  const time = note.art == 'l' ? 0.05 : 0.0;
  return `sox ${instrument.getFullPath(note.snd)} ${TMP}/${it}.wav trim ${0.0 + time } ${note.duration * options.BMP_FACTOR + time} && `;
}
let melody = [];

function combine() {
  // console.log("HEADER: ", options);
  let instrument = new Samples(options.instrument);
  let cmd = '';
  let it = 0;
  melody.map(note => {
    cmd += line2sox(note, it, instrument);
    it++;
  });
  cmd += 'sox ';
  for (let i = 0; i < it; i++) {
    cmd += `${TMP}/${i}.wav `;
  }
  cmd += `${options.name}.wav`;
  cp.exec(cmd, (err, stdout, stderr) => {
      // console.log(cmd);
      // console.log("CREATED");
      // console.log("EXIT");
  });
}
