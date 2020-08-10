import {View} from "./View"
import {PageError} from "../models/PageError";

export class ErrorView extends View {

    /**
     * @param {HTMLElement|View} parent - content container
     * @param {PageError} model - view model
     */
    constructor(parent = null, model = undefined) {
        super(parent, model);
    }

    render() {
        return this._render(`<div id="notfound">
                <div class="notfound">
                    <div class="notfound-code">
                        <h1>Oops!</h1>
                    </div>
                    <h2>${this.model.code} - ${this.model.message}</h2>
                    <p>${this.model.describe}</p>
                    <a href="/">Go To Homepage</a>
                </div>
            </div>`)
    }
}