import {View} from "./View";
import {OrderDto} from "../models/dto/OrderDto";
import {app} from "../app";
import {OrderInfoDto} from "../models/dto/OrderInfoDto";

const PAGE_KEY = "ORDER_PANEL_CURRENT_PAGE";

class OrderPanelView extends View {
    /**
     * @param parent {HTMLElement|View} - content container
     * @param urlParams {String} - url params (with ? in start)
     */
    constructor(parent, urlParams) {
        super(parent);
        this.perPage = 10;
        this.orderCount = 0;
        this.urlParams = urlParams;
    }

    async render() {
        this.orderCount = await this.handler.handle(CourierEvent.COUNT);
        await this._render(this.renderPage());
        await this.renderContent(this.getCurrentPageNum());
        return this.container;
    }

    renderPage() {
        return `
            <div class="panel-wrapper">
            <div class="panel-info"></div>
            <div class="panel-content">
                <div class="o-p-content">
                    
                </div>
            </div>
        </div>`;
    }

    async renderContent(pageNum) {
        const data = await this.handler.handle(CourierEvent.DATA,{
            limit: this.perPage,
            offset: this.perPage * (pageNum - 1),
            urlParams: this.urlParams
        });
        this.getHtmlElement(".o-p-content").innerHTML = "";
        this.getHtmlElement(".o-p-content").appendChild(await this.contentHtml(pageNum, data));
    }

    /**
     * @param pageNum {Number}
     * @param data {OrderDto[]}
     * @return {Promise<HTMLDivElement>}
     */
    async contentHtml(pageNum, data) {
        const arr = data.map(it => this.createListItem(it));
        const div = document.createElement("div");
        div.classList.add("o-p-content");
        div.innerHTML = `<div class="o-p-item-list">${arr.join("")}</div><div class="page-nav-wrapper"></div>`;

        const els = div.getElementsByClassName("more-info-box");
        for (let e of els) {
            e.addEventListener("click", this.showMoreInfoCallback());
        }
        const takeButtons = div.getElementsByClassName("o-p-item-btn");
        for (let it of takeButtons) {
            it.addEventListener("click", this.takeOrderCallback());
        }
        this.saveCurrentPageNum(pageNum);
        div.getElementsByClassName("page-nav-wrapper")[0].appendChild(this.createPageNav(pageNum));
        return div;
    }

    /**
     * @param obj {OrderDto}
     */
    createListItem(obj) {
        const status = obj.courier ? "Taken" : "Pending";
        const btn = obj.courier ? "" : `<button class="o-p-item-btn" data-order="${obj.id}">Take</button>`;
        return `<div class="o-p-item">
                            <div class="o-p-item-preview">
                                <h6 class="o-p-item-date">${obj.date.toLocaleString(app.locale)}</h6>
                                <h2 class="o-p-item-status">${status}</h2>
                            </div>
                            <div class="o-p-item-info">
                                <h2 class="o-p-item-title"></h2>
                                <div class="o-p-item-user">
                                    <p>User email: ${obj.user.email}</p>
                                    <p>User phone: ${obj.user.phone}</p>
                                </div>
                                <div class="o-p-item-play">
                                    <p>Order cost: ${obj.cost}</p>
                                    <p>Tickets count: ${obj.quantity}</p>
                                    <p ${obj.paid ? "class='o-p-paid'" : ""}>${obj.paid ? "Paid" : "Not Paid"}</p>
                                </div>
                                <div class="o-p-ticket-info">
                                    <input type="checkbox" class="more-info-box" id="info_${obj.id}" data-order="${obj.id}" hidden>
                                    <label for="info_${obj.id}">Show info</label>
                                    <div class="o-p-info-payload"></div>
                                </div>
                                ${btn}
                            </div>
                        </div>`;
    }

    /**
     * @param page {Number} - page number
     * @return {HTMLUListElement}
     */
    createPageNav(page) {
        const ul = document.createElement("ul");
        ul.classList.add("page-nav");
        const pageNum = Math.ceil(this.orderCount / this.perPage);
        ul.appendChild(this.createPageNavItem(page, null, "selected-page"));
        let it = page;
        while (--it > page - 4 && it > 0) {
            ul.insertBefore(this.createPageNavItem(it), ul.firstElementChild);
        }
        it = page;
        while (++it < page + 4 && it <= pageNum) {
            ul.appendChild(this.createPageNavItem(it));
        }
        ul.insertBefore(this.createPageNavItem(1, "Start"), ul.firstElementChild);
        ul.appendChild(this.createPageNavItem(Math.ceil(this.orderCount / this.perPage), "End"));
        return ul;
    }

    /**
     * @param pageNum
     * @param text - button text
     * @param className - class attribute
     * @return {HTMLLIElement}
     */
    createPageNavItem(pageNum, text = null, className = null) {
        if (!text) {
            text = pageNum;
        }
        const li = document.createElement("li");
        if (className) {
            li.classList.add(className);
        }
        li.innerText = text;
        li.addEventListener("click", this.thisCreateClickPageListener(pageNum));
        return li;
    }

    thisCreateClickPageListener(pageNum) {
        return () => {
            this.renderContent(pageNum).then(() => window.scrollTo(0, 0));
        };
    }

    showMoreInfoCallback() {
        return async (e) => {
            const id = e.target.getAttribute("data-order");
            const info = await this.handler.handle(CourierEvent.INFO, id);
            if (info) {
                e.target.parentElement.lastElementChild.innerHTML = this.createInfoHtml(info);
            } else {
                e.target.parentElement.lastElementChild.innerHTML = "Not found info"
            }
        };
    }

    takeOrderCallback() {
        return (e) => {
            const id = e.target.getAttribute("data-order");
            this.handler.handle(CourierEvent.TAKE, id).then(dto => {
                const div = document.createElement("div");
                div.innerHTML = this.createListItem(dto);
                const parent = this.getElementParentWithClass(e.target, "o-p-item");
                if (parent) {
                    parent.replaceWith(div.firstElementChild);
                }
            });
        };
    }

    /**
     * @param info {OrderInfoDto}
     */
    createInfoHtml(info) {
        const arr = [];
        for (let [key, item] of info.categoriesOfOrder) {
            arr.push(`<p>${key.name}: ${item}</p>`)
        }
        return arr.join("")
    }

    saveCurrentPageNum(page) {
        sessionStorage.setItem(PAGE_KEY, page);
    }

    getCurrentPageNum() {
        return Number(sessionStorage.getItem(PAGE_KEY)) || 1;
    }

    /**
     * Find parent of given element.
     * @param element {Element}
     * @param classAttribute {String}
     */
    getElementParentWithClass(element, classAttribute) {
        let parent = element.parentElement;
        while (parent) {
            if (parent.classList.contains(classAttribute)) {
                return parent;
            }
            parent = parent.parentElement;
        }
        return null;
    }
}

const CourierEvent = {
    DATA: "actual",
    COUNT: "actual_count",
    INFO: "more_info",
    TAKE: "take_order",
};

export {
    CourierEvent,
    OrderPanelView,
}