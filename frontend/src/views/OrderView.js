import {View} from "./View";
import {PlayDto} from "../models/dto/PlayDto";
import {resources, app} from "../app";
import {HallMapViewPart} from "./parts/HallMapViewPart";
import {showProgressOperation} from "../ProgressLoader";
import {NotExistsOrderDto, RowDto} from "../models/dto/NotExistsOrderDto";
import {CategoryDto} from "../models/dto/CategoryDto";

const urlDateRegx = /.+date=(\d+)/;

class OrderView extends View {
    /**
     * @param {HTMLElement|View} parent - content container
     * @param urlParams -
     */
    constructor(parent, urlParams) {
        super(parent);
        this.urlParams = urlParams;
        this.selectedDate = null;
        this.selectedHall = null;
    }

    async render() {
        /** @type {PlayDto} */
        this.model = await this.handler.handle(EVENT.MODEL, this.urlParams);
        /** @type {Array<{id: Number, name: String}>} */
        this.halls = await this.handler.handle(EVENT.HALLS);
        /** @type {Map<Number, CategoryDto>} */
        this.categories = await this.handler.handle(EVENT.CATEGORIES);
        if (this.model) {
            await this._render(this.viewHtml());
            this.createDateList(this.getHtmlElement(".map-dates-list"));
            this.createHallList(this.getHtmlElement(".map-halls-list"));
            this.orderCommitListener(this.getHtmlElement("#confirm_order"));
        }
        return this.container;
    }

    viewHtml() {
        return `<div class="order-wrapper">
            <div class="order-info">
                <div class="play-info">
                    <p class="play-title">${resources.strings.playPage.title}: ${this.model.title}</p>
                    <p class="author-name">${resources.strings.playPage.author}: ${this.model.authorName}</p>
                    <p class="genre">${resources.strings.playPage.genre}: ${this.model.genreName}</p>
                </div>
            </div>
            <div class="play-map-wrapper">
                <div class="order-map-dates">
                    <ul class="map-dates-list">
                    </ul>
                </div>
                <div class="order-map-halls">
                    <ul class="map-halls-list">
                    </ul>
                </div>
                <div class="create-order-wrapper">
                    <div class="play-map">
                        
                    </div>
                    <div class="order-confirm-info">
                        <div class="last-selected-info">
                            <p>Last selected place category: <b id="hint_category">None.</b></p>
                            <p>Its price is: <b id="hint_price">0</b></p>
                        </div>
                        <div class="order-complete-info">
                            <p>Selected <b id="total_count">0</b> tickets</p>
                            <p>Total price: <b id="total_price">0</b></p>
                        </div>
                        <div class="confirm-order-panel">
                            <button class="confirm-order-btn" id="confirm_order">Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    /**
     * @param div {Element}
     */
    createDateList(div) {
        let currentDateId = Number(urlDateRegx.exec(this.urlParams)[1]);
        for (let date of this.model.dates) {
            let li = document.createElement("li");
            li.innerText = new Date(date.date.epochSecond * 1000).toLocaleDateString(app.locale);
            li.classList.add("map-date");
            li.setAttribute("data-id", date.id.toString());
            if (date.id === currentDateId) {
                li.classList.add("selected");
                this.selectedDate = currentDateId;
            }
            li.addEventListener("click", this.createSelectMapCallback(div, date.id, true));
            div.appendChild(li);
        }
    }

    /**
     * @param div {Element}
     */
    createHallList(div) {
        if (this.halls) {
            for (let hall of this.halls) {
                let li = document.createElement("li");
                li.classList.add("map-hall");
                li.innerText = hall.name;
                li.addEventListener("click", this.createSelectMapCallback(div, hall.id, false));
                div.appendChild(li);
            }
        }
    }

    /**
     * @param div {Element} - parent element for li
     * @param id {Number} - model id
     * @param isDate {Boolean} - true if it's from date list
     */
    createSelectMapCallback(div, id, isDate) {
        return e => {
            if (!e.target.classList.contains("selected")) {
                let selected = div.getElementsByClassName("selected")[0];
                if (selected) selected.classList.remove("selected");
                e.target.classList.add("selected");
            }
            let changed = false;
            if (isDate && this.selectedDate !== id) {
                this.selectedDate = id;
                changed = true;
            } else if (!isDate && this.selectedHall !== id) {
                this.selectedHall = id;
                changed = true;
            }
            if (this.selectedDate && this.selectedHall && changed) {
                this.handler.handle(EVENT.MAP, {date: this.selectedDate, hall: this.selectedHall})
                    .then(model => {
                        let map = new HallMapViewPart(model);
                        map.mapHandler = this.theaterMapHandler();
                        this.getHtmlElement(".play-map").innerHTML = "";
                        this.getHtmlElement(".play-map").appendChild(map.htmlDom());
                        this.getHtmlElement(".order-confirm-info").style.display = "flex";
                });
            }
        }
    }

    theaterMapHandler() {
        return (checked, div, category) => {
            this.printTotal(div);
            if (checked) {
                this.getHtmlElement("#hint_category").innerText = this.categories.get(category).name;
                this.getHtmlElement("#hint_price").innerText = this.categories.get(category).price.toString();
            }
        }
    }

    /**
     * @param schema
     * @return {{places: Element[], price: number}}
     */
    calculateTotal(schema) {
        let places = Array.from(schema.getElementsByClassName("place-box"));
        let price = 0;
        places = places.filter(box => box.checked);
        for (let item of places) {
            price += this.categories.get(Number(item.getAttribute("data-category"))).price;
        }
        return {price, places}
    }

    printTotal(schema) {
        let total = this.calculateTotal(schema);
        this.getHtmlElement("#total_count").innerText = total.places.length.toString();
        this.getHtmlElement("#total_price").innerText = total.price.toString();
    }

    orderCommitListener(btn) {
        btn.addEventListener("click", () => {
            let schema = this.getHtmlElement(".schema");
            if (schema) {
                showProgressOperation(async () => {
                    let places = this.calculateTotal(schema).places;
                    let rows = places.map(p => p.nextElementSibling)
                        .map(it => new RowDto(Number(it.getAttribute("data-id")), Number(it.innerText)));
                    let selectedDate = this.container.querySelector(".map-date.selected");
                    let dto = new NotExistsOrderDto();
                    dto.dateId = Number(selectedDate.getAttribute("data-id"));
                    dto.places = rows;
                    return await this.handler.handle(EVENT.COMMIT, dto);
                }).then(obj => app.router.updateCurrent());
            }
        });
    }
}

const EVENT = {
    MODEL: "o_m",
    MAP: "map",
    HALLS: "hall",
    CATEGORIES: "category",
    COMMIT: "commit"
};

export {
    OrderView, EVENT
}