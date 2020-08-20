import {progress} from "./ProgressLoader";

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
     * @callback urlHandler - async function
     * @param url {String=}
     * @param index {Number=} - index of symbol '?' for eject params
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
     * @param replace {Boolean=} - use replaceState
     */
    navigateTo(url, silent= false, replace = false) {
        let paramIndex = url.indexOf("?");
        let handler = this.urlMap.get(paramIndex < 0 ? url : url.substring(0, paramIndex));
        if (handler) {
            progress.show();
            if (!silent) {
                if (replace) {
                    history.replaceState(null, null, url);
                } else {
                    history.pushState(null, null, url);
                }
            }
            handler(url, paramIndex)
                .then(() => progress.hide())
                .catch(e => console.error(`Unhandled error (navigateTo) - ${e}`));
        } else if (this.options && this.options.page404) {
            this.options.page404(url)
                .catch(e => console.error(`Unhandled error ${e}`));
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