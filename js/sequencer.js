var seq = {
  size: 16,
  range: 15,
  note: [],
  glide: [],
  trigger: [],
};

seq.init = function() {
  for(var i = 0; i < seq.size; i++) {
    seq.note[i] = null;
    seq.glide[i] = false;
    seq.trigger[i] = true;
  }
};

seq.randomize = function() {
  seq.init();
  for(var i = 0; i < seq.size; i++) {
    if(Math.random() < 0.8) {
      seq.note[i] = Math.floor(Math.random() * seq.range);
      seq.trigger[i] = Math.random() < 0.85;
      seq.glide[i] = Math.random() < 0.25;
    }
  }
};

seq.randomize();

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
  while(playback.time < currentTime + playback.lookahead) {
    var playTime = playback.time + playback.startTime;
    playback.triggerSynth(playback.pos, playTime);
    playback.increment();

  if(playback.time != lastD) {

    lastD = playback.time;

    hlCol = (playback.pos + (seq.size - 1)) % seq.size;
    requestAnimationFrame(draw);
  }


  }
  playback.id = setTimeout(playback.update, 0);
};

playback.triggerSynth = function(pos, t) {
  if(seq.note[pos] !== null) {
    var freq = mtof(seq.note[pos]);
    synth.playNote(freq, seq.glide[pos], seq.trigger[pos], t);

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
