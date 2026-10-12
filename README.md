# Hack Club Terra

Neural-style cellular automata playground built with plain HTML, CSS, and JavaScript.

## Project Structure

- `index.html`: UI layout, controls, and simulation canvas
- `style.css`: Responsive two-column layout, control styling, and canvas presentation
- `script.js`: State management, render loop, interaction handlers, and CA rules

## Simulation Architecture

- **Renderer**: `<canvas id="simulationCanvas">` at 800x600 internal resolution, displayed responsively with CSS `aspect-ratio: 4 / 3`
- **Grid model**:
  - `max_grid_size = 100` allocates the backing array
  - active simulation size is controlled by `grid_size` (`10..100`)
  - width is derived as `floor(4/3 * grid_size)` to match canvas aspect ratio
- **Main loop**:
  - `requestAnimationFrame(simulation_control)` drives updates
  - FPS slider sets `interval = 1000 / speed`
  - frame updates are throttled by comparing `current_time - lastFrameTime`

## Rule Sets and Boundary Behavior

Rule selection is handled in `patternSelector`:

- `gol`: born `[3]`, survive `[2,3]` (Conway's Game of Life)
- `highLife`: born `[3,6]`, survive `[2,3]`
- `seeds`: born `[2]`, survive `[0]`

Edge behavior is selected with `endBehaviorSelector`:

- `None`: hard boundaries (out-of-range neighbors ignored)
- `wrapUp`: wrap top/bottom only
- `wrapSide`: wrap left/right only
- `torus`: full wrapping in both dimensions

Neighbor counting is implemented in `count_alive_cells(row, column)`.

## Controls and Events

Implemented control bindings in `script.js`:

- Start/Stop: `start_simulation()` / `stop_simulation()`
- Step: one-generation update when simulation is paused
- Reset: clear canvas, reset counters, stop animation
- Randomize: regenerate cells via `create_random_grid()`
- FPS slider: updates frame throttle interval
- Grid size slider: only applies when not running
- Canvas click/drag: toggle cell state (`mousedown` + `mousemove`)
- Grid lines checkbox: overlays or clears line grid

## Runtime Notes

- Generation and alive counters are updated via `update_counters()` and `update_alive()`
- Pointer coordinates are scaled from CSS pixels to canvas pixels in `toggle_cell()`
- Grid lines are redrawn after each frame when enabled

## Run Locally

Open `index.html` directly in a browser, or serve it locally:

```powershell
cd "D:\Janmejay\Hack Club Terra"
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Known Implementation Notes

- `#pauseButton` is styled in `style.css` but not present in `index.html`
- `create_random_grid()` currently uses `Math.random() < 100/newChance`, which strongly favors dead cells at typical slider values
