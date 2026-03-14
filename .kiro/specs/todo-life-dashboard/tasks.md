# Implementation Plan: To-Do Life Dashboard

## Overview

Implement a single-page productivity dashboard in three files (`index.html`, `css/style.css`, `js/app.js`) using plain HTML, CSS, and Vanilla JavaScript. Each task builds incrementally toward a fully wired application with no orphaned code.

## Tasks

- [x] 1. Create project file structure and HTML skeleton
  - Create `index.html` with semantic sections: `#greeting`, `#timer`, `#todo`, `#links`
  - Create empty `css/style.css` and `js/app.js` files linked from `index.html`
  - Add input fields, buttons, and containers required by each widget as static HTML
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 2. Implement the Storage utility
  - [x] 2.1 Write the `Storage` object with `get(key)` and `set(key, array)` methods
    - `get` reads from `localStorage`, parses JSON, returns `[]` on missing key or parse error (try/catch)
    - `set` serialises to JSON and writes; wraps in try/catch, logs warning on quota error
    - Use keys `"tld_tasks"` and `"tld_links"`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.7_

  - [ ]* 2.2 Write property test for Storage round-trip (Task array) — Property 16
    - **Property 16: Task array serialization round-trip**
    - **Validates: Requirements 5.1, 5.3, 5.4, 5.5**

  - [ ]* 2.3 Write property test for Storage round-trip (Link array) — Property 17
    - **Property 17: Link array serialization round-trip**
    - **Validates: Requirements 5.2, 5.3, 5.4, 5.6**

  - [ ]* 2.4 Write property test for malformed/missing storage — Property 18
    - **Property 18: Malformed or missing storage returns empty array**
    - **Validates: Requirements 5.7**

- [x] 3. Implement GreetingWidget
  - [x] 3.1 Write `GreetingWidget` with `init()`, `_tick()`, and `_getGreeting(hour)` methods
    - `init` binds DOM refs and starts a 1-second `setInterval` calling `_tick`
    - `_tick` reads `new Date()`, formats time as `HH:MM`, formats date as human-readable string, calls `_getGreeting`
    - `_getGreeting(hour)` returns the correct string for hours 0–23 per requirements 1.3–1.6
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [ ]* 3.2 Write property test for time format — Property 1
    - **Property 1: Time format is always HH:MM**
    - **Validates: Requirements 1.1**

  - [ ]* 3.3 Write property test for date format — Property 2
    - **Property 2: Date format contains weekday, month, day, and year**
    - **Validates: Requirements 1.2**

  - [ ]* 3.4 Write property test for greeting correctness — Property 3
    - **Property 3: Greeting text is correct for all hours**
    - **Validates: Requirements 1.3, 1.4, 1.5, 1.6**

- [x] 4. Implement FocusTimer
  - [x] 4.1 Write `FocusTimer` with `init()`, `_start()`, `_stop()`, `_reset()`, `_tick()`, `_onComplete()`, `_render()`, and `_format(s)` methods
    - `init` binds DOM refs and calls `_render()` with `secondsLeft = 1500`
    - `_format(s)` converts total seconds to `"MM:SS"` zero-padded string
    - `_start` sets interval, `_stop` clears it, `_reset` clears interval and restores 1500
    - `_tick` decrements `secondsLeft`; calls `_onComplete()` when it reaches 0
    - `_render` updates display text and enables/disables Start, Stop, Reset buttons per requirements 2.7, 2.8
    - `_onComplete` stops timer and applies `"session-ended"` CSS class
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

  - [ ]* 4.2 Write property test for timer decrement — Property 4
    - **Property 4: Timer decrements by one per tick**
    - **Validates: Requirements 2.2**

  - [ ]* 4.3 Write property test for MM:SS format — Property 5
    - **Property 5: Timer display is always valid MM:SS**
    - **Validates: Requirements 2.3**

  - [ ]* 4.4 Write property test for stop preserving remaining time — Property 6
    - **Property 6: Stopping the timer preserves remaining time**
    - **Validates: Requirements 2.4**

  - [ ]* 4.5 Write property test for button state invariant — Property 7
    - **Property 7: Timer button states are consistent with running state**
    - **Validates: Requirements 2.7, 2.8**

