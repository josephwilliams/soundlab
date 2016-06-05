function sliderControl(id, target, property, min, max) {
  var slider = document.getElementById(id);
  var range = max - min;

  slider.value = (target[property] - min) / range;

  slider.addEventListener("input", function() {
    target[property] = slider.value * range + min;
  });
}

sliderControl("cutoffSlider", synth.cutoff.gain, 'value', 20, 5000);
sliderControl("resonanceSlider", synth.filter.Q, 'value', 0, 12);
sliderControl("attackSlider", synth, 'attackTime', 0.001, 0.06);
sliderControl("releaseSlider", synth, 'decayTime', 0.05, 0.75);
sliderControl("delaySlider", delayAmp.gain, 'value', 0, 0.75);
// sliderControl("volumeSlider", out.gain, 'value', 0, 0.35);
sliderControl("tempoSlider", playback, 'tempo', 10, 250);

document.body.onkeyup = function(e){
    if(e.keyCode == 32){
      if(!playback.playing) {
        playback.playing = true;
        playback.start();
        playButton.innerHTML = "&#9664;";
    }
    else {
      playback.playing = false;
      playback.stop();
      requestAnimationFrame(draw);
      playButton.innerHTML = "&#9654;";
    }
  }
};

var playButton = document.getElementById("playButton");
playButton.addEventListener("click", function() {
  if(!playback.playing) {
    playback.playing = true;
    playback.start();
    this.innerHTML = "&#9664;";
  }
  else {
    playback.playing = false;
    playback.stop();
    this.innerHTML = "&#9654;";
    requestAnimationFrame(draw);
  }
});

var clearButton = document.getElementById("clearButton");
clearButton.addEventListener("click", function() {
  clearGrid();
  requestAnimationFrame(draw);
});

//WAVEFORM
var squareRadio = document.getElementById("squareRadio");
squareRadio.addEventListener("change", function() {
  synth.osc.type = "square";
});

var sawRadio = document.getElementById("sawRadio");
sawRadio.addEventListener("change", function() {
  synth.osc.type = "sawtooth";
});
