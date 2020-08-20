import {app, URLS} from "./app";
import {statusCodes} from "./httpStatus";

export class Fetcher {
    /**
     * @return Promise<Response> - fetch() promise
     */
    async jsonRequest(url, method = "GET", jsonData = undefined) {
        let auth = await this.updateJwtTokenHeader();
        return fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                "Authorization": auth
            },
            body: jsonData
        });
    }

    async updateJwtTokenHeader() {
        if (app.token) {
            let isEnd = new Date().getTime() > app.tokenPayload.exp * 1000;
            if (isEnd) {
                await this.refreshTokenRequest();
            }
        } else if (app.refreshToken) {
            await this.refreshTokenRequest();
        }
        return `Bearer ${app.token}`;
    }

    async refreshTokenRequest() {
        let response = await fetch(URLS.refreshToken, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({token: app.refreshToken})
        });
        if (response.ok) {
            await app.acceptJwtToken(await response.json());
        } else if (response.status === statusCodes.UNAUTHORIZED) {
            // TODO: then or always redirect
        }
    }

    /**
     * Returns response if status 200 (OK), or handles another status
     * @param response {Response}
     * @param excludedCodes {Array<Number>} - codes that will not be handled
     * @return {Response} - given response, or undefined if status isn't 200
     */
    clearResponse(response, excludedCodes) {
        if (response.ok || excludedCodes.includes(response.status)) {
            return response;
        }

        switch (response.status) {
            case statusCodes.UNAUTHORIZED:
                // TODO: wasn't authorize
                break;
            case statusCodes.FORBIDDEN:
                // TODO: invalid credentials
                break;
            case statusCodes.BAD_REQUEST:
                // TODO: incorrect request
                break;
        }

        return undefined;
    }
}