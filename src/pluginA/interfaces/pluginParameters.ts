

interface PluginParameters {
    status: {
        background: TilingImage[];
        actor: ActorData;
        profile: {
            name: TextContainer;
            description: TextContainer;
        }
    }
}

export interface TextContainer {
    x: number;
    y: number;
    maxWidth: number;
    lineHeight: number;
    align: string;
}
export interface TilingImage extends BitmapData {
    scroll: {
        x: number;
        y: number;
    }
}
export interface BitmapData {
    bitmap: string;
    coords: {
        x: number,
        y: number
    };
    type: number;
}

export enum BITMAP_ENUM {
    SINGLE,
    ANIMATED,
    TILLING
}

export interface ActorData {
    x: number;
    y: number;
    pivot: {
        x: number;
        y: number;
    }
}
export {PluginParameters}