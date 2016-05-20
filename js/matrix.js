var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// seq.size = 15 (3 'octaves' of pentatonic scale)
var xScale = (canvas.width - 1) / seq.size;
// seq.range = 16 (4/4 time; four bars of four measures)
var yScale = (canvas.height - 1) / seq.range;

// sets height of each individual tile
var cellHeight = 30;

// sets new canvas height based on the range (how many columns there are)
canvas.height = cellHeight * seq.range + 1;

// remaps original [x,y] coordinate (top-left corner)
ctx.translate(0.5, 0.5);

var drawCells = function() {
  // sets transparency of the canvas object (1 is opaque)
  ctx.globalAlpha = 1;

  for (var x = 0; x < xScale; x++) {

    // ctx.strokeRect(x * xScale, yScale, xScale, cellHeight);

    // paints the individual tiles
    if(seq.note[x] !== null) {
      seq.trigger[x] ? ctx.fillStyle = "lightblue" : ctx.fillStyle = "teal";
      ctx.fillRect(x * xScale, (seq.range - 1 - seq.note[x]) * cellHeight, xScale, cellHeight);
    }

    // draws grid; more rows (greater height) are added if seq.range is increased
    for(var y = 0; y < seq.range; y++) {
      ctx.strokeRect(x * xScale, y * cellHeight, xScale, cellHeight);
    }
  }
};

function draw() {
  // #clearRect clears the drawing such that new renderings can occur
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // #strokeStyle determines color of the grid lines
  ctx.strokeStyle = "#fff";
  drawCells();

  if(playback.playing) {
    highlightCol(hlCol);
  }
}

draw();
