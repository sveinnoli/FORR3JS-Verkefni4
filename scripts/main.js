import {Game} from "./game.js"
import {UserInterface} from './userInterface.js'

// Initializes game when User prompts to start
let game = new Game(canvas);

// Initializes event listeners
let userInterface = new UserInterface(game);

// Handles resizing the window for example when rotating the phone
function handleResize() {
    let computedStyle = getComputedStyle(canvas);
    canvas.width = parseFloat(window.innerWidth - parseFloat(computedStyle.borderRight)*2);
    canvas.height = parseFloat(window.innerHeight - parseFloat(computedStyle.borderBottom)*2);
}

// handleResize();


// Set height and width on page load or resize
// window.addEventListener("resize", handleResize);





