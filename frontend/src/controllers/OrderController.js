import {Controller} from "./Controller";
import {app, URLS} from "../app";
import {PlayDto} from "../models/dto/PlayDto";
import {EVENT} from "../views/OrderView";
import {HallRow} from "../models/dto/HallRow";
import {NotExistsOrderDto} from "../models/dto/NotExistsOrderDto";
import {CourierEvent} from "../views/OrderPanelView";
import {OrderDto} from "../models/dto/OrderDto";
import {CategoryDto} from "../models/dto/CategoryDto";
import {OrderInfoDto} from "../models/dto/OrderInfoDto";

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
            case EVENT.MODEL:
                return await this.orderModelByUrl(data);
            case CourierEvent.DATA:
                return await this.loadActualOrders(data);
            case CourierEvent.COUNT:
                return await this.actualOrdersCount(data);
            case CourierEvent.INFO:
                return await this.loadOrderInfo(data);
            case CourierEvent.TAKE:
                return await this.takeOrder(data);
        }
    }

    async orderModelByUrl(args) {
        const webParam = args ? args : "";
        const response = await app.fetcher.jsonRequestOnlyOk(URLS.getPlays + webParam);
        if (response) {
            const plays = await response.json();
            return new PlayDto(plays[0]);
        }
    }

    async loadMapInfo(params) {
        const url = URLS.rowsInfo + `?date=${params.date ? params.date : ""}&hall=${params.hall ? params.hall : ""}`;
        const response = await app.fetcher.jsonRequestOnlyOk(url);
        if (response) {
            const data = await response.json();
            const rows = data.rows;
            const arr = [];
            for (const row of rows) {
                arr.push(new HallRow(row));
            }
            data.rows = arr;
            return data;
        }
    }

    async loadHalls() {
        const response = await app.fetcher.jsonRequestOnlyOk(URLS.loadHalls);
        if (response) {
            return await response.json();
        }
    }

    async loadCategories() {
        const response = await app.fetcher.jsonRequestOnlyOk(URLS.categories);
        if (response) {
            const array = await response.json();
            if (array && array.length && array.length > 0) {
                const categories = array.map(it => new CategoryDto(it));
                const map = new Map();
                for (const item of categories) {
                    map.set(item.id, item);
                }
                return map;
            }
        }
    }

    /**
     * @param data {NotExistsOrderDto}
     * @return {Promise<void>}
     */
    async commitOrder(data) {
        const response = await app.fetcher.jsonRequestOnlyOk(URLS.commitOrder, "POST", data.toJson());
        if (response) {
            const order = await response.json();
            if (order) {
                return order;
            } else {
                throw new Error(`Order error ${order}`);
            }
        }
    }

    /**
     * @param info {{limit: Number, offset: Number}|null}
     * @return {Promise<OrderDto[]>}
     */
    async loadActualOrders(info) {
        let urlParams = "";
        if (info) {
            urlParams = `?limit=${info.limit}&offset=${info.offset}`
        }
        const response = await app.fetcher.jsonRequestOnlyOk(URLS.actualOrders + urlParams);
        if (response) {
            const arr = await response.json();
            return arr.map(it => new OrderDto(it));
        }
    }
    
    async actualOrdersCount() {
        const response = await app.fetcher.jsonRequestOnlyOk(URLS.actualOrdersCount);
        if (response) {
            return Number(await response.text());
        }
    }

    async loadOrderInfo(data) {
        const response = await app.fetcher.jsonRequestOnlyOk(`${URLS.ordersCategoryInfo}?id=${data}`);
        if (response) {
            return new OrderInfoDto(await response.json());
        }
        return undefined;
    }

    async takeOrder(id) {
        const response = await app.fetcher.jsonRequestOnlyOk(`${URLS.takeOrder}?id=${id}`, "PUT");
        if (response) {
            return new OrderDto(await response.json());
        }
    }
}