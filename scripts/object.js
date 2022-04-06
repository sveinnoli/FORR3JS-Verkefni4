class GameObject {
    constructor(x, y, xv, yv) {
        this.x = x;
        this.y = y;
        this.xv = xv;
        this.yv = yv;
    }

    move() {

    }
}

export class Asteroid extends GameObject {
    constructor(x, y, xv, yv) {
        super(x, y, xv, yv);
    }

    render() {
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.arc(this.x, this.y, 25, 0, 2 * Math.PI);
        ctx.fill();
    }
};

export class Ship extends GameObject {
    constructor(x, y, xv, yv) {
        super(x, y, xv, yv);
    }

    render() {
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(this.x, this.y, 25, 0, 2 * Math.PI);
        ctx.fill();
    }
};
