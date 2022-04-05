// Settings for the game
const config = {

}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Handles resizing the window for example when rotating the phone
function handleResize() {
    let computedStyle = getComputedStyle(canvas);
    canvas.width = parseFloat(window.innerWidth - parseFloat(computedStyle.borderRight)*2);
    canvas.height = parseFloat(window.innerHeight - parseFloat(computedStyle.borderBottom)*2);
}

// Set height and width on page load or resize
window.addEventListener("resize", handleResize);
window.addEventListener("DOMContentLoaded", handleResize);


function toggleFullScreen() {
    let elem = canvas;

    if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
            alert(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen();
    }
}

toggleFullScreen();

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

    draw() {
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.arc(this.x, this.y, 25, 0, 2 * Math.PI);
        ctx.fill();
        window.requestAnimationFrame(this.draw.bind(this));
    }
};

class Ship extends BasicFunctionality {
    constructor(x, y, xv, yv) {
        super(x, y, xv, yv);
    }
};


testZoid = new Asteroid(50, 100, 5, 5);
function mainLoop() {
    testZoid.draw();
}

window.requestAnimationFrame(mainLoop);