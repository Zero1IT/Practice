export class CategoryDto {

    /**
     * @param obj {{id: Number, name: String, price: Number}}
     */
    constructor(obj) {
        this._id = obj.id;
        this._name = obj.name;
        this._price = obj.price;
    }


    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get price() {
        return this._price;
    }

    set price(value) {
        this._price = value;
    }
}