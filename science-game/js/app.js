/**
 * Science Game - App Controller v2.0
 * Optimized: cached DOM, DocumentFragment batch ops, event delegation
 */
var App = (function () {
  'use strict';

  var currentScreen = 'splash';
  var currentTopic = null;

  // Pre-cache screen elements
  var screens = {};
  function cacheScreens() {
    screens.splash = document.getElementById('screen-splash');
    screens.menu = document.getElementById('screen-menu');
    screens.game = document.getElementById('screen-game');
    screens.results = document.getElementById('screen-results');
  }

  function showScreen(screenId) {
    for (var key in screens) {
      if (screens.hasOwnProperty(key)) {
        screens[key].classList.remove('active');
      }
    }

    if (screens[screenId]) {
      screens[screenId].classList.add('active');
      currentScreen = screenId;
    }

    switch (screenId) {
      case 'menu': initMenuNav(); updateMenuStars(); break;
      case 'game': initGameNav(); break;
      case 'results': initResultsNav(); break;
    }
  }

  // ---------- Splash ----------
  function initSplash() {
    var container = document.getElementById('stars-container');
    var frag = document.createDocumentFragment();

    for (var i = 0; i < 50; i++) {
      var star = document.createElement('div');
      star.className = i % 8 === 0 ? 'star-particle large' : 'star-particle';
      var s = star.style;
      s.left = (Math.random() * 100) + '%';
      s.top = (Math.random() * 100) + '%';
      s.animationDelay = (Math.random() * 3) + 's';
      s.animationDuration = (1.5 + Math.random() * 2) + 's';
      frag.appendChild(star);
    }
    container.appendChild(frag);

    // Loading bar with RAF
    var fill = document.getElementById('loading-fill');
    var progress = 0;
    var loadId = setInterval(function () {
      progress += (Math.random() * 18) + 6;
      if (progress >= 100) {
        progress = 100;
        clearInterval(loadId);
        setTimeout(function () { showScreen('menu'); }, 350);
      }
      fill.style.width = progress + '%';
    }, 180);
  }

  // ---------- Menu ----------
  function initMenuNav() {
    createMenuParticles();

    TVNav.init('screen-menu', function (el) {
      var topic = el.getAttribute('data-topic');
      if (topic) {
        currentTopic = topic;
        SoundEngine.select();
        startGame(topic);
      }
    }, function () {
      exitApp();
    });
  }

  var particlesCreated = false;
  function createMenuParticles() {
    if (particlesCreated) return;
    particlesCreated = true;

    var container = document.getElementById('menu-particles');
    var frag = document.createDocumentFragment();
    var colors = ['#4FC3F7', '#FFD740', '#69F0AE', '#FF6E40', '#B388FF'];

    for (var i = 0; i < 12; i++) {
      var p = document.createElement('div');
      p.className = 'particle';
      var size = (20 + Math.random() * 36) + 'px';
      var s = p.style;
      s.width = size;
      s.height = size;
      s.left = (Math.random() * 100) + '%';
      s.top = (Math.random() * 100) + '%';
      s.backgroundColor = colors[(Math.random() * 5) | 0];
      s.animationDelay = (Math.random() * 5) + 's';
      s.animationDuration = (7 + Math.random() * 6) + 's';
      frag.appendChild(p);
    }
    container.appendChild(frag);
  }

  function updateMenuStars() {
    var topics = ['matter', 'solar', 'plants', 'animals', 'body', 'weather'];
    var totalStars = 0;

    for (var t = 0; t < topics.length; t++) {
      var topic = topics[t];
      var stars = GameEngine.getTopicStars(topic);
      totalStars += stars;

      var container = document.getElementById('stars-' + topic);
      if (container) {
        var els = container.querySelectorAll('.star');
        for (var i = 0; i < els.length; i++) {
          if (i < stars) els[i].classList.remove('empty');
          else els[i].classList.add('empty');
        }
      }
    }
    document.getElementById('menu-total-stars').textContent = totalStars;
  }

  // ---------- Game ----------
  function startGame(topicKey) {
    showScreen('game');
    GameEngine.start(topicKey);

    setTimeout(function () {
      var btn = document.querySelector('#screen-game .answer-btn');
      if (btn) TVNav.focusElement(btn);
    }, 80);
  }

  function initGameNav() {
    TVNav.init('screen-game', function (el) {
      var idx = el.getAttribute('data-answer');
      if (idx !== null) {
        GameEngine.answer(parseInt(idx, 10));
      }
      if (el.id === 'btn-back') {
        GameEngine.stopTimer();
        showScreen('menu');
      }
    }, function () {
      GameEngine.stopTimer();
      showScreen('menu');
    });

    var btn = document.querySelector('#screen-game .answer-btn');
    if (btn) TVNav.focusElement(btn);
  }

  // ---------- Results ----------
  function initResultsNav() {
    TVNav.init('screen-results', function (el) {
      if (el.id === 'btn-retry') startGame(currentTopic);
      else if (el.id === 'btn-menu') showScreen('menu');
    }, function () {
      showScreen('menu');
    });
  }

  // ---------- Lifecycle ----------
  function exitApp() {
    if (typeof tizen !== 'undefined' && tizen.application) {
      try { tizen.application.getCurrentApplication().exit(); } catch (e) {}
    }
  }

  function init() {
    cacheScreens();
    SoundEngine.init();
    GameEngine.loadProgress();
    TVNav.start();
    initSplash();

    // Pause timer on visibility change
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) GameEngine.stopTimer();
    }, false);

    // Mouse/touch click delegation for browser testing
    document.addEventListener('click', function (e) {
      var el = e.target.closest('.focusable');
      if (!el) return;

      SoundEngine.init();
      TVNav.focusElement(el);

      var idx = el.getAttribute('data-answer');
      if (idx !== null && currentScreen === 'game') {
        GameEngine.answer(parseInt(idx, 10));
      } else if (el.getAttribute('data-topic')) {
        currentTopic = el.getAttribute('data-topic');
        startGame(currentTopic);
      } else if (el.id === 'btn-back') {
        GameEngine.stopTimer();
        showScreen('menu');
      } else if (el.id === 'btn-retry') {
        startGame(currentTopic);
      } else if (el.id === 'btn-menu') {
        showScreen('menu');
      }
    }, false);
  }

  return {
    init: init,
    showScreen: showScreen,
    getCurrentScreen: function () { return currentScreen; }
  };
})();

document.addEventListener('DOMContentLoaded', function () {
  App.init();
}, false);
