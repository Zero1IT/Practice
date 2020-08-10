import {Router} from "./Router";
import {ErrorView} from "./views/ErrorView";
import {SignView} from "./views/SignView";
import {ContainerView} from "./views/ContainerView";
import {PageError} from "./models/PageError";
import {SignController} from "./controllers/SignController";
import {Validator} from "./Validator";
import {Fetcher} from "./Fetcher";
import strings from "./values/strings.en"
import {Observable} from "./models/observable/Observable";

const root = document.getElementById("wrapper");

class App {

    constructor() {
        this.isInitialized = false;
        this.router = new Router({
            page404: page => {
                new ErrorView(new ContainerView(root), PageError.model404(page)).render();
            }
        });
        this.validator = new Validator();
        this.fetcher = new Fetcher();
        this.values = strings;
        this.token = "";
        this.tokenPayload = new Observable(null);
    }

    acceptJwtToken(token) {
        this.token = token;
        let payload = this.token.split(".")[1];
        this.tokenPayload.replaceModel(JSON.parse(atob(payload)).sub); // sub - payload key, value is object from server
    }

    initializeApp() {
        if (this.isInitialized) {
            throw new Error("App has already initialized");
        }
        this.isInitialized = true;
        this.router.add("/", () => {
            new ContainerView(root, this.tokenPayload).render();
        });
        this.router.add("/sign", () => {
            let sign = new SignView(new ContainerView(root, this.tokenPayload));
            sign.setHandler(new SignController());
            sign.render();
        });
        this.router.navigateTo(window.location.pathname, true);
        this.router.startListener();

        document.body.addEventListener("click", e => {
            if (e.target.tagName === "A") {
                e.preventDefault();
                const href = e.target.getAttribute("href");
                this.router.navigateTo(href);
            }
        });
    }
}

const app = new App();
app.initializeApp();

export {
    app
}