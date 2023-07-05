var angle;
var axiom = "F--F--F";
var sentence = axiom;
var len = 100;
var in_rul;
var in_axm;
var in_ang;
var axioma;

var rules = [];
rules[0] = {
  a: "F",
  b: "F+F--F+F"
}

let str_a = "";
let str_r = "";
let index = 0;
let trigger = 0;
let autoplay = false;
let osc;

let newRules = {
  "F": "F+F--F+F"
}


function iterations(axiom, rules, n) {
  production = iteration(axiom, rules)
  for (let i=0; i<n -1 ; i++) {
    production = iteration(production, rules)
  }
  return production
}

function iteration(axiom, rules) {
  let symbols = axiom.split("");
  let production = []
  for (symbol of symbols) {
    if (hasKey(rules, symbol)) {
      production.push(rules[symbol])
    } else {
      production.push(symbol)
    }
  }
  return production.join("")
}

function hasKey(obj, key) {
  return Object.keys(obj).includes(key)
}


function generate() {
  // The autoplay must be resumed after a user gesture on the page see https://stackoverflow.com/a/55078547.
  getAudioContext().resume();
  len *= 0.5;
  sentence = iteration(sentence, newRules);
  createP(sentence);
  turtle();
  autoplay = true;
}

function turtle() {
  background(51);
  resetMatrix();
  translate(width / 2, 2*height/3);
  stroke(255, 100);
  for (var i = 0; i < sentence.length; i++) {
    var current = sentence.charAt(i);

    if (current == "F") {
      line(0, 0, 0, -len);
      translate(0, -len);
    } else if (current == "+") {
      rotate(angle);
    } else if (current == "-") {
      rotate(-angle)
    } else if (current == "[") {
      push();
    } else if (current == "]") {
      pop();
    }
  }
}

function setup() {
  createCanvas(600, 600);
  angle = radians(60);
  background(101);
  createP(axiom);
  //turtle(angulo);
  //const ax = input.value();
  // input.value('');
  // const ang = input.value();
  // input.value('');

  in_axm = createInput();
  in_axm.value(axiom);
  var axioma = in_axm.value();
  in_axm.position(95,15);


  in_rul = createInput();
  in_rul.value(rules[0].b);
  var regla = in_rul.value();
  in_rul.position(95,35);

  in_ang = createInput();
  var angulo = in_ang.value();
  in_ang.position(95,55);

// crear botones que escriban input al axioma
  createButton("F").mouseClicked(addCharacter_ta).position(245,15);
  createButton("+").mouseClicked(addCharacter_ta).position(270,15);
  createButton("-").mouseClicked(addCharacter_ta).position(295,15);
// crear botones que escriban input a la regla
  createButton("F").mouseClicked(addCharacter).position(245,35);
  createButton("+").mouseClicked(addCharacter).position(270,35);
  createButton("-").mouseClicked(addCharacter).position(295,35);
  createButton("[").mouseClicked(addCharacter).position(320,35);
  createButton("]").mouseClicked(addCharacter).position(340,35);


// slider para el ángulo

  angSlider = createSlider(0, 90, 60);
  angSlider.position(245, 55);
  angle = radians(angSlider.value());
  in_ang.value(angSlider.value());
  // create a button to store the string
  //createButton("Axioma").mouseClicked(storeAxiom);
  //createButton("Regla").mouseClicked(storeRule);

  // A triangle oscillator
  osc = new p5.TriOsc();
  // Start silent
  osc.start();
  osc.amp(0);


  var button = createButton("generate");
  button.mousePressed(generate);

  var playagain = createButton("play again");
  playagain.mousePressed(play_again);

  button1 = createButton('submit');
  button1.position(95, 75);
  button1.mousePressed(interact);
  button1.mousePressed(storeAxiom);
  button1.mousePressed(storeRule);

  in_regla = createElement('h4', 'Axioma');
  in_regla.position(20, 0);
  in_axioma = createElement('h4', 'Regla');
  in_axioma.position(20, 20);
  in_angle = createElement('h4', 'Ángulo');
  in_angle.position(20, 40);

  turtle();
}


function addCharacter_ta() {
  // add the clicked character to the string
  str_a += this.elt.innerText;
  in_axm.value(str_a);
}

function addCharacter() {
  // add the clicked character to the string
  str_r += this.elt.innerText;
  in_rul.value(str_r);
}

function storeAxiom() {
  // save the current string as axiom
  axiom = str_a;
  str_a = "";
}

function storeRule() {
  // save the current string as rule
  newRules = {
    "F": str_r
  };
  str_r = "";
}

function draw() {
  play()
}

function play() {
  if (autoplay && millis() > trigger){
    playNote(lsys_to_int(sentence)[index], len*5);
    trigger = millis() + len*5;
    // Move to the next note
    index ++;
  // We're at the end, stop autoplaying.
  } else if (index >= lsys_to_int(sentence).length) {
    autoplay = false;
  }
}

function play_again() {
  autoplay = true;
  trigger = 0;
  index = 0;
  play()
}

function interact() {
  var angle = in_ang.value();
}

// A function to play a note
function playNote(note, duration) {
  osc.freq(midiToFreq(note));
  // Fade it in
  osc.fade(0.5,0.2);

  // If we sest a duration, fade it out
  if (duration) {
    setTimeout(function() {
      osc.fade(0,0.2);
    }, duration-50);
  }
}

function lsys_to_int(lSystemString) {
  var current = 65;
  let integerArray = [];
  for (let i = 0; i < lSystemString.length; i++) {
    if (lSystemString[i] === 'L') {
      integerArray.push(current);
    } else if (lSystemString[i] === '+') {
      current = current+2;
      integerArray.push(current);
    } else if (lSystemString[i] === '-') {
      current = current-2;
      integerArray.push(current);
    }
  }
  return integerArray;
}
