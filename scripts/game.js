const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
import { uiElements } from "./uiElements.js";
import { Asteroid, Ship } from "./objects.js"

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.config;
        this.gameState = uiElements.gameState;
        this.__setupGamestate();
    }

    __setupGamestate() {
        // Watches for changes in the gamestate element
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
              if (mutation.type == "attributes") {
                    let newState = this.gameState.getAttribute('gamestate');
                    if (newState === "playing") {
                        
                    } else {
                        // Pause the game loop 
                        window.cancelAnimationFrame(this.start.bind(this));
                    }
              }
            }.bind(this));
          }.bind(this));
        observer.observe(this.gameState, { attributes: true});
    }

    __changeGamestate(newState) {
        this.gameState.setAttribute('gamestate', newState)
    }

    initGame() {
        // Here we would use the config to set difficulty and the gamemode
    }   

    setup_config(config) {
        this.config = config;
    }

    start() {
        // Here we keep going 
        this.initGame();
        this.__changeGamestate('playing');
        if (1 == 2) {
            // Here we need to validate the game is still running
            // If so we request another frame otherwise we do not and end the game.
            // we would have to do that with the ship object as when the player dies off 
            // the game would end
            window.requestAnimationFrame(this.start.bind(this));
        }
        return false;
        
    }
}