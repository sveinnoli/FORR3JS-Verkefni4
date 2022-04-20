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
        this.touches = {}
        this.currentAnimationFrameID;
        this.fps = 60; // Can scale it dynamically but browser runs at ~ 60 fps
        this.scoreElem = uiElements.menuElements.score;
        this.gameState = uiElements.gameState;        
        this.screenSize = { "width": undefined, "height": undefined } // Gets set at runtime 

        // Controls sizing and speed of objects
        this.screenRatio;
        
        // Timings
        this.oldTimestamp = 0;
        this.timestamp = 0;
        
        this.__setup_gamestate_handler();
        this.__setup_event_handlers();
        this.setupKeys();
        this.setupTouch();
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
                this.ship.shoot(this.screenRatio);
                this.oldTimestamp = this.timestamp;
            }
        }
    }
    
    displayScore() {
        // Here we update the score counter on the canvas
        this.scoreElem.textContent = `Score: ${this.score.toFixed(2)}`;
    }




    setupTouch() {
        // Touch listeners
        canvas.addEventListener("touchstart", (e) => {
            // Here we initiate move command for ship
            console.log("Touchstart");
            let touches = e.changedTouches;
            this.ship.setGoal(touches[0].clientX, touches[0].clientY-canvas.getBoundingClientRect().top);
        })
        
        canvas.addEventListener("touchend", (e) => {
            // Here we cancel the move command
            console.log("touchend");
        })
        
        canvas.addEventListener("touchmove", (e) => { 
            // Here we adjust the heading 
            console.log("touchmove");
            let touches = e.changedTouches;
            this.ship.setGoal(touches[0].clientX, touches[0].clientY-canvas.getBoundingClientRect().top);
            if (touches.length > 1 ) {
                // Here we need to rotate the player
            }
        })
    }
    
    setupKeys() {
        window.addEventListener('keydown', (e) => {
            this.pressedKeys[e.key.toLocaleLowerCase()] = true;
        });
        
        window.addEventListener('keyup', (e) => {
            this.pressedKeys[e.key.toLowerCase()] = false;
        })
    }

    generateAsteroids(numAsteroids=this.gameConfig.maxAsteroids, spawnOutOfBounds=false) {
        console.log(this.screenRatio, canvas.width, canvas.height, window.innerWidth, window.innerHeight);
        for (let i = 0; i < numAsteroids; i++) {
            // Here we need to dynamically scale the velocities and size based on screensize
            let size = Math.random()*12 + 25 * this.screenRatio;
            let x;
            let y;

            // Randomly place the asteroids at the outer boundaries to avoid collision on game start
            if (spawnOutOfBounds) {
                if (Math.random() > 0.5) {
                    // Starts top or bottom
                    x = Math.random() * canvas.width;
                    y = Math.random() > 0.5 ? canvas.height+size/2: -size/2;
                } else {
                    // Starts left or right
                    x = Math.random() > 0.5 ? canvas.width+size/2: -size/2;
                    y = Math.random()*canvas.height; 
                }
            } else {
                if (Math.random() > 0.5) {
                    // Starts top or bottom
                    x = Math.random() * canvas.width;
                    y = Math.random() > 0.5 ? canvas.height-Math.random()*canvas.height*0.3: Math.random()*canvas.height*0.3;
                } else {
                    // Starts left or right
                    x = Math.random() > 0.5 ? canvas.width-Math.random()*canvas.width*0.3: Math.random()*canvas.width*0.3;
                    y = Math.random()*canvas.height; 
                }
            }
            let xv = Math.random() > 0.5 ? Math.random()*0.3 + 0.3 : -Math.random()*0.3 - 0.3;
            let yv = Math.random() > 0.5 ? Math.random()*0.3 + 0.3 : -Math.random()*0.3 - 0.3; 
            this.asteroids.push(
                new Asteroid(
                    Math.round(Math.random()*2+6),  // Sides
                    x,                              // X
                    y,                              // Y
                    xv*this.screenRatio,                             // XV
                    yv*this.screenRatio,                             // YV
                    size,                           // Size
                    Math.random()*360,              // Rotation
                    2                               // Stage
                ));
        }
    }

    generateShips() {
        let size = 25 * this.screenRatio;
        this.ship = new Ship(2*this.screenRatio, 2*this.screenRatio, size, 45);
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
        let gameState = this.gameState.getAttribute("gamestate")
        if (gameState.match(/playing|resume/)) {
            // Detected change in window size while playing send pause to gameState
            this.__changeGamestate("pause");
        }
        
        let newWidth = window.innerWidth;
        let newHeight = window.innerWidth / 1.778; // 16/9 aspect ratio

        // Might be bugged for mobile, not properly running
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
        this.screenRatio = canvas.height/canvas.width;
    }

    __handle_dimension_change(newWidth, newHeight) {
        // TODO make it only calculate after x time has passed to avoid
        // calculating hundreds of times per second
        let widthRatio = newWidth/this.screenSize.width;
        let heightRatio = newHeight/this.screenSize.height;
        // Sets ship on new position according to the ratio of the old screensize and new screensize and resizes them
        if (this.ship) {
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
                asteroid.newRand();
            }
        })
    }

    circleRectangleCollision(circle, rectangle) {
        // Detects collision between a circle and a square
        let rectX = rectangle.x-rectangle.size/2
        let rectY = rectangle.y-rectangle.size/2;
        var distX = Math.abs(circle.x - rectX-rectangle.size/2);
        var distY = Math.abs(circle.y - rectY-rectangle.size/2);
    
        if (distX > (rectangle.size/2 + circle.size)) { return false; }
        if (distY > (rectangle.size/2 + circle.size)) { return false; }
        if (distX <= (rectangle.size/2)) { return true; } 
        if (distY <= (rectangle.size/2)) { return true; }
    
        var dx = distX-rectangle.size/2;
        var dy = distY-rectangle.size/2;
        return (dx*dx+dy*dy<=(circle.size*circle.size));
    }

    detectCollision() {
        let tempAsteroids = []
        for (let j = 0; j < this.asteroids.length; j++) {
            // Detect collision with bullet and asteroid        
            for (let i = 0; i < this.ship.bullets.length; i++) {
                if (this.circleRectangleCollision(this.ship.bullets[i], this.asteroids[j])) {
                    this.score += this.asteroids[j].stage*1/3;
                    // Splitting asteroid  
                    if (this.asteroids[j].stage > 0) {
                        for (let k = 0; k < this.gameConfig.asteroid.splitBy; k++) {
                            let randAng = Math.random()*360;
                            let xv = this.helper.xDirAngle(randAng, this.asteroids[j].xv*1.1+0.2);
                            let yv = this.helper.yDirAngle(randAng, this.asteroids[j].xv*1.1+0.2);
                            xv = Math.cos(randAng)*this.asteroids[j].xv*1.1;
                            yv = Math.sin(randAng)*this.asteroids[j].yv*1.1;
                            tempAsteroids.push(new Asteroid(
                                Math.round(Math.random()*2+6),                                                            // Sides
                                this.asteroids[j].x + this.helper.xDirAngle(randAng, this.asteroids[j].size),   // X          
                                this.asteroids[j].y + this.helper.yDirAngle(randAng, this.asteroids[j].size),   // Y    
                                xv,                                     	                                              // XV
                                yv,                                     	                                              // YV
                                this.asteroids[j].size/1.2,             	                                              // Size
                                Math.random()*360,                      	                                              // Rotation
                                this.asteroids[j].stage-1               	                                              // Stage
                            ));
                        }
                    } 
                    // Mark asteroid and bullet for removal
                    this.ship.bullets[i].age = this.gameConfig.bullet.maxAge;
                    this.asteroids[j].size = 0;  
                }
            }
            
            // Detect collision with asteroid and ship
            if (this.circleRectangleCollision(this.asteroids[j], this.ship)) {
                // Player looses, collision between player and asteroid occured
                window.navigator.vibrate(200);
                this.__changeGamestate("defeat")
            }
        }
        this.asteroids = this.asteroids.filter(asteroid => asteroid.size > 0);

        // Spawn more asteroids in the field when the number has gone below a certain threshold
        if (this.asteroids.length <= this.gameConfig.maxAsteroids/1.5) {
            this.generateAsteroids(this.gameConfig.maxAsteroids/1.5, true);
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
        this.handleResize();
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
        this.displayScore();
        this.clearScreen();
        this.handleInputs();

        // Cache length so it only has to be calculated once per loop
        let i = this.asteroids.length - 1;
        for (i; i > -1; i--) {
            this.asteroids[i].move();
            this.asteroids[i].boundaryChecking();
            this.asteroids[i].render();
        }

        // Automatic shooting
        if (this.timestamp - this.oldTimestamp > this.gameConfig.ship.fireRate) {
            this.ship.shoot(this.screenRatio);
            this.oldTimestamp = this.timestamp;
        }

        this.ship.update(this.fps, this.gameConfig.bullet.maxAge);
        this.ship.renderShip();
        this.ship.boundaryChecking();
        this.ship.moveCommand();

        this.detectCollision();
        this.currentAnimationFrameID = window.requestAnimationFrame(this.loop.bind(this));
    }
}