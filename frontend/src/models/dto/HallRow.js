export class HallRow {
    /**
     * @typedef {{
     *     id: Number,
     *     hallId: Number,
     *     number: Number,
     *     count: String,
     *     hint: Number,
     *     categoryId: Number,
     * }} JavaHallRow
     */

     /**
     * @param model {JavaHallRow}
     */
    constructor(model) {
        this._id = model.id;
        this._hallId = model.hallId;
        this._number = model.number;
        this._count = model.count;
        this._hint = model.hint;
        this._categoryId = model.categoryId;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get hallId() {
        return this._hallId;
    }

    set hallId(value) {
        this._hallId = value;
    }

    get number() {
        return this._number;
    }

    set number(value) {
        this._number = value;
    }

    get count() {
        return this._count;
    }

    set count(value) {
        this._count = value;
    }

    get hint() {
        return this._hint;
    }

    set hint(value) {
        this._hint = value;
    }

    get categoryId() {
        return this._categoryId;
    }

    set categoryId(value) {
        this._categoryId = value;
    }
}