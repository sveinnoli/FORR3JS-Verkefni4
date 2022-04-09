
const ctx = document.getElementById('canvas').getContext('2d');
class GameObject {
    constructor(x, y, xv, yv) {
        this.x = x;
        this.y = y;
        this.xv = xv;
        this.yv = yv;
    }

    dXFromAngleAndHypot(angle, hypot) {
        return hypot * Math.cos(this.toRad(angle));
    }
    dYFromAngleAndHypot(angle, hypot) {
        return hypot * Math.sin(this.toRad(angle));
    }

    _getTipPos() {
        return {
            x: this.x + this.dXFromAngleAndHypot(this.rotation, 50 / 2),
            y: this.y + this.dYFromAngleAndHypot(this.rotation, 50 / 2)
        };
    }

    toRad(deg) {
        return deg*(Math.PI/180);
    }
}


class Bullet extends GameObject {

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
        ctx.fillStyle = "#b32d2e";
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#f86368';
        ctx.fill();
        ctx.stroke();
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
        this.rotation = 0;
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
            this.x += this.dXFromAngleAndHypot(this.rotation, this.xv);
            this.y += this.dYFromAngleAndHypot(this.rotation, this.yv);
        }

        if (this.keys["s"]) {
            this.x -= this.dXFromAngleAndHypot(this.rotation, this.xv);
            this.y -= this.dYFromAngleAndHypot(this.rotation, this.yv);
        }
        
        if (this.keys["a"]) {
            this.rotation = (this.rotation % 360) - 1.7;
        }
        
        
        if (this.keys["d"]) {
            this.rotation = (this.rotation % 360) + 1.7;
        } 
    }

    renderTriangle() {
        let rotRad = this.toRad(this.rotation);
        ctx.beginPath();

        // Go to origo of triangle
        ctx.moveTo(this.x, this.y);
        cosRad = Math.cos(rotRad);
        sinRad = Math.sin(rotRad);
        ctx.lineTo(this.x + (cosRad * 100) - sinRad * 100, this.y + (cosRad * 100) + sinRad * 100);

        ctx.lineTo(this.x - (cosRad * 100) + sinRad * 100, this.y - (cosRad * 100) - sinRad * 100);
        ctx.lineTo(this.x - (cosRad * 100) - sinRad * 100, this.y + (cosRad * 100) - sinRad * 100);

        // end same at same point as started
        ctx.lineTo(this.x + (cosRad * 100) - sinRad * 100, this.y + (cosRad * 100) + sinRad * 100);

        // Color the triangle in
        ctx.fillStyle = "rgb(172, 50, 50)";
        ctx.fill();
    }

    render() {
        let rotRad = this.toRad(this.rotation);
        ctx.save();
        ctx.translate(this.x, this.y)
        ctx.rotate(rotRad)
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(0, 0, 25, 0, Math.PI*2);
        ctx.fillRect(0, 0, 25, 25)
        ctx.fill();
        ctx.restore();
    }

    renderShip() {
        let pos = this._getTipPos();
        let x = pos.x;
        let y = pos.y
        ctx.beginPath();
        let opposite = this.rotation <= 1 ? this.rotation + 180 : this.rotation - 180;
        let startAngle = this.toRad(opposite - 22.5);
        let endAngle = this.toRad(opposite + 22.5);
        ctx.arc(x, y, 50, startAngle, endAngle);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#77ffff';
        ctx.fillStyle = "#0a4b78";
        ctx.fill();
        ctx.stroke();
    }
};
