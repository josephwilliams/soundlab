var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// seq.size = 15 (3 'octaves' of pentatonic scale)
// xScale represents the x (horizontal) size of each tile
var xScale = (canvas.width - 1) / seq.size;

// seq.range = 16 (4/4 time; four bars of four measures)
// yScale represents the y (vertical) size of each tile
var yScale = (canvas.height - 1) / seq.range;

// sets height of each individual tile
var cellHeight = 30;

// sets new canvas height based on the range (how many columns there are)
canvas.height = cellHeight * seq.range + 1;

// remaps original [x,y] coordinate (top-left corner)
ctx.translate(0.5, 0.5);

// setting up a variable to hold the cell that's being hovered over
var hoverCell = null;

var drawCells = function() {
  // sets transparency of the canvas object (1 is opaque)
  ctx.globalAlpha = 1;

  // xScale = 31.875
  for (var x = 0; x < xScale; x++) {

    // ctx.strokeRect(x * xScale, yScale, xScale, cellHeight);

    // paints the individual tiles
    // checks to see if x has been pushed into seq.note array; paints it if so (if not null)
    if(seq.note[x] !== null) {
      // paints tile based on whether it's in trigger array or not
      ctx.fillStyle = "#A020F0";
      ctx.fillRect(x * xScale,
                   (seq.range - 1 - seq.note[x]) * cellHeight,
                   xScale,
                   cellHeight
                  );
    }

    // draws grid; more rows (greater height) are added if seq.range is increased
    for(var y = 0; y < seq.range; y++) {
      ctx.strokeRect(x * xScale,
                     y * cellHeight,
                     xScale,
                     cellHeight
                    );
    }
  }
};

canvas.addEventListener("click", function(e) {
  var xRaw = e.offsetX || e.layerX;
  var yRaw = e.offsetY || e.layerY;

  // would show alert on screen with [x,y] coordinates of mouse on click event.
  // alert("x:" + xRaw + "  y:" + yRaw);

  // to find x, we look at its position on-click, xRaw.  We then divide that value
  // by xScale, the length of each tile.  So, if you're at position 100, and tiles
  // are 10 pixels long, you'd be at tile 10.
  var x = Math.floor(xRaw / xScale);
  var y = Math.floor(yRaw / cellHeight);

  // toggles a cell on/off, or whether it is null or defined within the seq.note array
  if (seq.note[x] === null || seq.note[x] !== (seq.range - 1 - y)) {
    seq.note[x] = seq.range - 1 - y;
  }
  else if (seq.note[x] !== null) {
    seq.note[x] = null;
  }

  requestAnimationFrame(draw);
});


var highlightCol = function(x) {
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = "#9999ff";
  ctx.fillRect(x * xScale, 0, xScale, cellHeight * seq.range);

  // ctx.fillRect(x * xScale, canvas.height, xScale, cellHeight);
};

var lastD = 0;
var hlCol = 0;

function draw() {
  // #clearRect clears the drawing such that new renderings can occur
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // #strokeStyle determines color of the grid lines
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  drawCells();

  if(playback.playing) {
    highlightCol(hlCol);
  }
}

draw();
