import {app} from "./app";
import {statusCodes} from "./httpStatus";

export class Fetcher {
    /**
     * @return Promise<Response> - fetch() promise
     */
    async jsonRequest(url, method, jsonData) {
        let auth = await this.getJwtTokenHeader();
        return fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                "Authorization": auth
            },
            body: jsonData
        });
    }

    async getJwtTokenHeader() {
        if (!app.token) {
            return "";
        }
        if (new Date().getTime() > app.tokenPayload.exp * 1000) {
            await this.refreshTokenRequest();
        }
        return `Bearer ${app.token}`;
    }

    async refreshTokenRequest() {
        let response = await fetch("/refresh-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({token: app.refreshToken})
        });
        if (response.ok) {
            app.acceptJwtToken(await response.json());
        } else if (response.status === statusCodes.UNAUTHORIZED) {
            // TODO: then or always redirect
        }
    }
}