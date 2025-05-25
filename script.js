// Import the wasm module
import init, {
  wasm_bridge_init,
  wasm_bridge_update,
} from "./pkg/wasm_falling_sand.js";

let canvas, ctx;
const cellSize = 4;

// Initialize everything from wasm
await init();

function animate() {
  console.log("animate() called");
  
  const data = wasm_bridge_update();
  console.log("Data from Rust:", data);
  console.log("Number of active particles:", data.active_particles.length);

  //reset canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //draw recs
  for (let i = 0; i < data.active_particles.length; i++) {
    const [row, col] = data.active_particles[i];
    const x = col * cellSize;
    const y = row * cellSize;
    
    console.log(`Drawing particle at grid(${row},${col}) -> pixel(${x},${y})`);

    ctx.fillStyle = "yellow";
    ctx.fillRect(x, y, cellSize, cellSize);
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

    console.log("Canvas setup complete, starting animation");

    //begin the animation
    animate();
  }
}

//Listen for go-ahead signal from browser to start the simulation
window.addEventListener("load", draw);
