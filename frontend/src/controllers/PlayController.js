import {Controller} from "./Controller";
import {PlayItemViewPart} from "../views/parts/PlayItemViewPart";
import {app, URLS} from "../app";

export class PlayController extends Controller {

    /**
     * @return {Promise<Array<PlayItemViewPart>>}
     */
    async init() {
        let response = await app.fetcher.jsonRequest(URLS.getNewPlays, "GET");
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(`${response.status}`);
        }
    }
}