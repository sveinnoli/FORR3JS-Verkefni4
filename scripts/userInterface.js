import { uiElements } from "./uiElements.js"
export class UserInterface {
    constructor(gameInstance) {
        this.gameInstance = gameInstance;
        this.config = {
            "difficulty": "medium",
            "mode" : "normal"
        }
        this.menuElements = uiElements.menuElements;
        this.buttonElements = uiElements.buttons;
        this.gameState = uiElements.gameState;
        this.__setup_eventListeners();
        this.__setup_gamestate_handler();
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

    __changeGamestate(newState) {
        this.gameState.setAttribute('gamestate', newState)
    }
    
    __menu_return() {
        this.menuElements.currMenu.style.transform = "translateX(200%)";
        this.menuElements.currMenu = this.menuElements.mainmenu;
        this.menuElements.currMenu.style.transform = "translateX(0%)";
        
        // Back arrow already visible, hide it 
        this.buttonElements.return.hidden = true;    
        this.buttonElements.fullscreen.hidden = true; 


        // Hides elements that are already visible until end of menu transition
        this.menuElements.currMenu.addEventListener('transitionend', () => {
            this.buttonElements.fullscreen.hidden = false; 
        })

    }
    // Switches to either settings || difficulty menu 
    __switch_menu(menu) {
        this.menuElements.currMenu.style.transform = "translateX(200%)";
        this.menuElements.currMenu = this.menuElements[menu];
        this.menuElements.currMenu.style.transform = "translateX(0%)";

        // fullscreen button
        this.buttonElements.fullscreen.hidden = true; 

        // Makes element appear that are hidden on transitionend
        this.menuElements.currMenu.addEventListener('transitionend', () => {
            this.buttonElements.return.hidden = !this.buttonElements.return.hidden;   
            this.buttonElements.fullscreen.hidden = false; 
        }, {once:true})

    }

    __setup_gamestate_handler() {
        // Listen for changes to gamestate attributes
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type.match(/attributes/)) {
                    let newState = this.gameState.getAttribute('gamestate');
                    if ((newState.match(/mainmenu|pause/)) && this.menuElements.currMenu !== this.menuElements[newState]) {
                        this.__switch_menu(newState);
                        this.__show_menu("overlay");
                        this.buttonElements.fullscreen.hidden = false;
                    }  else if (newState.match(/resume/)) {
                        this.__switch_menu(newState);
                        this.__hide_menu('overlay');
                    } else if (newState.match(/shop/)) {
                        //! Still has no element in uiElements
                        this.__switch_menu(newState);
                        this.__show_menu('overlay');
                    } else if (newState.match(/defeat/)) {
                        this.__switch_menu(newState);
                        this.__show_menu('overlay');
                        this.set_score();
                    }
                }
            }.bind(this));
          }.bind(this));
        observer.observe(this.gameState, { attributes: true});
    }

    set_score() {
        document.querySelectorAll("[data-option='score']").forEach((i) => {
            i.textContent = this.gameInstance.score.toFixed(2);
        }) 

    }

    
    __setup_eventListeners() {
        // Sets up all event listeners on the UI elements
        const optionsMenu = document.querySelector(".options__menu");
        const settingsMenu = document.querySelector(".settings .options__menu-sidemenu");
        const difficultyMenu = document.querySelector(".difficulty .options__menu-sidemenu")
        const pauseMenu = document.querySelector('.pause .options__menu-sidemenu');
        const defeatMenu = document.querySelector('.defeat .options__menu-sidemenu');
        
        // Button elements
        const pauseButton = this.buttonElements.pause;
        const shopButton = this.buttonElements.shop;
        const fullScreenButton = this.buttonElements.fullscreen;
        const exitButton = this.buttonElements.exit;
        const returnButton = this.buttonElements.return;


        optionsMenu.addEventListener('click', (e) => {
            let option = e.target.getAttribute("data-option");
            if ((option.match(/difficulty|settings/)) && this.menuElements[option] !== this.menuElements["currMenu"]) {
                this.__switch_menu(option);
            } else if (option.match(/start/)) {
                this.__hide_menu("overlay");
                this.gameInstance.initGame(this.config);
            } 
        });
        
        // Settings menu 
        settingsMenu.addEventListener('click', (e) => {
            this.config.mode = e.target.getAttribute('data-option');
            // Change classlist based on what was selected
        })
        
        // Difficulty menu
        difficultyMenu.addEventListener('click', (e) => {
            this.config.difficulty = e.target.getAttribute('data-option');
            // Can add color to the currently selected option

            // Change classlist based on what was selected
        }) 

        // Pause menu
        pauseMenu.addEventListener('click', (e) => {
            let menuOption = e.target.getAttribute('data-option');
            if (menuOption.match(/resume/)) {
                this.__changeGamestate(menuOption);
            } else if (menuOption.match(/restart/)) {
                this.gameInstance.restart();
                this.__switch_menu('mainmenu');
                this.__hide_menu("overlay");
                // this.menuElements.overlay.hidden = true;
            } else if (menuOption.match(/quit/)) {
                // Could be a bug here, since there's no swapping between overlays it hides the arrow when you go to the main menu
                this.__changeGamestate("mainmenu");
            }
        })

        defeatMenu.addEventListener('click', (e) => {
            let menuOption = e.target.getAttribute('data-option');
            if (menuOption) {
                if (menuOption.match(/restart/)) {
                    this.gameInstance.restart();
                    this.__switch_menu('mainmenu');
                    this.__hide_menu("overlay");
                    // this.menuElements.overlay.hidden = true;
                } else if (menuOption.match(/quit/)) {
                    this.__changeGamestate("mainmenu");
                }
            }
        })
        
        /* --------------------------- 
               START OF BUTTONS
         --------------------------- */ 

        // Pause button
        pauseButton.addEventListener('click', () => {
            this.__changeGamestate('pause');
        })

        // Shop button 
        shopButton.addEventListener('click', () => {
            this.__changeGamestate('shop');
            this.buttonElements.exit.hidden = false;
        })

        // Menu return button
        returnButton.addEventListener('click', () => {
            this.__menu_return();
        });

        // Exit button
        exitButton.addEventListener('click', () => {
            this.buttonElements.exit.hidden = true;
            this.__changeGamestate("resume");
        });
        
        // Fullscreen
        fullScreenButton.addEventListener('click', () => {
            this.__toggle_full_screen();
        });
    }

    __hide_menu(menu) {
        // Showing Menu
        this.menuElements[menu].hidden = true;
    }
    
    __show_menu(menu) {
        // Showing Menu
        this.menuElements[menu].hidden = false;
    }

}

