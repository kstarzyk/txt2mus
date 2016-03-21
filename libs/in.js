"use strict";

function comp_atom_to_object(a, b, by) {
  return a == object.by;
}

function comp_atom_to_atom(a, b, by) {
  return a == b;
}

function comp_array_to_array(a, b, by) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i])
      return false;
  }
  return true;
}

function comp_obj_to_obj(a, b, by) {
  return a[by] === b[by];
}


module.exports = (hay, stack, by) => {
  const isHayArray = hay instanceof Array;
  const isHayObject = typeof(hay) === 'object';
  const compMethod = isHayObject && !isHayArray ? comp_obj_to_obj : isHayArray ? comp_atom_to_atom : comp_atom_to_object;
  for (let i = 0; i < stack.length; i++) {
    if (compMethod(hay, stack[i], by)) {
      return true;
    }
  }
  return false;
};
