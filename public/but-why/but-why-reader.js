/*
 * But Why? — interactive conversation reader
 * ------------------------------------------------------------------
 * A framework-free, build-step-free component that reveals a "But Why?"
 * nature conversation one turn at a time, as alternating speech bubbles.
 *
 * Drops in anywhere: plain HTML + this file + but-why-reader.css.
 * No dependencies. Attaches `ButWhyReader` to the global (window) and
 * also exports it for Node (so the logic can be unit-tested headlessly).
 *
 * --- Usage -------------------------------------------------------------
 *   <link rel="stylesheet" href="but-why-reader.css">
 *   <div id="reader"></div>
 *   <script src="but-why-reader.js"></script>
 *   <script>
 *     // From an already-loaded conversation object:
 *     ButWhyReader.mount(document.getElementById('reader'), conversation);
 *
 *     // Or fetch one by URL (returns a Promise<ButWhyReader>):
 *     ButWhyReader.load(document.getElementById('reader'),
 *                       'data/conversations/ornamental-cherry-no-fruit.json');
 *   </script>
 *
 * --- Conversation shape it consumes ------------------------------------
 *   {
 *     title:      "Why are there no cherries on that cherry tree?",
 *     setting:    "A spring walk down a street of ornamental cherries.",
 *     characters: { "child": "Maya", "adult": "Grandad" },  // role -> name
 *     turns:      [ { speaker: "child"|"adult", text: "..." }, ... ],
 *     // teacher-only (shown only behind the collapsed "For teachers" panel):
 *     the_heart_of_it: "...",
 *     watch_for:       "...",
 *     extend_it:       [ "...", "..." ]
 *   }
 *
 * Speaker roles are NOT hard-coded to Maya/Grandad. Display names always
 * come from `characters[role]`; the two roles are "child" and "adult".
 */
