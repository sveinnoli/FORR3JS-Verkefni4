const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
import { uiElements } from "./uiElements.js";
import { Asteroid, Ship } from "./objects.js"


export class Game {
    constructor(canvas) {
        this.asteroids = [];
        this.canvas = canvas;
        this.config;
        this.currentAnimationFrameID;
        this.gameState = uiElements.gameState;

        this.__setupGamestate();
        this.__setup_event_handlers();
        //
        this.generateAsteroids();
    }

    generateAsteroids() {
        for (let i = 0; i < 30; i++) {
            this.asteroids.push(new Asteroid(Math.random()*canvas.width, Math.random()* canvas.height, 3/5, 2/5))
        }
    }

    __setupGamestate() {
        // Watches for changes in the gamestate element
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
              if (mutation.type == "attributes") {
                    let newState = this.gameState.getAttribute('gamestate');
                    if (newState === "playing") {
                        // Resume the game loop
                    } else {
                        // Pause the game loop 
                        window.cancelAnimationFrame(this.start.bind(this));
                    }
              }
            }.bind(this));
          }.bind(this));
        observer.observe(this.gameState, { attributes: true});
    }

    __pause_game() {
        this.__changeGamestate("paused");
        window.cancelAnimationFrame(this.currentAnimationFrameID);
        // Also need to reposition all elements accordingly and bring up the pause menu
    }

    handleResize() {
        if (this.gameState.getAttribute("gamestate") === "playing") {
            this.__pause_game()
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