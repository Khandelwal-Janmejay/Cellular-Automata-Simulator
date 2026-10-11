// Inputs
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const resetButton = document.getElementById('resetButton');
const fpsSlider = document.getElementById('fpsSlider');
const patternSelector = document.getElementById('patternSelector');
const gridSizeSlider = document.getElementById('gridSizeSlider');
const stepButton = document.getElementById('stepButton');
const randomButton = document.getElementById('randomButton');

//outputs and spans and counters
const fpsValue = document.getElementById('fpsValue');
const gridSizeValue = document.getElementById('gridSizeValue');
const showgridlines = document.getElementById('showgridlines');
const generationCounter = document.getElementById('generationCounter');
const aliveCounter = document.getElementById('aliveCounter');

// grid definition
const simulationCanvas = document.getElementById('simulationCanvas');
const ctx = simulationCanvas.getContext('2d');

// variables
let speed = fpsSlider.value;
let grid = [];
let grid_size = gridSizeSlider.value;
let max_grid_size = 100;
let interval = 1000 / speed;
let lastFrameTime = 0;
let animationFrameId = null;
let isRunning = false;
let isMouseDown = false;
// Cellular Automata Variables
let rules = [
    [3],
    [2, 3],
    [3, 6],
    [2,3],
    [2],
    [0]
];

let current_rule_alive = rules[0];
let current_rule_survive = rules[1];

// event listeners
fpsSlider.addEventListener('input', () => {
    sync_speed();
});

gridSizeSlider.addEventListener('input', () => {
    if (!isRunning) {
        sync_grid();
        reset_grid();
        draw_grid();
        if (showgridlines.checked) {
            draw_lines();
        }
    }
    else {
        gridSizeSlider.value = grid_size;
    }
})

showgridlines.addEventListener('input', () => {
    if (showgridlines.checked) {
        draw_lines();
    } else {
        clear_lines();
        draw_grid();
    }

})

randomButton.addEventListener('click', () => {
    randomize_grid();
})

resetButton.addEventListener('click', () => {
    reset_grid();
    create_grid(max_grid_size);
    if (showgridlines.checked) {
        draw_lines();
    }
    reset_counters();
    stop_simulation();
})

simulationCanvas.addEventListener('click', (event) => {
    toggle_cell(event);
})

simulationCanvas.addEventListener('mousedown', (event) => {
    isMouseDown = true;
})

simulationCanvas.addEventListener('mouseup', (event) => {
    isMouseDown = false;
})

simulationCanvas.addEventListener('mousemove', (event) => {
    if (isMouseDown) {
        toggle_cell(event);
    }
})

startButton.addEventListener('click', () => {
    start_simulation();
})

stopButton.addEventListener('click', () => {
    stop_simulation();
});

patternSelector.addEventListener('input', () => {
    const selectedPattern = patternSelector.value;
    switch (selectedPattern) {
        case 'gol':
            current_rule_alive = rules[0];
            current_rule_survive = rules[1];
            break;
        case 'highLife':
            current_rule_alive = rules[2];
            current_rule_survive = rules[3];
            break;
        case 'seeds':
            current_rule_alive = rules[4];
            current_rule_survive = rules[5];
            break;
        default:
            current_rule_alive = rules[0];
            current_rule_survive = rules[1];
    }
})

stepButton.addEventListener('click', () => {
    if (!isRunning) {
        update_grid();
    }
    update_counters();
})
// functions
function sync_speed() {
    if (fpsSlider.value !== speed) {
        speed = fpsSlider.value;
        fpsValue.textContent = speed;
        interval = 1000 / speed;
    }
}

function start_simulation() {
    if (isRunning) {
        return;
    }

    isRunning = true;
    lastFrameTime = 0;
    animationFrameId = requestAnimationFrame(simulation_control);
}

function stop_simulation() {
    isRunning = false;

    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

function sync_grid() {
    if (gridSizeSlider.value !== grid_size) {
        grid_size = gridSizeSlider.value;
        gridSizeValue.textContent = grid_size;
    }
}

function grid_math() {
    // Perform grid math operations here
    let grid_height = simulationCanvas.height;
    let grid_width = simulationCanvas.width;
    let num_cells_height = grid_size;
    let num_cells_width = Math.floor(4 / 3 * num_cells_height);
    let horizontal_cell_size = (grid_width / num_cells_width);
    let vertical_cell_size = (grid_height / num_cells_height);
    return {
        horizontal_cell_size,
        vertical_cell_size
    };
}

function reset_grid() {
    ctx.clearRect(0, 0, simulationCanvas.width, simulationCanvas.height);
}

function draw_lines() {
    const { horizontal_cell_size, vertical_cell_size } = grid_math();
    const num_cells_height = grid_size;
    const num_cells_width = Math.floor(4 / 3 * num_cells_height);
    ctx.strokeStyle = 'black';
    for (let i = 0; i <= num_cells_height; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * vertical_cell_size);
        ctx.lineTo(simulationCanvas.width, i * vertical_cell_size);
        ctx.stroke();
    }
    for (let i = 0; i <= num_cells_width; i++) {
        ctx.beginPath();
        ctx.moveTo(i * horizontal_cell_size, 0);
        ctx.lineTo(i * horizontal_cell_size, simulationCanvas.height);
        ctx.stroke();
    }
}

