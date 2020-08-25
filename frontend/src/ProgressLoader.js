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

/**
 * @callback operationWithProgress - async function
 * @return {Promise<*>}
 */
 /**
 * @param func {operationWithProgress}
 */
async function showProgressOperation(func) {
    progress.show();
    let res = await func();
    progress.hide();
    return res;
}

export {
    ProgressLoader,
    progress,
    showProgressOperation
}