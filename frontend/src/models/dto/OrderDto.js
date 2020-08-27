import {UserDto} from "./UserDto";

export class OrderDto {
    /**
     * @typedef {{
     *  id: Number,
     *  cost: Number,
     *  quantity: Number,
     *  user: UserDto,
     *  courier: UserDto
     *  confirmed: boolean
     *  paid: boolean
     *  date: {nano: Number, epochSecond: Number}
     * }} JavaCompletedOrderDto
     */

    /**
     * @param obj {JavaCompletedOrderDto}
     */
    constructor(obj) {
        this._id = obj.id;
        this._cost = obj.cost;
        this._quantity = obj.quantity;
        this._user = obj.user;
        this._confirmed = obj.confirmed;
        this._courier = obj.courier;
        this._paid = obj.paid;
        this._date = new Date(obj.date.epochSecond * 1000);
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get cost() {
        return this._cost;
    }

    set cost(value) {
        this._cost = value;
    }

    get quantity() {
        return this._quantity;
    }

    set quantity(value) {
        this._quantity = value;
    }

    get user() {
        return this._user;
    }

    set user(value) {
        this._user = value;
    }

    get confirmed() {
        return this._confirmed;
    }

    set confirmed(value) {
        this._confirmed = value;
    }

    get courier() {
        return this._courier;
    }

    set courier(value) {
        this._courier = value;
    }

    get paid() {
        return this._paid;
    }

    set paid(value) {
        this._paid = value;
    }

    get date() {
        return this._date;
    }

    set date(value) {
        this._date = value;
    }
}