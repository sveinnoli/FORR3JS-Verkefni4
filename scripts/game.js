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
        
        this.screenSize = {"width": undefined, "height": undefined} 

        this.__setup_gamestate_handler();
        this.__setup_event_handlers();
        this.handleResize(); // Call once on startup to adjust screen
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
              if (mutation.type.match(/attributes/)) {
                    let newState = this.gameState.getAttribute('gamestate');
                    if (newState.match(/resume/)) {
                        this.__resume_game();
                    } else if (newState.match(/pause|shop/)) {
                        this.__pause_game();                        
                    } else if (newState.match(/mainmenu/)) {
                        this.quit();
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

    /* 
        Here i may wish to move resize handling over to the UserInterface class
    */
    handleResize() {
        let gameState = this.gameState.getAttribute("gamestate")
        if (gameState.match(/playing|resume/)) {
            // Detected change in window size while playing send pause to gameState
            this.__changeGamestate("pause");
        }
        
        let newWidth = window.innerWidth;
        let newHeight = window.innerWidth / 1.778+40;

        if (!(this.screenSize.width && this.screenSize.height)) {
            // First time running
            this.screenSize.width = newWidth;
            this.screenSize.height = newHeight;
        } else {
            // 
            this.__handle_dimension_change(newWidth, newHeight);
        }

        canvas.width = newWidth;
        canvas.height = newHeight;

        this.screenSize.width = newWidth;
        this.screenSize.height = newHeight;
    }

    __handle_dimension_change(newWidth, newHeight) {
        // TODO make it only calculate after x time has passed to avoid
        // calculating hundreds of times per second
        console.log("Readjusting...")
        let widthRatio = newWidth/this.screenSize.width;
        let heightRatio = newHeight/this.screenSize.height;
        if(this.ship) {
            // Recalculate xpos and ypos
            this.ship.x *= widthRatio;
            this.ship.y *= heightRatio;
            console.log(`Screenwidth is : ${newWidth}`)
            console.log(`Moving x by ${widthRatio}, old x: ${this.ship.x}, "new x: ${this.ship.x*widthRatio}`)
        }

        this.asteroids.map(asteroid => {
            if (asteroid) {
                // Recalculate xpos and ypos
                asteroid.x *= widthRatio;
                asteroid.y *= heightRatio;
            }
        })
    }

    __setup_event_handlers() {
        window.addEventListener("resize", this.handleResize.bind(this));
    }

    __changeGamestate(newState) {
        this.gameState.setAttribute('gamestate', newState)
    }

    initGame(config) {
        // Configure game from config and difficulty level
        // also need to load gameState
        this.config = config;
    }   

    resetGame() {
        window.cancelAnimationFrame(this.currentAnimationFrameID);
        this.ship = undefined;
        this.asteroids = [];
    }

    start() {
        // Here we initialize all of our stuff
        this.generateAsteroids();
        this.generateShips();
        this.__changeGamestate('playing');
        this.loop();
    }

    restart() {
        this.resetGame();
        this.start();
    }

    quit() {
        this.resetGame();
        // Reset variables all variables here on game quit or make a function to do so
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

        // this.ship.render();
        // this.ship.renderTriangle();
        this.ship.renderShip();
        this.ship.update();
        this.currentAnimationFrameID = window.requestAnimationFrame(this.loop.bind(this));
    }
}