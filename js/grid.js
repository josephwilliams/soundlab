var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var xScale = (canvas.width - 1) / seq.size;
var cellHeight = 20;
var noteOffset = 0;
var glideOffset = noteOffset + cellHeight * seq.range - cellHeight;
canvas.height = glideOffset + cellHeight + 1;
ctx.translate(0.5, 0.5);

var drawCells = function() {
  ctx.globalAlpha = 1.0;

  for(var x = 0; x < seq.size; x++) {

    // ctx.strokeRect(x * xScale, glideOffset, xScale, cellHeight);

    // if(seq.glide[x]) {
    //   ctx.fillStyle = "black";
    //   ctx.fillRect(x * xScale, glideOffset, xScale, cellHeight);
    // }

    if(seq.note[x] !== null) {
      seq.trigger[x] ? ctx.fillStyle = "lightblue" : ctx.fillStyle = "teal";
      ctx.fillRect(x * xScale, (seq.range - 1 - seq.note[x]) * cellHeight + noteOffset, xScale, cellHeight);
    }

    for(var y = 0; y < seq.range; y++) {
      ctx.strokeRect(x * xScale, y * cellHeight + noteOffset, xScale, cellHeight);
    }
  }
};

canvas.addEventListener("click", function(e) {
  var xRaw = e.offsetX || e.layerX;
  var yRaw = e.offsetY || e.layerY;

  var x = Math.floor((xRaw - 4) / xScale);
  if( (yRaw - 4) < glideOffset - 5) {
    var y = Math.floor((yRaw - 4) / cellHeight);
    if(seq.note[x] === null || seq.note[x] !== seq.range-1-y) {
      seq.note[x] = seq.range-1-y;
      seq.trigger[x] = true;
    }
    else if(seq.note[x] !== null && seq.trigger[x]) {
      seq.trigger[x] = false;
    }

    else if(seq.note[x] !== null && !seq.trigger[x]) {
      seq.note[x] = null;
      seq.trigger[x] = true;
    }

  }
  else if (yRaw - 4 > glideOffset) {
    seq.glide[x] = !seq.glide[x];
  }

  requestAnimationFrame(draw);
});

var highlightCol = function(x) {
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = "red";
  ctx.fillRect(x * xScale, 0, xScale, noteOffset + cellHeight * seq.range);
  ctx.fillRect(x * xScale, glideOffset, xScale, cellHeight);
};

var lastD = 0;
var hlCol = 0;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCells();
  if(playback.playing) {
    highlightCol(hlCol);
  }

};

draw();
