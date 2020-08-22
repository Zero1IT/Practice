import {app, URLS} from "./app";
import {Fetcher} from "./Fetcher";

const REFRESH_TOKEN_KEY = "jwt_refresh_token";

export class Session {
    constructor() {
        this.fetcher            = new Fetcher();
        this.refreshToken       = localStorage.getItem(REFRESH_TOKEN_KEY);
        this.tokenPayload       = null;
        this.token              = null;
        /** @type {UserDto} */
        this.user               = null;
    }

    async tryUpdateTokens() {
        if (this.refreshToken) {
            await app.fetcher.refreshTokenRequest();
        }
    }

    /**
     * Loading session data
     * @param token {{refresh: String, access: String}} - object represent jwt tokens
     * @return {Promise<void>}
     */
    async openSession(token) {
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

    async destroySession() {
        await this.fetcher.jsonRequest(URLS.signOut, "POST"); // first, remove token from server
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
}