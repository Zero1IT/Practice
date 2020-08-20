import {Controller} from "./Controller";
import {EVENT} from "../views/SignView";
import {LoginDto} from "../models/dto/LoginDto";
import {RegistrationDto} from "../models/dto/RegistrationDto";
import {app, URLS} from "../app";
import {NAVIGATOR} from "../navigator";

export class SignController extends Controller {

    async handle(eventType, data) {
        switch (eventType) {
            case EVENT.SIGN_IN:
                await this.signIn(data);
                break;
            case EVENT.SIGN_UP:
                await this.signUp(data);
                break;
        }
    }

    /**
     * @param data {{event: EventListener, model: LoginDto}}
     * @return {Promise<void>}
     */
    async signIn(data) {
        this.doSign(data, URLS.login);
    }

    /**
     * @param data {{event: EventListener, model: RegistrationDto}}
     * @return {Promise<void>}
     */
    async signUp(data) {
        await this.doSign(data, URLS.registration);
    }

    async doSign(data, url) {
        let response = await app.fetcher.jsonRequest(url, "POST", data.model.toJson());
        if (response.ok) {
            let json = await response.json();
            await app.acceptJwtToken(json);
            app.router.navigateTo(NAVIGATOR.HOME, false, true);
        } else {
            throw new Error(`${response.status}`);
        }
    }
}