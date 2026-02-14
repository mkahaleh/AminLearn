/**
 * Science Game - Samsung TV D-pad Navigation System
 * Implements spatial navigation for Samsung TV remote control
 * Supports: Arrow keys (D-pad), Enter (OK), Backspace/ESC (Back), Color buttons
 *
 * Samsung TV Remote Key Codes:
 * - Arrow keys: 37(Left), 38(Up), 39(Right), 40(Down)
 * - Enter/OK: 13
 * - Back: 10009 (Tizen) or 8/27 (browser)
 * - Color buttons: Red=403, Green=404, Yellow=405, Blue=406
 */
var TVNav = (function () {
  var currentScreen = null;
  var focusedElement = null;
  var onSelect = null;
  var onBack = null;
  var navLocked = false;

  // Samsung Tizen key codes
  var KEY = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    ENTER: 13,
    BACK_TIZEN: 10009,
    BACK_BROWSER: 8,
    ESC: 27,
    RED: 403,
    GREEN: 404,
    YELLOW: 405,
    BLUE: 406
  };

  /**
   * Get all focusable elements in the current active screen
   */
  function getFocusables() {
    if (!currentScreen) return [];
    return Array.prototype.slice.call(
      currentScreen.querySelectorAll('.focusable:not(.disabled):not([disabled])')
    );
  }

  /**
   * Set visual focus on an element
   */
  function setFocus(el) {
    if (!el) return;

    // Remove focus from previous element
    if (focusedElement) {
      focusedElement.classList.remove('focused');
      focusedElement.blur();
    }

    // Set focus on new element
    focusedElement = el;
    focusedElement.classList.add('focused');
    focusedElement.focus({ preventScroll: true });

    // Play navigation sound
    SoundEngine.navigate();

    // Ensure element is visible
    scrollIntoViewIfNeeded(el);
  }

  function scrollIntoViewIfNeeded(el) {
    // TV apps typically don't scroll, but safety check
    if (el.scrollIntoViewIfNeeded) {
      el.scrollIntoViewIfNeeded(false);
    }
  }

  /**
   * Find the nearest focusable element in a given direction
   * Uses spatial navigation algorithm based on element positions
   */
  function findNearest(direction) {
    var items = getFocusables();
    if (items.length === 0) return null;
    if (!focusedElement) return items[0];

    var rect = focusedElement.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;

    var best = null;
    var bestScore = Infinity;

    for (var i = 0; i < items.length; i++) {
      if (items[i] === focusedElement) continue;

      var r = items[i].getBoundingClientRect();
      var ix = r.left + r.width / 2;
      var iy = r.top + r.height / 2;
      var dx = ix - cx;
      var dy = iy - cy;

      var valid = false;
      var primaryDist = 0;
      var secondaryDist = 0;

      switch (direction) {
        case 'left':
          if (dx < -5) { valid = true; primaryDist = Math.abs(dx); secondaryDist = Math.abs(dy); }
          break;
        case 'right':
          if (dx > 5) { valid = true; primaryDist = Math.abs(dx); secondaryDist = Math.abs(dy); }
          break;
        case 'up':
          if (dy < -5) { valid = true; primaryDist = Math.abs(dy); secondaryDist = Math.abs(dx); }
          break;
        case 'down':
          if (dy > 5) { valid = true; primaryDist = Math.abs(dy); secondaryDist = Math.abs(dx); }
          break;
      }

      if (valid) {
        // Score: prioritize primary direction, penalize perpendicular offset
        var score = primaryDist + secondaryDist * 3;
        if (score < bestScore) {
          bestScore = score;
          best = items[i];
        }
      }
    }

    return best;
  }

  /**
   * Handle key press events
   */
  function handleKeyDown(e) {
    if (navLocked) return;

    var keyCode = e.keyCode;

    switch (keyCode) {
      case KEY.LEFT:
        e.preventDefault();
        var leftEl = findNearest('left');
        if (leftEl) setFocus(leftEl);
        break;

      case KEY.RIGHT:
        e.preventDefault();
        var rightEl = findNearest('right');
        if (rightEl) setFocus(rightEl);
        break;

      case KEY.UP:
        e.preventDefault();
        var upEl = findNearest('up');
        if (upEl) setFocus(upEl);
        break;

      case KEY.DOWN:
        e.preventDefault();
        var downEl = findNearest('down');
        if (downEl) setFocus(downEl);
        break;

      case KEY.ENTER:
        e.preventDefault();
        if (focusedElement && onSelect) {
          SoundEngine.select();
          onSelect(focusedElement);
        }
        break;

      case KEY.BACK_TIZEN:
      case KEY.BACK_BROWSER:
      case KEY.ESC:
        e.preventDefault();
        if (onBack) {
          SoundEngine.back();
          onBack();
        }
        break;
    }
  }

  return {
    /**
     * Initialize navigation for a screen
     * @param {string} screenId - The screen element ID
     * @param {Function} selectHandler - Called when OK/Enter is pressed
     * @param {Function} backHandler - Called when Back is pressed
     */
    init: function (screenId, selectHandler, backHandler) {
      currentScreen = document.getElementById(screenId);
      onSelect = selectHandler;
      onBack = backHandler;
      navLocked = false;

      // Focus the first focusable element
      var items = getFocusables();
      if (items.length > 0) {
        setFocus(items[0]);
      }
    },

    /**
     * Set focus to a specific element
     */
    focusElement: function (el) {
      setFocus(el);
    },

    /**
     * Focus first focusable in current screen
     */
    focusFirst: function () {
      var items = getFocusables();
      if (items.length > 0) {
        setFocus(items[0]);
      }
    },

    /**
     * Lock navigation (during animations, feedback, etc.)
     */
    lock: function () {
      navLocked = true;
    },

    /**
     * Unlock navigation
     */
    unlock: function () {
      navLocked = false;
    },

    /**
     * Check if navigation is locked
     */
    isLocked: function () {
      return navLocked;
    },

    /**
     * Get current focused element
     */
    getFocused: function () {
      return focusedElement;
    },

    /**
     * Start listening for key events
     */
    start: function () {
      document.addEventListener('keydown', handleKeyDown);

      // Register Samsung TV keys if available
      if (typeof tizen !== 'undefined' && tizen.tvinputdevice) {
        try {
          tizen.tvinputdevice.registerKey('ColorF0Red');
          tizen.tvinputdevice.registerKey('ColorF1Green');
          tizen.tvinputdevice.registerKey('ColorF2Yellow');
          tizen.tvinputdevice.registerKey('ColorF3Blue');
        } catch (e) {
          // Not on a real TV, ignore
        }
      }
    },

    /**
     * Stop listening for key events
     */
    stop: function () {
      document.removeEventListener('keydown', handleKeyDown);
    },

    KEY: KEY
  };
})();
