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
import {OrderView} from "./views/OrderView";
import {OrderController} from "./controllers/OrderController";

const Navigator = {
    HOME: "/", SIGN: "/sign", PLAY: "/plays/order",
    PANEL_USERS: "/panel/users",
    PANEL_ORDER: "/panel/orders"
};

const containerController = new ContainerController();
const orderController = new OrderController();
const signController = new SignController();
const playController = new PlayController();

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

    router.add(Navigator.HOME, async () => {
        let playView = new PlayView(getContainerView());
        playView.setHandler(playController);
        await playView.render();
    });

    router.add(Navigator.SIGN, async () => {
        let sign = new SignView(getContainerView());
        sign.setHandler(signController);
        await sign.render();
    });

    router.add(Navigator.PLAY, async (url) => {
        let ord = new OrderView(getContainerView(), url);
        ord.setHandler(orderController);
        await ord.render();
    });

    router.add(Navigator.PANEL_ORDER, async () => {

    });

    router.startListener();
    return router;
}

export {
    Navigator,
    createRouter,
}