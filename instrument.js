"use strict";
const fs = require("fs");
const cp = require("child_process");
const in_array = require('./in.js');

const SAMPLES_PATH = 'samples';
const CREATED_PATH = 'created';

const OCTAVE = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'h'];
const HALF_TONE = 100;

function get_notes_from_dir(dirname) {
  return fs.readdirSync(dirname).filter((elem, ind) => {
    return elem.indexOf('.wav') > -1;
  }).map(x => {
    return Instrument.getNoteInfo(x);
  });
}

function sort_notes(notes) {
  return notes.sort((a,b) => {
    return a.id - b.id;
  });
}

function mkdir(dirname) {
  return fs.mkdirSync(dirname);
}

function print_notes(notes) {
  console.log(notes.map(x => `${x.id}: ${x.name}`).join('\n'));
}

class Instrument {
  constructor(name) {
    this.name = name;
    this.notes = [];
    this.path = `./${SAMPLES_PATH}/${name}`;
    this.created = [];
    this.isClear = true;
    this.init();
  }

  init() {
    this.notes = get_notes_from_dir(this.path);
    if (get_notes_from_dir(`${this.path}/${CREATED_PATH}`)) {
      const created = get_notes_from_dir(`${this.path}/${CREATED_PATH}`);
      this.notes = this.notes.concat(created);
      this.isClear = false;
    }

    console.log(`${this.name} initialized`);
    this.notes = sort_notes(this.notes);
    print_notes(this.notes);


  }

  get(note) {
    if (in_array(note, notes, name)) {
      return `note.wav`;
    } else {
      return this.create(note).full;
    }
  }


  static getOctave(note) {
    const base = note.replace('#', '').replace('b', '').replace('.wav', '');
    if (base[0].toUpperCase() == base[0]) {
      return -1;
    } else if(base.length == 1) {
      return 0;
    } else {
      if (isNaN(parseInt(base[1]))) {console.log(note, "is not defined");}
      return parseInt(base[1]);
    }
  }

  static getNoteInfo(note) {
    const octave = Instrument.getOctave(note);
    let base = '';
    if (note.indexOf('#') > -1 || note.indexOf('b') > -1 ) {
      base = `${note[0]}${note[1]}`;
    } else {
      base = note[0];
    }
    const name = note.replace('.wav', '');
    const full = note.indexOf('.wav') > -1 ? note : `${name}.wav`;
    return {base: base.toLowerCase(), octave: octave, id: (octave+2)*12 + OCTAVE.indexOf(base.toLowerCase()), full: full, name: name};
  }

  create(note) {
    const hay = Instrument.getNoteInfo(note);

    if (in_array(hay, this.notes, 'id')) {
      return true;
    }

    if (this.isClear) {
      mkdir(`./${SAMPLES_PATH}/${this.name}/created`);
      this.isClear = false;
    }

    const candidate = this.findClosest(note);
    const pitch = Instrument.pitch_dist(hay, candidate);
    const cmd = `sox ${this.path}/${candidate.full} ${this.path}/${CREATED_PATH}/${hay.full} pitch ${pitch}`;
    console.info("CMD: ", cmd);
    cp.execSync(cmd);
    this.init();
  }

  // @getNoteInfo
  findClosest(name) {
    const lookup = Instrument.getNoteInfo(name);
    const sorted = this.notes.sort((a) => { return lookup.id - a.id; });
    return sorted[0];
  }

  // @getNoteInfo
  static pitch_dist(FIRST, SECOND) {
    const oct_dist = (SECOND.octave - FIRST.octave) * 12 * HALF_TONE;
    return (( OCTAVE.indexOf(SECOND.base) - OCTAVE.indexOf(FIRST.base) ) * HALF_TONE) + oct_dist;
  }
}

// let cos = new Instrument('Klarnet');
// cos.init();
// cos.create('d#1');


module.exports = new Instrument('Klarnet');
