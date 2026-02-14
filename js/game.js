/**
 * AminLearn - Game Engine v2.0
 * Performance: RAF-based smooth timer, cached DOM refs, batch updates
 */
var GameEngine = (function () {
  'use strict';

  // ---------- Cached DOM References ----------
  var DOM = {};
  function cacheDOM() {
    DOM.topicTitle = document.getElementById('game-topic-title');
    DOM.score = document.getElementById('game-score');
    DOM.questionNumber = document.getElementById('question-number');
    DOM.questionText = document.getElementById('question-text');
    DOM.questionHint = document.getElementById('question-hint');
    DOM.progressFill = document.getElementById('progress-fill');
    DOM.progressText = document.getElementById('progress-text');
    DOM.visualAid = document.getElementById('visual-aid');
    DOM.feedbackOverlay = document.getElementById('feedback-overlay');
    DOM.feedbackIcon = document.getElementById('feedback-icon');
    DOM.feedbackTitle = document.getElementById('feedback-title');
    DOM.feedbackText = document.getElementById('feedback-text');
    DOM.feedbackPoints = document.getElementById('feedback-points');
    DOM.timerText = document.getElementById('timer-text');
    DOM.timerCircle = document.getElementById('timer-circle');
    DOM.confetti = document.getElementById('confetti-container');
    DOM.answerBtns = [];
    DOM.answerTexts = [];
    for (var i = 0; i < 4; i++) {
      DOM.answerBtns[i] = document.querySelector('[data-answer="' + i + '"]');
      DOM.answerTexts[i] = document.getElementById('answer-' + i);
    }
  }

  // ---------- State ----------
  var state = {
    currentTopic: null,
    questions: [],
    currentIndex: 0,
    score: 0,
    correctCount: 0,
    totalTime: 0,
    timePerQuestion: 15,
    timeLeft: 15,
    answered: false,
    topicStars: {}
  };

  var POINTS = { CORRECT: 10, FAST_BONUS: 5, STREAK_BONUS: 3 };
  var streak = 0;
  var CIRCUMFERENCE = 163.36; // 2 * PI * 26

  // ---------- RAF Timer ----------
  var timerRAF = null;
  var timerStart = 0;
  var timerDuration = 0;
  var lastTickSecond = -1;
  var onTimerTimeout = null;

  function startTimer(onTimeout) {
    stopTimer();
    state.timeLeft = state.timePerQuestion;
    timerDuration = state.timePerQuestion * 1000;
    timerStart = performance.now();
    lastTickSecond = state.timePerQuestion;
    onTimerTimeout = onTimeout;
    updateTimerRing(1);
    updateTimerText(state.timePerQuestion);
    timerRAF = requestAnimationFrame(tickTimer);
  }

  function tickTimer(now) {
    var elapsed = now - timerStart;
    var remaining = timerDuration - elapsed;
    if (remaining < 0) remaining = 0;

    var secondsLeft = Math.ceil(remaining / 1000);
    state.timeLeft = secondsLeft;

    // Smooth ring animation every frame
    var fraction = remaining / timerDuration;
    updateTimerRing(fraction);

    // Only update text when second changes
    if (secondsLeft !== lastTickSecond) {
      lastTickSecond = secondsLeft;
      updateTimerText(secondsLeft);

      if (secondsLeft <= 5 && secondsLeft > 0) {
        SoundEngine.tick();
      }
    }

    if (remaining <= 0) {
      timerRAF = null;
      if (onTimerTimeout) onTimerTimeout();
      return;
    }

    timerRAF = requestAnimationFrame(tickTimer);
  }

  function stopTimer() {
    if (timerRAF) {
      cancelAnimationFrame(timerRAF);
      timerRAF = null;
    }
    onTimerTimeout = null;
  }

  function updateTimerRing(fraction) {
    if (!DOM.timerCircle) return;
    DOM.timerCircle.style.strokeDashoffset = CIRCUMFERENCE * (1 - fraction);

    var color;
    if (fraction <= 0.2) color = '#FF5252';
    else if (fraction <= 0.33) color = '#FF6E40';
    else color = '#4FC3F7';
    DOM.timerCircle.style.stroke = color;
  }

  function updateTimerText(seconds) {
    if (!DOM.timerText) return;
    DOM.timerText.textContent = seconds;
    if (seconds <= 3) DOM.timerText.className = 'danger';
    else if (seconds <= 5) DOM.timerText.className = 'warning';
    else DOM.timerText.className = '';
  }

  // ---------- Visual Aids ----------
  var visuals = {
    matter: [
      '<svg viewBox="0 0 300 200"><rect x="20" y="100" width="70" height="70" rx="4" fill="#4FC3F7" opacity="0.9"/><text x="55" y="190" text-anchor="middle" fill="#9BA4C4" font-size="12">Solid</text><ellipse cx="150" cy="140" rx="40" ry="25" fill="#4FC3F7" opacity="0.6"/><text x="150" y="190" text-anchor="middle" fill="#9BA4C4" font-size="12">Liquid</text><circle cx="245" cy="120" r="8" fill="#4FC3F7" opacity="0.3"/><circle cx="260" cy="135" r="6" fill="#4FC3F7" opacity="0.3"/><circle cx="240" cy="145" r="7" fill="#4FC3F7" opacity="0.3"/><circle cx="255" cy="110" r="5" fill="#4FC3F7" opacity="0.3"/><text x="250" y="190" text-anchor="middle" fill="#9BA4C4" font-size="12">Gas</text></svg>',
      '<svg viewBox="0 0 300 200"><rect x="50" y="80" width="60" height="60" rx="8" fill="#81D4FA"/><text x="80" y="170" text-anchor="middle" fill="#9BA4C4" font-size="14">Ice</text><text x="150" y="115" fill="#FFD740" font-size="28">\u2192</text><ellipse cx="230" cy="120" rx="40" ry="20" fill="#4FC3F7" opacity="0.7"/><text x="230" y="170" text-anchor="middle" fill="#9BA4C4" font-size="14">Water</text></svg>'
    ],
    solar: [
      '<svg viewBox="0 0 300 200"><circle cx="150" cy="100" r="30" fill="#FFD740"/><circle cx="150" cy="100" r="50" fill="none" stroke="#FFD740" stroke-width="0.5" opacity="0.5"/><circle cx="200" cy="100" r="6" fill="#4FC3F7"/><circle cx="150" cy="100" r="80" fill="none" stroke="#FFD740" stroke-width="0.5" opacity="0.3"/><circle cx="70" cy="100" r="4" fill="#FF6E40"/><text x="150" y="180" text-anchor="middle" fill="#9BA4C4" font-size="13">Our Solar System</text></svg>'
    ],
    plants: [
      '<svg viewBox="0 0 300 200"><circle cx="250" cy="40" r="25" fill="#FFD740" opacity="0.8"/><rect x="120" y="150" width="60" height="30" rx="4" fill="#8D6E63"/><rect x="145" y="80" width="10" height="70" fill="#69F0AE"/><ellipse cx="150" cy="70" rx="30" ry="22" fill="#66BB6A"/><path d="M100 30 Q110 50 140 70" stroke="#4FC3F7" stroke-width="2" fill="none"/><circle cx="100" cy="28" r="4" fill="#4FC3F7"/><circle cx="95" cy="35" r="3" fill="#4FC3F7"/></svg>'
    ]
  };

  // ---------- Persistence ----------
  function loadProgress() {
    try {
      var d = localStorage.getItem('aminLearnProgress');
      if (d) state.topicStars = JSON.parse(d);
    } catch (e) { state.topicStars = {}; }
  }

  function saveProgress() {
    try {
      localStorage.setItem('aminLearnProgress', JSON.stringify(state.topicStars));
    } catch (e) {}
  }

  // ---------- Confetti (DocumentFragment batch) ----------
  function spawnConfetti() {
    DOM.confetti.textContent = '';
    var frag = document.createDocumentFragment();
    var colors = ['#FFD740', '#4FC3F7', '#69F0AE', '#FF6E40', '#B388FF', '#FF4081'];

    for (var i = 0; i < 40; i++) {
      var p = document.createElement('div');
      p.className = 'confetti-piece';
      var s = p.style;
      s.left = (Math.random() * 100) + '%';
      s.backgroundColor = colors[(Math.random() * 6) | 0];
      s.animationDelay = (Math.random() * 1.8) + 's';
      s.animationDuration = (2.2 + Math.random() * 1.8) + 's';
      s.width = (6 + Math.random() * 8) + 'px';
      s.height = (12 + Math.random() * 10) + 'px';
      frag.appendChild(p);
    }
    DOM.confetti.appendChild(frag);
  }

  return {
    cacheDOM: cacheDOM,

    start: function (topicKey) {
      var topicData = ScienceQuestions[topicKey];
      if (!topicData) return;

      if (!DOM.topicTitle) cacheDOM();

      state.currentTopic = topicKey;
      state.questions = topicData.questions.slice();
      state.currentIndex = 0;
      state.score = 0;
      state.correctCount = 0;
      state.totalTime = 0;
      state.answered = false;
      streak = 0;

      DOM.topicTitle.textContent = topicData.title;
      DOM.score.textContent = '0';

      this.loadQuestion();
    },

    loadQuestion: function () {
      var q = state.questions[state.currentIndex];
      if (!q) return;

      state.answered = false;

      // Batch DOM writes
      DOM.questionNumber.textContent = 'Question ' + (state.currentIndex + 1);
      DOM.questionText.textContent = q.text;

      var pct = ((state.currentIndex + 1) / state.questions.length) * 100;
      DOM.progressFill.style.width = pct + '%';
      DOM.progressText.textContent = (state.currentIndex + 1) + '/' + state.questions.length;

      DOM.questionHint.textContent = '';
      DOM.questionHint.classList.remove('visible');

      for (var i = 0; i < 4; i++) {
        DOM.answerTexts[i].textContent = q.options[i];
        DOM.answerBtns[i].className = 'answer-btn focusable';
        DOM.answerBtns[i].removeAttribute('disabled');
      }

      // Visual aid
      var svg = visuals[state.currentTopic] && visuals[state.currentTopic][state.currentIndex];
      if (svg) {
        DOM.visualAid.innerHTML = svg;
        DOM.visualAid.classList.remove('hidden');
      } else {
        DOM.visualAid.innerHTML = '';
        DOM.visualAid.classList.add('hidden');
      }

      DOM.feedbackOverlay.classList.remove('visible');

      var self = this;
      startTimer(function () { self.handleTimeout(); });

      TVNav.unlock();
    },

    answer: function (answerIndex) {
      if (state.answered) return;
      state.answered = true;

      stopTimer();
      TVNav.lock();

      var q = state.questions[state.currentIndex];
      var isCorrect = answerIndex === q.correct;
      var timeUsed = state.timePerQuestion - state.timeLeft;
      state.totalTime += timeUsed;

      // Disable all, mark correct/wrong
      for (var i = 0; i < 4; i++) {
        DOM.answerBtns[i].classList.add('disabled');
      }

      if (isCorrect) {
        DOM.answerBtns[answerIndex].classList.add('correct');
        streak++;
        var pts = POINTS.CORRECT;
        if (timeUsed < 5) pts += POINTS.FAST_BONUS;
        if (streak >= 3) pts += POINTS.STREAK_BONUS;
        state.score += pts;
        state.correctCount++;
        SoundEngine.correct();
        this.showFeedback('correct', 'Correct!', q.explanation, '+' + pts);
      } else {
        DOM.answerBtns[answerIndex].classList.add('wrong');
        DOM.answerBtns[q.correct].classList.add('correct');
        streak = 0;
        SoundEngine.wrong();
        this.showFeedback('wrong', 'Not Quite!', q.explanation, '+0');
      }

      DOM.score.textContent = state.score;
    },

    handleTimeout: function () {
      if (state.answered) return;
      state.answered = true;
      TVNav.lock();
      streak = 0;

      var q = state.questions[state.currentIndex];
      DOM.answerBtns[q.correct].classList.add('correct');
      state.totalTime += state.timePerQuestion;

      for (var i = 0; i < 4; i++) {
        DOM.answerBtns[i].classList.add('disabled');
      }

      SoundEngine.timeout();
      this.showFeedback('timeout', "Time's Up!", q.explanation, '+0');
    },

    showFeedback: function (type, title, text, points) {
      DOM.feedbackIcon.className = 'feedback-icon ' + type;
      var icons = { correct: '\u2713', wrong: '\u2717', timeout: '\u23F0' };
      var colors = { correct: '#69F0AE', wrong: '#FF5252', timeout: '#FF6E40' };
      DOM.feedbackIcon.textContent = icons[type];
      DOM.feedbackTitle.style.color = colors[type];
      DOM.feedbackTitle.textContent = title;
      DOM.feedbackText.textContent = text;
      DOM.feedbackPoints.textContent = points;
      DOM.feedbackPoints.style.display = type === 'correct' ? 'block' : 'none';
      DOM.feedbackOverlay.classList.add('visible');

      var self = this;
      setTimeout(function () {
        DOM.feedbackOverlay.classList.remove('visible');
        self.nextQuestion();
      }, 2000);
    },

    nextQuestion: function () {
      state.currentIndex++;
      if (state.currentIndex >= state.questions.length) {
        this.showResults();
      } else {
        this.loadQuestion();
      }
    },

    calculateStars: function () {
      var pct = state.correctCount / state.questions.length;
      if (pct >= 0.9) return 3;
      if (pct >= 0.7) return 2;
      if (pct >= 0.5) return 1;
      return 0;
    },

    showResults: function () {
      var stars = this.calculateStars();
      var avgTime = state.questions.length > 0 ? Math.round(state.totalTime / state.questions.length) : 0;

      var prev = state.topicStars[state.currentTopic] || 0;
      if (stars > prev) {
        state.topicStars[state.currentTopic] = stars;
        saveProgress();
      }

      var titles = ['Keep Trying!', 'Good Job!', 'Great Work!', 'Amazing!'];
      document.getElementById('results-title').textContent = titles[stars];
      document.getElementById('results-subtitle').textContent = 'You completed ' + ScienceQuestions[state.currentTopic].title;
      document.getElementById('results-score').textContent = state.score;
      document.getElementById('results-correct').textContent = state.correctCount + '/' + state.questions.length;
      document.getElementById('results-time').textContent = avgTime + 's';

      var starEls = document.querySelectorAll('.result-star');
      for (var i = 0; i < starEls.length; i++) starEls[i].classList.remove('earned');

      SoundEngine.complete();

      for (var j = 0; j < stars; j++) {
        (function (idx) {
          setTimeout(function () {
            starEls[idx].classList.add('earned');
            SoundEngine.star();
          }, 400 + idx * 350);
        })(j);
      }

      if (stars >= 2) spawnConfetti();

      App.showScreen('results');
    },

    getState: function () { return state; },
    getTopicStars: function (key) { return state.topicStars[key] || 0; },
    getTotalStars: function () {
      var t = 0;
      for (var k in state.topicStars) {
        if (state.topicStars.hasOwnProperty(k)) t += state.topicStars[k];
      }
      return t;
    },
    loadProgress: loadProgress,
    stopTimer: stopTimer
  };
})();
