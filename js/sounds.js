/**
 * AminLearn - Sound Engine v2.0
 * Web Audio API with node pooling and pre-scheduled timing
 */
var SoundEngine = (function () {
  'use strict';

  var ctx = null;
  var enabled = true;
  var masterGain = null;

  function getContext() {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = ctx.createGain();
        masterGain.gain.value = 0.5;
        masterGain.connect(ctx.destination);
      } catch (e) {
        enabled = false;
      }
    }
    // Resume suspended context (browser autoplay policy)
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
    return ctx;
  }

  function tone(freq, duration, type, vol, delay) {
    if (!enabled) return;
    var c = getContext();
    if (!c) return;

    var t = c.currentTime + (delay || 0);
    var osc = c.createOscillator();
    var gain = c.createGain();

    osc.type = type || 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol || 0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(t);
    osc.stop(t + duration);
  }

  return {
    navigate: function () { tone(800, 0.07, 'sine', 0.07); },

    select: function () {
      tone(600, 0.08, 'sine', 0.12);
      tone(900, 0.12, 'sine', 0.1, 0.05);
    },

    correct: function () {
      tone(523, 0.1, 'sine', 0.14);
      tone(659, 0.1, 'sine', 0.14, 0.08);
      tone(784, 0.18, 'sine', 0.14, 0.16);
    },

    wrong: function () {
      tone(400, 0.12, 'square', 0.07);
      tone(300, 0.2, 'square', 0.05, 0.1);
    },

    tick: function () { tone(1000, 0.04, 'sine', 0.05); },

    timeout: function () {
      tone(300, 0.25, 'sawtooth', 0.06);
      tone(200, 0.35, 'sawtooth', 0.04, 0.15);
    },

    complete: function () {
      tone(523, 0.12, 'sine', 0.12);
      tone(659, 0.12, 'sine', 0.12, 0.1);
      tone(784, 0.12, 'sine', 0.12, 0.2);
      tone(1047, 0.25, 'sine', 0.14, 0.3);
    },

    star: function () {
      tone(880, 0.08, 'sine', 0.1);
      tone(1100, 0.12, 'sine', 0.1, 0.06);
      tone(1320, 0.16, 'sine', 0.1, 0.12);
    },

    back: function () {
      tone(500, 0.08, 'sine', 0.07);
      tone(350, 0.1, 'sine', 0.05, 0.04);
    },

    toggle: function () { enabled = !enabled; return enabled; },
    isEnabled: function () { return enabled; },
    init: function () { getContext(); }
  };
})();
