import {Controller} from "./Controller";
import {app, URLS} from "../app";
import {PlayDto} from "../models/dto/PlayDto";
import {EVENT} from "../views/OrderView";
import {HallRow} from "../models/dto/HallRow";
import {OrderDto} from "../models/dto/OrderDto";

export class OrderController extends Controller {

    async handle(eventType, data = null) {
        switch (eventType) {
            case EVENT.MAP:
                return await this.loadMapInfo(data);
            case EVENT.HALLS:
                return await this.loadHalls(data);
            case EVENT.CATEGORIES:
                return await this.loadCategories(data);
            case EVENT.COMMIT:
                return await this.commitOrder(data);
        }
    }

    async init(args) {
        let webParam = args ? args : "";
        let response = await app.fetcher.jsonRequestOnlyOk(URLS.getPlays + webParam);
        if (response) {
            let plays = await response.json();
            return new PlayDto(plays[0]);
        }
    }

    async loadMapInfo(params) {
        let url = URLS.rowsInfo + `?date=${params.date ? params.date : ""}&hall=${params.hall ? params.hall : ""}`;
        let response = await app.fetcher.jsonRequestOnlyOk(url);
        if (response) {
            let data = await response.json();
            let rows = data.rows;
            let arr = [];
            for (let row of rows) {
                arr.push(new HallRow(row));
            }
            data.rows = arr;
            return data;
        }
    }

    async loadHalls() {
        let response = await app.fetcher.jsonRequestOnlyOk(URLS.loadHalls);
        if (response) {
            return await response.json();
        }
    }

    async loadCategories() {
        let response = await app.fetcher.jsonRequestOnlyOk(URLS.categories);
        if (response) {
            let array = await response.json();
            if (array && array.length && array.length > 0) {
                let map = new Map();
                for (let item of array) {
                    map.set(item.id, item);
                }
                return map;
            }
        }
    }

    /**
     * @param data {OrderDto}
     * @return {Promise<void>}
     */
    async commitOrder(data) {
        let response = await app.fetcher.jsonRequestOnlyOk(URLS.commitOrder, "POST", data.toJson());
        if (response) {
            let order = await response.json();
            if (order) {
                return order;
            } else {
                throw new Error(`Order error ${order}`);
            }
        }
    }
}