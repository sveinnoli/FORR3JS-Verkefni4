import {uiElements} from "./uiElements.js"
export class UserInterface {
    constructor(gameInstance) {
        this.gameInstance = gameInstance;
        this.config = {
            "difficulty": "medium",
            "settings": {
                "mode" : "normal"
            }
        }
        this.menuElements = uiElements.menuElements;
        this.gameState = uiElements.gameState;
        this.__setup_eventListeners();
        this.__setup_gamestate_change();
    }
    


    // Switches back to previous menu if return is pressed
    
    __toggle_full_screen() {
        if (!document.fullscreenElement) {
            document.body.requestFullscreen().catch(err => {
                alert(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    __menu_return() {
        this.menuElements.currMenu.style.transform = "translateX(500%)";
        this.menuElements.currMenu = this.menuElements.mainMenu;
        this.menuElements.currMenu.style.transform = "translateX(0%)";
        
        // Back arrow already visible, hide it instantly
        this.menuElements.return.hidden = !this.menuElements.return.hidden;    
        this.menuElements.fullscreen.hidden = true; 


        // Hides elements that are already visible until end of menu transition
        this.menuElements.currMenu.addEventListener('transitionend', () => {
            this.menuElements.fullscreen.hidden = false; 
        })

    }
    // Switches to either settings || difficulty menu 
    __switch_menu(menu) {
        this.menuElements.currMenu.style.transform = "translateX(-500%)";
        this.menuElements.currMenu = this.menuElements[menu];
        this.menuElements.currMenu.style.transform = "translateX(0%)";

        // fullscreen button
        this.menuElements.fullscreen.hidden = true; 

        // Makes element appear that are hidden on transitionend
        this.menuElements.currMenu.addEventListener('transitionend', () => {
            this.menuElements.return.hidden = !this.menuElements.return.hidden;   
            this.menuElements.fullscreen.hidden = false; 
        }, {once:true})

    }

    __setup_gamestate_change() {
        // Listen for changes to gamestate attributes
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
              if (mutation.type === "attributes") {
                    let newState = this.gameState.getAttribute('gamestate');
                    if (newState === "mainmenu" || newState === "pause") {
                        this.__show_menu(newState);
                    } 
              }
            }.bind(this));
          }.bind(this));
        observer.observe(this.gameState, { attributes: true});
    }

    
    __setup_eventListeners() {
        // Sets up all event listeners on the UI elements
        const optionsMenu = document.querySelector(".options__menu");
        const settingsMenu = document.querySelector(".settings .options__menu-sidemenu");
        const difficultyMenu = document.querySelector(".difficulty .options__menu-sidemenu")
        this.menuElements.return.addEventListener('click', this.__menu_return.bind(this));

        optionsMenu.addEventListener('click', (e) => {
            let option = e.target.getAttribute("data-option");
            if ((option === "difficulty" || option === "settings") && this.menuElements[option] !== this.menuElements["currMenu"]) {
                this.__switch_menu(option);
            } else if (option === "start") {
                this.__hide_menu("mainmenu");
                this.gameInstance.setup_config(this.config);
                this.gameInstance.start();       
            } 
        });
        
        // Settings menu 
        settingsMenu.addEventListener('click', (e) => {
            this.config.settings.mode = e.target.getAttribute('data-option');
        })
        
        // Difficulty menu
        difficultyMenu.addEventListener('click', (e) => {
            this.config.difficulty = e.target.getAttribute('data-option');
            // Can add color to the currently selected option
        }) 

        // Will probably need a seperate event listener for pause menu as it will have different options from the start menu 
        
        // Fullscreen
        this.menuElements.fullscreen.addEventListener('click', this.__toggle_full_screen.bind(this));
    }

    __hide_menu(menu) {
        this.menuElements.overlay.hidden = true;
    }
    
    __show_menu(menu) {
        this.menuElements.overlay.hidden = false;
    }

}

