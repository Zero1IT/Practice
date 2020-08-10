/**
 * Observer should implement async notify(model) method
 */
export class Observable {

    constructor(model) {
        this.subscribers = new Set();
        this.model = model;
    }

    /**
     * Callback for change model
     * @param model
     * @callback callModel
     */

    /**
     * Change model and notify all
     * @param callback {callModel}
     */
    changeModel(callback) {
        new Promise(resolve => {
            callback(this.model);
            resolve(this.model);
        }).then(model => {
            this.notifyAll(model);
        });
    }

    notifyAll(model) {
        for (let subscriber of this.subscribers) {
            subscriber.notify(model).catch(console.log); // TODO: error handler
        }
    }

    replaceModel(newModel) {
        this.model = newModel;
        this.notifyAll(this.model);
    }

    /**
     * @return {boolean} - true if model present, otherwise false
     */
    isPresent() {
        return !!this.model;
    }

    /**
     * Return copy of observable model
     * @return {*}
     */
    getModelAsImmutable() {
        return Object.assign(Object.create(Object.getPrototypeOf(this.model)), this.model);
    }

    subscribe(observer) {
        if (((typeof observer["notify"]) == "function")) {
            this.subscribers.add(observer);
        } else {
            throw new Error(`${observer} doesn't implement async notify(model) method`)
        }
    }

    unsubscribe(observer) {
        this.subscribers.delete(observer);
    }
}