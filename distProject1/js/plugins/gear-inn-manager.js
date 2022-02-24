/*:
 * @target MZ
 * @plugindesc the gear plugin that rework the whole Menu System
 * @author Nio Kasgami
 * @base gear-inn-actions
 * @help
 *
 * ==========================================================================
 *  + Changelog
 * --------------------------------------------------------------------------
 *  + initial release
 *  + many Inc0der-shrooms died for this plugin
 *
 * @param inns
 * @type struct<Inn>[]
 */


/*~struct~Inn:
 *
 * @param displayName
 * @type text
 * @param id
 * @type text
 *
 * @param rooms
 * @type struct<Room>[]
 */



/*~struct~Room:
 *
 * @param name
 * @type text
 *
 * @param description
 * @type multiline_string
 *
 * @param price
 * @type number
 *
 * @param func
 * @text action
 * @type text
 * @param args
 * @type text[]
 *  
 */

/*~struct~RoomEffect:
 *
 * @param text
 * @type multiline_string
 *
 * @param icon
 * @desc used if a state, item , etc icon is needed
 * @type number
 *
 * @param type
 * @type select
 * @option TEXT ONLY
 * @value 0
 * @option ICON
 */

/// COMMON STRUCT =======================================

/*~struct~TextContainer:
 * @param x
 * @type number
 * @param y
 * @type number
 * @param maxWidth
 * @type number
 * @param lineHeight
 * @type number
 *
 * @param align
 * @type select
 * @option LEFT
 * @value left
 * @option CENTER
 * @value center
 * @option RIGHT
 * @value right
 *
 */
/*~struct~TilingStruct:
 * @param bitmap
 * @type file
 * @dir img/menu/status
 * @param coords
 * @type struct<Points>
 * 
 * @param scroll
 * @type struct<Points>
 * 
 * @param type
 * @desc describe if the picture is an single image or a tiling image
 * @type select
 * @option SINGLE
 * @value 0
 * @option ANIMATED
 * @value 1
 * @option TILING
 * @value 2
 */

/*~struct~Actor:
 * @param x
 * @type number
 * @param y
 * @type number
 * @param pivot
 * @type struct<Points>
*/

/*~struct~Points:
 * @param x
 * @desc the x coordinates
 * @type number
 * @param y
 * @desc the y coordinates
 * @type number
 */
///========================================================



//=============================================================================
// ** NOTICE **
//-----------------------------------------------------------------------------
// The code below is generated by a compiler, and is not well suited for human
// reading. If you are interested on the source code, please take a look at
// the Github repository for this plugin!
//=============================================================================

this.Gear = this.Gear || {};
this.Gear.Inn = (function (exports) {
    'use strict';

    /**
     * the helper class who handle plugin parameters
     * @internal
     */
    class Helper {

        /**
         * return the current active script parameters
         * @returns {string}
         */
        static find() {
            const currentScript = document.currentScript.src.match(/.+\/(.+)\.js/)[1];
            return PluginManager.parameters(currentScript);
        }

        /**
         * parse raw param into an object
         *
         * @static
         * @param {string} parameters
         * @return {object}
         */
        static parse(parameters) {
            function parseParameters(object) {
                try {
                    return JSON.parse(object, (key, value) => {
                        try {
                            return parseParameters(value)
                        } catch (e) {
                            return value
                        }
                    })
                } catch (e) {
                    return object
                }
            }

            return parseParameters(JSON.stringify(parameters))
        }

        /**
         * load a bitmap from a defined directory
         * @param directory
         * @param filename
         * @returns {Bitmap}
         */
        static loadCustomDir(directory,filename){
            return window.ImageManager.loadBitmap(`img/${directory}/`, filename);
        }

    }

    const rawParams = Helper.find();

    /**
     *
     * @type {InnParameters}
     */
    const PARAMS = Helper.parse(rawParams);
    console.log(PARAMS);

    class InnManager {

        static _data = PARAMS;

        static _inns = PARAMS.inns;
        static _func = {};
        static _defaultInn = {};
        static _id = "";

        constructor() {
            throw new Error("this is a static class");
        }

        /**
         * init the InnManager with an ID
         * @param {string} id
         */
        static init(id){
            this._id = id;
        }

        /**
         * return the whole array of inns
         * @returns {Inn[]}
         */
        static inns(){
            return this._inns;
        }

        /**
         * return the active inn
         * @returns {Inn}
         */
        static inn(){
            let index = this.findInn(this._id);
            return this._inns[index];
        }

        /**
         * return the inn display name
         * @returns {string}
         */
        static innName(){
            return this.inn().displayName;
        }

        /**
         * return the inn id
         * @returns {string}
         */
        static innId(){
            return this.inn().id;
        }

        /**
         * return the whole array of rooms for the active inn
         * @returns {Room[]}
         */
        static rooms(){
            return this.inn().rooms;
        }

        /**
         * return a specific room for the active inn
         * @param {number} id - the room index
         * @returns {Room}
         */
        static room(id){
            return this.rooms()[id];
        }

        /**
         * register a custom action to use for a room
         * @param {string} actionName - the action name
         * @param {()=> void} callback - the action function
         */
        static registerAction(actionName,callback){
            this._func[actionName] = callback;
        }

        /**
         * call a specific action or a room
         * @param {string} actionName - the action name
         * @param {any[]} args - the action arguments
         */
        static executeAction(actionName,args){
            if(this._func.hasOwnProperty(actionName)){
                this._func[actionName].call(this,args);
            }
        }

        /**
         * find a inn via it's id
         * @param {string} name - the inn name
         * @returns {number}
         */
        static findInn(name){
            let index = 0;
            for(let i = 0; i < this._inns.length; i++){
                const {id} = this._inns[i];
                if(id === name){
                    index = 0;
                    break;
                }
            }
            return index;
        }


    }

    class Window_InnRooms extends Window_ItemList {

        constructor() {
            super(...arguments);
        }

        initialize(rect) {
            super.initialize(rect);
            this.refresh();
            this.activate();
            this.forceSelect(0);
        }

        maxCols() {
            return 1;
        }

        makeItemList() {
            const rooms = InnManager.rooms();

            for(let i = 0; i < rooms.length; i++){
                this._data.push(rooms[i]);
            }
        }


        drawItem(index) {
            const item = this.itemAt(index);
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

        isEnabled(item){
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
            this.setHelpWindowRoom(this.item());
        }

        /**
         *
         * @param{Room} item
         */
        setHelpWindowRoom(item){

            if(this._helpWindow && item !== null){

                this._helpWindow.setText(item.description);
            }
        }

        refresh() {
            super.refresh();
        }

    }

    class Window_InnConfirmation extends Window_HorzCommand {

        constructor() {
            super(...arguments);
        }

        initialize(rect) {
            super.initialize(rect);
        }

        maxCols() {
            return 2;
        }

        makeCommandList() {
            this.addCommand("Yes","yes",true);
            this.addCommand("No","no", true);
        }
    }

    class Window_InnConfirmationTitle extends Window_Base {

        constructor() {
            super(...arguments);
        }

        initialize(rect) {
            super.initialize(rect);
            this.text = "";
        }

        setText(text){
            this.text = text;
            this.refresh();
        }

        refresh(){
            this.contents.clear();
            this.drawText(this.text,0,0, this.width, 'center');
        }
    }

    class Scene_Inn extends window.Scene_MenuBase {

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
            this._confirmWindow = new Window_InnConfirmation(rect);
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

    exports.InnManager = InnManager;
    exports.Scene_Inn = Scene_Inn;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
//# sourceMappingURL=gear-inn-manager.js.map