(function (global) {
  'use strict';

  /* ---- Pure helpers (no DOM — unit-testable in Node) ----------------- */

  // Resolve a role ("child"/"adult") to its display name from the map.
  function speakerName(conversation, role) {
    var chars = (conversation && conversation.characters) || {};
    return chars[role] || role;
  }

  // Which side of the thread a role sits on. Child left, everyone else right.
  function sideFor(role) {
    return role === 'child' ? 'child' : 'adult';
  }

  // Anticipation hint for the *upcoming* turn (the joy is guessing it).
  // Returns null when there is no next turn.
  function hintFor(conversation, turn) {
    if (!turn) return null;
    var name = speakerName(conversation, turn.speaker);
    return turn.speaker === 'child'
      ? 'Tap to reveal ' + name + '’s question'
      : 'Tap to reveal ' + name + '’s answer';
  }

  // Validate the minimal contract the reader depends on. Throws on a bad
  // conversation so integrators get a clear error instead of a blank reader.
  function validate(conversation) {
    if (!conversation || typeof conversation !== 'object') {
      throw new Error('ButWhyReader: conversation must be an object');
    }
    if (!Array.isArray(conversation.turns) || conversation.turns.length === 0) {
      throw new Error('ButWhyReader: conversation.turns must be a non-empty array');
    }
    conversation.turns.forEach(function (t, i) {
      if (!t || typeof t.text !== 'string' || typeof t.speaker !== 'string') {
        throw new Error('ButWhyReader: turn ' + i + ' must have string {speaker, text}');
      }
    });
    return true;
  }

  /* ---- The component ------------------------------------------------- */

  function ButWhyReader(container, conversation, options) {
    if (!container) throw new Error('ButWhyReader: a container element is required');
    validate(conversation);

    this.container = container;
    this.conversation = conversation;
    this.options = options || {};
    this.revealed = 0;            // number of turns currently on screen
    this.reduceMotion = prefersReducedMotion();

    this._onKeydown = this._onKeydown.bind(this);
    this._render();
    this._sync();
  }

  // Reveal the next hidden turn. No-op once everything is shown.
  ButWhyReader.prototype.next = function () {
    if (this.revealed >= this.conversation.turns.length) return;
    this.revealed += 1;
    this._sync();
    this._scrollToLatest();
  };

  // Reveal every remaining turn at once. Deliberately does not scroll: the
  // reader should stay where they are and read on from their current place,
  // rather than being thrown to the bottom of the conversation.
  ButWhyReader.prototype.revealAll = function () {
    this.revealed = this.conversation.turns.length;
    this._sync();
  };

  // Collapse back to the opening scene.
  ButWhyReader.prototype.restart = function () {
    this.revealed = 0;
    this._sync();
    this.container.scrollTop = 0;
    if (this._revealBtn && this._revealBtn.focus) this._revealBtn.focus();
  };

  // Remove listeners and empty the container.
  ButWhyReader.prototype.destroy = function () {
    this.container.removeEventListener('keydown', this._onKeydown);
    this.container.innerHTML = '';
  };

  /* ---- Internals ----------------------------------------------------- */

  ButWhyReader.prototype._render = function () {
    var c = this.conversation;
    var doc = this.container.ownerDocument || (global.document);
    this._doc = doc;

    this.container.innerHTML = '';
    this.container.className = 'bwr';
    this.container.setAttribute('tabindex', '0');
    this.container.setAttribute('role', 'region');
    this.container.setAttribute(
      'aria-label',
      'But Why? conversation: ' + (c.title || 'a nature conversation')
    );
    if (this.reduceMotion) this.container.classList.add('bwr--reduce-motion');

    // Opening scene: title + one-line setting.
    var scene = el(doc, 'div', 'bwr-scene');
    if (c.title) scene.appendChild(el(doc, 'h2', 'bwr-title', c.title));
    if (c.setting) scene.appendChild(el(doc, 'p', 'bwr-setting', c.setting));
    this.container.appendChild(scene);

    // Thread of bubbles (filled in by _sync).
    this._thread = el(doc, 'div', 'bwr-thread');
    this._thread.setAttribute('aria-live', 'polite');
    this.container.appendChild(this._thread);
    this._bubbles = [];

    // Primary reveal affordance: a big friendly tappable prompt.
    this._revealBtn = el(doc, 'button', 'bwr-reveal');
    this._revealBtn.setAttribute('type', 'button');
    this._revealHint = el(doc, 'span', 'bwr-reveal-hint');
    this._revealArrow = el(doc, 'span', 'bwr-reveal-arrow', '↓'); // down arrow
    this._revealArrow.setAttribute('aria-hidden', 'true');
    this._revealBtn.appendChild(this._revealHint);
    this._revealBtn.appendChild(this._revealArrow);
    this._revealBtn.addEventListener('click', this.next.bind(this));
    this.container.appendChild(this._revealBtn);

    // Secondary controls: reveal all / start again.
    var controls = el(doc, 'div', 'bwr-controls');
    this._allBtn = el(doc, 'button', 'bwr-btn bwr-btn--ghost', 'Reveal all');
    this._allBtn.setAttribute('type', 'button');
    this._allBtn.addEventListener('click', this.revealAll.bind(this));
    this._restartBtn = el(doc, 'button', 'bwr-btn bwr-btn--ghost', 'Start again');
    this._restartBtn.setAttribute('type', 'button');
    this._restartBtn.addEventListener('click', this.restart.bind(this));
    controls.appendChild(this._allBtn);
    controls.appendChild(this._restartBtn);
    this.container.appendChild(controls);

    // Teacher panel: collapsed by default, never mixed into the bubbles.
    if (c.the_heart_of_it || c.watch_for || (c.extend_it && c.extend_it.length)) {
      this.container.appendChild(this._renderTeacherPanel(doc, c));
    }

    // Keyboard: Space / Enter / ArrowRight / ArrowDown advance; Backspace/Left
    // restart; Home/"r" restart. Scoped to the container so it never hijacks
    // the whole page when embedded.
    this.container.addEventListener('keydown', this._onKeydown);
  };

  ButWhyReader.prototype._renderTeacherPanel = function (doc, c) {
    var details = el(doc, 'details', 'bwr-teacher');
    var summary = el(doc, 'summary', 'bwr-teacher-summary', 'For teachers');
    details.appendChild(summary);
    var body = el(doc, 'div', 'bwr-teacher-body');
    if (c.the_heart_of_it) {
      body.appendChild(el(doc, 'h3', 'bwr-teacher-h', 'The heart of it'));
      body.appendChild(el(doc, 'p', null, c.the_heart_of_it));
    }
    if (c.watch_for) {
      body.appendChild(el(doc, 'h3', 'bwr-teacher-h', 'Watch for'));
      body.appendChild(el(doc, 'p', null, c.watch_for));
    }
    if (c.extend_it && c.extend_it.length) {
      body.appendChild(el(doc, 'h3', 'bwr-teacher-h', 'Extend it'));
      var ul = el(doc, 'ul', 'bwr-teacher-list');
      c.extend_it.forEach(function (item) {
        ul.appendChild(el(doc, 'li', null, item));
      });
      body.appendChild(ul);
    }
    details.appendChild(body);
    return details;
  };

  // Reconcile the DOM with the current `revealed` count.
  ButWhyReader.prototype._sync = function () {
    var doc = this._doc;
    var turns = this.conversation.turns;

    // Add any newly-revealed bubbles.
    for (var i = this._bubbles.length; i < this.revealed; i++) {
      var bubble = this._makeBubble(doc, turns[i]);
      this._thread.appendChild(bubble);
      this._bubbles.push(bubble);
    }
    // Remove bubbles that should no longer be shown (after restart).
    while (this._bubbles.length > this.revealed) {
      var last = this._bubbles.pop();
      if (last.parentNode) last.parentNode.removeChild(last);
    }

    var done = this.revealed >= turns.length;
    var upcoming = done ? null : turns[this.revealed];

    // Update the reveal prompt.
    if (done) {
      this._revealBtn.classList.add('bwr-reveal--done');
      this._revealBtn.setAttribute('disabled', 'disabled');
      this._revealHint.textContent = 'The end — tap “Start again” to replay';
      this._revealArrow.classList.add('bwr-hidden');
    } else {
      this._revealBtn.classList.remove('bwr-reveal--done');
      this._revealBtn.removeAttribute('disabled');
      this._revealHint.textContent = hintFor(this.conversation, upcoming);
      this._revealArrow.classList.remove('bwr-hidden');
      // Colour the prompt by who speaks next, to build the anticipation.
      this._revealBtn.classList.toggle('bwr-reveal--child', upcoming.speaker === 'child');
      this._revealBtn.classList.toggle('bwr-reveal--adult', upcoming.speaker !== 'child');
    }

    // Start-again only matters once something is revealed.
    setDisabled(this._restartBtn, this.revealed === 0);
    setDisabled(this._allBtn, done);
  };

  ButWhyReader.prototype._makeBubble = function (doc, turn) {
    var side = sideFor(turn.speaker);
    var row = el(doc, 'div', 'bwr-row bwr-row--' + side);
    if (!this.reduceMotion) row.classList.add('bwr-row--enter');
    var bubble = el(doc, 'div', 'bwr-bubble bwr-bubble--' + side);
    bubble.appendChild(el(doc, 'span', 'bwr-speaker',
      speakerName(this.conversation, turn.speaker)));
    bubble.appendChild(el(doc, 'p', 'bwr-text', turn.text));
    row.appendChild(bubble);
    return row;
  };

  ButWhyReader.prototype._scrollToLatest = function () {
    // Scroll the reveal button — not just the newest bubble — into view. The
    // button sits directly below the latest bubble, so bringing it on screen
    // keeps the "tap to reveal" affordance always reachable while the new
    // bubble lands just above it. 'nearest' moves the minimum needed and won't
    // jump when the button is already visible. (scroll-margin-bottom on
    // .bwr-reveal leaves a little breathing room beneath it.)
    var target = this._revealBtn || this._bubbles[this._bubbles.length - 1];
    if (target && typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({
        behavior: this.reduceMotion ? 'auto' : 'smooth',
        block: 'nearest'
      });
    }
  };

  ButWhyReader.prototype._onKeydown = function (e) {
    var key = e.key;
    if (key === ' ' || key === 'Spacebar' || key === 'Enter' ||
        key === 'ArrowRight' || key === 'ArrowDown') {
      // Don't steal Enter/Space from the dedicated buttons.
      if ((key === 'Enter' || key === ' ' || key === 'Spacebar') &&
          isButton(e.target)) return;
      e.preventDefault();
      this.next();
    } else if (key === 'Home' || key === 'r' || key === 'R') {
      e.preventDefault();
      this.restart();
    }
  };

  /* ---- Static convenience API ---------------------------------------- */

  ButWhyReader.mount = function (container, conversation, options) {
    return new ButWhyReader(container, conversation, options);
  };

  // Fetch a conversation JSON and mount it. Returns Promise<ButWhyReader>.
  ButWhyReader.load = function (container, url, options) {
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error('ButWhyReader: failed to load ' + url + ' (' + res.status + ')');
      return res.json();
    }).then(function (conversation) {
      return new ButWhyReader(container, conversation, options);
    });
  };

  // Expose pure helpers for testing / advanced use.
  ButWhyReader.speakerName = speakerName;
  ButWhyReader.sideFor = sideFor;
  ButWhyReader.hintFor = hintFor;
  ButWhyReader.validate = validate;

  /* ---- Small DOM utilities ------------------------------------------- */

  function el(doc, tag, className, text) {
    var node = doc.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function setDisabled(node, on) {
    if (!node) return;
    if (on) node.setAttribute('disabled', 'disabled');
    else node.removeAttribute('disabled');
  }

  function isButton(node) {
    return node && node.tagName && String(node.tagName).toLowerCase() === 'button';
  }

  function prefersReducedMotion() {
    try {
      return !!(global.matchMedia &&
        global.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (_) {
      return false;
    }
  }

  /* ---- Export -------------------------------------------------------- */

  global.ButWhyReader = ButWhyReader;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ButWhyReader;
  }

})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
