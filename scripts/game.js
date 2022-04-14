const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
import { uiElements } from "./uiElements.js";
import { Asteroid, Ship } from "./objects.js"
import { GAMECONFIG } from "./gameConfig.js"
import { Helpers } from "./objects.js"


export class Game {
    constructor(canvas) {
        this.asteroids = [];
        this.ship;
        this.score = 0;
        this.helper = new Helpers();
        this.canvas = canvas;
        this.gameConfig = {};
        this.settings = {}
        this.pressedKeys = {};  
        this.currentAnimationFrameID;
        this.fps = 60; // Can scale it dynamically but browser runs at ~ 60 fps
        this.gameState = uiElements.gameState;        
        this.screenSize = { "width": undefined, "height": undefined } 
        this.screenRatio = canvas.height/window.innerHeight;
        
        // Timings
        this.oldTimestamp = 0;
        this.timestamp = 0;

        this.__setup_gamestate_handler();
        this.__setup_event_handlers();
        this.setupKeys();
        this.handleResize(); // Call once on startup to adjust screen
    }

    handleInputs() {
        if (this.pressedKeys["w"]) { 
            this.ship.moveForward();
        }

        if (this.pressedKeys["s"]) {
            this.ship.moveBackwards();
        }
        
        if (this.pressedKeys["a"]) {
            this.ship.rotateLeft();
        }
        
        if (this.pressedKeys["d"]) {
            this.ship.rotateRight();
        } 

        if (this.pressedKeys[" "]) {
            if (this.timestamp - this.oldTimestamp > this.gameConfig.ship.fireRate) {
                console.log(this.screenRatio);
                this.ship.shoot(this.screenRatio);
                this.oldTimestamp = this.timestamp;
            }
        }
    }

 

    updateScore() {
        // Here we update the score counter on the canvas
    }

    setupKeys() {
        window.addEventListener('keydown', (e) => {
            this.pressedKeys[e.key.toLocaleLowerCase()] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.pressedKeys[e.key.toLowerCase()] = false;
        })

    }

    generateAsteroids() {
        for (let i = 0; i < this.gameConfig.maxAsteroids; i++) {
            // Here we need to dynamically scale the velocities and size based on screensize
            let size = Math.random()*12 + 25 * this.screenRatio;
            let x;
            let y;

            // Randomly place the asteroids at the outer boundaries to avoid collision on game start
            if (Math.random() > 0.5) {
                // Starts top or bottom
                x = Math.random() * canvas.width;
                y = Math.random() > 0.5 ? canvas.height-Math.random()*canvas.height*0.3: Math.random()*canvas.height*0.3;
            } else {
                // Starts left or right
                x = Math.random() > 0.5 ? canvas.width-Math.random()*canvas.width*0.3: Math.random()*canvas.width*0.3;
                y = Math.random()*canvas.height; 
            }
            let xv = Math.random() > 0.5 ? Math.random()*0.2 + 0.2 : -Math.random()*0.2 - 0.2;
            let yv = Math.random() > 0.5 ? Math.random()*0.2 + 0.2 : -Math.random()*0.2 - 0.2; 
            this.asteroids.push(
                new Asteroid(
                    Math.round(Math.random()*2+6),  // Sides
                    x,                              // X
                    y,                              // Y
                    xv,                             // XV
                    yv,                             // YV
                    size,                           // Size
                    Math.random()*360,              // Rotation
                    2                               // Stage
                ));
        }
    }

