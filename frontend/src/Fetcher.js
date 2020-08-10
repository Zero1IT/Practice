import {app} from "./app";

export class Fetcher {
    /**
     * @return Promise<Response> - fetch() promise
     */
    jsonRequest(url, method, jsonData) {
        return fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                "Authorization": `Bearer ${app.token}`
            },
            body: jsonData
        });
    }
}