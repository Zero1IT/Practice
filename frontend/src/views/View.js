/**
 * All view must be override all methods
 */
import {Controller} from "../controllers/Controller";

export class View {

    /**
     * @param {HTMLElement|View} parent - content container
     * @param model - view model
     */
    constructor(parent= null, model = null) {
        this.container = null;
        this.parent = parent;
        this.model = model;
        /**
         * @type {Controller}
         */
        this.handler = null;
        /**
         * @type {Map<String, HTMLElement>}
         * @private
         */
        this._htmlCache = new Map();
    }

    /**
     * Method to override
     * @return {Promise<HTMLElement>} - content container
     */
    async render() {
        throw new Error("Render wasn't override");
    }

    /**
     * Method to override, set event handler on view
     * @param handler {Controller}
     */
    setHandler(handler) {
        this.handler = handler;
    }

    /**
     * Should be used every time before rendering (render() call)
     */
    clearCache() {
        this._htmlCache.clear();
    }

    /**
     * Find and cache html element inside current container (if it's class return first in DOM)
     * @param selector {String} - id or class selector for child container
     * @return HTMLElement
     */
    getHtmlElement(selector) {
        if (this.container) {
            let element = this._htmlCache.get(selector);
            if (!element) {
                element = this._getElementBySelector(this.container, selector);
                this._htmlCache.set(selector, element);
            }
            return element;
        }
    }

    /**
     * Insert {html} code into parent block
     * @param html {String} - html code
     * @param root {String=} - id or class selector for child container
     * @return {HTMLElement} - container if view rendered itself, otherwise view's html string
     * @protected
     */
    _render(html, root = undefined) {
        let container = this.parent instanceof View ? this.parent.render() : this.parent;
        container.innerHTML = html;
        if (root) {
            container = this._getElementBySelector(container, root);
            if (!container) {
                throw new Error(`Selector ${root} not found (it's should be id or class)`);
            }
        }
        return (this.container = container);
    }

    /**
     * Find html element inside container (if it's class return first in DOM)
     * @param container - container for search
     * @param selector - selector class or id
     * @return {HTMLElement}
     * @private
     */
    _getElementBySelector(container, selector) {
        return selector.startsWith("#") ? document.getElementById(selector.substring(1)) :
            (selector.startsWith(".") ? container.getElementsByClassName(selector.substring(1))[0] : undefined);
    }
}