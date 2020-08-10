
export class Router {
    /**
     * Callback for handle url
     * @callback notFoundCallback
     * @param {String} path - not founded path
     */

    /**
     * @param {{page404: notFoundCallback}=} options
     */
    constructor(options) {
        this.urlMap = new Map();
        this.options = options;
    }

    /**
     * Callback for handle url
     * @callback urlHandler
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
            handler();
        } else if (this.options && this.options.page404) {
            this.options.page404(url);
        } else {
            alert(`Cannot handle navigate to ${url}`)
        }
    }

    redirectTo(url) {
        history.go(-10000);
        this.navigateTo(url, true);
    }

    startListener() {
        window.onpopstate = () => this.popstateBinder();
    }

    popstateBinder() {
        this.navigateTo(window.location.pathname, true);
    }
}