/*:
 * @target MZ
 * @plugindesc display detailed statuse of enemies
 * @author Yoji Ojima | Nio Kasgami (port)
 *
 * @param unknownData
 * @text Unknown Data
 * @desc the index for an unknown enemy.
 * @type text
 * @default ?????
 *
 * @param button
 * @text Use UI touch button
 * @desc enable or disable the UI touch button
 * @type boolean
 * @default true
 * @on enabled3
 * @off disabled
 *
 * @command open
 * @desc open the EnemyBook
 *
 * @command add
 * @desc add an enemy to the book
 * 
 * @arg id
 * @desc the enemy id
 * @type enemy
 * @default 1
 *
 * @command remove
 * @desc remove an enemy from the book
 *
 * @arg id
 * @desc the enemy id
 * @type enemy
 * @default 1
 *
 * @command complete
 * @desc complete the enemy book
 *
 * @command clear
 * @desc clear the enemy book
 *
 * @help
 * this plugin is a port and improvement of
 * the original MV plugin created by yoji ojima
 *
 * ==========================================================================
 *  + changelog
 * --------------------------------------------------------------------------
 *   + modernised the plugin to ES6 standard
 *   + plugin commands are now updated to MZ standard
 *   + plugin parameter is now updated to MZ standard
 *   + the plugin classes are now globally accessible which are :
 *      -> Scene_EnemyBook
 *      -> Window_EnemyBookIndex
 *      -> Window_EnemyBookStatus
 *   + added an extra boolean function
 *   + made the description notetag optional
 *   + it is now possible to enable and disable the touch button
 *   + cat are still awesome
 *
 * ==========================================================================
 *  + notetag (enemy)
 * --------------------------------------------------------------------------
 *  <desc1:foobar>      # first line for the enemy description in the enemy book
 *  <desc2:foobar>      # second line for the enemy description in the enemy book
 *  <book:no>           # the enemy wont appear in the enemy book
 *
 * ==========================================================================
 *  + script call
 * --------------------------------------------------------------------------
 *   $gameSystem.addToEnemyBook(enemyId);       
 *   $gameSystem.removeFromEnemyBook(enemyId);
 *   $gameSystem.completeEnemyBook();
 *   $gameSystem.clearEnemyBook();
 *   $gameSystem.isInEnemyBook(enemyId);
 *   SceneManager.push(Scene_EnemyBook);
 *
 * @url
 * 
 * 
 */
