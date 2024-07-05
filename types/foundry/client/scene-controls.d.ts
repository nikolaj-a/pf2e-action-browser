interface ToolclipConfigurationItem {
    paragraph: string;
    heading: string;
    content: string;
    reference: string;
}

interface ToolclipConfiguration {
    src: string;
    heading: string;
    items: ToolclipConfigurationItem[];
}

interface SceneControlTool {
    name: string;
    title: string;
    icon: string;
    visible?: boolean;
    toggle?: boolean;
    active?: boolean;
    button?: boolean;
    onClick: Function;
    toolclip?: ToolclipConfiguration;
}
interface SceneControl {
    name: string;
    title: string;
    layer: string;
    icon: string;
    visible: boolean;
    tools: SceneControlTool[];
    activeTool: string;
}
