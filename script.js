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
let grid_size = gridSizeSlider.value;

// event listeners
speedSlider.addEventListener('input', () => {
    sync_speed();
});
gridSizeSlider.addEventListener('input', () => {
    sync_grid();
    draw_lines();
})

showgridlines.addEventListener('input', () => {
    if (showgridlines.checked) {
        draw_lines();
    } else {
        reset_grid();
    }
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
    reset_grid()
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
