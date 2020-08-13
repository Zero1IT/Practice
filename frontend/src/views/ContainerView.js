import {View} from "./View";

export class ContainerView extends View {

    /**
     * @param {HTMLElement|View} parent - content container
     */
    constructor(parent = null) {
        super(parent);
    }

    async render() {
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