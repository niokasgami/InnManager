import {Sprite} from "rmmz";


class GearSprite extends Sprite{

    /**
     *
     * @param bitmap
     * @param {BitmapData} data
     */
    constructor(bitmap, data) {
        super(bitmap);
        this._data = data;
        this.x = data.coords.x;
        this.y = data.coords.y;
    }

    // TODO in future to handle animated
}

export {GearSprite}