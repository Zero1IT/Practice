import {Controller} from "./Controller";
import {EVENT} from "../views/ContainerView";
import {app} from "../app";
import {Navigator} from "../navigator";

export class ContainerController extends Controller {

    async handle(eventType, data = null) {
        switch(eventType) {
            case EVENT.loadResource:
                await app.changeLocale(data);
                break;
            case EVENT.signOut:
                await app.signOut();
                app.router.forceNavigateTo(Navigator.HOME);
                break;
        }
    }
}