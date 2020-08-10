export class PageError {

    /**
     * @param {Number|String} code - status code
     * @param {String} message - error message
     * @param {String} describe - error info
     */
    constructor(code, message, describe) {
        this.code = code;
        this.message = message;
        this.describe = describe;
    }

    static model404(page = "page") {
        let code = 404;
        let message = "Page not found";
        let info = `The ${page} you are looking for might have been removed had its name changed or is temporarily unavailable.`;
        return new PageError(code, message, info);
    }
}