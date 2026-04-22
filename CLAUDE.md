# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Learnable Programming Visible Flow Prototype** ("Tangible Time") — an educational visual programming environment inspired by Bret Victor's [Learnable Programming](http://worrydream.com/LearnableProgramming/) essay. The core idea is making execution flow *visible*: users build programs with Blockly blocks, execute them, and can scrub through a time slider to replay execution step-by-step on a Logo-style turtle graphics canvas.

## Running the Project

There is no build step. Open `index.html` directly in a browser, or serve it with any static file server:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

There are no tests, no linter, and no package manager. All dependencies are bundled locally or loaded as git submodules.

## Architecture

### Execution Pipeline

Blockly blocks → JavaScript source (via `Blockly.JavaScript.workspaceToCode`) → `JS-Interpreter` (sandboxed execution) → Microworld canvas rendering.

The key constraint: `JS-Interpreter` runs in an isolated environment separate from the browser. Objects cannot be passed between the two environments directly, so `microworld_procedural_bindings.js` exposes a flat set of global `*CT()` functions (e.g. `moveCT`, `turnCT`) that bridge interpreter calls to the `currentworld` Microworld instance.

### Key Files

- **[js/microworld.js](js/microworld.js)** — The `Microworld` class. Manages two canvas layers (turtle sprite + pen drawing), and a `canvasStoryStack` array that saves canvas snapshots after each command when "time visible" mode is on.
- **[js/microworld_procedural_bindings.js](js/microworld_procedural_bindings.js)** — Global `*CT()` functions that proxy calls from inside the JS-Interpreter sandbox to the `currentworld` global.
- **[js/TurtleBlocks.js](js/TurtleBlocks.js)** — Blockly block definitions and their JavaScript code generators. Each block's generator emits a call to a `*CT()` function.
- **[js/LPBlocks.js](js/LPBlocks.js)** — Additional LP-specific block definitions and bindings (pen, screen, LP API).
- **[js/ui.js](js/ui.js)** — Entry point for DOM interaction. Holds the `currentworld`, `workspace`, and `myInterpreter` globals. Wires up run/step buttons and the time slider.
- **[js/microworld_store.js](js/microworld_store.js)** — Save/load of microworld state to `localStorage`.

### Time-Visible Mode

When the "Mostra passos" toggle is on, after every turtle command `Microworld` pushes a copy of the canvas state onto `canvasStoryStack`. The time slider (`#programTimeSlider`) maps directly to this stack — scrubbing replays the frame at that index via `setPlayTime(frame)`. When the mode is off, all commands render synchronously without saving frames.

### Globals

Three globals in `ui.js` are the backbone of the runtime:
- `currentworld` — the active `Microworld` instance
- `workspace` — the Blockly workspace
- `myInterpreter` — the JS-Interpreter instance for step execution

### Localization

The UI is in Brazilian Portuguese. Blockly messages use `blockly/msg/js/pt-br.js`; custom block messages use `js/msg/pt-br.js`.
