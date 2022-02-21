import {Scene_MenuBase} from "rmmz";
import {InnManager} from "./InnManager";
import {Window_InnCommand} from "./Window_InnCommand";
import {Window_InnRooms} from "./Window_InnRooms";


class Scene_Inn extends Scene_MenuBase {

    /**
     *
     * @param {string} id - the inn id
     */
    prepare(id) {
        this._id = id;
    }
    constructor() {
        super(...arguments);
    }

    initialize() {
        super.initialize();
        InnManager.init(this._id);
        this._inn = InnManager.inn();
        this._roomId = 0;
    }

    start() {
        super.start();
        this.refreshInfo();
    }

    refreshInfo(){
    //    this._helpWindow.setText(this._inn.rooms[this._roomId].description);
    }
    create() {
        super.create();
        this.createInnNameWindow();
        this.createHelpWindow();
        this.createCommandWindow();
        this.createHeaderWindow();
        this.createGoldWindow();
    }

    createCommandWindow(){
        const rect = this.commandWindowRect();
        this._windowRoom = new Window_InnRooms(rect);
        this._windowRoom.setHelpWindow(this._helpWindow);
        this._windowRoom.setHandler('ok',this.onRoomOk.bind(this));
        this.addWindow(this._windowRoom);
    }

    onRoomOk(item){

    }

    createHeaderWindow(){
        const rect = this.headerWindowRect();
        this._headerWindow = new Window_Help(rect);
        this._headerWindow.setText("Rooms");
        this.addWindow(this._headerWindow);
    }

    headerWindowRect(){
        const x = 0;
        const y = this.mainAreaTop() + this.innNameWindowRect().y + 10;
        const width = this.mainCommandWidth();
        const height = this.calcWindowHeight(1,false);
        return new Rectangle(x,y,width,height);
    }


    commandWindowRect(){
        const ww = this.mainCommandWidth();
        const wh = this.mainAreaHeight() - this.goldWindowRect().height - this.headerWindowRect().height - 20;
        const wx = 0;
        const wy = this.mainAreaTop() + this.headerWindowRect().height + 10;
        return new Rectangle(wx,wy,ww,wh);
    }

    createGoldWindow(){
        const rect = this.goldWindowRect();
        this._goldWindow = new Window_Gold(rect);
        this.addWindow(this._goldWindow);
    }
    goldWindowRect() {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(1, true);
        const wx = 0;
        const wy = this.mainAreaBottom() - 80;
        return new Rectangle(wx, wy, ww, wh);
    }
    createInnNameWindow(){
        const rect = this.innNameWindowRect();
        this._innNameWindow = new Window_Help(rect);
        this._innNameWindow.setText(this._inn.displayName);
        this.addWindow(this._innNameWindow);
    }

    innNameWindowRect(){
       const x = 0;
       const y = this.buttonY();
       const width = Graphics.boxWidth - this._cancelButton.width - 30;
       const height = this.calcWindowHeight(1,false);
       return new Rectangle(x,y,width,height);
    }
}
export {Scene_Inn}