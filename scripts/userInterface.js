export class UserInterface {
    constructor(canvas) {
        this.canvas = canvas;
        this.config = {
            "difficulty": "medium",
            "settings": {

            }
        }
        this.menuElements = {
            "return" : document.querySelector(".options-return"),
            "mainMenu" : document.querySelector(".mainmenu"),  
            "currMenu" : document.querySelector(".mainmenu"),  
            "settings" : document.querySelector(".settings"),
            "difficulty" : document.querySelector(".difficulty")
        }
        this.__setup_eventListeners();
    }

    // Switches back to previous menu if return is pressed
    __menu_return() {
        this.menuElements.currMenu.style.transform = "translateX(500%)";
        this.menuElements.currMenu = this.menuElements.mainMenu;
        this.menuElements.currMenu.style.transform = "translateX(0%)";
        this.menuElements.currMenu.addEventListener('transitionstart', () => {
            this.menuElements.return.hidden = !this.menuElements.return.hidden;    
        }, {once:true})
    }

    // Switches to either settings || difficulty menu 
    __switch_menu(menu) {
        this.menuElements.currMenu.style.transform = "translateX(-500%)";
        this.menuElements.currMenu = this.menuElements[menu];
        this.menuElements.currMenu.style.transform = "translateX(0%)";
        this.menuElements.currMenu.addEventListener('transitionend', () => {
            this.menuElements.return.hidden = !this.menuElements.return.hidden;    
        }, {once:true})
    }
    
    __setup_eventListeners() {
        const optionsMenu = document.querySelector(".options__menu");
        const settingsMenu = document.querySelector(".settings .options__menu-sidemenu");
        const difficultyMenu = document.querySelector(".difficulty .options__menu-sidemenu")
        
        this.menuElements.return.addEventListener('click', this.__menu_return.bind(this));
        optionsMenu.addEventListener('click', (e) => {
            let option = e.target.getAttribute("data-option");
            if ((option === "difficulty" || option === "settings") && this.menuElements[option] !== this.menuElements["currMenu"]) {
                this.__switch_menu(option);
            } else if (option === "start") {
                // here i need to hide the menu and start the main game loop
                // I could extend the Game class here and have the game.loop return false||true 
                // when it ends and then return the user to the main menu although that would be awkward
            }
        });

        settingsMenu.addEventListener('click', (e) => {
            console.log("event : ",e.currentTarget);
            console.log("this : ",this);
            console.log("this === e", this===e)
            e.stopPropagation();
        }, true)

        difficultyMenu.addEventListener('click', (e) => {
            this.config.difficulty = e.target.getAttribute('data-option');
        })
    }
}

