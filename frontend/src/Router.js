
export class Router {
    /**
     * Callback for handle url
     * @callback notFoundCallback
     * @param {String} path - not founded path
     * @return {Promise<*>}
     */

    /**
     * @param {{page404: notFoundCallback}=} options
     */
    constructor(options) {
        /**
         * @type {Map<String, urlHandler>}
         */
        this.urlMap = new Map();
        this.options = options;
    }

    /**
     * Callback for handle url
     * @callback urlHandler
     * @return {Promise<*>}
     */

    /**
     * Add url handler to router
     * @param {String} url - handled url
     * @param {urlHandler} handler - callback function
     */
    add(url, handler) {
        this.urlMap.set(url, handler);
    }

    /**
     * Navigate to given url
     * @param {String} url
     * @param {Boolean=} silent - false for add to history otherwise true
     */
    navigateTo(url, silent= false) {
        let handler = this.urlMap.get(url);
        if (handler) {
            if (!silent) {
                history.pushState(null, null, url);
            }
            handler().catch(e => console.error(`Unhandled error ${e}`));
        } else if (this.options && this.options.page404) {
            this.options.page404(url).catch(e => console.error(`Unhandled error ${e}`));
        } else {
            alert(`Cannot handle navigate to ${url}`)
        }
    }

    startListener() {
        window.onpopstate = () => this.popstateBinder();
    }

    popstateBinder() {
        this.navigateTo(window.location.pathname, true);
    }
}