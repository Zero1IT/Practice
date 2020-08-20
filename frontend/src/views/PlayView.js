import {View} from "./View";
import {PlayItemViewPart} from "./parts/PlayItemViewPart";

export class PlayView extends View {

    constructor(parent) {
        super(parent);
    }

    async render() {
        let data = await this.handler.init();
        let container = await this.getContainer();
        let list = container.getElementsByClassName("plays-list")[0];
        for (let item of data) {
            list.appendChild(new PlayItemViewPart(item).htmlDom());
        }
        return container;
    }

    async getContainer() {
        return this._render(`
        <div class="plays-content-wrapper">
            <div class="plays-list">
            </div>
        </div>`)
    }
}