import {Validator} from "./Validator";
import strings from "./values/strings.en"
import {createRouter} from "./navigator";
import {progress} from "./ProgressLoader";
import {Session} from "./Session";

/**
 * @typedef {{
 *     strings: {rootPage: *, signPage: *, playPage: *}
 * }} LangRes
 *
 * @type {LangRes}
 */
const resources = {
    strings: {}
};

const Roles = {
    USER: "USER",
    COURIER: "COURIER",
    ADMIN: "ADMIN"
};

const URLS = {
    login: "/api/sign/login", registration: "/api/sign/registration", getNewPlays: "/api/plays/future",
    getPlays: "/api/plays", userInfo: "/api/users/info", refreshToken: "/api/sign/refresh-token",
    loadLanguage: "/api/sign/lang", signOut: "/api/sign/sign-out", loadHalls: "/api/construction/halls",
    rowsInfo: "/api/construction/rows/info", categories: "/api/construction/category",
    commitOrder: "/api/orders/commit", actualOrders: "/api/orders/actual",
    actualOrdersCount: "/api/orders/actual/count", ordersCategoryInfo: "/api/orders/info",
    takeOrder: "/api/orders/take",
};

const LOCALE = {
    RU: "ru",
    EN: "en-US"
};

class App {

    constructor() {
        this.isInitialized      = false;
        this.validator          = new Validator();
        this.locale             = this.defaultLocale();
        this.values             = strings;
        this.router             = null;
        this.defaultInit();
    }

    defaultInit() {
        this.session            = new Session();
        this.fetcher            = this.session.fetcher;
    }

    /**
     * Save jwt token
     * @param token - valid jwt token
     */
    async acceptJwtToken(token) {
        await this.session.openSession(token);
    }

    async signOut() {
        await this.session.destroySession();
        this.defaultInit();
    }

    async initializeApp() {
        progress.show();
        if (this.isInitialized) {
            throw new Error("App has already initialized");
        }
        this.router = createRouter(this);
        await this.session.tryUpdateTokens();
        await loadResources();
        this.router.navigateTo(this.router.ejectPathNameWithParams(), true);
        this.isInitialized = true;
        progress.hide();
    }

    /**
     * @param newLocale {String} - locale name
     */
    async changeLocale(newLocale) {
        let lc = newLocale.toUpperCase();
        for (let key in LOCALE) {
            if (key === lc) {
                this.locale = LOCALE[key];
                await loadResources(key);
                this.router.navigateTo(this.router.ejectPathNameWithParams(), false, true);
                return;
            }
        }
        throw new Error(`Invalid locale ${newLocale}`);
    }

    defaultLocale() {
        let lc = navigator.language;
        for (let key in LOCALE) {
            if (LOCALE[key] === lc) {
                return LOCALE[key];
            }
        }
        return LOCALE.EN;
    }
}

async function loadResources(name = null) {
    let param = name ? `?locale=${name}` : "";
    let response = await app.fetcher.jsonRequest(`${URLS.loadLanguage}${param}`);
    if (response.ok) {
        resources.strings = await response.json();
    } else {
        console.error(response); // TODO; stop app
    }
}

const app = new App();
app.initializeApp()
    .catch(console.error);

export {
    App,
    app,
    URLS,
    resources,
    Roles
}
