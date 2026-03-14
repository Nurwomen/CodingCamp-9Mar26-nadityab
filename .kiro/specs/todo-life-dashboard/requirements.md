# Requirements Document

## Introduction

The To-Do List Life Dashboard is a client-side web application that serves as a personal productivity homepage. It provides users with a real-time clock and greeting, a Pomodoro-style focus timer, a persistent to-do list, and a quick-links panel — all built with plain HTML, CSS, and Vanilla JavaScript, with no backend or build tooling required. All data is persisted using the browser's Local Storage API.

## Glossary

- **Dashboard**: The single-page web application described in this document.
- **Greeting_Widget**: The UI component that displays the current time, date, and a time-of-day greeting.
- **Focus_Timer**: The UI component that implements a 25-minute countdown timer.
- **Todo_List**: The UI component that manages a collection of tasks.
- **Task**: A single to-do item with a title, completion state, and unique identifier.
- **Quick_Links**: The UI component that displays user-defined shortcut buttons to external URLs.
- **Link**: A user-defined entry consisting of a label and a URL.
- **Storage**: The browser's Local Storage API used for client-side persistence.
- **Modern_Browser**: Chrome, Firefox, Edge, or Safari at their current stable release.

---

## Requirements

### Requirement 1: Real-Time Greeting

**User Story:** As a user, I want to see the current time, date, and a contextual greeting when I open the dashboard, so that I am immediately oriented to the current moment.

#### Acceptance Criteria

1. THE Greeting_Widget SHALL display the current time in HH:MM format, updated every second.
2. THE Greeting_Widget SHALL display the current date in a human-readable format (e.g., "Monday, July 14, 2025").
3. WHEN the local time is between 05:00 and 11:59, THE Greeting_Widget SHALL display the greeting "Good morning".
4. WHEN the local time is between 12:00 and 17:59, THE Greeting_Widget SHALL display the greeting "Good afternoon".
5. WHEN the local time is between 18:00 and 21:59, THE Greeting_Widget SHALL display the greeting "Good evening".
6. WHEN the local time is between 22:00 and 04:59, THE Greeting_Widget SHALL display the greeting "Good night".

---

### Requirement 2: Focus Timer

**User Story:** As a user, I want a 25-minute countdown timer with start, stop, and reset controls, so that I can use the Pomodoro technique to manage focused work sessions.

#### Acceptance Criteria

1. THE Focus_Timer SHALL initialise with a countdown value of 25 minutes (1500 seconds).
2. WHEN the user activates the Start control, THE Focus_Timer SHALL begin counting down one second per real-world second.
3. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL display the remaining time in MM:SS format.
4. WHEN the user activates the Stop control, THE Focus_Timer SHALL pause the countdown and retain the current remaining time.
5. WHEN the user activates the Reset control, THE Focus_Timer SHALL stop any active countdown and restore the display to 25:00.
6. WHEN the countdown reaches 00:00, THE Focus_Timer SHALL stop automatically and display a visual indication that the session has ended.
7. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL disable the Start control and enable the Stop and Reset controls.
8. WHILE the Focus_Timer is paused or reset, THE Focus_Timer SHALL enable the Start control and disable the Stop control.

---

### Requirement 3: To-Do List

**User Story:** As a user, I want to add, edit, complete, and delete tasks in a persistent to-do list, so that I can track what I need to accomplish during the day.

#### Acceptance Criteria

