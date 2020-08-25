import {PlayDto} from "../../models/dto/PlayDto";
import {app, resources} from "../../app";
import {Navigator} from "../../navigator";

export class PlayItemViewPart {

    /**
     * @param model {PlayDto}
     */
    constructor(model) {
        this.model = model;
    }

    /**
     * @return {HTMLDivElement}
     */
    htmlDom() {
        let div = document.createElement("div");
        div.classList.add("play-item");
        this.fill(div);
        return div;
    }

    /**
     * @param div {HTMLDivElement}
     */
    fill(div) {
        div.innerHTML = `
                    <div class="play-info">
                        <h3 class="play-title">${this.model.title}</h3>
                        <p class="play-author">
                            <span class="h-name">${resources.strings.playPage.author}:</span>
                            <span class="h-item">${this.model.authorName}</span>
                        </p>
                        <p class="play-genre">
                            <span class="h-name">${resources.strings.playPage.genre}:</span>
                            <span class="h-item">${this.model.genreName}</span>
                        </p>
                    </div>
                    <div class="play-dates">
                        <ul class="play-dates-list">
                            <li>${resources.strings.playPage.dates}:</li>
                            ${this.playDatesListRender()}
                        </ul>
                    </div>`;
    }

    playDatesListRender() {
        let html = [];
        for (let item of this.model.dates) {
            let d = new Date(item.date.epochSecond * 1000).toLocaleString(app.locale);
            html.push(`<li class="play-date"><a href="${Navigator.PLAY}?id=${this.model.id}&date=${item.id}">${d}</a></li>`);
        }
        return html.join("\n");
    }
}