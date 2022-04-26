const ctx = document.getElementById('canvas').getContext('2d');

export class Helpers {

    xDirAngle(angle, length) {
        return length * Math.cos(this.toRad(angle));
    }

    yDirAngle(angle, length) {
        return length * Math.sin(this.toRad(angle));
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
            x: this.x + this.xDirAngle(this.rotation, this.size/2),
            y: this.y + this.yDirAngle(this.rotation, this.size/2)
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
        this.x += this.xDirAngle(this.rotation, this.xv);
        this.y += this.yDirAngle(this.rotation, this.yv); 
    }

    render() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.fill();
        ctx.lineWidth = 0.75;
        ctx.stroke();
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
        this.stage = stage;   // Denotes what stage the asteroid is at, at 0 the asteroid dissapears
        this.randLength = []; // Used to give each asteroid a unique shape
        for (let i = 0; i < this.sides; i++) {
            this.randLength.push(Math.random()*this.size*0.15+this.size/1.1);
        }
    }

    newRand() {
        this.randLength = [];
        for (let i = 0; i < this.sides; i++) {
            this.randLength.push(Math.random()*this.size*0.15+this.size+0.01);
        }
    }

    render() {
        ctx.beginPath();
        this.rotation += this.rotateBy;
        ctx.strokeStyle = "orange"; 
        ctx.lineWidth = 1;
        let fullRotation = 2 * Math.PI
        
        // Generate sides
        for(let i = 0; i <= this.sides; i++) {
            ctx.lineTo(this.x + ( Math.cos( fullRotation * (i / this.sides) + this.rotation ) * this.randLength[i]), this.y + ( Math.sin( fullRotation * (i / this.sides) + this.rotation) * this.randLength[i]) );
        }   
        // Close last side
        ctx.lineTo(this.x + ( Math.cos( fullRotation * (0 / this.sides) + this.rotation ) * this.randLength[0]), this.y + ( Math.sin( fullRotation * (0 / this.sides) + this.rotation) * this.randLength[0]) );
        ctx.fill();
        ctx.stroke();
    }

    move() {
        this.x += this.xv*3*(Math.sin(Math.random()));
        this.y += this.yv*2*Math.cos(Math.random());
    }

    boundaryChecking() {
        // Y boundaries
        if (this.y + (this.size * 1.5) < 0) {
            this.y = canvas.height + this.size;
        } else if (this.y-this.size > canvas.height) {
            this.y = -this.size;
        }

        // X boundaries 
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
        this.goal = {"x": canvas.width/2, "y": canvas.height/2} // Ship will attempt to reach this point, once it is reached it will be set to undefined 
        this.angleGoal;
    }

    setGoal(x, y) {
        // Sets a goal and rotates player towards goal
        this.goal.x = x; 
        this.goal.y = y;
        let angle = Math.atan2(this.goal.y - this.y-this.size/1.5, this.goal.x-this.x)*180/Math.PI;
        if ( -2 <= angle <= 2) {
            this.rotation = angle;
        } 
    }

    moveCommand() {
        if (this.goal.x && this.goal.y) {
            let dx = Math.abs(this.x-this.goal.x);
            let dy = Math.abs(this.y-this.goal.y);

            // Only move forward if we are not on our goal already 
            if (dx + dy > this.size) {
                this.moveForward();
            } else {
                // Remove the goal
                this.goal.x = undefined;
                this.goal.y = undefined;
            }
        }
    }

    shoot(ratio) {
        let pos = this._getTipPos();
        let size = 8*ratio;
        this.bullets.push(new Bullet(pos.x, pos.y, this.xv*2, this.yv*2, size, this.rotation))
    }

    moveForward() {
        this.x += this.xDirAngle(this.rotation, this.xv);
        this.y += this.yDirAngle(this.rotation, this.yv);
    }

    moveBackwards() {
        this.x -= this.xDirAngle(this.rotation, this.xv);
        this.y -= this.yDirAngle(this.rotation, this.yv);
    }

    rotateLeft() {
        this.rotation = (this.rotation % 360) - 3;
    }

    rotateRight() {
        this.rotation = (this.rotation % 360) + 3;
    }

    update(fps, maxAge) {
        let newBullets = [];
        if (this.bullets) {
            for (let i = 0; i < this.bullets.length; i++) {
                this.bullets[i].render();
                this.bullets[i].move();
                this.bullets[i].age += 1/fps;
            }

            // Use for loop instead of filter because performance
            for (let i = 0; i < this.bullets.length; i++) {
                if (this.bullets[i].age < maxAge) {
                    newBullets.push(this.bullets[i]);
                }
            }
            this.bullets = newBullets;
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
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#77ffff';
        ctx.fillStyle = "#0a4b78";
        ctx.fill();
        ctx.stroke();
    }
};
