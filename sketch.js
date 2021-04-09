// The SketchRNN model
let model; // Start by drawing
let previous_pen = 'down'; // Current location of drawing
let x, y; // The current "stroke" of the drawing
let strokePath = null;
let pen;

// For when SketchRNN is fixed
function preload() {
  // See a list of all supported models: https://github.com/ml5js/ml5-library/blob/master/src/SketchRNN/models.js
  model = ml5.sketchRNN('penguin', modelReady);
}

function setup() {
  createCanvas(800, 800);
  background(255);

  // Button to reset drawing
  let button = createButton('clear');
  button.mousePressed(startDrawing);

  // run sketchRNN
  startDrawing();
}

function modelReady() {
  console.log('model loaded');
  startDrawing();
}

// Reset the drawing
function startDrawing() {
  background(255);
  // Start in the middle
  x = width / 2;
  y = height / 2;
  model.reset();
  // Generate the first stroke path
  model.generate(gotStroke);
}

function draw() {
  // If something new to draw
  //   if (strokePath) {
  //     // If the pen is down, draw a line
  //     if (previous_pen == 'down') {
  //       stroke(0);
  //       strokeWeight(3.0);
  //       line(x, y, x + strokePath.dx, y + strokePath.dy);
  //     }
  //     // Move the pen
  //     x += strokePath.dx;
  //     y += strokePath.dy;
  //     // The pen state actually refers to the next stroke
  //     previous_pen = strokePath.pen;

  //     // If the drawing is complete
  //     if (strokePath.pen !== 'end') {
  //       strokePath = null;
  //       model.generate(gotStroke);
  //     }
  //   }
  translate(width / 2, height / 2);
  if (strokePath != null) {
    let newX = x + strokePath.dx * 0.2;
    let newY = y + strokePath.dy * 0.2;
    if (pen == 'down') {
      stroke(0);
      strokeWeight(2);
      line(x, y, newX, newY);
    }
    pen = strokePath.pen;
    strokePath = null;
    x = newX;
    y = newY;

    if (pen !== 'end') {
      model.generate(gotSketch);
    } else {
      console.log('drawing complete');
      // In the video forgot to reset the pen to "down"
      // along with the x,y position so here is a new
      // function that takes care of both!
      setupNewSketch();
      model.reset();
      model.generate(gotSketch);
    }
  }

}
// A new stroke path
function gotStroke(err, s) {
  strokePath = s;
}

function gotSketch(error, s) {
  if (error) {
    console.error(error);
  } else {
    strokePath = s;
    //console.log(strokePath);
  }
}

function setupNewSketch() {
  pen = 'down';
  x = random(-width / 2, width / 2);
  y = random(-height / 2, height / 2);
}