- [x] 5. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement TodoList
  - [x] 6.1 Write `TodoList` with `init()`, `_add(title)`, `_delete(id)`, `_toggleComplete(id)`, `_startEdit(id)`, `_confirmEdit(id, newTitle)`, `_persist()`, `_render()`, and `_validate(title)` methods
    - `init` loads tasks from `Storage.get("tld_tasks")` and calls `_render()`
    - `_validate(title)` returns `false` for empty/whitespace-only strings
    - `_add` generates a unique id (`crypto.randomUUID()` with fallback), sets `done: false`, pushes to `_tasks`, calls `_persist()` and `_render()`
    - `_render` rebuilds the task list DOM; shows inline validation message on empty submit
    - `_startEdit` replaces the title span with an inline `<input>`
    - `_confirmEdit` trims the new title; updates if non-empty, discards if empty, then calls `_persist()` and `_render()`
    - `_toggleComplete` flips `done`, calls `_persist()` and `_render()`
    - `_delete` removes by id, calls `_persist()` and `_render()`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10_

  - [ ]* 6.2 Write property test for valid task shape — Property 8
    - **Property 8: Adding a valid task produces a correctly-shaped task**
    - **Validates: Requirements 3.2**

  - [ ]* 6.3 Write property test for whitespace title rejection — Property 9
    - **Property 9: Whitespace-only titles are rejected**
    - **Validates: Requirements 3.3**

  - [ ]* 6.4 Write property test for edit result — Property 10
    - **Property 10: Edit result depends on new title validity**
    - **Validates: Requirements 3.5, 3.6**

  - [ ]* 6.5 Write property test for completion toggle round-trip — Property 11
    - **Property 11: Completion toggle is a round-trip**
    - **Validates: Requirements 3.7**

  - [ ]* 6.6 Write property test for task deletion — Property 12
    - **Property 12: Deleting a task removes it from the list**
    - **Validates: Requirements 3.8**

- [x] 7. Implement QuickLinks
  - [x] 7.1 Write `QuickLinks` with `init()`, `_add(label, url)`, `_delete(id)`, `_persist()`, `_render()`, and `_validate(label, url)` methods
    - `init` loads links from `Storage.get("tld_links")` and calls `_render()`
    - `_validate` returns `false` if label or url is empty/whitespace-only
    - `_add` generates a unique id, pushes to `_links`, calls `_persist()` and `_render()`; shows validation message on invalid input
    - `_render` rebuilds the links DOM; each link button calls `window.open(url, '_blank')`
    - `_delete` removes by id, calls `_persist()` and `_render()`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

  - [ ]* 7.2 Write property test for valid link shape — Property 13
    - **Property 13: Adding a valid link produces a correctly-shaped link**
    - **Validates: Requirements 4.2**

  - [ ]* 7.3 Write property test for empty label/URL rejection — Property 14
    - **Property 14: Links with empty label or URL are rejected**
    - **Validates: Requirements 4.3**

  - [ ]* 7.4 Write property test for link deletion — Property 15
    - **Property 15: Deleting a link removes it from the list**
    - **Validates: Requirements 4.5**

- [x] 8. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Wire all widgets in app.js and style the dashboard
  - [x] 9.1 Add `DOMContentLoaded` listener that calls `init()` on each widget in order
    - Call `GreetingWidget.init()`, `FocusTimer.init()`, `TodoList.init()`, `QuickLinks.init()`
    - _Requirements: 6.1, 6.2_

  - [x] 9.2 Write `css/style.css` to lay out all four widgets in a single viewport
    - Use a grid or flexbox layout so all widgets are visible at 768px height without scrolling
    - Apply clear visual hierarchy between sections; minimum 16px body font size
    - Style the `"session-ended"` state on the timer
    - _Requirements: 7.1, 7.2, 7.4_

- [x] 10. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use fast-check and must run ≥ 100 iterations each
- Each property test must include the comment tag: `// Feature: todo-life-dashboard, Property N: <property text>`
- Unit tests cover specific examples, integration points, and edge cases not covered by property tests
