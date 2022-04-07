import {Game} from "./game.js"
import {UserInterface} from './userInterface.js'

// Initializes game when User prompts to start

// Handles resizing the window for example when rotating the phone
function handleResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerWidth / 2.031;
}

handleResize();


// Set height and width on page load or resize
window.addEventListener("resize", handleResize);
let game = new Game(canvas);

// Initializes event listeners
let userInterface = new UserInterface(game);

// can use this to get offset from top with canvas to place items accordingly
// canvas.getBoundingClientRect().top; 




