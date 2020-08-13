export class Controller {

    /**
     * Handle view event
     * @param eventType - type of event (some constant understandable for Controller)
     * @param data - some model understandable for Controller
     * @return {Promise<void>} - promise is handling inside view
     */
    async handle(eventType, data = null) {
        throw new Error("Handler isn't support");
    }

    /**
     * Loads data for view, and return it
     * @return {Promise<*>} - promise is wrapping some model
     */
    async init() {
        throw new Error("Controller doesn't support init()")
    }
}