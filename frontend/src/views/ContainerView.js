import {View} from "./View";
import {UserDto} from "../models/dto/UserDto";
import {app, resources} from "../app";

class ContainerView extends View {

    /**
     * @param model {UserDto}
     * @param {HTMLElement|View} parent - content container
     */
    constructor(model, parent = null) {
        super(parent);
        this.model = model;
    }

    async render() {
        super._render(`
            <header class="header-menu">
                <div class="header-logo">
                    {HOME-PAGE}
                </div>
                <nav class="header-nav">
                    <ul class="header-nav-links">
                        <li><a>{Item 1}</a></li>
                        <li><a>{Item 2}</a></li>
                        <li><a>{Item 3}</a></li>
                    </ul>   
                </nav>
                <div class="header-sign">
                    <div class="user-profile-menu">
                        <button class="sign-in-btn">${this.model ? this.model.name : "<a href='/sign'>Sign</a>"}</button>
                        <ul class="profile-menu-list">
                          <li class="profile-menu-item">${resources.strings.rootPage.profile}</li>
                            <li class="profile-menu-item">${resources.strings.rootPage.basket}</li>
                            <li class="profile-menu-item" id="sign_out">${resources.strings.rootPage.out}</li>
                        </ul>
                    </div>
                    <div class="language-selector" id="lang">
                        <span class="language-selector-nav">${resources.strings.rootPage.lang}</span>
                        <ul class="language-list">
                            <li class="language-item" data-lang="en">English</li>
                            <li class="language-item" data-lang="ru">Russian</li>
                        </ul>
                    </div>
                </div>
            </header>
            <div id="root">
        
            </div>
            <footer class="footer-menu">
                <div class="social-links"></div>
                <div class="copyright">
                    <span><span class="copy-sign">&copy;</span> All right reserved</span>
                </div>
                <div class="footer-info"></div>
            </footer>`, "#root");
        this.setupHandlers();
        return this.container;
    }

    setupHandlers() {
        let lang = document.getElementById("lang");
        let languageItems = lang.getElementsByClassName("language-item");
        for (let item of languageItems) {
            if (app.locale.includes(item.getAttribute("data-lang"))) {
                item.classList.add("selected-language");
            }
            item.addEventListener("click",
                async (e) => this.handler.handle(EVENT.loadResource, e.target.getAttribute("data-lang")));
        }
        this.menuHandlers();
    }

    menuHandlers() {
        let signOut = document.getElementById("sign_out");
        signOut.addEventListener("click", async () => this.handler.handle(EVENT.signOut));
    }
}

const EVENT = {
    loadResource: "res_load",
    signOut: "app_out"
};

export {
    ContainerView,
    EVENT
}