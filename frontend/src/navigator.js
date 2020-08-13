import {Router} from "./Router";
import {ErrorView} from "./views/ErrorView";
import {ContainerView} from "./views/ContainerView";
import {PageError} from "./models/PageError";
import {SignView} from "./views/SignView";
import {SignController} from "./controllers/SignController";

const root = document.getElementById("wrapper");
const router = new Router({
    page404: async page => {
        await new ErrorView(new ContainerView(root), PageError.model404(page)).render();
    }
});

document.body.addEventListener("click", e => {
    if (e.target.tagName === "A") {
        e.preventDefault();
        router.navigateTo(e.target.getAttribute("href"));
    }
});

router.add("/", async () => {
    await new ContainerView(root).render();
});

router.add("/sign", async () => {
    let sign = new SignView(new ContainerView(root));
    sign.setHandler(new SignController());
    await sign.render();
});

router.startListener();

export {
    router
}