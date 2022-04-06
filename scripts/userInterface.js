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
    }

    // Switches back to previous menu if return is pressed
    __menu_return() {
        this.menuElements.currMenu.style.transform = "translateX(500%)";
        this.menuElements.currMenu = this.menuElements.mainMenu;
        this.menuElements.currMenu.style.transform = "translateX(0%)";
        // Back arrow already visible, hide it instantly
        this.menuElements.return.hidden = !this.menuElements.return.hidden;    
    }

    // Switches to either settings || difficulty menu 
    __switch_menu(menu) {
        this.menuElements.currMenu.style.transform = "translateX(-500%)";
        this.menuElements.currMenu = this.menuElements[menu];
        this.menuElements.currMenu.style.transform = "translateX(0%)";
        // Tells the browser to show the return-arrow once transition ends on menuElement
        this.menuElements.currMenu.addEventListener('transitionend', () => {
            this.menuElements.return.hidden = !this.menuElements.return.hidden;    
        }, {once:true})
    }

    __handle_gamestate_change(newState) {
        // Could merge __menu_return, __switch_menu and this function into one but for now its ok
        console.log("User interface game state detection");
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
                this.__hide_ui();
                // Alternatively could use an element to listen to onchange which would 
                // tell the interface to put up its UI up again
                // Which might be best as it could be used to signal pause || start
                if (!this.gameInstance.loop(this.config)) {
                    this.__show_ui();
                }
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

        // Gamestate 
        this.gameState.addEventListener('change', this.__handle_gamestate_change.bind(this)); 

    }
    __hide_ui() {
        this.menuElements.overlay.hidden = true;
    }
    
    __show_ui() {
        this.menuElements.overlay.hidden = false;

    }
}