    generateShips() {
        let size = 25 * canvas.height/window.innerHeight;
        this.ship = new Ship(3, 3, size, 45);
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
                    } else if (newState.match(/defeat/)) {
                        console.log(this.gameConfig, this.settings)
                        this.__pause_game();
                    } else if (newState.match(/victory/)) {
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

    /* 
        Here i may wish to move resize handling over to the UserInterface class
    */
    handleResize() {
        this.screenRatio = canvas.height/window.innerHeight;
        // console.log(canvas.width/1920, canvas.height/1080);
        let gameState = this.gameState.getAttribute("gamestate")
        if (gameState.match(/playing|resume/)) {
            // Detected change in window size while playing send pause to gameState
            this.__changeGamestate("pause");
        }
        
        let newWidth = window.innerWidth;
        let newHeight = window.innerWidth / 1.778;

        if ((this.screenSize.width && this.screenSize.height)) {
            this.__handle_dimension_change(newWidth, newHeight);
        } else {
            // First time running
            this.screenSize.width = newWidth;
            this.screenSize.height = newHeight;
        }

        canvas.width = newWidth;
        canvas.height = newHeight;

        this.screenSize.width = newWidth;
        this.screenSize.height = newHeight;
    }

    __handle_dimension_change(newWidth, newHeight) {
        console.log(this.screenRatio)
        // TODO make it only calculate after x time has passed to avoid
        // calculating hundreds of times per second
        let widthRatio = newWidth/this.screenSize.width;
        let heightRatio = newHeight/this.screenSize.height;
        // Sets ship on new position according to the ratio of the old screensize and new screensize and resizes them
        if(this.ship) {
            this.ship.x *= widthRatio;
            this.ship.y *= heightRatio;
            this.ship.size *= heightRatio;
            this.ship.xv *= heightRatio;
            this.ship.yv *= heightRatio;
            if (this.ship.bullets) {
                for (let i = 0; i < this.ship.bullets.length; i++) {
                    let bullet = this.ship.bullets[i];
                    bullet.x *= heightRatio;
                    bullet.y *= heightRatio;
                    bullet.xv *= heightRatio;
                    bullet.yv *= heightRatio;
                    bullet.size *= heightRatio;
                }
            }
        }
        
        this.asteroids.map(asteroid => {
            if (asteroid) {
                // Recalculate xpos and ypos
                asteroid.x *= widthRatio;
                asteroid.y *= heightRatio;
                asteroid.size *= heightRatio;
                asteroid.xv *= heightRatio;
                asteroid.yv *= heightRatio;
            }
        })
    }

    detectCollision() {
        // TODO change collision to use boxes instead to get more accurate results
        // let j = this.asteroids.length-1;
        // let i = this.ship.bullets.length-1;
        let tempAsteroids = []
        for (let j = 0; j < this.asteroids.length; j++) {
            // Detect collision with bullet and asteroid        
            for (let i = 0; i < this.ship.bullets.length; i++) {
                let delta = Math.sqrt((this.asteroids[j].x - this.ship.bullets[i].x)**2 + (this.asteroids[j].y - this.ship.bullets[i].y)**2);
                if (delta < this.ship.bullets[i].size+this.asteroids[j].size) {
                    console.log("Bullet collided with asteroid");    
                    this.score++;
                    // Splitting asteroid  
                    if (this.asteroids[j].stage > 0) {
                        for (let k = 0; k < this.gameConfig.asteroid.splitBy; k++) {
                            let randAng = Math.random()*360;
                            let xv = this.helper.dXFromAngleAndHypot(randAng, this.asteroids[j].xv*1.1+0.2);
                            let yv = this.helper.dYFromAngleAndHypot(randAng, this.asteroids[j].xv*1.1+0.2);
                            xv = Math.cos(randAng)*this.asteroids[j].xv*1.1;
                            yv = Math.sin(randAng)*this.asteroids[j].yv*1.1;
                            tempAsteroids.push(new Asteroid(
                                Math.round(Math.random()*2+6),                                                            // Sides
                                this.asteroids[j].x + this.helper.dXFromAngleAndHypot(randAng, this.asteroids[j].size),   // X          // X
                                this.asteroids[j].y + this.helper.dYFromAngleAndHypot(randAng, this.asteroids[j].size),   // Y     // Y
                                xv,                                     	                                              // XV
                                yv,                                     	                                              // YV
                                this.asteroids[j].size/1.2,             	                                              // Size
                                Math.random()*360,                      	                                              // Rotation
                                this.asteroids[j].stage-1               	                                              // Stage
                            ));
                        }
                    } else {
                        if (this.asteroids.length === 0) {
                            // Dosen't work as the asteroid gets removed in the end :(
                        }
                    }
                    // Mark asteroid and bullet for removal
                    this.ship.bullets[i].age = this.gameConfig.bullet.maxAge;
                    this.asteroids[j].size = 0;  
                }
            }
            
            // Detect collision with asteroid and ship
            // Change to rectangle-circle hitbox
            let deltaAS = Math.sqrt((this.asteroids[j].x - this.ship.x)**2 + (this.asteroids[j].y - this.ship.y)**2);
            if (deltaAS < this.asteroids[j].size + this.ship.size) {
                // Here we display gameover and all that shieeet
                this.__changeGamestate("defeat")
            }
        }
        this.asteroids = this.asteroids.filter(asteroid => asteroid.size > 0);
        if (this.asteroids.length === 0) {
            this.__changeGamestate("victory");
        }
        this.ship.bullets = this.ship.bullets.filter(bullet => bullet.age < this.gameConfig.bullet.maxAge);


        // Add the new asteroids onto the field 
        if (tempAsteroids[0]) {
            tempAsteroids.map(asteroid => {
                this.asteroids.push(asteroid);
            })
        }
    }

    __setup_event_handlers() {
        window.addEventListener("resize", this.handleResize.bind(this));
    }

    __changeGamestate(newState) {
        this.gameState.setAttribute('gamestate', newState)
    }

    initGame(settings) {
        this.settings = settings;
        this.gameConfig = GAMECONFIG[settings.difficulty];
        if (settings.mode === "cheat") {
            this.gameConfig.ship.fireRate = 1;
        }
        this.start();
    }   

    resetGame() {
        window.cancelAnimationFrame(this.currentAnimationFrameID);
        this.ship = undefined;
        this.asteroids = [];
        this.score = 0;
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


    loop(timestamp) {
        this.timestamp = timestamp;
        this.clearScreen();
        this.handleInputs();
        // Cache length so it only has to be calculated once per loop
        let i = this.asteroids.length - 1;
        for (i; i > -1; i--) {
            this.asteroids[i].move();
            this.asteroids[i].boundaryChecking();
            this.asteroids[i].render();
        }

        this.ship.update(this.fps, this.gameConfig.bullet.maxAge);
        this.ship.renderShip();
        this.ship.boundaryChecking();

        this.detectCollision();
        this.currentAnimationFrameID = window.requestAnimationFrame(this.loop.bind(this));
    }
}