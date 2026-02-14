/**
 * AminLearn - Samsung TV D-pad Navigation v2.0
 * Performance: input throttling, cached DOM lookups, passive listeners
 * Samsung TV Remote Key Codes:
 *   Arrows: 37/38/39/40, Enter: 13, Back: 10009 (Tizen) / 8,27 (browser)
 */
var TVNav = (function () {
  'use strict';

  var currentScreen = null;
  var focusedElement = null;
  var onSelect = null;
  var onBack = null;
  var navLocked = false;
  var lastKeyTime = 0;
  var KEY_THROTTLE = 120; // ms between key repeats

  var KEY = {
    LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40,
    ENTER: 13, BACK_TIZEN: 10009, BACK_BROWSER: 8, ESC: 27,
    RED: 403, GREEN: 404, YELLOW: 405, BLUE: 406
  };

  // Cached focusable list - invalidated on screen change
  var cachedFocusables = null;

  function invalidateCache() {
    cachedFocusables = null;
  }

  function getFocusables() {
    if (cachedFocusables) return cachedFocusables;
    if (!currentScreen) return [];
    cachedFocusables = Array.prototype.slice.call(
      currentScreen.querySelectorAll('.focusable:not(.disabled):not([disabled])')
    );
    return cachedFocusables;
  }

  function setFocus(el) {
    if (!el || el === focusedElement) return;

    if (focusedElement) {
      focusedElement.classList.remove('focused');
    }

    focusedElement = el;
    focusedElement.classList.add('focused');
    focusedElement.focus({ preventScroll: true });

    SoundEngine.navigate();
  }

  /**
   * Spatial navigation: find nearest element in direction
   * Optimized with early exit and squared distance (no sqrt)
   */
  function findNearest(direction) {
    var items = getFocusables();
    if (items.length === 0) return null;
    if (!focusedElement) return items[0];

    var rect = focusedElement.getBoundingClientRect();
    var cx = rect.left + (rect.width >> 1);
    var cy = rect.top + (rect.height >> 1);

    var best = null;
    var bestScore = 1e9;
    var isHoriz = direction === 'left' || direction === 'right';
    var isPositive = direction === 'right' || direction === 'down';

    for (var i = 0, len = items.length; i < len; i++) {
      if (items[i] === focusedElement) continue;

      var r = items[i].getBoundingClientRect();
      var ix = r.left + (r.width >> 1);
      var iy = r.top + (r.height >> 1);
      var dx = ix - cx;
      var dy = iy - cy;

      var primary = isHoriz ? dx : dy;
      var secondary = isHoriz ? dy : dx;

      // Check direction validity
      if (isPositive ? primary <= 5 : primary >= -5) continue;

      var absPrimary = primary < 0 ? -primary : primary;
      var absSecondary = secondary < 0 ? -secondary : secondary;
      var score = absPrimary + absSecondary * 3;

      if (score < bestScore) {
        bestScore = score;
        best = items[i];
      }
    }

    return best;
  }

  function handleKeyDown(e) {
    if (navLocked) return;

    // Throttle rapid key presses
    var now = Date.now();
    if (now - lastKeyTime < KEY_THROTTLE) return;
    lastKeyTime = now;

    var code = e.keyCode;
    var target;

    switch (code) {
      case KEY.LEFT:
        e.preventDefault();
        target = findNearest('left');
        if (target) setFocus(target);
        break;
      case KEY.RIGHT:
        e.preventDefault();
        target = findNearest('right');
        if (target) setFocus(target);
        break;
      case KEY.UP:
        e.preventDefault();
        target = findNearest('up');
        if (target) setFocus(target);
        break;
      case KEY.DOWN:
        e.preventDefault();
        target = findNearest('down');
        if (target) setFocus(target);
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
    init: function (screenId, selectHandler, backHandler) {
      currentScreen = document.getElementById(screenId);
      onSelect = selectHandler;
      onBack = backHandler;
      navLocked = false;
      invalidateCache();

      var items = getFocusables();
      if (items.length > 0) {
        setFocus(items[0]);
      }
    },

    focusElement: function (el) {
      setFocus(el);
    },

    focusFirst: function () {
      invalidateCache();
      var items = getFocusables();
      if (items.length > 0) setFocus(items[0]);
    },

    lock: function () {
      navLocked = true;
    },

    unlock: function () {
      navLocked = false;
      invalidateCache();
    },

    isLocked: function () {
      return navLocked;
    },

    getFocused: function () {
      return focusedElement;
    },

    invalidateCache: invalidateCache,

    start: function () {
      document.addEventListener('keydown', handleKeyDown, false);

      // Register Samsung Tizen remote keys
      if (typeof tizen !== 'undefined' && tizen.tvinputdevice) {
        try {
          var keys = ['ColorF0Red', 'ColorF1Green', 'ColorF2Yellow', 'ColorF3Blue'];
          for (var i = 0; i < keys.length; i++) {
            tizen.tvinputdevice.registerKey(keys[i]);
          }
        } catch (e) {}
      }
    },

    stop: function () {
      document.removeEventListener('keydown', handleKeyDown, false);
    },

    KEY: KEY
  };
})();
