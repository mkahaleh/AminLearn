/**
 * Science Game - Sound Effects Engine
 * Uses Web Audio API for lightweight, instant sound generation
 * No external audio files needed - all sounds synthesized in real-time
 */
var SoundEngine = (function () {
  var ctx = null;
  var enabled = true;

  function getContext() {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        enabled = false;
      }
    }
    return ctx;
  }

  function playTone(freq, duration, type, volume, delay) {
    if (!enabled) return;
    var c = getContext();
    if (!c) return;

    var osc = c.createOscillator();
    var gain = c.createGain();

    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, c.currentTime + (delay || 0));
    gain.gain.setValueAtTime(volume || 0.15, c.currentTime + (delay || 0));
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + (delay || 0) + duration);

    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(c.currentTime + (delay || 0));
    osc.stop(c.currentTime + (delay || 0) + duration);
  }

  function playNoise(duration, volume) {
    if (!enabled) return;
    var c = getContext();
    if (!c) return;

    var bufferSize = c.sampleRate * duration;
    var buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (volume || 0.05);
    }
    var source = c.createBufferSource();
    source.buffer = buffer;

    var gain = c.createGain();
    gain.gain.setValueAtTime(volume || 0.05, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);

    source.connect(gain);
    gain.connect(c.destination);
    source.start();
  }

  return {
    /** Navigate / move focus sound */
    navigate: function () {
      playTone(800, 0.08, 'sine', 0.08);
    },

    /** Select / confirm action */
    select: function () {
      playTone(600, 0.1, 'sine', 0.12);
      playTone(900, 0.15, 'sine', 0.1, 0.06);
    },

    /** Correct answer - happy ascending tones */
    correct: function () {
      playTone(523, 0.12, 'sine', 0.15);
      playTone(659, 0.12, 'sine', 0.15, 0.1);
      playTone(784, 0.2, 'sine', 0.15, 0.2);
    },

    /** Wrong answer - descending tone */
    wrong: function () {
      playTone(400, 0.15, 'square', 0.08);
      playTone(300, 0.25, 'square', 0.06, 0.12);
    },

    /** Time running out warning beep */
    tick: function () {
      playTone(1000, 0.05, 'sine', 0.06);
    },

    /** Time's up */
    timeout: function () {
      playTone(300, 0.3, 'sawtooth', 0.08);
      playTone(200, 0.4, 'sawtooth', 0.06, 0.2);
    },

    /** Level complete fanfare */
    complete: function () {
      playTone(523, 0.15, 'sine', 0.12);
      playTone(659, 0.15, 'sine', 0.12, 0.12);
      playTone(784, 0.15, 'sine', 0.12, 0.24);
      playTone(1047, 0.3, 'sine', 0.15, 0.36);
    },

    /** Star earned */
    star: function () {
      playTone(880, 0.1, 'sine', 0.12);
      playTone(1100, 0.15, 'sine', 0.1, 0.08);
      playTone(1320, 0.2, 'sine', 0.12, 0.16);
    },

    /** Back / cancel */
    back: function () {
      playTone(500, 0.1, 'sine', 0.08);
      playTone(350, 0.12, 'sine', 0.06, 0.05);
    },

    /** Enable/disable sound */
    toggle: function () {
      enabled = !enabled;
      return enabled;
    },

    isEnabled: function () {
      return enabled;
    },

    /** Initialize audio context on user interaction */
    init: function () {
      getContext();
    }
  };
})();
