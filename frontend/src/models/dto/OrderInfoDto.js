import {CategoryDto} from "./CategoryDto";

export class OrderInfoDto {
    /**
     * @typedef {{
     *     value: String,
     *     key: CategoryDto
     * }} JavaPair
     * @typedef {{
     *     categoriesOfOrder: JavaPair[]
     * }} JsonOrderInfoDto
     */

    /**
     * @param obj {JsonOrderInfoDto}
     */
    constructor(obj) {
        /** @type {Map<CategoryDto, String>} */
        this.categoriesOfOrder = new Map();
        for (let key of obj.categoriesOfOrder) {
            this.categoriesOfOrder.set(key.key, key.value);
        }
    }
}