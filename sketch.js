let axiom = "F--F--F";

let i
let generation
let lines
let boundary

let width
let height
let proportion
let scaleFactor
let button
let xOffset
let yOffset
let on

let newRules = {
  "F": "F+F--F+F"
}
// The midi notes of a scale
// let notes = [ 60, 62, 64, 65, 67, 69, 71];

class Turtle {
  constructor(x, y, angle, angleIncrement) {
    this.x = x
    this.y = y
    this.angle = angle
    this.angleIncrement = angleIncrement
    this.stack = []
  }

  _degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180
  }

  _radiansToDegrees(radians) {
    return (radians * 180) / Math.PI
  }

  forward(distance) {
    distance = distance ?? 1
    this.x = this.x + distance * Math.cos(this._degreesToRadians(this.angle))
    this.y = this.y + distance * Math.sin(this._degreesToRadians(this.angle))
  }

  backward(distance) {
    distance = distance ?? 1
    this.forward(-1 * distance)
  }

  left() {
    this.angle += this.angleIncrement
  }

  right() {
    this.angle -= this.angleIncrement
  }

  push() {
    console.log(`Saved state: ${this.x}, ${this.y}, ${this.angle}`)
    this.stack.push([this.x, this.y, this.angle])
  }

  pop() {
    if (this.stack.length === 0)
      throw new Error('Underflow.')
    let loaded = this.stack.pop()
    this.x = loaded[0]
    this.y = loaded[1]
    this.angle = loaded[2]

    console.log(`Loaded state: ${this.x}, ${this.y}, ${this.angle}`)
  }

  position() {
    return [this.x, this.y]
  }

  print() {
    console.log(`Turtle at [${this.x}, ${this.y}] pointing to ${this.angle}`)
  }
}

function iterations(axiom, rules, n) {
  production = iteration(axiom, rules)
  for (let i = 0; i < n - 1; i++) {
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

function lSystemToNotes(lSystemString) {
  let currentNote = 65
  let notes = []
  let move = []
  for (symbol of lSystemString.split("")) {
    if (symbol === "F") {
      notes.push(move)
      move = []
    } else if (symbol === "+") {
      currentNote += 2
      // continue
    } else if (symbol === "-") {
      currentNote -= 2
      // continue
    } else if (symbol === "[") {
      continue
    } else if (symbol === "]") {
      continue
    }
    move.push(currentNote)
  }
  return notes
}

function computeBoundingBox(lines) {
  /*
   * This function takes in a list of pairs of points: [[[x1, y1], [x2, y2]], [[x3, y3], [x4, y4]], ...]
   * representing a list of lines and will compute the bounding box for them in the format [x, ]
   */
  let minX = Number.POSITIVE_INFINITY, minY = Number.POSITIVE_INFINITY, maxX = Number.NEGATIVE_INFINITY, maxY = Number.NEGATIVE_INFINITY
  let p1, p2
  for (line_ of lines) {
    p1 = line_[0]
    p2 = line_[1]

    // Compute x boundaries
    if (p1[0] < minX) {
      minX = p1[0]
    }
    if (p2[0] < minX) {
      minX = p2[0]
    }
    if (p1[0] > maxX) {
      maxX = p1[0]
    }
    if (p2[0] > maxX) {
      maxX = p2[0]
    }
    // Compute y boundaries
    if (p1[1] < minY) {
      minY = p1[1]
    }
    if (p2[1] < minY) {
      minY = p2[1]
    }
    if (p1[1] > maxY) {
      maxY = p1[1]
    }
    if (p2[1] > maxY) {
      maxY = p2[1]
    }
  }

  return [minX, minY, (maxX - minX), (maxY - minY)]
}

function parseGeneration(generation, angle) {
  let symbols = generation.split("")
  let turtle = new Turtle(0, 0, 0, angle)
  let lines = []
  let initial, final
  for (symbol of symbols) {
    if (symbol == "F") {
      initial = turtle.position()
      turtle.forward()
      final = turtle.position()
      lines.push([initial, final])
    } else if (symbol == "+") {
      turtle.left()
    } else if (symbol == "-") {
      turtle.right()
    } else if (symbol == "[") {
      turtle.push()
    } else if (symbol == "]") {
      turtle.pop()
    }
  }
  return lines
}

function processGeneration(generation) {
  notes = lSystemToNotes(generation)
  lines = parseGeneration(generation, 60)
  boundary = computeBoundingBox(lines)
  scaleFactor = height * proportion / boundary[3] // We are using the width to proportionate things, we could use the height as well
  xOffset = boundary[0] * scaleFactor + (width - boundary[2] * scaleFactor) / 2
  yOffset = -1 * boundary[1] * scaleFactor + (height - boundary[3] * scaleFactor) / 2

  i = 0
  background(101)
}

function generate() {
  getAudioContext().resume();
  generation = iteration(generation, newRules)
  processGeneration(generation)
}

function restart() {
  i = 0
  background(101)
}

function pause() {
  on = false
}

function play() {
  on = true
}

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

function setup() {
  width = 800
  height = 600// width * boundary[3] / boundary[2]
  proportion = .9 // How much of the canvas should the drawing take
  on = true
  createCanvas(width, height)

  // A triangle oscillator
  osc = new p5.TriOsc();
  env = new p5.Envelope();
  osc.start()
  env.play(osc);

  generation = axiom
  processGeneration(generation)

  button = createButton("generate")
  button.mousePressed(generate)

  button = createButton("restart")
  button.mousePressed(restart)

  button = createButton("play")
  button.mousePressed(play)

  button = createButton("pause")
  button.mousePressed(pause)
}

function draw() {
  /* This function is native to p5.js, it will be called on every frame, what we are doing here is to paint a
   * step of the fractal per frame which makes the animation flow.
   */
  if (i < lines.length && on) {
    let p1, p2
    let line_ = lines[i]
    p1 = line_[0]
    p2 = line_[1]

    for (note of notes[i]) {
      osc.freq(midiToFreq(note))
      env.ramp(osc, 0, 1.0, 0)
    }

    line(xOffset + p1[0] * scaleFactor, yOffset + p1[1] * scaleFactor, xOffset + p2[0] * scaleFactor, yOffset + p2[1] * scaleFactor)
    i++
  } else {
    osc.freq(0)
  }
}
