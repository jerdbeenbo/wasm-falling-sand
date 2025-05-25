// Import the wasm module
import init, {
  wasm_bridge_init,
  wasm_bridge_update,
  add_sand,
} from "./pkg/wasm_falling_sand.js";

let canvas, ctx;
const cellSize = 4;

// Initialize everything from wasm
await init();

let lastSimulationTime = 0;
const simulationInterval = 1000 / 60; // Run simulation 60 times per second
function animate(currentTime) {
  // Only run simulation if enough time has passed
  if (currentTime - lastSimulationTime >= simulationInterval) {
    const data = wasm_bridge_update();
    
    // Store the latest simulation data
    window.currentSimulationData = data;
    lastSimulationTime = currentTime;
  }
  
  // Draw at full 60fps using the latest simulation data
  if (window.currentSimulationData) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < window.currentSimulationData.active_particles.length; i++) {
      const [row, col] = window.currentSimulationData.active_particles[i];
      const x = col * cellSize;
      const y = row * cellSize;
      
      ctx.fillStyle = "yellow";
      ctx.fillRect(x, y, cellSize, cellSize);
    }
  }
  
  requestAnimationFrame(animate);
}

async function draw() {
  wasm_bridge_init();
  canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    //create an object with tooling for drawing on the canvas
    ctx = canvas.getContext("2d");

    canvas.width = 1200;
    canvas.height = 800;

    setupMouseInput();

    //begin the animation
    animate();
  }
}

function setupMouseInput() {
  canvas.addEventListener('mousedown', handleMouse);
  canvas.addEventListener('mousemove', handleMouseMove);
}

let isMouseDown = false;

function handleMouse(event) {
  isMouseDown = true;
  addSandAtMouse(event);
}

function handleMouseMove(event) {
  if (isMouseDown) {
    addSandAtMouse(event);
  }
}

// Stop drawing when mouse is released
document.addEventListener('mouseup', () => {
  isMouseDown = false;
});

function addSandAtMouse(event) {
  // Get mouse position relative to canvas
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  
  // Convert pixel coordinates to grid coordinates
  const col = Math.floor(mouseX / cellSize);
  const row = Math.floor(mouseY / cellSize);
  
  console.log(`Adding sand at grid(${row}, ${col})`);
  
  // Call your Rust function to add sand
  add_sand(row, col);
}

//Listen for go-ahead signal from browser to start the simulation
window.addEventListener("load", draw);
