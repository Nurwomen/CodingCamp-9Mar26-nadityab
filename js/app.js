// js/app.js — To-Do Life Dashboard

const Storage = {
  get(key) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  set(key, array) {
    try {
      localStorage.setItem(key, JSON.stringify(array));
    } catch (e) {
      console.warn(`Storage.set: failed to write key "${key}"`, e);
    }
  }
};

const GreetingWidget = {
  _timeEl: null,
  _dateEl: null,
  _textEl: null,
  _intervalId: null,

  init() {
    this._timeEl = document.getElementById('greeting-time');
    this._dateEl = document.getElementById('greeting-date');
    this._textEl = document.getElementById('greeting-text');
    this._tick();
    this._intervalId = setInterval(() => this._tick(), 1000);
  },

  _tick() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    this._timeEl.textContent = `${hh}:${mm}`;
    this._dateEl.textContent = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    this._textEl.textContent = this._getGreeting(now.getHours());
  },

  _getGreeting(hour) {
    if (hour >= 5 && hour <= 11) return 'Good morning';
    if (hour >= 12 && hour <= 17) return 'Good afternoon';
    if (hour >= 18 && hour <= 21) return 'Good evening';
    return 'Good night';
  }
};

const FocusTimer = {
  _displayEl: null,
  _startBtn: null,
  _stopBtn: null,
  _resetBtn: null,
  _intervalId: null,
  secondsLeft: 1500,

  init() {
    this._displayEl = document.getElementById('timer-display');
    this._startBtn  = document.getElementById('timer-start');
    this._stopBtn   = document.getElementById('timer-stop');
    this._resetBtn  = document.getElementById('timer-reset');

    this._startBtn.addEventListener('click', () => this._start());
    this._stopBtn.addEventListener('click',  () => this._stop());
    this._resetBtn.addEventListener('click', () => this._reset());

    this.secondsLeft = 1500;
    this._render();
  },

  _format(s) {
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  },

  _start() {
    if (this._intervalId !== null) return;
    this._intervalId = setInterval(() => this._tick(), 1000);
    this._render();
  },

  _stop() {
    if (this._intervalId !== null) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
    this._render();
  },

  _reset() {
    if (this._intervalId !== null) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
    this.secondsLeft = 1500;
    this._displayEl && this._displayEl.classList.remove('session-ended');
    this._render();
  },

  _tick() {
    this.secondsLeft -= 1;
    if (this.secondsLeft <= 0) {
      this.secondsLeft = 0;
      this._render();
      this._onComplete();
      return;
    }
    this._render();
  },

  _onComplete() {
    this._stop();
    this._displayEl && this._displayEl.classList.add('session-ended');
  },

  _render() {
    if (this._displayEl) {
      this._displayEl.textContent = this._format(this.secondsLeft);
    }
    const running = this._intervalId !== null;
    if (this._startBtn) this._startBtn.disabled = running;
    if (this._stopBtn)  this._stopBtn.disabled  = !running;
    if (this._resetBtn) this._resetBtn.disabled = false;
  }
};

