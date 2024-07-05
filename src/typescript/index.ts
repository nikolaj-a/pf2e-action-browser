import "../styles/action-browser.scss";
import { ActionBrowser } from "./apps/action-browser";

interface GameActionBrowser extends GamePF2e {
    actionBrowser: ActionBrowser;
}

declare global {
    const game: GameActionBrowser;
}

Hooks.once("init", () => {
    const paths = [
        "modules/pf2e-action-browser/templates/apps/action-browser.hbs",
        "modules/pf2e-action-browser/templates/apps/action-buttons.hbs",
        "modules/pf2e-action-browser/templates/apps/action-details.hbs",
        "modules/pf2e-action-browser/templates/apps/action-list.hbs",
    ];
    loadTemplates(paths);
});

Hooks.on("ready", () => {
    game.actionBrowser = new ActionBrowser();
});

Hooks.on("getSceneControlButtons", (controls) => {
    const tokenTools = controls.find((control) => control.name === "token")?.tools;

    // Action Browser
    tokenTools?.push({
        name: "actionbrowser",
        title: "CONTROLS.ActionBrowser",
        icon: "action-browser",
        button: true,
        visible: true,
        onClick: () => {
            if (game.actionBrowser.rendered) {
                game.actionBrowser.close({ force: true });
            } else {
                game.actionBrowser.render(true);
            }
        },
    });
});
