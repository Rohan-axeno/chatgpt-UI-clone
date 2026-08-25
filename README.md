# ChatGPT UI Clone

ChatGPT web application built using only **HTML5 + SCSS + Vanilla JavaScript** — no frameworks, no libraries, no backend.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (for SCSS compilation)

### Installation

```bash
git clone https://github.com/Rohan-axeno/chatgpt-UI-clone
cd chatgpt-UI-clone
npm install
```

### Development

```bash
npm run sass
```

This starts the SCSS watcher. Open `index.html` directly in your browser.

---

## 📁 Project Structure

```
chatgpt-UI/
├── index.html              # Single-page application entry
├── package.json            # SCSS compiler dependency
│
├── scss/                   # SCSS source (7-1 pattern)
│   ├── main.scss           # Entry point — imports all partials
│   ├── abstracts/
│   │   ├── _variables.scss # Design tokens (colors, spacing, typography, etc.)
│   │   └── _mixins.scss    # Functions, breakpoints, utility mixins
│   ├── base/
│   │   ├── _reset.scss     # CSS reset
│   │   ├── _base.scss      # Global styles, icon sizing, utilities
│   │   └── _typography.scss# Typography scale classes
│   ├── components/
│   │   ├── _buttons.scss   # Icon buttons
│   │   ├── _chat.scss      # Messages, code blocks, tables, typing indicator
│   │   ├── _composer.scss  # Textarea, attachments, send/stop buttons
│   │   ├── _dropdown.scss  # Popover/dropdown system
│   │   ├── _modal.scss     # Search modal, settings modal
│   │   └── _tooltip.scss   # Hover tooltips
│   ├── layout/
│   │   ├── _container.scss # App layout, header, mobile overlay
│   │   └── _sidebar.scss   # Sidebar, drawer, history groups
│   └── pages/
│       └── _home.scss      # Chat page, greeting, suggestions, model selector
│
├── css/
│   └── main.css            # Compiled CSS output
│
├── js/                     # Modular JavaScript
│   ├── main.js             # Global: dropdowns, message actions, model selector, shortcuts
│   ├── data/
│   │   └── _data.js        # Mock data: chat history, responses, models
│   ├── Components/
│   │   ├── _chat.js        # Message rendering (user, assistant, code, tables, lists)
│   │   ├── _composer.js    # Textarea auto-grow, send, file picker, stop generating
│   │   ├── _sidebar.js     # Toggle, new chat, history rendering, rename, delete
│   │   └── _modals.js      # Search modal, settings modal, navigation
│   └── Utils/
│       └── helper.js       # Utilities: escapeHtml, clipboard, debounce, formatFileSize
│
└── assets/
    └── icons/              # SVG icons (30+ files)
```

---

## 🎨 SCSS Architecture

### Design Tokens (`_variables.scss`)

All visual values are centralized — **no hardcoded values in component files**.

| Category          | Examples                                                                               |
| ----------------- | -------------------------------------------------------------------------------------- |
| **Colors**        | `$color-bg-primary`, `$color-text-muted`, `$color-danger`, `$color-code-bg`            |
| **Spacing**       | `$spacing-4` through `$spacing-80` (consistent rem scale)                              |
| **Typography**    | `$font-size-xs` through `$font-size-3xl`, `$font-weight-normal` to `$font-weight-bold` |
| **Border Radius** | `$radius-sm` through `$radius-full`, `$radius-circle`                                  |
| **Shadows**       | `$shadow-sm` through `$shadow-xl`, `$shadow-tooltip`                                   |
| **Z-Index**       | `$z-dropdown: 100`, `$z-sticky: 200`, `$z-overlay: 500`, `$z-modal: 1000`              |
| **Layout**        | `$sidebar-width`, `$chat-max-width`, `$content-max-width`                              |

### Breakpoints

```scss
$breakpoint-mobile: rem(480);
$breakpoint-tablet: rem(768);
$breakpoint-desktop: rem(1024);
$breakpoint-wide: rem(1280);
```

Used via mixins: `@include mobile-only`, `@include tablet-up`, `@include desktop-up`, `@include wide-up`.

### Key Rules