const TodoList = {
  _tasks: [],
  _inputEl: null,
  _addBtn: null,
  _listEl: null,
  _validationEl: null,

  init() {
    this._tasks = Storage.get('tld_tasks');
    this._inputEl      = document.getElementById('todo-input');
    this._addBtn       = document.getElementById('todo-add');
    this._listEl       = document.getElementById('todo-list');
    this._validationEl = document.getElementById('todo-validation');

    this._addBtn.addEventListener('click', () => this._add(this._inputEl.value));
    this._inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this._add(this._inputEl.value);
    });

    this._render();
  },

  _validate(title) {
    return title.trim().length > 0;
  },

  _add(title) {
    const trimmed = title.trim();
    if (!this._validate(trimmed)) {
      if (this._validationEl) this._validationEl.textContent = 'Task title cannot be empty.';
      return;
    }
    const id = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : Date.now().toString() + Math.random();
    this._tasks.push({ id, title: trimmed, done: false });
    if (this._validationEl) this._validationEl.textContent = '';
    if (this._inputEl) this._inputEl.value = '';
    this._persist();
    this._render();
  },

  _delete(id) {
    this._tasks = this._tasks.filter(t => t.id !== id);
    this._persist();
    this._render();
  },

  _toggleComplete(id) {
    const task = this._tasks.find(t => t.id === id);
    if (task) task.done = !task.done;
    this._persist();
    this._render();
  },

  _startEdit(id) {
    const task = this._tasks.find(t => t.id === id);
    if (!task) return;
    const span = this._listEl.querySelector(`[data-id="${id}"] .todo-title`);
    if (!span) return;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = task.title;
    input.className = 'todo-edit-input';

    let confirmed = false;
    const confirm = () => {
      if (confirmed) return;
      confirmed = true;
      this._confirmEdit(id, input.value);
    };

    input.addEventListener('blur', confirm);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { input.blur(); }
      if (e.key === 'Escape') {
        confirmed = true; // prevent blur from firing confirm
        this._render();
      }
    });

    span.replaceWith(input);
    input.focus();
  },

  _confirmEdit(id, newTitle) {
    const trimmed = newTitle.trim();
    const task = this._tasks.find(t => t.id === id);
    if (task && trimmed.length > 0) {
      task.title = trimmed;
    }
    // if empty, discard — original title is retained
    this._persist();
    this._render();
  },

  _persist() {
    Storage.set('tld_tasks', this._tasks);
  },

  _render() {
    if (!this._listEl) return;
    this._listEl.innerHTML = '';
    this._tasks.forEach(task => {
      const li = document.createElement('li');
      li.dataset.id = task.id;
      li.className = 'todo-item';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.done;
      checkbox.addEventListener('change', () => this._toggleComplete(task.id));

      const titleSpan = document.createElement('span');
      titleSpan.className = 'todo-title';
      titleSpan.textContent = task.title;
      if (task.done) titleSpan.style.textDecoration = 'line-through';
      titleSpan.addEventListener('click', () => this._startEdit(task.id));

      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.className = 'todo-edit-btn';
      editBtn.addEventListener('click', () => this._startEdit(task.id));

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.className = 'todo-delete-btn';
      deleteBtn.addEventListener('click', () => this._delete(task.id));

      li.append(checkbox, titleSpan, editBtn, deleteBtn);
      this._listEl.appendChild(li);
    });
  }
};

const QuickLinks = {
  _links: [],
  _labelInputEl: null,
  _urlInputEl: null,
  _addBtn: null,
  _containerEl: null,
  _validationEl: null,

  init() {
    this._links = Storage.get('tld_links');
    this._labelInputEl  = document.getElementById('links-label-input');
    this._urlInputEl    = document.getElementById('links-url-input');
    this._addBtn        = document.getElementById('links-add');
    this._containerEl   = document.getElementById('links-container');
    this._validationEl  = document.getElementById('links-validation');

    this._addBtn.addEventListener('click', () =>
      this._add(this._labelInputEl.value, this._urlInputEl.value)
    );

    this._render();
  },

  _validate(label, url) {
    return label.trim().length > 0 && url.trim().length > 0;
  },

  _add(label, url) {
    const trimmedLabel = label.trim();
    const trimmedUrl   = url.trim();
    if (!this._validate(trimmedLabel, trimmedUrl)) {
      if (this._validationEl) this._validationEl.textContent = 'Label and URL are required.';
      return;
    }
    const id = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : Date.now().toString() + Math.random();
    this._links.push({ id, label: trimmedLabel, url: trimmedUrl });
    if (this._validationEl) this._validationEl.textContent = '';
    if (this._labelInputEl) this._labelInputEl.value = '';
    if (this._urlInputEl)   this._urlInputEl.value   = '';
    this._persist();
    this._render();
  },

  _delete(id) {
    this._links = this._links.filter(l => l.id !== id);
    this._persist();
    this._render();
  },

  _persist() {
    Storage.set('tld_links', this._links);
  },

  _render() {
    if (!this._containerEl) return;
    this._containerEl.innerHTML = '';
    this._links.forEach(link => {
      const btn = document.createElement('button');
      btn.textContent = link.label;
      btn.className = 'quick-link-btn';
      btn.addEventListener('click', () => window.open(link.url, '_blank'));

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.className = 'quick-link-delete-btn';
      deleteBtn.addEventListener('click', () => this._delete(link.id));

      this._containerEl.appendChild(btn);
      this._containerEl.appendChild(deleteBtn);
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  GreetingWidget.init();
  FocusTimer.init();
  TodoList.init();
  QuickLinks.init();
});
