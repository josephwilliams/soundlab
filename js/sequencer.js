var seq = {
  size: 16,
  range: 15,
};

var playback = {
  pos: 0,
  id: 0,
  tempo: 120,
  interval: 0,
  playing: false,
  startTime: 0,
  time: 0,
  lookahead: 0.05
};

playback.increment = function() {
  playback.pos = (playback.pos + 1) % seq.size;
  playback.interval = 15 / playback.tempo;
  delay.delayTime.value = 3 * playback.interval;
  playback.time += playback.interval;
};

playback.update = function() {
  var currentTime = audio.currentTime;
  currentTime -= playback.startTime;
  while (playback.time < currentTime + playback.lookahead) {
    var playTime = playback.time + playback.startTime;
    playback.triggerSynth(playback.pos, playTime);
    playback.increment();

    if (playback.time !== lastD) {
      lastD = playback.time;
      hlCol = (playback.pos + (seq.size - 1)) % seq.size;

      requestAnimationFrame(draw);
    }

  }
  playback.id = setTimeout(playback.update, 0);
};

playback.triggerSynth = function(pos, t) {
  currentNotes = selectedNotes[playback.pos];
  if (currentNotes.length > 0) {
    for (var i = 0; i < currentNotes.length; i++) {
      var note = currentNotes[i];
      var freq = mtof(note);
      synth.playNote(freq, t);
    }
  }
};

playback.start = function() {
  playback.pos = 0;
  playback.time = 0;
  playback.startTime = audio.currentTime + 0.05;
  playback.update();
};

playback.stop = function() {
  clearTimeout(playback.id);
};

var scale = [1, 16/15, 4/3, 3/2, 8/5];
function mtof(m) {
  var pitch = scale[m % scale.length];
  var octave = Math.floor(m / scale.length);
  var freq = 60 * pitch * Math.pow(2, octave);
  return freq;
}