- **No element tag selectors** (except in `_reset.scss`)
- **No `!important`** declarations
- **No hardcoded hex/px values** outside `_variables.scss`
- All sizing uses the `rem()` function

---

## ⚡ JavaScript Structure

All JS is modular and uses Vanilla JavaScript only:

| File           | Responsibility                                                                                             |
| -------------- | ---------------------------------------------------------------------------------------------------------- |
| `_data.js`     | Mock data store (chat history, responses, models)                                                          |
| `helper.js`    | Utility functions (escape, clipboard, debounce, formatting)                                                |
| `_chat.js`     | Message rendering (user/assistant bubbles, code blocks, lists, tables, typing indicator)                   |
| `_composer.js` | Auto-growing textarea, send/voice/stop toggling, file picker, upload simulation                            |
| `_sidebar.js`  | Collapse/expand, mobile drawer, new chat, history rendering, rename, delete                                |
| `_modals.js`   | Search modal with live filtering & no-results state, settings modal with 5 panels                          |
| `main.js`      | Global dropdown system, message actions (copy/like/dislike/regenerate), model selector, keyboard shortcuts |

---

## 🎯 Key Implementation Decisions

1. **No frameworks** — Everything is built with Vanilla JS using event delegation for performance
2. **IIFE pattern** — Component JS files are wrapped in IIFEs to avoid global namespace pollution
3. **Event delegation** — Dynamic content (chat messages, sidebar items) uses document-level listeners
4. **Form submission** — Composer is wrapped in `<form>` for proper Enter-to-submit behavior
5. **rem() everywhere** — All pixel values converted via SCSS `rem()` function for consistent scaling
6. **Mobile-first responsive** — Sidebar becomes a drawer on mobile, collapses on tablet
7. **Accessibility-first** — Semantic HTML5, ARIA attributes, focus-visible states, keyboard navigation
8. **XSS prevention** — All user-generated content is escaped via `escapeHtml()` before DOM insertion

---

## ♿ Accessibility

- Semantic HTML5: `<aside>`, `<nav>`, `<main>`, `<header>`, `<section>`, `<form>`, `<button>`
- ARIA: `aria-label`, `aria-expanded`, `aria-modal`, `role="menu"`, `role="dialog"`, `aria-live="polite"`
- Keyboard: `Ctrl+K` (search), `Ctrl+Shift+O` (new chat), `Ctrl+Shift+S` (sidebar), `Escape` (close)
- Focus: `:focus-visible` states on all interactive elements
- Labels: All inputs have associated labels (visible or `visually_hidden`)

---

## 📱 Responsive Behavior

| Viewport                | Sidebar                        | Layout                      |
| ----------------------- | ------------------------------ | --------------------------- |
| **Mobile** (< 768px)    | Off-canvas drawer with overlay | Full-width, reduced padding |
| **Tablet** (768–1024px) | Collapsible                    | Adjusted spacing            |
| **Desktop** (> 1024px)  | Always visible                 | Full layout                 |

---

## 🔧 Features Implemented

- [x] Application layout (sidebar + main + header + composer)
- [x] Sidebar with utils, grouped history, hover actions, collapse
- [x] New chat / chat selection with active state
- [x] Chat screen (greeting, suggestions, active conversation)
- [x] Message rendering (user bubbles, assistant messages)
- [x] Message actions (copy, like, dislike, regenerate)
- [x] Code blocks with language label + copy button
- [x] Lists and tables in messages
- [x] Multi-line auto-growing composer
- [x] Send / Voice / Stop button states
- [x] Mock AI responses (keyword-based routing)
- [x] Typing indicator animation
- [x] Loading/generating state with stop button
- [x] Conversation search with live filter + no-results
- [x] Model selector with descriptions + selected state
- [x] Attachment UI (file picker, preview, progress, remove)
- [x] Settings modal (General, Appearance, Profile, Shortcuts, Notifications)
- [x] Responsive design (mobile drawer, tablet collapse, desktop full)
- [x] Design system (complete token set)
- [x] SVG icons throughout (no emojis)
- [x] Rename/Delete conversations
- [x] Keyboard shortcuts (Ctrl+K, Ctrl+Shift+O/S, Escape)
- [x] Accessibility (semantic HTML, ARIA, focus states)
