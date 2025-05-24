async function draw() {
    
    const canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        //create an object with tooling for drawing on the canvas
          const ctx = canvas.getContext("2d");

          /*
            Start communicating with webassembly and running the falling sand simulation...
          */
    }
}

//Listen for go-ahead signal from browser to start the simulation
window.addEventListener('load', draw);