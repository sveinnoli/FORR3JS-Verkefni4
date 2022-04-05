import {UserInterface} from "./userInterface.js"

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let userInterface = new UserInterface(canvas);

// Handles resizing the window for example when rotating the phone
function handleResize() {
    let computedStyle = getComputedStyle(canvas);
    canvas.width = parseFloat(window.innerWidth - parseFloat(computedStyle.borderRight)*2);
    canvas.height = parseFloat(window.innerHeight - parseFloat(computedStyle.borderBottom)*2);
}

// Set height and width on page load or resize
window.addEventListener("resize", handleResize);
window.addEventListener("DOMContentLoaded", handleResize);


class BasicFunctionality {
    constructor(x, y, xv, yv) {
        this.x = x;
        this.y = y;
        this.xv = xv;
        this.yv = yv;
    }

}

class Asteroid extends BasicFunctionality {
    constructor(x, y, xv, yv) {
        super(x, y, xv, yv);
    }

    render() {
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.arc(this.x, this.y, 25, 0, 2 * Math.PI);
        ctx.fill();
        // Example of how to bind to another object to allow the use of this
        // window.requestAnimationFrame(this.draw.bind(this));
    }
};

class Ship extends BasicFunctionality {
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