function create_random_grid() {
    let num_cells_height = grid_size;
    let num_cells_width = Math.floor(4 / 3 * num_cells_height);
    let new_grid = [];
    for (let i = 0; i < max_grid_size; i++) {
        new_grid[i] = [];
        for (let j = 0; j < Math.floor(max_grid_size * 4 / 3); j++) {
            if (i < num_cells_height && j < num_cells_width) {
                new_grid[i][j] = Math.random() < 0.5 ? 0 : 1; // Randomly assign 0 or 1
            } else {
                new_grid[i][j] = grid[i][j];
            }
        }
    }
    return new_grid;
}
function randomize_grid() {
    grid = create_random_grid();
    draw_grid();
    if (showgridlines.checked) {
        draw_lines();
    }
    update_alive();
}

function draw_grid() {
    // Draw the grid on the canvas
    const { horizontal_cell_size, vertical_cell_size } = grid_math();
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === 1) {
                ctx.fillStyle = 'green'; // Color for alive cells
            } else {
                ctx.fillStyle = '#141914'; // Color for dead cells
            }
            ctx.fillRect(j * horizontal_cell_size, i * vertical_cell_size, horizontal_cell_size, vertical_cell_size);
        }
    }
}

function toggle_cell(event) {
    const { horizontal_cell_size, vertical_cell_size } = grid_math();

    const rect = simulationCanvas.getBoundingClientRect();

    // scale factor: internal resolution ÷ displayed size
    const scaleX = simulationCanvas.width / rect.width;
    const scaleY = simulationCanvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const col = Math.floor(x / horizontal_cell_size);
    const row = Math.floor(y / vertical_cell_size);

    if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) return;

    grid[row][col] = grid[row][col] === 1 ? 0 : 1;
    draw_grid();
    if (showgridlines.checked) {
        draw_lines();
    }
    update_alive();
}

function create_grid(num_cells) {
    grid = [];
    for (let i = 0; i < num_cells; i++) {
        grid[i] = [];
        for (let j = 0; j < num_cells * 4 / 3; j++) {
            grid[i][j] = 0;
        }
    }
}

function clear_lines() {
    const { horizontal_cell_size, vertical_cell_size } = grid_math();
    const num_cells_height = grid_size;
    const num_cells_width = Math.floor(4 / 3 * num_cells_height);
    ctx.strokeStyle = "#141914";
    for (let i = 0; i <= num_cells_height; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * vertical_cell_size);
        ctx.lineTo(simulationCanvas.width, i * vertical_cell_size);
        ctx.stroke();
    }
    for (let i = 0; i <= num_cells_width; i++) {
        ctx.beginPath();
        ctx.moveTo(i * horizontal_cell_size, 0);
        ctx.lineTo(i * horizontal_cell_size, simulationCanvas.height);
        ctx.stroke();
    }
}

function simulation_control(current_time) {
    if (!isRunning) {
        return;
    }

    animationFrameId = requestAnimationFrame(simulation_control);

    if (current_time - lastFrameTime < interval) {
        return;
    }
    lastFrameTime = current_time;

    update_grid();
}

function calculate_next_generation() {
    const num_cells_height = grid_size;
    const num_cells_width = Math.floor(4 / 3 * num_cells_height);
    let new_grid = [];
    for (let i = 0; i < num_cells_height; i++) {
        new_grid[i] = [];
        for (let j = 0; j < num_cells_width; j++) {
            new_grid[i][j] = 0;
        }
    }
    // Apply the rules of the game to determine the next state of each cell
    for (let i = 0; i < num_cells_height; i++) {
        for (let j = 0; j < num_cells_width; j++) {
            let alive_neighbors = 0;
            // Count alive neighbors
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    if (x === 0 && y === 0) continue; // Skip the cell itself
                    const ni = i + x;
                    const nj = j + y;
                    if (ni >= 0 && ni < num_cells_height && nj >= 0 && nj < num_cells_width) {
                        alive_neighbors += grid[ni][nj];
                    }
                }
            }
            // Apply the rules of the game
            if (grid[i][j] === 1) {
                // Cell is alive
                if (current_rule_survive.includes(alive_neighbors)) {
                    new_grid[i][j] = 1;
                } else {
                    new_grid[i][j] = 0;
                }
            } else {
                // Cell is dead
                if (current_rule_alive.includes(alive_neighbors)) {
                    new_grid[i][j] = 1;
                } else {
                    new_grid[i][j] = 0; // Cell remains dead
                }
            }
        }
    }
    grid = new_grid;
}
function update_grid() {
    calculate_next_generation();
    draw_grid();
    if (showgridlines.checked) {
        draw_lines();
    }
    update_counters();
}

function update_counters() {
    let current_generation = parseInt(generationCounter.textContent.split(": ")[1]);
    current_generation++;
    generationCounter.textContent = "GENERATION: " + String(current_generation);
    update_alive();
}

function update_alive() {
    const num_cells_height = grid_size;
    const num_cells_width = Math.floor(4 / 3 * num_cells_height);
    let alive_count = 0;
    for (let i = 0; i < num_cells_height; i++) {
        for (let j = 0; j < num_cells_width; j++) {
            if (grid[i][j] === 1) {
                alive_count++;
            }
        }
    }
    aliveCounter.textContent = "ALIVE CELLS: " + String(alive_count);
}
function reset_counters() {
    generationCounter.textContent = "GENERATION: 0";
    aliveCounter.textContent = "ALIVE CELLS: 0";
}
create_grid(max_grid_size);