(() => {


//==========================================================================
// * Helper
//==========================================================================

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


    }
//==========================================================================
// * plugin params & commands
//==========================================================================
    const pluginName = "EnemyBook";

    /**
     * the raw params
     * @type {string}
     */
    const rawParams = Helper.find();

    /**
     * @typedef {Object} pluginParameters
     * @property {string} unknownData
     * @property {boolean} button
     */

    /**
     * the plugin params
     * @type {pluginParameters}
     */
    const params = Helper.parse(rawParams);


    PluginManager.registerCommand(pluginName, "open", () => {
        SceneManager.push(Scene_EnemyBook);
    });

    PluginManager.registerCommand(pluginName, "add", (args) => {
        const enemyId = Number(args.id);
        $gameSystem.addToEnemyBook(enemyId);
    });

    PluginManager.registerCommand(pluginName, "remove", (args) => {
        const enemyId = Number(args.id);
        $gameSystem.removeFromEnemyBook(enemyId);
    });

    PluginManager.registerCommand(pluginName, "complete", () => {
        $gameSystem.completeEnemyBook();
    });

    PluginManager.registerCommand(pluginName, "clear", () => {
        $gameSystem.clearEnemyBook();
    });


//==========================================================================
// * Game_System
//==========================================================================

    const alias01 = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function(){
        alias01.call(this);
        /**2
         * the enemy book array containing the enemy data
         * @type {boolean[]}
         * @private
         */
        this._enemyBookFlags = [];

    };
    /**
     * add entry to the enemy book
     * @param {number } enemyId - the enemy index
     */
    Game_System.prototype.addToEnemyBook = function(enemyId) {
        if(!this._enemyBookFlags){
            this.clearEnemyBook();
        }
        this._enemyBookFlags[enemyId] = true;
    };

    /**
     * remove entry to the enemy book
     * @param {number} enemyId
     */
    Game_System.prototype.removeFromEnemyBook = function(enemyId){
        if(this._enemyBookFlags){
            this._enemyBookFlags[enemyId] = false;
        }
    };

    /**
     * complete the whole enemy book
     */
    Game_System.prototype.completeEnemyBook = function(){
      this.clearEnemyBook();
      for(let i = 1; i < $dataEnemies.length; i++){
          this._enemyBookFlags[i] = true;
      }
    };

    /**
     * clear the whole enemy book
     */
    Game_System.prototype.clearEnemyBook = function(){
        this._enemyBookFlags = [];
    };

    /**
     * check if an enemy is in the enemy book
     * it's an internal function used for the windows
     * use $gameSystem.isInEnemyBook(id) for script call instead
     * @param {rm.types.Enemy} enemy
     * @private
     * return {boolean}
     */
    Game_System.prototype._isInEnemyBook = function(enemy) {
        if(this._enemyBookFlags && enemy){
            return !!this._enemyBookFlags[enemy.id]
        } else {
            return false;
        }
    };

    /**
     * check if an enemy is in the book
     * @param {number} enemyId
     * return {boolean}
     */
    Game_System.prototype.isInEnemyBook = function(enemyId){
        return this._enemyBookFlags[enemyId] === true;
    };

//==========================================================================
// * Game_Troop
//==========================================================================
    const alias02 = Game_Troop.prototype.setup;
    /** * @param {number}troopId */
    Game_Troop.prototype.setup = function (troopId){
        alias02.call(this,troopId);
        for (const enemy of this.troop.members()){
            if(enemy.isAppeared()){
                $gameSystem.addToEnemyBook(enemy.enemyId());
            }
        }
    };

//==========================================================================
// * Game_Enemy
//==========================================================================
    const alias03 = Game_Enemy.prototype.appear;
    Game_Enemy.prototype.appear = function () {
        alias03.call(this);
        $gameSystem.addToEnemyBook(this._enemyId);
    };

    const alias04 = Game_Enemy.prototype.transform;
    Game_Enemy.prototype.transform = function (enemyId){
        alias04.call(this,enemyId);
        $gameSystem.addToEnemyBook(enemyId);
    };

//==========================================================================
// * Scene_EnemyBook
//==========================================================================
    /**
     * the scene class who display the enemy book
     */
    class Scene_EnemyBook extends Scene_MenuBase {
        constructor() {
            super();
        }

        initialize() {
            super.initialize();
        }

        create() {
            super.create();
            this.createEnemyBookIndexWindow();
            this.createEnemyBookStatusWindow();
            this.adjustButtonCoords();
        }
        // TODO : adjust the window to work with the button? not to sure how to approach that
        needsCancelButton() {
            return params.button;
        }

        adjustButtonCoords(){
            if(params.button) {
                this._cancelButton.x -= 5;
                this._cancelButton.y = 250;
            }
        }

        createEnemyBookIndexWindow(){
            const rect = this.enemyBookIndexRect();
            this._indexWindow = new Window_EnemyBookIndex(rect);
            this._indexWindow.setHandler('cancel', this.popScene.bind(this));
            this.addWindow(this._indexWindow);
        }

        createEnemyBookStatusWindow(){
            const rect = this.enemyBookStatusRect();
            this._statusWindow = new Window_EnemyBookStatus(rect);
            this.addWindow(this._statusWindow);
            this._indexWindow.setStatusWindow(this._statusWindow);
        }

        enemyBookStatusRect(){
            const x = 0;
            const wy = this._indexWindow.height;
            const ww = Graphics.boxWidth;
            const wh = Graphics.boxHeight - wy;
            return new Rectangle(x,wy,ww,wh);
        }
        /**
         * return the enemy book index window rect
         * @returns {Rectangle}
         */
        enemyBookIndexRect(){
            const x = 0;
            const y = 0;
            const width = Graphics.boxWidth;
            const height = 0;
            return new Rectangle(x,y,width,height);
        }
    }
    window.Scene_EnemyBook = Scene_EnemyBook;

//==========================================================================
// * Window_EnemyBookIndex
//==========================================================================

    /**
     * the enemy book window class that handle index
     */
    class Window_EnemyBookIndex extends Window_Selectable {

        /**
         * the window who handle enemy book index
         * @param {Rectangle} rect
         */
        constructor(rect) {
            super(rect);
            // doing this fix as it was not possible to use this before super
            this.height = this.fittingHeight(5);
            this.refresh();
            this.setTopRow(Window_EnemyBookIndex.lastTopRow);
            this.select(Window_EnemyBookIndex.lastIndex);
            this.activate();
        }
        initialize(rect) {
            super.initialize(rect);
        }

        maxCols() {
            return 3;
        }

        maxItems() {
            return this._list ? this._list.length : 0;
        }

        setStatusWindow(statusWindow){
            this._statusWindow = statusWindow;
            this.updateStatus();
        }

        update() {
            super.update();
            this.updateStatus();
        }

        updateStatus(){
            if(this._statusWindow){
                const enemy = this._list[this.index()];
                this._statusWindow.setEnemy(enemy);
            }
        }

        refresh() {
            /**
             *
             * @type {rm.types.Enemy[]}
             * @private
             */
            this._list = [];
            for (let i = 1; i < $dataEnemies.length; i++){
                const enemy = $dataEnemies[i];
                if(enemy.name && enemy.meta.book !== 'no'){
                    this._list.push(enemy);
                }
            }
            this.createContents();
            this.drawAllItems();
        }

        drawItem(index) {
            const enemy = this._list[index];
            const rect = this.itemRect(index);
            let name;
            if($gameSystem._isInEnemyBook(enemy)){
                name = enemy.name;
            } else {
                name = params.unknownData;
            }
            this.drawText(name, rect.x,rect.y, rect.width);
        }

        processCancel() {
            super.processCancel();
            Window_EnemyBookIndex.lastTopRow = this.topRow();
            Window_EnemyBookIndex.lastIndex = this.index();
        }
    }
    Window_EnemyBookIndex.lastTopRow = 0;
    Window_EnemyBookIndex.lastIndex = 0;
    window.Window_EnemyBookIndex = Window_EnemyBookIndex;

//==========================================================================
// * Window_EnemyBookStatus
//==========================================================================

    class Window_EnemyBookStatus extends Window_Base {

        /**
         *
         * @param {Rectangle} rect
         */
        constructor(rect) {
            super(rect);
        }

        initialize(rect) {
            super.initialize(rect);
            /**
             *
             * @type {Game_Enemy}
             * @private
             */
            this._enemy = null;
            this._enemySprite = new Sprite();
            this._enemySprite.anchor.x = 0.5;
            this._enemySprite.anchor.y = 0.5;
            this._enemySprite.x = rect.width / 2 - 20;
            this._enemySprite.y = rect.height / 2;
            this.addChildToBack(this._enemySprite);
            this.refresh();
        }

        /**
         *
         * @param {rm.types.Enemy} enemy
         */
        setEnemy(enemy){
            if(this._enemy !== enemy){
                this._enemy = enemy;
                this.refresh();
            }
        }

        update(){
            super.update();
            if(this._enemySprite.bitmap){
                const bitmapHeight = this._enemySprite.bitmap.height;
                const contentsHeight = this.contents.height;
                let scale = 1;
                if(bitmapHeight > contentsHeight){
                    scale = contentsHeight / bitmapHeight;
                }
                this._enemySprite.scale.x = scale;
                this._enemySprite.scale.y = scale;
            }
        }

        refresh(){
            const enemy = this._enemy;
            let x = 0;
            let y = 0;
            const lineHeight = this.lineHeight();

            this.contents.clear();

            if(!enemy || !$gameSystem._isInEnemyBook(enemy)){
                this._enemySprite.bitmap = null;
                return;
            }
            const name = enemy.battlerName;
            const hue = enemy.battlerHue;
            let bitmap;
            if($gameSystem.isSideView()){
                bitmap = ImageManager.loadSvEnemy(name,hue);
            } else {
                bitmap = ImageManager.loadEnemy(name,hue);
            }
            this._enemySprite.bitmap = bitmap;
            
            this.resetTextColor();
            this.drawText(enemy.name,x,y);
            
            x = this.itemPadding();
            y = lineHeight + this.itemPadding();

            for(let i = 0; i < 8; i++){
                this.changeTextColor(this.systemColor());
                this.drawText(TextManager.param(i), x,y,160);
                this.resetTextColor();
                this.drawText(enemy.params[i], x + 160, y, 60, 'right');
                y += lineHeight;
            }

            let rewardsWidth = 280;
            x = this.contents.width - rewardsWidth;
            y = lineHeight + this.itemPadding();

            this.resetTextColor();
            this.drawText(enemy.exp,x,y);
            x += this.textWidth(enemy.exp) + 6;
            this.changeTextColor(this.systemColor());
            this.drawText(TextManager.expA, x, y);
            x += this.textWidth(TextManager.expA + '  ');

            this.resetTextColor();
            this.drawText(enemy.gold, x, y);
            x += this.textWidth(enemy.gold) + 6;
            this.changeTextColor(this.systemColor());
            this.drawText(TextManager.currencyUnit, x, y);

            x = this.contents.width - rewardsWidth;
            y += lineHeight;

            for (let j = 0; j < enemy.dropItems.length; j++) {
                const di = enemy.dropItems[j];
                if (di.kind > 0) {
                    const item = Game_Enemy.prototype.itemObject(di.kind, di.dataId);
                    this.drawItemName(item, x, y, rewardsWidth);
                    y += lineHeight;
                }
            }

            const descWidth = 480;
            x = this.contents.width - descWidth;
            y = this.itemPadding() + lineHeight * 7;
            let descText1, descText2;

            if(enemy.meta.hasOwnProperty('desc1')){
                descText1 = enemy.meta.desc1;
            } else {
                descText1 = "";
            }
            if(enemy.meta.hasOwnProperty('desc2')){
                descText2 = enemy.meta.desc2;
            } else {
                descText2 = "";
            }
            this.drawTextEx(descText1, x, y + lineHeight * 0, descWidth);
            this.drawTextEx(descText2, x, y + lineHeight * 1, descWidth);
        }
    }
    window.Window_EnemyBookStatus = Window_EnemyBookStatus;
})();