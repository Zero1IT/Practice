import {Validator} from "./Validator";
import {Fetcher} from "./Fetcher";
import strings from "./values/strings.en"
import {UserDto} from "./models/dto/UserDto";
import {createRouter} from "./navigator";
import {progress} from "./ProgressLoader";

const REFRESH_TOKEN_KEY = "jwt_refresh_token";

/**
 * @typedef {{
 *     strings: {rootPage: *, playPage: *, preloader: *}
 * }} LangRes
 *
 * @type {LangRes}
 */
const resources = {
    strings: {}
};

const URLS = {
    login: "/api/sign/login",
    registration: "/api/sign/registration",
    getNewPlays: "/api/plays/future",
    userInfo: "/api/users/info",
    refreshToken: "/api/sign/refresh-token",
    loadLanguage: "/api/sign/lang",
    signOut: "/api/sign/sign-out",
};

const LOCALE = {
    RU: "ru",
    EN: "en-US"
};

class App {

    constructor() {
        this.validator          = new Validator();
        this.fetcher            = new Fetcher();
        this.locale             = this.defaultLocale();
        this.values             = strings;
        this.router             = null;
        this.dataDefaultInit();
    }

    dataDefaultInit() {
        this.isInitialized      = false;
        this.refreshToken       = localStorage.getItem(REFRESH_TOKEN_KEY);
        this.tokenPayload       = null;
        this.token              = null;
        /** @type {UserDto} */
        this.user               = null;
    }

    /**
     * Save jwt token
     * @param token - valid jwt token
     */
    async acceptJwtToken(token) {
        try {
            this.refreshToken = token.refresh;
            this.token = token.access;
            let payload = this.token.split(".")[1];
            this.tokenPayload = JSON.parse(atob(payload));
            localStorage.setItem(REFRESH_TOKEN_KEY, this.refreshToken);
            await this.loadUserInfo();
        } catch (e) {
            console.error(e);
        }
    }

    async loadUserInfo() {
        let response = await this.fetcher.jsonRequest(URLS.userInfo);
        if (response.ok) {
            this.user = await response.json();
        } else {
            console.log(response);
            // TODO:
        }
    }

    async initializeApp(primary = true) {
        progress.show();
        if (this.isInitialized) {
            throw new Error("App has already initialized");
        }
        await loadResources();
        if (this.refreshToken) {
            await app.fetcher.refreshTokenRequest();
        }
        this.router = createRouter(this);
        if (primary) {
            this.router.navigateTo(window.location.pathname, true);
        }
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
                this.router.navigateTo(window.location.pathname, false, true);
                return;
            }
        }
        throw new Error(`Invalid locale ${newLocale}`);
    }

    async signOut() {
        await this.fetcher.jsonRequest(URLS.signOut, "POST"); // first remove token from server
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        this.dataDefaultInit();
        await this.initializeApp(false);
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
    resources
}
