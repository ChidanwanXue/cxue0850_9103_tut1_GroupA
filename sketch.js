let multiCircles = [];
let multiCircleNum = 20;// Number of multiCircles
let innerMultiCircleNum = 10; // Number of inner concentric circles
let layerNum = 5; // Number of outer layers
let dotSize = 10; // Size of the dots
let dotDensity = 30; // Density of the dots

let myImage; //Add variable picture
function preload(){
  myImage = loadImage('Moon.png');//Add the picture
}

class MultiCircle {
  // Constructor to initialize the properties of multiCircle
  constructor(x, y, maxRadius, innerMultiCircleNum, layerNum) {
    this.x = x;
    this.y = y;
    this.maxRadius = maxRadius;
    this.innerMultiCircleNum = innerMultiCircleNum;
    this.layerNum = layerNum;
    this.innerRadius = maxRadius / 2;
    this.dotRadius = 5;
    // Allowed colors for inner concentric circles
    this.innerAllowedColors = [
      color(87, 98, 100),
      color(180, 172, 153),
      color(128, 128, 98),
      color(175, 146, 116),
      color(145, 73, 63)
    ];
    // Allowed colors for outer dots
    this.outerAllowedColors = [
      color(221, 211, 143),
      color(198, 177, 107),
      color(124, 167, 195),
      color(141, 164, 189),
      color(228, 122, 77),
    ];
    // Generate random colors for inner circles and outer dots
    this.innerColors = this.generateRandomColors(innerMultiCircleNum, this.innerAllowedColors);
    this.outerColor = this.generateRandomColors(1, this.outerAllowedColors)[0];
  }

  update(){
    let timeFactor = frameCount * 0.002; // Adjust the time factor as needed
    this.x += (noise(timeFactor) - 0.5) * 5; // Update the position of x with Perlin noise
    this.y += (noise(timeFactor + 100) - 0.5) * 5; // Update the y position with Perlin noise
    this.maxRadius = 100 + (noise(timeFactor + 200) - 0.5) * 5; // Update radius size
  }

  // Generate an array of random colors from the allowed colors
  generateRandomColors(num, allowedColors = []) {
    let colors = [];
    for (let i = 0; i < num; i++) {
      if (allowedColors.length > 0) {
        colors.push(allowedColors[int(random(allowedColors.length))]);
      } else {
        colors.push(color(random(255), random(255), random(255)));
      }
    }
    return colors;
  }

  // Display the multiCircle
  display() {
    // Calculate the outermost radius
    let outerRadius = this.innerRadius + this.layerNum * this.dotRadius * 2;

    // Draw the background circle with no stroke
    fill(231, 231, 224);
    noStroke();
    ellipse(this.x, this.y, outerRadius * 2);

    // Draw inner concentric circles
    noFill();
    for (let i = this.innerColors.length - 1; i >= 0; i--) {
      stroke(this.innerColors[i]);
      strokeWeight(5);
      ellipse(this.x, this.y, this.innerRadius * (i + 1) / this.innerColors.length * 2);
    }

    // Draw outer circle dots
    fill(this.outerColor);
    noStroke();
    for (let i = 0; i < 360; i += 10) {
      let angle = radians(i);
      for (let j = 0; j < this.layerNum; j++) {
        let radius = this.innerRadius + j * this.dotRadius * 2;
        let x = this.x + cos(angle) * radius;
        let y = this.y + sin(angle) * radius;
        ellipse(x, y, this.dotRadius * 2);

        let imageScale = outerRadius / 2200; // Adjust the scale factor as needed
        image(myImage, this.x-10 , this.y -10, outerRadius * 2 * imageScale, outerRadius * 2 * imageScale);
      }
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Generate multiCircles at random positions
  for (let i = 0; i < multiCircleNum; i++) {
    let x = random(width);
    let y = random(height);
    let maxRadius = random(100, 200);
    multiCircles.push(new MultiCircle(x, y, maxRadius, innerMultiCircleNum, layerNum));
  }
}

function initializeMultiCircles() {
  for (let i = 0; i < multiCircleNum; i++) {
    let x = random(width);
    let y = random(height);
    let maxRadius = random(100, 200);
    multiCircles.push(new MultiCircle(x, y, maxRadius, innerMultiCircleNum, layerNum));
  }
}

function draw() {
  background(255);
  drawPolkaDotBackground();

  if (windowWidth !== width || windowHeight !== height) {
    windowResized(); // Reinitialize multiCircles
  }
  
  // Display all multiCircles
  for (let mc of multiCircles) {
    mc.update();
    mc.display();
  }
}

function drawPolkaDotBackground() {
  // Draw polka dot background
  fill(193, 110, 74);
  noStroke();

  let waveOffset = frameCount * 0.02; // Adjust the speed of the wave as needed

  for (let y = 0; y < height; y += dotDensity) {
    for (let x = 0; x < width; x += dotDensity) {
      // Use the sine function to adjust the vertical position of the point
      let waveHeight = sin(x * 0.02 + waveOffset) * 10; // Amplitude and frequency are adjustable
      ellipse(x, y + waveHeight, dotSize);
      ellipse(x, y + waveHeight, dotSize + waveHeight / 2);

      let colorBrightness = map(waveHeight, -10, 10, 0, 120); // Adjust the brightness according to the waveform
      fill(176, 86, colorBrightness);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseClicked() {
  if (mouseX < width && mouseY < height) {
    //Create a new multiCircle
    let x = mouseX;
    let y = mouseY;
    let maxRadius = random(100, 200);
    multiCircles.push(new MultiCircle(x, y, maxRadius, innerMultiCircleNum, layerNum));
  } else {
    // Delete the last multiCircle
    multiCircles.pop();
  }
}