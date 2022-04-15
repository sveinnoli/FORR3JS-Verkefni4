export const uiElements = {
    menuElements : {
        "mainmenu" : document.querySelector(".mainmenu"),  
        "currMenu" : document.querySelector(".mainmenu"),  
        "pause" : document.querySelector(".pause"),
        "shop" : document.querySelector(".shop"),
        "settings" : document.querySelector(".settings"),
        "difficulty" : document.querySelector(".difficulty"),
        "overlay" : document.querySelector(".options-overlay"),
        "resume" : document.querySelector('.mainmenu'),
        "victory" : document.querySelector(".victory"),
        "defeat" : document.querySelector(".defeat"),
        "score" : document.querySelector(".score-counter")
    },
    buttons : {   
        "return" : document.querySelector(".options-return"), 
        "exit" : document.querySelector(".options-exit"),
        "pause" : document.querySelector(".options-pause"),
        "shop" : document.querySelector(".options-shop"),
        "fullscreen" : document.querySelector('.options-fullscreen'), 
    },
    gameState : document.querySelector('data[name="game-state"]')
} 