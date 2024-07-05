interface HasPreview {
    preview(options: Partial<ActionCheckPreviewOptions>): ActionCheckPreview[];
}

interface ActionBrowserData {
    actions: Record<ActionSection | "favorites" | "other", ActionListItem[]>;
    actor?: Actor;
    disabled: boolean;
    details?: ActionDetails;
}

function hasPreview(value: object): value is HasPreview {
    return "preview" in value;
}

class ActionVariantListItem {
    readonly checks;
    readonly #variant;

    constructor(variant: ActionVariant, actor?: Actor) {
        this.checks = hasPreview(variant) ? variant.preview({ actor }) : undefined;
        this.#variant = variant;
    }

    get cost(): ActionVariant["cost"] {
        return this.#variant.cost;
    }

    get name(): ActionVariant["name"] {
        return this.#variant.name;
    }

    get slug(): ActionVariant["slug"] {
        return this.#variant.slug;
    }

    get traits(): ActionVariant["traits"] {
        return this.#variant.traits;
    }
}

class ActionListItem {
    readonly #action;
    readonly checks;
    readonly variants;

    constructor(action: Action, actor?: Actor) {
        this.#action = action;
        if (action.variants.size === 0) {
            this.checks = hasPreview(action)
                ? action.preview({ actor }).filter(check => check.label?.trim()) // filter out unlabelled checks
                : undefined;
        }
        const variants: [string, ActionVariantListItem][] = action.variants.contents
            .map((variant) => new ActionVariantListItem(variant, actor))
            .map((variant) => [variant.slug, variant]);
        this.variants = new Collection<ActionVariantListItem>(variants);
    }

    get cost(): Action["cost"] {
        return this.#action.cost;
    }

    get img(): Action["img"] {
        return this.#action.img;
    }

    get name(): Action["name"] {
        return this.#action.name;
    }

    get section(): Action["section"] {
        return this.#action.section;
    }

    get slug(): Action["slug"] {
        return this.#action.slug;
    }

    get traits(): Action["traits"] {
        return this.#action.traits;
    }
}

class ActionDetails {
    readonly #action;
    readonly #description;
    readonly checks;
    readonly variants;

    private constructor(action: Action, description: string | undefined, actor?: Actor) {
        this.#action = action;
        this.#description = description;
        if (action.variants.size === 0) {
            this.checks = hasPreview(action) ? action.preview({ actor }) : undefined;
        }
        const variants: [string, ActionVariantListItem][] = action.variants.contents
            .map((variant) => new ActionVariantListItem(variant, actor))
            .map((variant) => [variant.slug, variant]);
        this.variants = new Collection<ActionVariantListItem>(variants);
    }

    static async from(action: Action, actor?: Actor): Promise<ActionDetails> {
        const description = await TextEditor.enrichHTML(
            game.i18n.localize(action.description ?? "")
        ) || undefined;
        return new ActionDetails(action, description, actor);
    }

    get cost(): Action["cost"] {
        return this.#action.cost;
    }

    get description(): Action["description"] {
        return this.#description;
    }

    get img(): Action["img"] {
        return this.#action.img;
    }

    get name(): Action["name"] {
        return this.#action.name;
    }

    get sampleTasks(): Action["sampleTasks"] {
        return this.#action.sampleTasks;
    }

    get section(): Action["section"] {
        return this.#action.section;
    }

    get slug(): Action["slug"] {
        return this.#action.slug;
    }

    get traits(): Action["traits"] {
        return this.#action.traits;
    }
}

function uniqBy<T extends object>(a: T[], key: (item: T) => string) {
    const seen = new Set();
    return a.filter(item => {
        let k = key(item);
        return seen.has(k) ? false : seen.add(k);
    });
}

function selected(): Actor[] {
    const actors = uniqBy(
        game.user.getActiveTokens().flatMap((t) => t.actor ? [t.actor] : []),
        (actor: Actor) => actor.id,
    );
    if (actors.length > 0) {
        return actors;
    } else if (game.user.character) {
        return [game.user.character];
    }
    return [];
}

export class ActionBrowser extends Application {
    readonly #controlTokenHandler: typeof this.onControlToken;
    #selected?: Action | null = null;

