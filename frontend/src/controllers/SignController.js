import {Controller} from "./Controller";
import {EVENT} from "../views/SignView";
import {LoginDto} from "../models/dto/LoginDto";
import {RegistrationDto} from "../models/dto/RegistrationDto";
import {app} from "../app";

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
        let response = await app.fetcher.jsonRequest("/login", "POST", data.model.toJson());
        if (response.ok) {
            
        }
    }

    /**
     * @param data {{event: EventListener, model: RegistrationDto}}
     * @return {Promise<void>}
     */
    async signUp(data) {
        let response = await app.fetcher.jsonRequest("/registration", "POST", data.model.toJson());
        if (response.ok) {
            let json = await response.json();
            app.acceptJwtToken(json);
        } else {
            throw new Error(`${response.status}`);
        }
    }
}