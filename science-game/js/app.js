/**
 * Science Game - Main Application Controller
 * Manages screen transitions, initialization, and app lifecycle
 * Optimized for Samsung Tizen TV platform
 */
var App = (function () {
  var currentScreen = 'splash';
  var currentTopic = null;

  // ---------- Screen Management ----------
  function showScreen(screenId) {
    // Hide all screens
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) {
      screens[i].classList.remove('active');
    }

    // Show target screen
    var target = document.getElementById('screen-' + screenId);
    if (target) {
      target.classList.add('active');
      currentScreen = screenId;
    }

    // Initialize navigation for the screen
    switch (screenId) {
      case 'menu':
        initMenuNav();
        updateMenuStars();
        break;
      case 'game':
        initGameNav();
        break;
      case 'results':
        initResultsNav();
        break;
    }
  }

  // ---------- Splash Screen ----------
  function initSplash() {
    // Create star particles
    var container = document.getElementById('stars-container');
    for (var i = 0; i < 60; i++) {
      var star = document.createElement('div');
      star.className = 'star-particle';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 3 + 's';
      star.style.animationDuration = (1.5 + Math.random() * 2) + 's';
      container.appendChild(star);
    }

    // Animate loading bar
    var fill = document.getElementById('loading-fill');
    var progress = 0;
    var loadInterval = setInterval(function () {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(loadInterval);
        // Transition to menu after brief pause
        setTimeout(function () {
          showScreen('menu');
        }, 400);
      }
      fill.style.width = progress + '%';
    }, 200);
  }

  // ---------- Menu Screen ----------
  function initMenuNav() {
    // Create floating particles
    createMenuParticles();

    TVNav.init('screen-menu', function (el) {
      // Handle selection
      var topic = el.getAttribute('data-topic');
      if (topic) {
        currentTopic = topic;
        SoundEngine.select();
        startGame(topic);
      }
    }, function () {
      // Back = exit app (on real TV)
      exitApp();
    });
  }

  function createMenuParticles() {
    var container = document.getElementById('menu-particles');
    if (container.children.length > 0) return; // Already created

    var colors = ['#4FC3F7', '#FFD93D', '#66BB6A', '#FF7043', '#AB47BC'];
    for (var i = 0; i < 15; i++) {
      var p = document.createElement('div');
      p.className = 'particle';
      p.style.width = (20 + Math.random() * 40) + 'px';
      p.style.height = p.style.width;
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDelay = Math.random() * 5 + 's';
      p.style.animationDuration = (6 + Math.random() * 6) + 's';
      container.appendChild(p);
    }
  }

  function updateMenuStars() {
    var topics = ['matter', 'solar', 'plants', 'animals', 'body', 'weather'];
    var totalStars = 0;

    topics.forEach(function (topic) {
      var stars = GameEngine.getTopicStars(topic);
      totalStars += stars;

      var container = document.getElementById('stars-' + topic);
      if (container) {
        var starEls = container.querySelectorAll('.star');
        for (var i = 0; i < starEls.length; i++) {
          if (i < stars) {
            starEls[i].classList.remove('empty');
          } else {
            starEls[i].classList.add('empty');
          }
        }
      }
    });

    document.getElementById('menu-total-stars').textContent = totalStars;
  }

  // ---------- Game Screen ----------
  function startGame(topicKey) {
    showScreen('game');
    GameEngine.start(topicKey);

    // Focus first answer after brief delay for animation
    setTimeout(function () {
      var firstAnswer = document.querySelector('#screen-game .answer-btn');
      if (firstAnswer) {
        TVNav.focusElement(firstAnswer);
      }
    }, 100);
  }

  function initGameNav() {
    TVNav.init('screen-game', function (el) {
      // Handle answer selection or back button
      var answerIndex = el.getAttribute('data-answer');
      if (answerIndex !== null) {
        GameEngine.answer(parseInt(answerIndex, 10));
      }

      if (el.id === 'btn-back') {
        GameEngine.stopTimer();
        showScreen('menu');
      }
    }, function () {
      // Back button = return to menu
      GameEngine.stopTimer();
      showScreen('menu');
    });

    // Focus first answer
    var firstAnswer = document.querySelector('#screen-game .answer-btn');
    if (firstAnswer) {
      TVNav.focusElement(firstAnswer);
    }
  }

  // ---------- Results Screen ----------
  function initResultsNav() {
    TVNav.init('screen-results', function (el) {
      if (el.id === 'btn-retry') {
        startGame(currentTopic);
      } else if (el.id === 'btn-menu') {
        showScreen('menu');
      }
    }, function () {
      showScreen('menu');
    });
  }

  // ---------- App Lifecycle ----------
  function exitApp() {
    // Samsung Tizen exit
    if (typeof tizen !== 'undefined' && tizen.application) {
      try {
        tizen.application.getCurrentApplication().exit();
      } catch (e) {
        // Fallback - do nothing in browser
      }
    }
  }

  // ---------- Initialization ----------
  function init() {
    // Initialize sound engine
    SoundEngine.init();

    // Load saved progress
    GameEngine.loadProgress();

    // Start navigation system
    TVNav.start();

    // Start with splash screen
    initSplash();

    // Handle Samsung TV visibility change
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        GameEngine.stopTimer();
      }
    });

    // Handle mouse/touch for testing in browser
    document.addEventListener('click', function (e) {
      var target = e.target.closest('.focusable');
      if (target) {
        SoundEngine.init(); // Ensure audio context is active
        TVNav.focusElement(target);
        // Simulate OK press
        var answerIndex = target.getAttribute('data-answer');
        if (answerIndex !== null && currentScreen === 'game') {
          GameEngine.answer(parseInt(answerIndex, 10));
        } else if (target.getAttribute('data-topic')) {
          currentTopic = target.getAttribute('data-topic');
          startGame(currentTopic);
        } else if (target.id === 'btn-back') {
          GameEngine.stopTimer();
          showScreen('menu');
        } else if (target.id === 'btn-retry') {
          startGame(currentTopic);
        } else if (target.id === 'btn-menu') {
          showScreen('menu');
        }
      }
    });
  }

  // ---------- Public API ----------
  return {
    init: init,
    showScreen: showScreen,
    getCurrentScreen: function () { return currentScreen; }
  };
})();

// Boot the application when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  App.init();
});
