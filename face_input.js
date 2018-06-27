/**
 *
 *     Face Input ~ for cognitive accesibility
 *
 */


/* global variables */

var colorNegative, 
  colorNeutral, 
  colorPositive;      // colors

var X;         // x input (normalized)
var output;    // output HTML container
var xc;        // contrained drag value

var touched;

function setup() {
  var w = constrain(windowWidth, 200, 600);
  var canvas = createCanvas(w, w * .75);
  canvas.parent('canvasContainer');
  face = new Face(width/2, height*.49, 1);
  colorNegative = color(172, 147, 255);
  colorNeutral = color(232, 232, 232);
  colorPositive = color(250, 255, 0);
  output = document.getElementById('val');

  // initialize default 
  xc = width/2;
  X = .5;
  touched = false;
}

function touchStarted() {
  touched = true;
  return false;
}
function touchEnded() {
  touched = false;
  return false;
}

function draw() {
  face.drawFace();
  drawSlider(height - 60);
}

function drawSlider(y) {
  var m = 20;           // margin 
  var M = 2 * m;        // real margin

  if (mouseIsPressed || touched) {
    xc = constrain(mouseX, M, width-M);
    X = map(xc, M, width-M, 0, 1);
  } 

  fill(242);
  noStroke();
  rect(m, y+m, width-2*m, 2*m, m);
  fill(face.col);
  stroke(0);
  strokeWeight(m/5);
  ellipse(xc, y+m*2, m*1.5, m*1.5);
  output.innerHTML = X.toPrecision(3);
}


function Face(x, y, s) {
  this.x = x; // x position
  this.y = y; // y position
  this.s = s; // scale
  // current, start, middle and target expression
  this.ce = this.se = this.me = this.te = [];
  this.col = color(200);
  this.se = expression_sad;
  this.me = expression_neutral;
  this.te = expression_happy;
  this.ce = expression_default;


  this.drawFace = function() {
    if (mouseIsPressed || touched) {
      this.calc(X);
    }
    push();
    translate(this.x, this.y);
    scale(this.s);
    this.drawContour();
    this.drawEyes();
    this.drawNose();
    this.drawEyebrows();
    this.drawMouth();
    pop();
  }

  this.drawEyes = function() {
    fill(0);
    noStroke();
    ellipse(this.ce[10][0], this.ce[10][1], 10, 10);
    ellipse(-this.ce[10][0], this.ce[10][1], 10, 10);
  }

  this.drawNose = function() {
    stroke(0);
    strokeWeight(3);
    noFill();
    beginShape();
    vertex(this.ce[4][0], this.ce[4][1]);
    vertex(this.ce[5][0], this.ce[5][1]);
    vertex(this.ce[6][0], this.ce[6][1]);
    endShape();
  }

  this.drawEyebrow = function() {
    stroke(0);
    strokeWeight(3);
    noFill();
    bezier(
      this.ce[0][0], this.ce[0][1], 
      this.ce[1][0], this.ce[1][1], 
      this.ce[2][0], this.ce[2][1], 
      this.ce[3][0], this.ce[3][1]);
  }

  this.drawEyebrows = function() {
    // left
    this.drawEyebrow();
    // right
    push();
    scale(-1, 1);
    this.drawEyebrow();
    pop();
  }

  this.drawMouth = function() {
    stroke(0);
    strokeWeight(3);
    noFill();
    bezier(
      this.ce[7][0], this.ce[7][1], 
      this.ce[8][0], this.ce[8][1], 
      -this.ce[8][0], this.ce[8][1], 
      -this.ce[7][0], this.ce[7][1]);

    bezier(
      this.ce[7][0], this.ce[7][1], 
      this.ce[9][0], this.ce[9][1], 
      -this.ce[9][0], this.ce[9][1], 
      -this.ce[7][0], this.ce[7][1]);
  }

  this.drawContour = function() {
    var a = createVector(-68.0, -32.0);
    var b = createVector(-75.0, -146.0);
    var c = createVector(-64.0, 115.0);
    noStroke();
    fill(this.col);
    beginShape();
    vertex(a.x, a.y);
    bezierVertex(b.x, b.y, -b.x, b.y, -a.x, a.y);
    vertex(-a.x, a.y);
    bezierVertex(-c.x, c.y, c.x, c.y, a.x, a.y);
    endShape();
  }

  this.calc = function(val) {
    var n;
    if (val <= 0.5) {
      n = map(val, 0, .5, 0, 1);
      for (var i = 0; i < this.ce.length; i++) {
        this.ce[i][0] = lerp(this.se[i][0], this.me[i][0], n);
        this.ce[i][1] = lerp(this.se[i][1], this.me[i][1], n);
      }
      this.col = lerpColor(colorNegative, colorNeutral, n);
    } else {
      n = map(val, .5, 1, 0, 1);
      for (var i = 0; i < this.ce.length; i++) {
        this.ce[i][0] = lerp(this.me[i][0], this.te[i][0], n);
        this.ce[i][1] = lerp(this.me[i][1], this.te[i][1], n);
      }
      this.col = lerpColor(colorNeutral, colorPositive, n);
    }
  }
}


/* 
======================= expression data =======================
*/

var expression_happy = [
  [-57.0, -40.0], 
  [-43.0, -57.0], 
  [-27.0, -54.0], 
  [-15.0, -49.0], 
  [-5.0, -37.0], 
  [-12.0, 2.0], 
  [3.0, 2.0], 
  [-29.0, 22.0], 
  [-4.0, 28.0], 
  [-14.0, 52.0], 
  [-32.0, -32.0]
];

var expression_sad = [
  [-57.0, -40.0], 
  [-43.0, -57.0], 
  [-27.0, -54.0], 
  [-12.0, -56.0], 
  [-5.0, -37.0], 
  [-12.0, 2.0], 
  [3.0, 2.0], 
  [-32.0, 41.0], 
  [-18.0, 18.0], 
  [-12.0, 36.0], 
  [-32.0, -32.0]
];

var expression_neutral = [
  [-55.0, -38.0], 
  [-43.0, -52.0], 
  [-27.0, -54.0], 
  [-13.0, -44.0], 
  [-5.0, -37.0], 
  [-12.0, 2.0], 
  [3.0, 2.0], 
  [-23.0, 28.0], 
  [-2.0, 29.0], 
  [-12.0, 29.0], 
  [-32.0, -32.0]
];

var expression_default = [
  [-55.0, -38.0], 
  [-43.0, -52.0], 
  [-27.0, -54.0], 
  [-13.0, -44.0], 
  [-5.0, -37.0], 
  [-12.0, 2.0], 
  [3.0, 2.0], 
  [-23.0, 28.0], 
  [-2.0, 29.0], 
  [-12.0, 29.0], 
  [-32.0, -32.0]
];
