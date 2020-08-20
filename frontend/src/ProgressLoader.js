class ProgressLoader {
    constructor() {
        this.init();
    }

    init() {
        this.preloader = document.getElementById("preloader");
        this.preloader.style.display = "none";
        this.waitersCount = 0;
        this.hidden = true;
    }

    show() {
        ++this.waitersCount;
        if (this.hidden) {
            this.preloader.style.display = "flex";
            this.hidden = false;
        }
    }

    hide() {
        --this.waitersCount;
        if (!this.hidden && this.waitersCount === 0) {
            this.preloader.style.display = "none";
            this.hidden = true;
        }
    }
}

const progress = new ProgressLoader();

export {
    progress
}