import {InnManager} from "./InnManager";


class Window_InnRooms extends Window_ItemList {

    constructor() {
        super(...arguments);
    }

    initialize(rect) {
        super.initialize(rect);
    }

    maxCols() {
        return 1;
    }

    makeItemList() {
        const rooms = InnManager.rooms();

        for(let i = 0; i < rooms.length; i++){
            this._data.push(rooms[i]);
        }
        console.log(this._data);
    }

    drawItem(index) {
        const item = this.itemAt(index);
        console.log(item);
        if(item){
            const rect = this.itemLineRect(index);
            this.changePaintOpacity(this.canBuy(item));
            this.drawRoomName(item, rect.x,rect.y,rect.width);
            this.changePaintOpacity(1);
        }
    }

    canBuy(item){
        return $gameParty.gold() >= item.price;
    }

    /**
     *
     * @param {Room} item
     * @param x
     * @param y
     * @param width
     */
    drawRoomName(item, x, y, width) {
        if(item) {
            this.resetTextColor();
            this.drawText(item.name,x,y,width);

        }
    }

    updateHelp() {
        this.updateHelpRoom(this.item());
    }

    /**
     *
     * @param{Room} item
     */
    setHelpWindowRoom(item){
        if(this._helpWindow){
            This._helpWindow.setText(item.description);
        }
    }

    refresh() {
        super.refresh();
        this.makeItemList();
    }
}
export {Window_InnRooms}