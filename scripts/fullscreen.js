button = document.getElementById("fullscreen");
button.addEventListener('click', toggleFullScreen);


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