1. THE Todo_List SHALL provide an input field and a submit control for adding new tasks.
2. WHEN the user submits a non-empty task title, THE Todo_List SHALL add a new Task with a unique identifier, the provided title, and a completion state of false.
3. IF the user submits an empty or whitespace-only task title, THEN THE Todo_List SHALL not add a Task and SHALL display an inline validation message.
4. WHEN the user activates the edit control for a Task, THE Todo_List SHALL allow the user to modify the Task's title inline.
5. WHEN the user confirms an inline edit with a non-empty title, THE Todo_List SHALL update the Task's title and persist the change to Storage.
6. IF the user confirms an inline edit with an empty or whitespace-only title, THEN THE Todo_List SHALL discard the edit and retain the original title.
7. WHEN the user activates the completion toggle for a Task, THE Todo_List SHALL toggle the Task's completion state and persist the change to Storage.
8. WHEN the user activates the delete control for a Task, THE Todo_List SHALL remove the Task from the list and persist the change to Storage.
9. THE Todo_List SHALL persist all Tasks to Storage after every add, edit, complete, or delete operation.
10. WHEN the Dashboard loads, THE Todo_List SHALL read all Tasks from Storage and render them in the order they were added.

---

### Requirement 4: Quick Links

**User Story:** As a user, I want to save and access shortcut buttons to my favourite websites, so that I can navigate to them quickly from the dashboard.

#### Acceptance Criteria

1. THE Quick_Links SHALL provide controls for adding a new Link consisting of a label and a URL.
2. WHEN the user submits a Link with a non-empty label and a valid URL, THE Quick_Links SHALL add the Link and persist it to Storage.
3. IF the user submits a Link with an empty label or an empty URL, THEN THE Quick_Links SHALL not add the Link and SHALL display an inline validation message.
4. WHEN the user activates a Link button, THE Quick_Links SHALL open the associated URL in a new browser tab.
5. WHEN the user activates the delete control for a Link, THE Quick_Links SHALL remove the Link and persist the change to Storage.
6. THE Quick_Links SHALL persist all Links to Storage after every add or delete operation.
7. WHEN the Dashboard loads, THE Quick_Links SHALL read all Links from Storage and render them.

---

### Requirement 5: Data Persistence

**User Story:** As a user, I want my tasks and quick links to survive page refreshes, so that I do not lose my data between sessions.

#### Acceptance Criteria

1. THE Storage SHALL store Tasks under a dedicated key in Local Storage as a JSON-serialised array.
2. THE Storage SHALL store Links under a dedicated key in Local Storage as a JSON-serialised array.
3. WHEN data is written to Storage, THE Storage SHALL serialise the data to a valid JSON string before writing.
4. WHEN data is read from Storage, THE Storage SHALL deserialise the JSON string and return the original data structure.
5. FOR ALL valid Task arrays, serialising then deserialising SHALL produce an array equivalent to the original (round-trip property).
6. FOR ALL valid Link arrays, serialising then deserialising SHALL produce an array equivalent to the original (round-trip property).
7. IF the Storage key is absent or contains malformed JSON, THEN THE Storage SHALL return an empty array and not throw an unhandled exception.

---

### Requirement 6: Technical Constraints

**User Story:** As a developer, I want the dashboard built with plain web technologies and a minimal file structure, so that it requires no build tools, servers, or dependencies to run.

#### Acceptance Criteria

1. THE Dashboard SHALL be implemented using only HTML, CSS, and Vanilla JavaScript with no third-party frameworks or libraries.
2. THE Dashboard SHALL require no backend server; opening `index.html` directly in a browser SHALL be sufficient to run the application.
3. THE Dashboard SHALL contain exactly one CSS file located at `css/style.css`.
4. THE Dashboard SHALL contain exactly one JavaScript file located at `js/app.js`.
5. THE Dashboard SHALL function correctly in Modern_Browser without polyfills or transpilation.

---

### Requirement 7: Visual Design and Performance

**User Story:** As a user, I want the dashboard to load quickly and present a clean, readable interface, so that it does not slow me down or distract me.

#### Acceptance Criteria

1. THE Dashboard SHALL render all widgets in a single viewport without requiring vertical scrolling on screens with a height of 768px or greater.
2. THE Dashboard SHALL apply a clear visual hierarchy that distinguishes the Greeting_Widget, Focus_Timer, Todo_List, and Quick_Links sections.
3. WHEN the user interacts with any control, THE Dashboard SHALL reflect the updated state within 100ms.
4. THE Dashboard SHALL use a font size of at least 16px for body text to ensure readability.
