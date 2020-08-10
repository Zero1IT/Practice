import {View} from "./View";
import {Observable} from "../models/observable/Observable";

export class ContainerView extends View {

    /**
     * @param {HTMLElement|View} parent - content container
     * @param model {Observable} - observable model with user information
     */
    constructor(parent = null, model) {
        super(parent, model);
        model.subscribe(this);
    }

    async notify(model) {
        console.log(model); // TODO: update view
    }

    render() {
        return super._render(`
        <div class="header-menu">
            <div class="status"></div>
            <nav class="header-nav"></nav>
            <div class="sign"></div>
        </div>
        <div id="root">
            <a href="/sign">Sign Page</a>
        </div>
        <footer>
        </footer>`, "#root");
    }
}