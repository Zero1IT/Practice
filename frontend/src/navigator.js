import {Router} from "./Router";
import {ErrorView} from "./views/ErrorView";
import {ContainerView} from "./views/ContainerView";
import {PageError} from "./models/PageError";
import {SignView} from "./views/SignView";
import {SignController} from "./controllers/SignController";
import {PlayController} from "./controllers/PlayController";
import {PlayView} from "./views/PlayView";
import {App} from "./app";
import {ContainerController} from "./controllers/ContainerController";

const NAVIGATOR = {
    HOME: "/",
    SIGN: "/sign",
    PLAY: "/plays/order"
};

const containerController = new ContainerController();

/**
 * @param app {App}
 * @return {Router}
 */
function createRouter(app) {

    function getContainerView() {
        let c = new ContainerView(app.session.user, root);
        c.setHandler(containerController);
        return c;
    }

    const root = document.getElementById("wrapper");
    const router = new Router({
        page404: async page => {
            await new ErrorView(getContainerView(), PageError.model404(page)).render();
        }
    });

    document.body.addEventListener("click", e => {
        // noinspection JSUnresolvedVariable
        if (e.target.tagName === "A") {
            e.preventDefault();
            // noinspection JSUnresolvedFunction
            router.navigateTo(e.target.getAttribute("href"));
        }
    });

    router.add(NAVIGATOR.HOME, async () => {
        let playView = new PlayView(getContainerView());
        playView.setHandler(new PlayController());
        await playView.render();
    });

    router.add(NAVIGATOR.SIGN, async () => {
        let sign = new SignView(getContainerView());
        sign.setHandler(new SignController());
        await sign.render();
    });

    router.add(NAVIGATOR.PLAY, async (url, i) => {
        console.log(url.substring(i))
    });

    router.startListener();
    return router;
}

export {
    NAVIGATOR,
    createRouter,
}