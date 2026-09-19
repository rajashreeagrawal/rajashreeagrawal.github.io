'use strict';

class WordFinderGame {
  constructor(data, lookup = WordFinderGame.lookup) {
    this.dictionary = new Set(data.pool);
    this.pairs = data.pairs;
    this.keys = Object.keys(data.pairs);
    this.lookup = lookup;
    this.added = new Set();
    this.score = 0;
    this.rounds = 0;
    this.version = 0;
    this.newRound();
  }

  newRound() {
    if (this.controller) this.controller.abort();
    this.version += 1;
    const choices = this.keys.filter(key => key !== this.pair);
    this.pair = choices[Math.floor(Math.random() * choices.length)] || this.keys[0];
    this.rounds += 1;
    this.found = [];
    this.checking = false;
  }

  answers() {
    return [...new Set([...this.pairs[this.pair], ...this.added])]
      .filter(word => word[0] + word.slice(-1) === this.pair).slice(0, 10);
  }

  static async lookup(word, signal) {
    const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(word), { signal });
    if (response.status === 404) return false;
    if (!response.ok) throw new Error('Dictionary unavailable');
    const entries = await response.json();
    return Array.isArray(entries) && entries.some(entry => Array.isArray(entry.meanings) && entry.meanings.length > 0);
  }

  async submit(value, onChecking = () => {}) {
    if (this.checking) return { type: 'info', msg: 'Please wait for the current word to be checked.' };
    const word = value.trim().toLowerCase();
    if (!/^[a-z]{3,60}$/.test(word)) return { type: 'err', msg: 'Use a word with at least 3 letters, without spaces or punctuation.' };
    if (word[0] + word.slice(-1) !== this.pair) return { type: 'err', msg: `Start with ${this.pair[0].toUpperCase()} and end with ${this.pair[1].toUpperCase()}.` };
    if (this.found.includes(word)) return { type: 'err', msg: 'You already found that word this round.' };
    let isNew = false;
    if (!this.dictionary.has(word)) {
      const version = this.version;
      this.checking = true;
      this.controller = new AbortController();
      const controller = this.controller;
      const timeout = setTimeout(() => controller.abort(), 8000);
      onChecking(word);
      try {
        const valid = await this.lookup(word, controller.signal);
        if (version !== this.version) return null;
        if (!valid) return { type: 'err', msg: `The dictionary did not recognize “${word}”. Try another word.` };
        this.dictionary.add(word);
        this.added.add(word);
        isNew = true;
      } catch {
        if (version !== this.version) return null;
        return { type: 'err', msg: 'The online dictionary is unavailable. Try again, or use a word from the built-in list.' };
      } finally {
        clearTimeout(timeout);
        if (version === this.version) this.checking = false;
      }
    }
    this.found.unshift(word);
    this.score += 1;
    return { type: 'ok', msg: isNew ? `“${word}” counts! Added to the dictionary for this session.` : `“${word}” counts. Nice work!` };
  }
}

if (typeof document !== 'undefined') {
  const game = new WordFinderGame(WORD_FINDER_DATA);
  const byId = id => document.getElementById(id);
  const form = byId('guess-form');
  const input = byId('guess');
  const submitButton = byId('submit-word');
  const feedback = byId('feedback');
  const showButton = byId('show-answers');
  let showAnswers = false;

  function message(result) {
    feedback.textContent = result ? result.msg : '';
    feedback.dataset.type = result ? result.type : '';
    input.setAttribute('aria-invalid', String(result?.type === 'err'));
  }

  function render() {
    byId('first-letter').textContent = game.pair[0].toUpperCase();
    byId('last-letter').textContent = game.pair[1].toUpperCase();
    input.placeholder = `${game.pair[0]}____${game.pair[1]}`;
    submitButton.disabled = game.checking;
    submitButton.textContent = game.checking ? 'Checking…' : 'Guess →';
    input.readOnly = game.checking;
    form.setAttribute('aria-busy', String(game.checking));
    byId('score').textContent = game.score;
    byId('rounds').textContent = game.rounds;
    byId('added-count').textContent = game.added.size;
    byId('found-section').hidden = game.found.length === 0;
    byId('found-words').replaceChildren(...game.found.map(word => {
      const chip = document.createElement('li');
      chip.textContent = word;
      return chip;
    }));
    byId('answers-section').hidden = !showAnswers;
    showButton.setAttribute('aria-expanded', String(showAnswers));
    showButton.textContent = showAnswers ? 'Hide answers' : 'Show answers';
    if (showAnswers) {
      byId('answers-title').textContent = `Some words for ${game.pair[0].toUpperCase()} → ${game.pair[1].toUpperCase()}`;
      byId('answer-words').replaceChildren(...game.answers().map(word => {
        const item = document.createElement('li');
        item.textContent = word;
        return item;
      }));
    }
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (game.checking) return;
    const result = await game.submit(input.value, word => {
      message({ type: 'info', msg: `Checking “${word}”…` });
      render();
    });
    // A lookup from a previous round must not change the new round.
    if (!result) return;
    message(result);
    if (result.type === 'ok') input.value = '';
    render();
    input.focus();
  });
  byId('new-round').addEventListener('click', () => {
    game.newRound();
    showAnswers = false;
    input.value = '';
    message(null);
    render();
    input.focus();
  });
  showButton.addEventListener('click', () => {
    showAnswers = !showAnswers;
    render();
  });
  render();
}
