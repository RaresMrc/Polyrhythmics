// canvas initialization
const paper = document.querySelector("#paper");
const pen = paper.getContext("2d");

const startTime = new Date().getTime();

const NUMBER_OF_ARCS = 21;
const velocity = 2 * Math.PI/14400;

// draws an arc
function drawArc(center, radius, height, startAngle, endAngle, color) {
    pen.strokeStyle = color;
    pen.beginPath();
    pen.arc(center, height, radius, startAngle, endAngle);
    pen.stroke();
}

// draws a ball
function drawBall(x, y, radius, color) {
    pen.fillStyle = color;
    pen.beginPath();
    pen.arc(x, y, radius, 0, 2 * Math.PI);
    pen.fill();
}

// colors of the arcs
const arcColors = [
    "#44decb",
    "#56d6b7",
    "#65d0a7",
    "#74c997",
    "#91bc78",
    "#aab15d",
    "#c0a845",
    "#d39f30",
    "#e89619",
    "#fe8d01",
    "#ff8209",
    "#ff701a",
    "#ff6424",
    "#ff5334",
    "#ff4541",
    "#ff3054",
    "#ff1f64",
    "#ff1a68",
    "#ff0e73",
    "#ff0978",
    "#ff047c",
    
]

let angle = [];

//initializing the angles with 0
for (let i = 0; i < NUMBER_OF_ARCS; i++) {
    angle[i] = 0;
}

let sounds = [];

// grabbing the sound files
for (let i = 0; i < NUMBER_OF_ARCS; i++) {
    sounds[i] = new Audio(`./sounds/sound${i + 1}.flac`);
    sounds[i].volume = 0.25;
}


class percentages {
    constructor(widthStartPercentage, widthEndPercentage, height) {
        this.widthStartPercentage = widthStartPercentage;
        this.widthEndPercentage = widthEndPercentage;
        this.height = height;
    }
}

class line {
    constructor(start, end, height) {
        this.start = start;
        this.end = end
        this.height = height;
        this.length = end - start;
        this.center = start + this.length/2;
    }
}

class arc {
    constructor(radius, spacing, startAngle, endAngle) {
        this.radius = radius;
        this.spacing = spacing;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
    }
}

class ball extends arc {
    constructor(radius, spacing, startAngle, endAngle, velocity) {
        super(radius, spacing, startAngle, endAngle);
        this.velocity = velocity;
    }
}

function draw() {

    // updating the canvas' size
    paper.width = document.body.clientWidth;
    paper.height = document.body.clientHeight;

    const percentageInfo = new percentages(0.3, 0.7, 0.5);

    const lineInfo = new line(paper.width * percentageInfo.widthStartPercentage,
                                paper.width * percentageInfo.widthEndPercentage,
                                paper.height * percentageInfo.height);

    const arcInfo = new arc(lineInfo.length/(2 * NUMBER_OF_ARCS), lineInfo.length/(2 * NUMBER_OF_ARCS), 0, 2 * Math.PI);
    
    const ballInfo = new ball(lineInfo.length * 0.0065, arcInfo.spacing, arcInfo.startAngle,
                                arcInfo.endAngle, velocity);

    // gradient for the middle line
    const gradient = pen.createLinearGradient(lineInfo.start, lineInfo.height, lineInfo.end, lineInfo.height);
    
    //first half of the middle line
    for (let i = 0; i < NUMBER_OF_ARCS; i++) {
        gradient.addColorStop(1 / ((arcColors.length - 1) * 2) * i, arcColors[arcColors.length - 1 - i]);
    }

    //second half of the midddle line
    for (let i = NUMBER_OF_ARCS - 1; i < 2 * (NUMBER_OF_ARCS - 1); i++) {
        gradient.addColorStop(1/((arcColors.length - 1) * 2) * (i + 1), arcColors[i - arcColors.length + 1]);
    }

    // colouring the middle line
    pen.strokeStyle = gradient;
    pen.beginPath();
    pen.moveTo(lineInfo.start, lineInfo.height)
    pen.lineTo(lineInfo.end, lineInfo.height);
    pen.stroke();

    //drawing the arcs
    for (let i = 0; i < NUMBER_OF_ARCS; i++) {
        drawArc(lineInfo.center, arcInfo.radius * (i + 1), lineInfo.height, arcInfo.startAngle,
                arcInfo.endAngle, arcColors[i]);
    }

    // playing a sound if the angle is over 2 * PI
    for (let i = 0; i < NUMBER_OF_ARCS; i++) {
        if (angle[i] >= 2 * Math.PI) {
            sounds[i].play();
            // const elapsedTime = new Date().getTime();
            // console.log(`Time for ${i + 1}: ${elapsedTime - startTime}`);
            angle[i] = angle[i] % (2 * Math.PI);
        }
    }

    //updating the angle, updating the x and y coordinates for each ball, then drawing the balls
    for (let i = 0; i < NUMBER_OF_ARCS; i++) {
        angle[i] += velocity * (i + 1);
        const x = lineInfo.center + arcInfo.radius * (i + 1) * Math.cos(Math.PI + angle[i]),
        y = lineInfo.height + arcInfo.radius * (i + 1) * Math.sin(Math.PI + angle[i]);
        
        drawBall(x, y, ballInfo.radius, arcColors[i]);
    }

    requestAnimationFrame(draw);
}

draw();