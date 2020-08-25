import {View} from "./View";
import {UserDto} from "../models/dto/UserDto";
import {app, resources, Roles} from "../app";
import {Navigator} from "../navigator";

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
                        ${this.generateHeaderNav()}
                    </ul>   
                </nav>
                <div class="header-sign">
                    <div class="user-profile-menu">
                        ${this.model ? this.profileButton() : `<a href='${Navigator.SIGN}' class='sign-in-btn'>Sign</a>`}
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
                    <span><span class="copy-sign">&copy;</span> ${resources.strings.rootPage.rights}</span>
                </div>
                <div class="footer-info"></div>
            </footer>`, "#root");
        this.setupHandlers();
        return this.container;
    }

    profileButton() {
        return `<button class="sign-in-btn">${this.model.name}</button>
                <ul class="profile-menu-list">
                    <li class="profile-menu-item">${resources.strings.rootPage.profile}</li>
                    <li class="profile-menu-item">${resources.strings.rootPage.basket}</li>
                    <li class="profile-menu-item" id="sign_out">${resources.strings.rootPage.out}</li>
                </ul>`;
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
        if (this.model) {
            this.menuHandlers();
        }
    }

    menuHandlers() {
        let signOut = document.getElementById("sign_out");
        signOut.addEventListener("click", async () => this.handler.handle(EVENT.signOut));
    }

    generateHeaderNav() {
        const links = this.getRoleDependentLinks();
        const result = [];
        if (this.model) {
            // noinspection FallThroughInSwitchStatementJS
            switch (this.model.roleName) {
                case Roles.ADMIN:
                    result.push(...this.createLinkItem(Roles.ADMIN, links));
                case Roles.COURIER:
                    result.push(...this.createLinkItem(Roles.COURIER, links));
                case Roles.USER:
                    result.push(...this.createLinkItem(Roles.USER, links));
            }
        }
        return result.join("\n");
    }

    getRoleDependentLinks() {
        return {
            [Roles.USER]: [],
            [Roles.COURIER]: [
                { name: resources.strings.rootPage.navOrder, url: Navigator.PANEL_ORDER }
            ],
            [Roles.ADMIN]: [
                { name: resources.strings.rootPage.navUser, url: Navigator.PANEL_USERS }
            ]
        };
    }

    createLinkItem(key, links) {
        const array = [];
        for (let link of links[key]) {
            array.push(`<li><a href="${link.url}">${link.name}</a></li>`);
        }
        return array;
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