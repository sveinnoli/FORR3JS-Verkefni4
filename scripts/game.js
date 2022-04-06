const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
import { uiElements } from "./uiElements.js";
import { Asteroid, Ship } from "./object.js"
export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.config;
        this.gameState = uiElements.gameState;
        this.__setupGamestate();
    }

    __setupGamestate() {
        // Need to add a mutation observer
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
              if (mutation.type == "attributes") {
                console.log("attributes changed")
              }
            });
          });
        observer.observe(this.gameState, { attributes: true, childList: true, subtree: true });
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

    loop(config) {
        // Here we keep going 
        this.setup_config(config);
        this.initGame();
        this.__changeGamestate('playing');
        if (1 == 2) {
            // Here we need to validate the game is still running
            // If so we request another frame otherwise we do not and end the game.
            // we would have to do that with the ship object as when the player dies off 
            // the game would end
            window.requestAnimationFrame(this.loop.bind(this));
        }
        return false;
        
    }
}