import {Validator} from "./Validator";
import {Fetcher} from "./Fetcher";
import strings from "./values/strings.en"
import {router} from "./navigator";

const REFRESH_TOKEN_KEY = "jwt_refresh_token";

class App {

    constructor() {
        this.refreshToken       = localStorage.getItem(REFRESH_TOKEN_KEY);
        this.isInitialized      = false;
        this.tokenPayload       = null;
        this.validator          = new Validator();
        this.fetcher            = new Fetcher();
        this.values             = strings;
        this.router             = router;
        this.token              = null;
    }

    /**
     * Save jwt token
     * @param token - valid jwt token
     * @return {boolean} - true if token saved, otherwise false
     */
    acceptJwtToken(token) {
        try {
            this.refreshToken = token.refresh;
            this.token = token.access;
            let payload = this.token.split(".")[1];
            this.tokenPayload = JSON.parse(atob(payload));
            localStorage.setItem(REFRESH_TOKEN_KEY, this.refreshToken);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    initializeApp() {
        if (this.isInitialized) {
            throw new Error("App has already initialized");
        }
        this.isInitialized = true;
        this.router.navigateTo(window.location.pathname, true);
    }
}

const app = new App();
app.initializeApp();

export {
    app
}