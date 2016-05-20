window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audio = new AudioContext();

// -------------------------------------------------
// OUTPUTS
// -------------------------------------------------

// This should remove any DC offset that is introduced by any hacky stuff
var dcKiller = audio.createBiquadFilter();
dcKiller.type = "highpass";
dcKiller.frequency.value = 10;
dcKiller.Q.value = 0;
dcKiller.connect(audio.destination);

var out = audio.createGain();
out.gain.value = 0.35;
out.connect(dcKiller);

var delay = audio.createDelay();
var delayAmp = audio.createGain();
var delayFb = audio.createGain();

delayFb.gain.value = 0.5;
delayFb.connect(out);
delayFb.connect(delay);
delay.connect(delayFb);
delayAmp.connect(delay);
delayAmp.gain.value = 0.25;

delay.delayTime.value = 0.5;

// -------------------------------------------------
// CONTROL VOLTAGE HACKINESS
// -------------------------------------------------
// In this bit I am using a slightly hacky approach to create a constant
// level audio signal for use as a control voltage. If we route this signal
// to a gain node and automate the node's gain value we can use our CV audio
// signal to modulate params rather than automating them. This allows us to
// automate multiple params simultaneously and gives us the ability to change
// scaling and other properties in real-time. We can also use audio nodes
// to modify and effect our control signal too. We will see this in action
// later when we run our signal through a LPF.

//We start by creating a cosine wavetable
var real = new Float32Array(2);
var imag = new Float32Array(2);
real[0] = 0;
real[1] = 1;
imag[0] = 0;
imag[1] = 0;

audio.createWaveTable = audio.createWaveTable || audio.createPeriodicWave;
var sigWave = audio.createWaveTable(real, imag);

// Next we set up an oscillator using our wavetable
var sig = audio.createOscillator();
sig.setPeriodicWave = sig.setPeriodicWave || sig.setWaveTable;
sig.setPeriodicWave(sigWave);

// The trick is that we set the oscillator's frequency to 0.
// We now have a constant audiorate signal of 1 ( Cos(0) === 1.0 )
sig.frequency.value = 0;
sig.start = sig.start || sig.noteOn;
sig.start(0);

var synth = {
  attackTime: 0.01,
  sustainTime: 0.1,
  decayTime: 0.25,
  glideRate: 0.05
};

// -------------------------------------------------
// CONTROL VOLTAGE ENVELOPE
// -------------------------------------------------

// Here we create our main envelope via a gain node
synth.adsr = audio.createGain();
synth.adsr.gain.value = 0;

// We connect our CV to our evelope
sig.connect(synth.adsr);

// Here we create a lowpass filter to smooth out evelope
// This is sort of like an analog style slew filter
synth.adsrF = audio.createBiquadFilter();
synth.adsrF.type = "lowpass";
synth.adsrF.frequency.value = 64;
synth.adsrF.Q.value = 0;

// Finally we hook our enveloper up to the filter
// Will will be using the filter output to modulate our synth parameters
synth.adsr.connect(synth.adsrF);

// -------------------------------------------------
// SYNTH DEFINITION
// -------------------------------------------------

synth.amp = audio.createGain();
synth.amp.gain.value = 0;

synth.adsrF.connect(synth.amp.gain);

synth.filter = audio.createBiquadFilter();
synth.filter.type = "lowpass";
synth.filter.frequency.value = 0;
synth.filter.Q.value = 10;
synth.filter.connect(synth.amp);

synth.cutoff = audio.createGain();
synth.cutoff.gain.value = 2500;
synth.cutoff.connect(synth.filter.frequency);
synth.adsrF.connect(synth.cutoff);

synth.osc = audio.createOscillator();
synth.osc.type = "sawtooth";
synth.osc.connect(synth.filter);

synth.osc.start = synth.osc.start || synth.osc.noteOn;
synth.osc.start(0);

synth.amp.connect(out);
synth.amp.connect(delayAmp);


// -------------------------------------------------
// SYNTH INTERFACE
// -------------------------------------------------

synth.playNote = function(freq, glide, trigger, t) {
  var now = t || audio.currentTime;
  var rate = glide ? synth.glideRate : 0.0000001;

  synth.osc.frequency.setTargetAtTime(freq, now, rate);

  if(trigger) {
    synth.adsr.gain.cancelScheduledValues(now);
    synth.adsr.gain.setValueAtTime(0, now);
    synth.adsr.gain.setTargetAtTime(1, now, synth.attackTime);
    synth.adsr.gain.setTargetAtTime(0, now + (synth.attackTime * 2), synth.decayTime);
  }
};
