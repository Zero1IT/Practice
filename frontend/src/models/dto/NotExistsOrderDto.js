class RowDto {
    constructor(rowId, place) {
        this._rowId = rowId;
        this._place = place;
    }


    get rowId() {
        return this._rowId;
    }

    set rowId(value) {
        this._rowId = value;
    }

    get place() {
        return this._place;
    }

    set place(value) {
        this._place = value;
    }

    toModel() {
        return {
            rowId: this.rowId,
            place: this.place
        };
    }
}

class NotExistsOrderDto {
    constructor() {
        /**
         * @type {Number}
         */
        this._dateId = undefined;
        /**
         * @type {RowDto[]}
         */
        this._places = undefined;
    }


    get dateId() {
        return this._dateId;
    }

    set dateId(value) {
        this._dateId = value;
    }

    get places() {
        return this._places;
    }

    set places(value) {
        this._places = value;
    }

    toJson() {
        return JSON.stringify({
            dateId: this.dateId,
            places: this.places.map(p => p.toModel())
        });
    }
}

export {
    RowDto, NotExistsOrderDto
}