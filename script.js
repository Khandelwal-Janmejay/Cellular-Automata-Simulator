// Inputs
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const resetButton = document.getElementById('resetButton');
const fpsSlider = document.getElementById('fpsSlider');
const patternSelector = document.getElementById('patternSelector');
const gridSizeSlider = document.getElementById('gridSizeSlider');
const stepButton = document.getElementById('stepButton');
const pauseButton = document.getElementById('pauseButton');
const randomButton = document.getElementById('randomButton');

//outputs and spans and counters
const fpsValue = document.getElementById('fpsValue');
const gridSizeValue = document.getElementById('gridSizeValue');
const showgridlines = document.getElementById('showgridlines');

// grid definition
const simulationCanvas = document.getElementById('simulationCanvas');
const ctx = simulationCanvas.getContext('2d');

// variables
let speed = fpsSlider.value;
let grid = [];
let grid_size = gridSizeSlider.value;
let max_grid_size = 100;
// event listeners
fpsSlider.addEventListener('input', () => {
    sync_speed();
});

gridSizeSlider.addEventListener('input', () => {
    sync_grid();
    reset_grid();
    draw_grid();
    if (showgridlines.checked) {
        draw_lines();
    }
})

showgridlines.addEventListener('input', () => {
    // if clicked, draw lines, else clear lines
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
})

simulationCanvas.addEventListener('click', (event) => {
    toggle_cell(event);
})

// functions
function sync_speed() {
    if (fpsSlider.value !== speed) {
        speed = fpsSlider.value;
        fpsValue.textContent = speed;
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

function grid_reset(num_cells) {
    let cloned = []
    for (let i = 0; i < num_cells; i++) {
        cloned[i] = [];
        for (let j = 0; j < num_cells * 4 / 3; j++) {
            if (grid[i][j] !== undefined) {
                cloned[i][j] = grid[i][j];
            }
            else {
                cloned[i][j] = 0;
            }
        }
    }

    for (let i = 0; i < num_cells; i++) {
        grid[i] = [];
        for (let j = 0; j < num_cells * 4 / 3; j++) {
            if (cloned[i] !== undefined) {
                grid[i][j] = cloned[i][j];
            } else {
                grid[i][j] = 0; // Initialize new cells to 0
            }
        }
    }
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

function full_reset() {
    clear_lines();
    reset_grid();
}
create_grid(max_grid_size);