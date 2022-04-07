const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
import { uiElements } from "./uiElements.js";
import { Asteroid, Ship } from "./objects.js"


export class Game {
    constructor(canvas) {
        this.asteroids = [];
        this.ship;
        this.canvas = canvas;
        this.config;
        this.currentAnimationFrameID;
        this.gameState = uiElements.gameState;

        this.__setup_gamestate_handler();
        this.__setup_event_handlers();
        this.handleResize(); // Call once on startup to adjust screen
        this.generateAsteroids();
    }

    generateAsteroids() {
        for (let i = 0; i < 30; i++) {
            this.asteroids.push(new Asteroid(Math.random()*canvas.width, Math.random()* canvas.height, 3/5, 2/5))
        }
    }

    generateShips() {
        this.ship = new Ship(2, 2);
    }

    __setup_gamestate_handler() {
        // MutationObserver handles all the changes in the gameState element
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
              if (mutation.type == "attributes") {
                    let newState = this.gameState.getAttribute('gamestate');
                    if (newState === "resume") {
                        this.__resume_game();
                    } else if (newState === "paused") {
                        this.__pause_game();                        
                    }
              }
            }.bind(this));
          }.bind(this));
        observer.observe(this.gameState, { attributes: true});
    }

    // Used to resume the game from the pause menu
    __pause_game() {
        window.cancelAnimationFrame(this.currentAnimationFrameID);
    }
    
    __resume_game() {
        window.requestAnimationFrame(this.loop.bind(this));
    }

    handleResize() {
        let gameState = this.gameState.getAttribute("gamestate")
        if (gameState === "playing" || gameState === "resume") {
            // Detected change in window size while playing send pause to gameState
            this.__changeGamestate("paused");
        }
        canvas.width = window.innerWidth;
        canvas.height = window.innerWidth / 2.031;
    }

    __setup_event_handlers() {
        window.addEventListener("resize", this.handleResize.bind(this));
    }

    __changeGamestate(newState) {
        this.gameState.setAttribute('gamestate', newState)
    }

    initGame(config) {
        // Configure game from config and difficulty level
        this.config = config;
    }   

    start() {
        // Here we initialize all of our stuff
        this.__changeGamestate('playing');
        this.loop();
    }

    clearScreen() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
    
    loop() {
        this.clearScreen();
        this.asteroids.map(asteroid => {
            asteroid.render();
            asteroid.move();
            asteroid.collision();
        })
        this.currentAnimationFrameID = window.requestAnimationFrame(this.loop.bind(this));
    }
}