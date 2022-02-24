import {Scene_MenuBase} from "rmmz";
import {InnManager} from "./InnManager";
import {Window_InnRooms} from "./Window_InnRooms";
import {Window_InnConfirmation} from "./Window_InnConfirmation";
import {Window_InnConfirmationTitle} from "./Window_InnConfirmationTitle";


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
        this._slept = false;
        this._waitForInput = false;
    }

    start() {
        super.start();
    }

    create() {
        super.create();
        this.createInnNameWindow();
        this.createHelpWindow();
        this.createCommandWindow();
        this.createHeaderWindow();
        this.createGoldWindow();
        this.createConfirmWindow();
        this.createConfirmTitleWindow();
        this.createResultsWindow();
    }

    update() {
        super.update();
        if (!this.isBusy() && this._slept) {
            this.startFadeIn(this.fadeSpeed());
        }
    }


    isBusy() {
        return this.isFading() || this._waitForInput;
    }

    createCommandWindow() {
        const rect = this.commandWindowRect();
        this._windowRoom = new Window_InnRooms(rect);
        this._windowRoom.setHelpWindow(this._helpWindow);
        this._windowRoom.setHandler('ok', this.onRoomOk.bind(this));
        this._windowRoom.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._windowRoom);
    }


    createConfirmWindow() {
        const rect = this.confirmWindowRect();
        this._confirmWindow = new Window_InnConfirmation(rect)
        this._confirmWindow.setHandler('yes', this.onConfirm.bind(this));
        this._confirmWindow.setHandler('no', this.onUnconfirm.bind(this));
        this._confirmWindow.hide();
        this.addWindow(this._confirmWindow);
    }

    onConfirm() {
        SoundManager.playShop();
        // this.startFadeOut(this.slowFadeSpeed());
        const item = this._windowRoom.item();
        $gameParty.loseGold(item.price);
        InnManager.executeAction(item.func, item.args);
        this._confirmWindow.hide();
        this._confirmTitleWindow.hide();
        this._windowRoom.show();
        this._windowRoom.activate();
    }

    onUnconfirm() {
        this._confirmWindow.hide();
        this._confirmTitleWindow.hide();
        this._windowRoom.show();
        this._windowRoom.activate();
    }

    createResultsWindow() {
        const rect = this.resultWindowRect();
        this._resultWindow = new Window_Message(rect);
        this.addWindow(this._resultWindow);
    }

    resultWindowRect() {
        const width = Graphics.boxWidth - 100;
        const height = this.calcWindowHeight(5, false);
        const x = Graphics.width / 2 - (width / 2);
        const y = Graphics.height / 2 - (height / 2);
        return new Rectangle(x,y,width,height);
    }

    createConfirmTitleWindow() {
        const rect = this.confirmTitleWindowRect();
        this._confirmTitleWindow = new Window_InnConfirmationTitle(rect);
        this._confirmTitleWindow.hide();
        this.addWindow(this._confirmTitleWindow);
    }

    confirmTitleWindowRect() {
        const width = this.calcWindowHeight(8, false) * 2;
        const height = this.calcWindowHeight(1, false);
        const x = Graphics.width / 2 - (width / 2);
        const y = Graphics.height / 2 - (height / 2) - height - 25;
        return new Rectangle(x, y, width, height);
    }

    confirmWindowRect() {
        const width = this.calcWindowHeight(2, true) * 2;
        const height = this.calcWindowHeight(1, true);
        const x = Graphics.width / 2 - (width / 2);
        const y = Graphics.height / 2 - (height / 2);
        return new Rectangle(x, y, width, height);
    }

    /**
     *
     */
    onRoomOk() {
        this._windowRoom.deactivate();
        this._confirmWindow.show();
        this._confirmWindow.activate();

        const room = this._windowRoom.item();
        const text = "Do you want to sleep in " + room.name;
        this._confirmTitleWindow.setText(text);
        this._confirmTitleWindow.show();
    }

    createHeaderWindow() {
        const rect = this.headerWindowRect();
        this._headerWindow = new Window_Help(rect);
        this._headerWindow.setText("Rooms");
        this.addWindow(this._headerWindow);
    }

    headerWindowRect() {
        const x = 0;
        const y = this.mainAreaTop() + this.innNameWindowRect().y + 10;
        const width = this.mainCommandWidth();
        const height = this.calcWindowHeight(1, false);
        return new Rectangle(x, y, width, height);
    }


    commandWindowRect() {
        const ww = this.mainCommandWidth();
        const wh = this.mainAreaHeight() - this.goldWindowRect().height - this.headerWindowRect().height - 20;
        const wx = 0;
        const wy = this.mainAreaTop() + this.headerWindowRect().height + 10;
        return new Rectangle(wx, wy, ww, wh);
    }

    createGoldWindow() {
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

    createInnNameWindow() {
        const rect = this.innNameWindowRect();
        this._innNameWindow = new Window_Help(rect);
        this._innNameWindow.setText(this._inn.displayName);
        this.addWindow(this._innNameWindow);
    }

    innNameWindowRect() {
        const x = 0;
        const y = this.buttonY();
        const width = Graphics.boxWidth - this._cancelButton.width - 30;
        const height = this.calcWindowHeight(1, false);
        return new Rectangle(x, y, width, height);
    }
}

export {Scene_Inn}