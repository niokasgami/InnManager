import {TilingSprite} from "rmmz";

class GearTilingSprite extends TilingSprite {

    /**
     *
     * @param {Bitmap} bitmap
     * @param {TilingImage} data
     */
    constructor(bitmap, data) {
        super(bitmap);
        this._data = data;
        this.x = data.coords.x;
        this.y = data.coords.y;
        this._scroll = new Point(data.scroll.x, data.scroll.y);
    }

    setScroll(x,y){
        this._scroll.x = x;
        this._scroll.y = y;
    }

    update(){
        super.update();
        if(this._scroll.x !== 0){
            this.x += this._scroll.x;
        }
        if(this._scroll.y !== 0){
            this.y += this._scroll.y;
        }
    }
}

export {GearTilingSprite}