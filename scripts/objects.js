
const ctx = document.getElementById('canvas').getContext('2d');
class GameObject {
    constructor(x, y, xv, yv) {
        this.x = x;
        this.y = y;
        this.xv = xv;
        this.yv = yv;
    }
}


/*
    AI
*/
export class Saucer extends GameObject {
    constructor(x, y, xv, yv) {
        super(x, y, xv, yv);
        // Implement this one after asteroids and ships are working
    }
}


/*
    AI
*/
export class Asteroid extends GameObject {
    constructor(x, y, xv, yv) {
        super(x, y, xv, yv);
        this.x = x;
        this.y = y;
        this.xv = xv;
        this.yv = yv;
    }

    render() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 25, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
    }

    move() {
        Math.random() > 0.99 ? this.xv *= -1 : 0;
        Math.random() > 0.99 ? this.yv *= -1 : 0;
        this.x += this.xv*3*(Math.sin(Math.random()));
        this.y += this.yv*2*Math.cos(Math.random());
    }

    collision() {
        if (this.x > canvas.width || this.x < 0) {
            this.x = canvas.width/2;
            this.y = canvas.height/2;
        }

        if (this.y > canvas.height || this.y < 0) {
            this.x = canvas.width/2;
            this.y = canvas.height/2;
        }

    }
};


/*
    Player
*/
export class Ship extends GameObject {
    constructor(xv, yv) {
        super(canvas.width/2, canvas.height/2, xv, yv);
        this.xv = xv;
        this.yv = yv;
        this.setupKeys();
        this.keys = {}

    }

    setupKeys() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLocaleLowerCase()] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        })
    }

    update() {
        if (this.keys["w"]) { 
            if (this.y - this.yv > 0) {
                this.y -= this.yv;
            } else {
                this.y = 0;
            }
        }
        
        if (this.keys["a"]) {
            if (this.x - this.xv > 0) {
                this.x -= this.xv;
            } else {
                this.x = 0;
            }
        }
        
        if (this.keys["s"]) {
            if (this.y + this.yv+25 < canvas.height) {
                this.y += this.yv;
            } else {
                this.y = canvas.height-25;
            }
        }
        
        if (this.keys["d"]) {
            if (this.x + this.xv+25 < canvas.width) {
                this.x += this.xv;
            } else {
                this.x = canvas.width-25;
            }
        }

        if (this.keys["e"]) {
            this.rotation = (this.rotation % 1) - 0.01;
        } else if (this.keys["q"]) {
            this.rotation = (this.rotation % 1) + 0.01;
        } 
    }


    render() {
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.arc(this.x, this.y, 25, 0, Math.PI*2);
        ctx.fillRect(this.x, this.y, 25, 25)
        ctx.fill();
        

    }
};
