export class ViewEvent {

    async handle(eventType, data = null) {
        throw new Error("Handler isn't support");
    }
}