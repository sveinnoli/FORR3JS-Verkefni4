
const ctx = document.getElementById('canvas').getContext('2d');
class GameObject {
    constructor(x, y, xv, yv) {
        this.x = x;
        this.y = y;
        this.xv = xv;
        this.yv = yv;
    }
}

export class Saucer extends GameObject {
    constructor(x, y, xv, yv) {
        super(x, y, xv, yv);
        // Implement this one after asteroids and ships are working
    }
}


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

export class Ship extends GameObject {
    constructor(xv, yv) {
        super(canvas.width/2, canvas.height/2, xv, yv);
        this.xv = xv;
        this.yv = yv;

    }

    render() {
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(this.x, this.y, 25, 0, 2 * Math.PI);
        ctx.fill();
    }
};