    constructor(options?: Partial<ApplicationOptions>) {
        super(options);
        this.#controlTokenHandler = this.onControlToken.bind(this);
    }

    static override get defaultOptions(): ApplicationOptions {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "action-browser",
            height: 550,
            width: 700,
            resizable: true,
            tabs: [{ navSelector: ".tabs", contentSelector: ".content", initial: "favorites" }],
            template: "modules/pf2e-action-browser/templates/apps/action-browser.hbs",
            title: "PF2EActionBrowser.Title",
        });
    }

    override get title(): string {
        const actors = selected();
        if (actors.length > 1) {
            return game.i18n.format("PF2EActionBrowser.TitleWithMultipleTokens", { tokens: actors.length});
        } else if (actors.length === 1) {
            return game.i18n.format("PF2EActionBrowser.TitleWithSingleActor", { name: actors[0].name});
        }
        return super.title;
    }

    override async getData(_options?: ApplicationOptions): Promise<ActionBrowserData> {
        const actors = selected();
        const actor = actors.length === 1 ? actors[0] : undefined;
        const actions: ActionBrowserData["actions"] = {
            favorites: [],
            basic: [],
            ["specialty-basic"]: [],
            skill: [],
            other: [],
        };
        [...game.pf2e.actions.values()]
            .map((action) => new ActionListItem(action, actor))
            .forEach((action) => {
                actions[action.section ?? "other"].push(action);
            });
        const details: ActionDetails | undefined = this.#selected
            ? await ActionDetails.from(this.#selected, actor)
            : undefined;
        return {
            actions,
            actor,
            disabled: actors.length === 0,
            details,
        };
    }

    override activateListeners($html: JQuery): void {
        super.activateListeners($html);
        const html = $html[0];

        // Action usage
        html.querySelector<HTMLElement>(".content")?.addEventListener("click", (event) => {
            const enabled = selected().length > 0;
            const target = event.target instanceof Element ? event.target : null;
            const action = target?.closest<HTMLElement>("[data-action-slug]")?.dataset.actionSlug;
            if (action) {
                const handler = target?.closest<HTMLElement>("[data-action-handler]")?.dataset.actionHandler;
                if (handler === "use" && enabled) {
                    const multipleAttackPenalty = target?.closest<HTMLElement>("[data-action-map]")?.dataset.actionMap;
                    const statistic = target?.closest<HTMLElement>("[data-action-statistic]")?.dataset.actionStatistic;
                    const variant = target?.closest<HTMLElement>("[data-action-variant-slug]")?.dataset.actionVariantSlug;
                    game.pf2e.actions
                        .get(action ?? "")
                        ?.use({
                            event,
                            multipleAttackPenalty: multipleAttackPenalty ? Number(multipleAttackPenalty) : undefined,
                            statistic,
                            variant,
                        })
                        .catch((reason: Error | string) => {
                            if (reason) {
                                ui.notifications.warn(reason.toString());
                            }
                        });
                } else if (handler === "chat") {
                    game.pf2e.actions.get(action ?? "")?.toMessage();
                } else if (this.#selected?.slug === action) {
                    // hide details panel
                    this.#selected = null;
                    this.refresh();
                } else {
                    // show in details panel
                    this.#selected = game.pf2e.actions.get(action ?? "");
                    this.refresh();
                }
            }
        });
    }

    override render(force?: boolean, options?: ApplicationRenderOptions): this {
        if (force && !this.rendered) {
            Hooks.on("controlToken", this.#controlTokenHandler);
            selected().forEach((actor) => (actor.apps[this.appId] = this));
        }
        return super.render(force, options);
    }

    override close(options?: { force?: boolean }): Promise<void> {
        Hooks.off("controlToken", this.#controlTokenHandler);
        selected().forEach((actor) => delete actor.apps[this.appId]);
        return super.close(options);
    }

    // debounced render method to prevent double-rendering in case of rapidly fired control token events, like when
    // tabbing through tokens on the canvas
    private refresh = foundry.utils.debounce(this.render, 100);

    private onControlToken(token: Token, control: boolean) {
        if (token.actor) {
            if (control) {
                token.actor.apps[this.appId] = this;
            } else if (token.actor) {
                delete token.actor.apps[this.appId];
            }
        }
        this.refresh(false);
    }
}
