const ctx = document.getElementById('canvas').getContext('2d');

export class Helpers {

    dXFromAngleAndHypot(angle, hypot) {
        return hypot * Math.cos(this.toRad(angle));
    }

    dYFromAngleAndHypot(angle, hypot) {
        return hypot * Math.sin(this.toRad(angle));
    }



    toRad(deg) {
        return deg*(Math.PI/180);
    }
}

class GameObject extends Helpers {
    constructor(x, y, xv, yv, size, rotation) {
        super();
        this.x = x;
        this.y = y;
        this.xv = xv;
        this.yv = yv;
        this.size = size;
        this.rotation = rotation;
    }

    _getTipPos() {
        return {
            x: this.x + this.dXFromAngleAndHypot(this.rotation, this.size/2),
            y: this.y + this.dYFromAngleAndHypot(this.rotation, this.size/2)
        };
    }
}


class Bullet extends GameObject {
    constructor(x, y, xv, yv, size, rotation) {
        super(x, y, xv, yv, size, rotation);
        // Determines how long the bullet will stay
        this.age = 0;
    }

    move() {
        this.x += this.dXFromAngleAndHypot(this.rotation, this.xv);
        this.y += this.dYFromAngleAndHypot(this.rotation, this.yv); 
    }

    render() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.fill();
    }
}


/*
    AI
*/
export class Saucer extends GameObject {
    constructor(x, y, xv, yv, size, rotation) {
        super(x, y, xv, yv, size, rotation);
        // Implement this one after asteroids and ships are working
    }
}


/*
    AI
*/
export class Asteroid extends GameObject {
    constructor(sides, x, y, xv, yv, size, rotation, stage=2) {
        super(x, y, xv, yv, size, rotation);
        this.sides = sides;
        this.deviation1 = Math.random()*1+0.5;
        this.deviation2 = Math.random()*1+0.5;
        this.rotateBy = Math.random()*0.01+0.005;
        this.stage = stage;
    }

    render() {
        ctx.beginPath();
        this.rotation += this.rotateBy;
        ctx.strokeStyle = "orange"; 
        ctx.lineWidth = 1;
        let fullRotation = 2 * Math.PI
        // Generate sides
        for(let i = 0; i <= this.sides; i++) {
            ctx.lineTo(this.x + ( Math.cos( fullRotation * (i / this.sides) + this.rotation ) * this.size), this.y + ( Math.sin( fullRotation * (i / this.sides) + this.rotation) * this.size) );
        }   
        ctx.fill();
        ctx.stroke();
    }

    move() {
        Math.random() > 0.998 ? this.xv *= -1 : 0;
        Math.random() > 0.998 ? this.yv *= -1 : 0;
        this.x += this.xv*3*(Math.sin(Math.random()));
        this.y += this.yv*2*Math.cos(Math.random());
    }

    boundaryChecking() {
        if (this.y + (this.size * 1.5) < 0) {
            this.y = canvas.height + this.size;
        } else if (this.y-this.size > canvas.height) {
            this.y = -this.size;
        }

        if (this.x + (this.size * 1.5) < 0) {
            this.x = canvas.width + this.size;
        } else if (this.x-this.size > canvas.width) {
            this.x = -this.size;
        }
    }
};


export class Ship extends GameObject {
    constructor(xv, yv, size, rotation) {
        super(canvas.width/2, canvas.height/2, xv, yv, size, rotation);
        this.bullets = [];
    }

    shoot(ratio) {
        let pos = this._getTipPos();
        let size = 10*ratio;
        console.log(size);
        this.bullets.push(new Bullet(pos.x, pos.y, this.xv+10, this.yv+10, size, this.rotation))
    }

    moveForward() {
        this.x += this.dXFromAngleAndHypot(this.rotation, this.xv);
        this.y += this.dYFromAngleAndHypot(this.rotation, this.yv);
    }

    moveBackwards() {
        this.x -= this.dXFromAngleAndHypot(this.rotation, this.xv);
        this.y -= this.dYFromAngleAndHypot(this.rotation, this.yv);
    }

    rotateLeft() {
        this.rotation = (this.rotation % 360) - 5;
    }

    rotateRight() {
        this.rotation = (this.rotation % 360) + 5;
    }

    update(fps, maxAge) {
        if (this.bullets) {
            for (let i = 0; i < this.bullets.length; i++) {
                this.bullets[i].render();
                this.bullets[i].move();
                this.bullets[i].age += 1/fps;
            }

            this.bullets.filter((bullet) => {
                bullet.age < maxAge;
            } ) 
        }
    }

    boundaryChecking() {
        if (this.y < 0) {
            this.y = canvas.height;
        } else if (this.y > canvas.height) {
            this.y = 0;
        }

        if (this.x < 0) {
            this.x = canvas.width;
        } else if (this.x > canvas.width) {
            this.x = 0;
        }
    }


    renderShip() {
        let pos = this._getTipPos();
        let x = pos.x;
        let y = pos.y
        ctx.beginPath();
        let opposite = this.rotation <= 1 ? this.rotation + 180 : this.rotation - 180;
        let startAngle = this.toRad(opposite - 22.5);
        let endAngle = this.toRad(opposite + 22.5);
        ctx.arc(x, y, this.size, startAngle, endAngle);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#77ffff';
        ctx.fillStyle = "#0a4b78";
        ctx.fill();
        ctx.stroke();
    }
};
