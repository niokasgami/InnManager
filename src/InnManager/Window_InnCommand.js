import {InnManager} from "./InnManager";


class Window_InnCommand extends Window_Command {
    constructor() {
        super(...arguments);
    }

    initialize(rect) {
        super.initialize(rect);
    }

    makeCommandList() {
        const rooms = InnManager.rooms();
        for(const room of rooms){
            const enabled = this.canAffordRoom(room.price);
            this.addCommand(room.name,room.name,enabled);
        }
    }
    updateHelp() {
        super.updateHelp();
        this._helpWindow.setText(InnManager.room(this.index()).description);
    }


    /**
     * return if the party has enough gold
     * @param {number} room
     * @returns {boolean}
     */
    canAffordRoom(room){
        return $gameParty.gold() >= room;
    }


}
export {Window_InnCommand}