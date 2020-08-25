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
     * @param force {Boolean} - anyway update
     */
    navigateTo(url, silent= false, replace = false, force = false) {
        if (!force && window.location.pathname === url && !replace && !silent) {
            return; // don't handle because no matter
        }
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
                .then(() => {progress.hide(); window.scrollTo(0, 0)})
                .catch(e => console.error(`Unhandled error (navigateTo) - ${e.stack}`));
        } else if (this.options && this.options.page404) {
            this.options.page404(url)
                .catch(e => console.error(`Unhandled error ${e}`));
        } else {
            alert(`Cannot handle navigate to ${url}`)
        }
    }

    forceNavigateTo(url, silent= false, replace = false) {
        this.navigateTo(url, silent, replace, true);
    }

    startListener() {
        window.onpopstate = () => this.popstateBinder();
    }

    popstateBinder() {
        this.navigateTo(this.ejectPathNameWithParams(), true);
    }

    ejectPathNameWithParams() {
        let link = window.location.pathname;
        let index = window.location.href.indexOf("?");
        return index > 0 ? link + window.location.href.substring(index) : link;
    }

    updateCurrent() {
        this.navigateTo(this.ejectPathNameWithParams(), false, true, true);
    }
}