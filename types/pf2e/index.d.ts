// @ts-ignore
const PROFICIENCY_RANKS = ["untrained", "trained", "expert", "master", "legendary"] as const;
declare type ProficiencyRank = (typeof PROFICIENCY_RANKS)[number];

// @ts-ignore
const ACTION_COSTS = ["free", "reaction", 0, 1, 2, 3] as const;
declare type ActionCost = (typeof ACTION_COSTS)[number];

// @ts-ignore
const ACTION_SECTIONS = ["basic", "skill", "specialty-basic"] as const;
declare type ActionSection = (typeof ACTION_SECTIONS)[number];

declare interface ActionMessageOptions {
    blind: boolean;
    variant: string;
    whisper: string[];
}

declare interface ActionVariantUseOptions extends Record<string, unknown> {
    actors: Actor | Actor[];
    event: Event;
    traits: string[];
    target: Actor | Token;
}

declare interface ActionVariant {
    cost?: ActionCost;
    description?: string;
    glyph?: string;
    name?: string;
    slug: string;
    traits: string[];
    toMessage(options?: Partial<ActionMessageOptions>): Promise<ChatMessage | undefined>;
    use(options?: Partial<ActionVariantUseOptions>): Promise<unknown>;
}

declare interface ActionUseOptions extends ActionVariantUseOptions {
    variant: string;
}

declare interface Action {
    cost?: ActionCost;
    description?: string;
    glyph?: string;
    img?: string;
    name: string;
    sampleTasks?: Partial<Record<ProficiencyRank, string>>;
    section?: ActionSection;
    slug: string;
    traits: string[];
    variants: Collection<ActionVariant>;
    toMessage(options?: Partial<ActionMessageOptions>): Promise<ChatMessage | undefined>;
    /** Uses the default variant for this action, which will usually be the first one in the collection. */
    use(options?: Partial<ActionUseOptions>): Promise<unknown>;
}

declare interface ActionCheckPreviewOptions {
    actor: Actor
}

declare interface ActionCheckPreview {
    label: string;
    modifier?: number;
    slug: string;
}

declare interface GamePF2e extends Game {
    pf2e: {
        actions: Collection<Action>;
    };
}
