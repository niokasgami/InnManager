import * as PIXI from "pixi.js";
import {BITMAP_TYPE} from "../pluginA/Config";
import {Helper} from "./Helper";
import {GearSprite} from "./GearSprite";
import {GearTilingSprite} from "./GearTilingSprite";

/**
 * the container class that handle sprite layering
 */
class SpriteLayer extends PIXI.Container {

    /**
     * will create an container who can contain tiling, single and animated sprite
     * @param {BitmapData[] | TilingImage[]} bitmaps
     * @param {string} directory
     */
    constructor(bitmaps, directory) {
        super();
        this._data = bitmaps;
        this._directory = directory;
        this.createBitmaps();
    }

    /**
     * create the sprites based on array and their type
     */
    createBitmaps() {
        let image = null;
        for (const sprite of this._data) {
            let bitmap = null;
            if (sprite.type === BITMAP_TYPE.SINGLE) {
                bitmap = Helper.loadCustomDir(this._directory, sprite.bitmap);
                image = new GearSprite(bitmap,sprite);

            } else if (sprite.type === BITMAP_TYPE.ANIMATED) {
                // TODO : actually implement animated?
                // maybe make it that it take an array of pictures?
            } else if (sprite.type === BITMAP_TYPE.TILLING) {
                bitmap = Helper.loadCustomDir(this._directory, sprite.bitmap);
                image = new GearTilingSprite(bitmap,sprite);
            } else {
                // treat them as single sprite to allow more flexibility
                bitmap = Helper.loadCustomDir(this._directory, sprite.bitmap);
                image = new GearSprite(bitmap,sprite);
            }
            this.addChild(image);
        }
    }


    update() {
        this.updateChildren();
    }

    updateChildren() {
        for (const child of this.children) {
            if (child.update) {
                // To still allow the children to update
                child.update();
            }
        }
    }
}

export {SpriteLayer}