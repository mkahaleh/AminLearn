/**
 * Science Game - Game Engine
 * Manages game state, scoring, timer, and question flow
 */
var GameEngine = (function () {
  var state = {
    currentTopic: null,
    questions: [],
    currentIndex: 0,
    score: 0,
    correctCount: 0,
    totalTime: 0,
    timePerQuestion: 15,
    timerInterval: null,
    timeLeft: 15,
    answered: false,
    topicStars: {} // persisted per-topic star ratings
  };

  var POINTS = {
    CORRECT: 10,
    FAST_BONUS: 5,   // answered in under 5 seconds
    STREAK_BONUS: 3  // 3+ correct in a row
  };

  var streak = 0;

  // ---------- Persistence ----------
  function loadProgress() {
    try {
      var data = localStorage.getItem('scienceGameProgress');
      if (data) {
        state.topicStars = JSON.parse(data);
      }
    } catch (e) {
      state.topicStars = {};
    }
  }

  function saveProgress() {
    try {
      localStorage.setItem('scienceGameProgress', JSON.stringify(state.topicStars));
    } catch (e) {
      // Storage not available
    }
  }

  // ---------- Timer ----------
  function startTimer(onTick, onTimeout) {
    state.timeLeft = state.timePerQuestion;
    updateTimerDisplay();

    state.timerInterval = setInterval(function () {
      state.timeLeft--;
      updateTimerDisplay();

      if (onTick) onTick(state.timeLeft);

      if (state.timeLeft <= 5 && state.timeLeft > 0) {
        SoundEngine.tick();
      }

      if (state.timeLeft <= 0) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
        if (onTimeout) onTimeout();
      }
    }, 1000);
  }

  function stopTimer() {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
  }

  function updateTimerDisplay() {
    var timerText = document.getElementById('timer-text');
    var timerCircle = document.getElementById('timer-circle');

    if (timerText) {
      timerText.textContent = state.timeLeft;
      timerText.className = '';
      if (state.timeLeft <= 3) {
        timerText.className = 'danger';
      } else if (state.timeLeft <= 5) {
        timerText.className = 'warning';
      }
    }

    if (timerCircle) {
      var circumference = 163.36; // 2 * PI * 26
      var offset = circumference * (1 - state.timeLeft / state.timePerQuestion);
      timerCircle.style.strokeDashoffset = offset;

      if (state.timeLeft <= 3) {
        timerCircle.style.stroke = '#EF5350';
      } else if (state.timeLeft <= 5) {
        timerCircle.style.stroke = '#FF7043';
      } else {
        timerCircle.style.stroke = '#4FC3F7';
      }
    }
  }

  // ---------- Visual Aids ----------
  function getVisualSVG(topic, questionIndex) {
    var visuals = {
      matter: [
        // Q1: Three states
        '<svg viewBox="0 0 300 200"><rect x="20" y="100" width="70" height="70" rx="4" fill="#4FC3F7" opacity="0.9"/><text x="55" y="190" text-anchor="middle" fill="#fff" font-size="12">Solid</text><ellipse cx="150" cy="140" rx="40" ry="25" fill="#4FC3F7" opacity="0.6"/><text x="150" y="190" text-anchor="middle" fill="#fff" font-size="12">Liquid</text><circle cx="245" cy="120" r="8" fill="#4FC3F7" opacity="0.3"/><circle cx="260" cy="135" r="6" fill="#4FC3F7" opacity="0.3"/><circle cx="240" cy="145" r="7" fill="#4FC3F7" opacity="0.3"/><circle cx="255" cy="110" r="5" fill="#4FC3F7" opacity="0.3"/><text x="250" y="190" text-anchor="middle" fill="#fff" font-size="12">Gas</text></svg>',
        // Q2: Ice melting
        '<svg viewBox="0 0 300 200"><rect x="50" y="80" width="60" height="60" rx="8" fill="#81D4FA"/><text x="80" y="170" text-anchor="middle" fill="#B0BEC5" font-size="14">Ice</text><text x="150" y="115" fill="#FFD93D" font-size="28">\u2192</text><ellipse cx="230" cy="120" rx="40" ry="20" fill="#4FC3F7" opacity="0.7"/><text x="230" y="170" text-anchor="middle" fill="#B0BEC5" font-size="14">Water</text></svg>'
      ],
      solar: [
        // Q1: Sun at center
        '<svg viewBox="0 0 300 200"><circle cx="150" cy="100" r="30" fill="#FFD93D"/><circle cx="150" cy="100" r="50" fill="none" stroke="#FFD93D" stroke-width="0.5" opacity="0.5"/><circle cx="200" cy="100" r="6" fill="#4FC3F7"/><circle cx="150" cy="100" r="80" fill="none" stroke="#FFD93D" stroke-width="0.5" opacity="0.3"/><circle cx="70" cy="100" r="4" fill="#FF7043"/><text x="150" y="180" text-anchor="middle" fill="#B0BEC5" font-size="13">Our Solar System</text></svg>'
      ],
      plants: [
        // Q1: Plant needs
        '<svg viewBox="0 0 300 200"><circle cx="250" cy="40" r="25" fill="#FFD93D" opacity="0.8"/><rect x="120" y="150" width="60" height="30" rx="4" fill="#8D6E63"/><rect x="145" y="80" width="10" height="70" fill="#66BB6A"/><ellipse cx="150" cy="70" rx="30" ry="22" fill="#81C784"/><path d="M100 30 Q110 50 140 70" stroke="#4FC3F7" stroke-width="2" fill="none"/><circle cx="100" cy="28" r="4" fill="#4FC3F7"/><circle cx="95" cy="35" r="3" fill="#4FC3F7"/></svg>'
      ]
    };

    if (visuals[topic] && visuals[topic][questionIndex]) {
      return visuals[topic][questionIndex];
    }
    return null;
  }

  return {
    /**
     * Start a new game with selected topic
     */
    start: function (topicKey) {
      var topicData = ScienceQuestions[topicKey];
      if (!topicData) return;

      state.currentTopic = topicKey;
      state.questions = topicData.questions.slice(); // clone
      state.currentIndex = 0;
      state.score = 0;
      state.correctCount = 0;
      state.totalTime = 0;
      state.answered = false;
      streak = 0;

      // Update UI
      document.getElementById('game-topic-title').textContent = topicData.title;
      document.getElementById('game-score').textContent = '0';

      this.loadQuestion();
    },

    /**
     * Load the current question into the UI
     */
    loadQuestion: function () {
      var q = state.questions[state.currentIndex];
      if (!q) return;

      state.answered = false;

      // Update question text
      document.getElementById('question-number').textContent = 'Question ' + (state.currentIndex + 1);
      document.getElementById('question-text').textContent = q.text;

      // Update progress
      var progress = ((state.currentIndex + 1) / state.questions.length) * 100;
      document.getElementById('progress-fill').style.width = progress + '%';
      document.getElementById('progress-text').textContent = (state.currentIndex + 1) + '/' + state.questions.length;

      // Hide hint
      var hintEl = document.getElementById('question-hint');
      hintEl.textContent = '';
      hintEl.classList.remove('visible');

      // Load answers
      for (var i = 0; i < 4; i++) {
        var btn = document.querySelector('[data-answer="' + i + '"]');
        if (btn) {
          document.getElementById('answer-' + i).textContent = q.options[i];
          btn.className = 'answer-btn focusable';
          btn.removeAttribute('disabled');
        }
      }

      // Load visual aid
      var visualContainer = document.getElementById('visual-aid');
      var svg = getVisualSVG(state.currentTopic, state.currentIndex);
      if (svg) {
        visualContainer.innerHTML = svg;
        visualContainer.classList.remove('hidden');
      } else {
        visualContainer.innerHTML = '';
        visualContainer.classList.add('hidden');
      }

      // Hide feedback
      document.getElementById('feedback-overlay').classList.remove('visible');

      // Start timer
      stopTimer();
      var self = this;
      startTimer(
        null,
        function () {
          // Timeout
          self.handleTimeout();
        }
      );

      // Unlock navigation
      TVNav.unlock();
    },

    /**
     * Handle answer selection
     */
    answer: function (answerIndex) {
      if (state.answered) return;
      state.answered = true;

      stopTimer();
      TVNav.lock();

      var q = state.questions[state.currentIndex];
      var isCorrect = answerIndex === q.correct;
      var timeUsed = state.timePerQuestion - state.timeLeft;
      state.totalTime += timeUsed;

      // Mark buttons
      var selectedBtn = document.querySelector('[data-answer="' + answerIndex + '"]');
      var correctBtn = document.querySelector('[data-answer="' + q.correct + '"]');

      // Disable all buttons
      var allBtns = document.querySelectorAll('.answer-btn');
      for (var i = 0; i < allBtns.length; i++) {
        allBtns[i].classList.add('disabled');
      }

      if (isCorrect) {
        selectedBtn.classList.add('correct');
        streak++;

        // Calculate points
        var points = POINTS.CORRECT;
        if (timeUsed < 5) points += POINTS.FAST_BONUS;
        if (streak >= 3) points += POINTS.STREAK_BONUS;

        state.score += points;
        state.correctCount++;

        SoundEngine.correct();
        this.showFeedback('correct', 'Correct!', q.explanation, '+' + points);
      } else {
        selectedBtn.classList.add('wrong');
        correctBtn.classList.add('correct');
        streak = 0;

        SoundEngine.wrong();
        this.showFeedback('wrong', 'Not Quite!', q.explanation, '+0');
      }

      // Update score display
      document.getElementById('game-score').textContent = state.score;
    },

    /**
     * Handle timeout (no answer given)
     */
    handleTimeout: function () {
      if (state.answered) return;
      state.answered = true;

      TVNav.lock();
      streak = 0;

      var q = state.questions[state.currentIndex];
      var correctBtn = document.querySelector('[data-answer="' + q.correct + '"]');
      correctBtn.classList.add('correct');

      state.totalTime += state.timePerQuestion;

      var allBtns = document.querySelectorAll('.answer-btn');
      for (var i = 0; i < allBtns.length; i++) {
        allBtns[i].classList.add('disabled');
      }

      SoundEngine.timeout();
      this.showFeedback('timeout', "Time's Up!", q.explanation, '+0');
    },

    /**
     * Show feedback overlay
     */
    showFeedback: function (type, title, text, points) {
      var overlay = document.getElementById('feedback-overlay');
      var iconEl = document.getElementById('feedback-icon');
      var titleEl = document.getElementById('feedback-title');
      var textEl = document.getElementById('feedback-text');
      var pointsEl = document.getElementById('feedback-points');

      iconEl.className = 'feedback-icon ' + type;
      if (type === 'correct') {
        iconEl.textContent = '\u2713';
        titleEl.style.color = '#66BB6A';
      } else if (type === 'wrong') {
        iconEl.textContent = '\u2717';
        titleEl.style.color = '#EF5350';
      } else {
        iconEl.textContent = '\u23F0';
        titleEl.style.color = '#FF7043';
      }

      titleEl.textContent = title;
      textEl.textContent = text;
      pointsEl.textContent = points;
      pointsEl.style.display = type === 'correct' ? 'block' : 'none';

      overlay.classList.add('visible');

      // Auto-advance after delay
      var self = this;
      setTimeout(function () {
        overlay.classList.remove('visible');
        self.nextQuestion();
      }, 2200);
    },

    /**
     * Advance to next question or show results
     */
    nextQuestion: function () {
      state.currentIndex++;

      if (state.currentIndex >= state.questions.length) {
        this.showResults();
      } else {
        this.loadQuestion();
      }
    },

    /**
     * Calculate stars based on score
     */
    calculateStars: function () {
      var percentage = state.correctCount / state.questions.length;
      if (percentage >= 0.9) return 3;
      if (percentage >= 0.7) return 2;
      if (percentage >= 0.5) return 1;
      return 0;
    },

    /**
     * Show the results screen
     */
    showResults: function () {
      var stars = this.calculateStars();
      var avgTime = state.questions.length > 0
        ? Math.round(state.totalTime / state.questions.length)
        : 0;

      // Save progress
      var prevStars = state.topicStars[state.currentTopic] || 0;
      if (stars > prevStars) {
        state.topicStars[state.currentTopic] = stars;
        saveProgress();
      }

      // Update results UI
      var titles = ['Keep Trying!', 'Good Job!', 'Great Work!', 'Amazing!'];
      document.getElementById('results-title').textContent = titles[stars];
      document.getElementById('results-subtitle').textContent =
        'You completed ' + ScienceQuestions[state.currentTopic].title;
      document.getElementById('results-score').textContent = state.score;
      document.getElementById('results-correct').textContent =
        state.correctCount + '/' + state.questions.length;
      document.getElementById('results-time').textContent = avgTime + 's';

      // Show stars with animation
      var starEls = document.querySelectorAll('.result-star');
      for (var i = 0; i < starEls.length; i++) {
        starEls[i].classList.remove('earned');
      }

      SoundEngine.complete();

      // Stagger star animations
      for (var j = 0; j < stars; j++) {
        (function (index) {
          setTimeout(function () {
            starEls[index].classList.add('earned');
            SoundEngine.star();
          }, 400 + index * 350);
        })(j);
      }

      // Show confetti for good performance
      if (stars >= 2) {
        this.spawnConfetti();
      }

      // Switch to results screen
      App.showScreen('results');
    },

    /**
     * Spawn confetti particles
     */
    spawnConfetti: function () {
      var container = document.getElementById('confetti-container');
      container.innerHTML = '';
      var colors = ['#FFD93D', '#4FC3F7', '#66BB6A', '#FF7043', '#AB47BC', '#EC407A'];

      for (var i = 0; i < 50; i++) {
        var piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = Math.random() * 2 + 's';
        piece.style.animationDuration = (2 + Math.random() * 2) + 's';
        piece.style.width = (6 + Math.random() * 8) + 'px';
        piece.style.height = (12 + Math.random() * 12) + 'px';
        container.appendChild(piece);
      }
    },

    /**
     * Get current state
     */
    getState: function () {
      return state;
    },

    /**
     * Get star count for a topic
     */
    getTopicStars: function (topicKey) {
      return state.topicStars[topicKey] || 0;
    },

    /**
     * Get total stars across all topics
     */
    getTotalStars: function () {
      var total = 0;
      for (var key in state.topicStars) {
        if (state.topicStars.hasOwnProperty(key)) {
          total += state.topicStars[key];
        }
      }
      return total;
    },

    /**
     * Load saved progress
     */
    loadProgress: loadProgress,

    /**
     * Stop the current timer
     */
    stopTimer: stopTimer
  };
})();
