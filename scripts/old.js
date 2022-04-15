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