var EWMA = require('../index.js');
var path = require('path');
var fs = require('fs');

var output = path.join(__dirname);

var functions = {
    'sawtooth': function(t) {
        var amplitude = 100;
        var rate = 10;
        var steps = amplitude / rate;
        t = t % steps;
        return t * rate;
    },
    'abs(sin(t)) * 100': function(t) {
        return Math.abs(Math.sin(t)) * 100;
    },
    'sin(x/2)/2': function(t) {
        return Math.sin(t/2)/2 * 100;
    }
}

var funcs = Object.keys(functions);
var files = funcs.map((v) => path.join(output, v.split('(')[0] + '.data'));
var contents = funcs.map((v) => '');

var TIME = 0;
var interval = 500; // Multiply TIME by this many ms to represent an interval
var clock = {
  now: () => TIME * 500
}

// Define different EWMA decay ratess that we want to compare
var decays = [
  0,
  (interval / 8) | 0, // make integer
  interval / 4,
  interval / 2,
  interval,
  interval * 2,
  interval * 4,
  interval * 8
]

// Convert decay rates to EWMA states for each func
var ewmas = funcs.map((v) => decays.map((v) => new EWMA(v, undefined, clock)))

for(var i = 0; i < funcs.length; i++) {
  contents[i] += 'TIME'
  for(var j = 0; j < decays.length; j++) {
    contents[i] += `\t${decays[j]}`
  }
}

// This loop controls time itself <sinister laugh>
for(TIME = 0; TIME < 1000; TIME++) {
  for(var i = 0; i < funcs.length; i++) { // FUNCS
    contents[i] += '\n'
    contents[i] += `${TIME}`
    for(var j = 0; j < decays.length; j++) { // DECAY
      ewmas[i][j].insert(functions[funcs[i]](TIME))
      contents[i] += `\t${ewmas[i][j].value()}`
    }
  }
}

for(var i = 0; i < funcs.length; i++) {
  fs.writeFileSync(files[i], contents[i]);
}
