// Inputs
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const resetButton = document.getElementById('resetButton');
const speedSlider = document.getElementById('speedSlider');
const patternSelector = document.getElementById('patternSelector');
const gridSizeSlider = document.getElementById('gridSizeSlider');
const stepButton = document.getElementById('stepButton');
const pauseButton = document.getElementById('pauseButton');
const randomButton = document.getElementById('randomButton');

//outputs and spans and counters
const speedValue = document.getElementById('speedValue');
const gridSizeValue = document.getElementById('gridSizeValue');
const showgridlines = document.getElementById('showgridlines');
// grid definition
const simulationCanvas = document.getElementById('simulationCanvas');
const ctx = simulationCanvas.getContext('2d');

// variables
let speed = speedSlider.value;
let grid = [];
let grid_size = gridSizeSlider.value;

// event listeners
speedSlider.addEventListener('input', () => {
    sync_speed();
});
gridSizeSlider.addEventListener('input', () => {
    clear_lines();
    sync_grid();
    grid_reset(grid_size);
    if (showgridlines.checked) {
        draw_lines();
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
})

simulationCanvas.addEventListener('click', (event) => {
    toggle_cell(event);
})
// functions
function sync_speed() {
    if (speedSlider.value !== speed) {
        speed = speedSlider.value;
        speedValue.textContent = speed;
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
    draw_grid()
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
    for (let i = 0; i < num_cells_height; i++) {
        let row = [];
        for (let j = 0; j < num_cells_width; j++) {
            row.push(Math.random() < 0.5 ? 0 : 1); // Randomly assign 0 or 1
        }
        new_grid.push(row);
    }
    return new_grid;
}
function randomize_grid() {
    grid = create_random_grid();
    reset_grid();
    draw_grid();
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
}

grid_reset(grid_size);
function grid_reset(num_cells) {
    reset_grid();
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