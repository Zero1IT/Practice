import {HallRow} from "../../models/dto/HallRow";

/**
 * Callback for handle checkbox map
 * @callback checkBoxClicked
 * @param checked {Boolean} - checkbox is checked or not
 * @param div {HTMLDivElement} - schema container
 * @param category {Number=} - category id
 * @param row {Number=} - row number
 * @param place {Number=} - place number
 */

export class HallMapViewPart {
    /**
     * @param model {{rows: Array<HallRow>, exclude: {number: Number, exclude: Array<Number>}}}
     */
    constructor(model) {
        this.model = model;
        /** @type {checkBoxClicked} */
        this.mapHandler = null;
    }

    /**
     * @return {HTMLDivElement}
     */
    htmlDom() {
        this.parent = document.createElement("div");
        this.parent.classList.add("map-schema");
        this.parent.appendChild(this.createHallMap(this.model.rows, this.model.exclude));
        return this.parent;
    }

    /**
     * @param rows {HallRow[]}
     * @param exclude {{number: Number, exclude: Number[]}}
     * @return {HTMLDivElement}
     */
    createHallMap(rows, exclude) {
        let schema = document.createElement("div");
        schema.classList.add("schema");
        let from = 0;
        for (let row of rows) {
            schema.appendChild(this.createRow(row, exclude[row.number], from));
            from += row.count;
        }
        return schema;
    }


    /**
     * @param row {HallRow}
     * @param exclude {Array<Number>}
     * @param from {Number} - number from which to start counting in a row
     * @return {HTMLDivElement}
     */
    createRow(row, exclude, from) {
        let rowDiv = document.createElement("div");
        let isOff = false;
        for (let i = 0; i < row.count; i++) {
            isOff = exclude && exclude.includes(from + i + 1);
            rowDiv.appendChild(this.createCustomCheckBox(row, i + 1, isOff))
        }
        return rowDiv;
    }

    /**
     * @param row {HallRow}
     * @param order {Number}
     * @param isOff {Boolean}
     * @return {HTMLDivElement}
     */
    createCustomCheckBox(row, order, isOff = false) {
        let wrapper = document.createElement("div");
        wrapper.classList.add("custom-checkbox-wrapper");
        let id = `place${row.number}_${order}`;
        let num = (row.number - 1) * row.count + order;
        wrapper.innerHTML = `
            <input type="checkbox" class="place-box" id="${id}" data-category="${row.categoryId}" ${isOff ? 'disabled' : ''} hidden />
            <label for="${id}" data-id="${row.id}" class="${isOff ? 'custom-box-disabled' : 'custom-box'}">${num}</label>`;
        wrapper.firstElementChild.addEventListener("click", e => {
            if (this.mapHandler) this.mapHandler(e.target.checked, this.parent, row.categoryId, row.number, order);
        });
        return wrapper;
    }
}