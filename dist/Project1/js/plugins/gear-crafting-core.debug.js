/*:
 * @target MZ
 * @author Nio Kasgami
 * @plugindesc The gear engine plugin who handle the core of a crafting system
 * @require Gemstone
 * @param recipes
 * @desc The crafting recipes database
 * @type struct<craftingRecipe>[]
 * @default []
 * @help
 *
 * ============================================================================
 *  -> Introduction
 *
 */


/*~struct~craftingRecipe:
 * @param header
 * @desc the core data of a recipe
 * @type struct<headerStruct>
 * 
 * @param conditions
 * @desc the recipe required ingredients
 * @type struct<craftingCondition>[]
 * @default []
 * 
 * @param results
 * @desc the list of items you would receive on result
 * @type struct<craftingResult>[]
 * @default []
 */
/*~struct~headerStruct:
 * 
 * @param name
 * @type text
 * @text name
 * @desc the recipe name
 * 
 * @param icondIndex
 * @type number
 * @text icon index
 * @desc the recipe icon
 * 
 * @param description
 * @type text
 * @text description
 * @desc the recipe description
 * 
 * @param type
 * @desc the recipe type
 * @type select
 * @default ITEM
 * @option ALL
 * @value 0
 * @option ITEM
 * @value 1
 * @option ARMOR
 * @value 2
 * @option WEAPON
 * @value 3
 */

/*~struct~craftingCondition:
 * 
 * @param id
 * @type number
 * @max 2000
 * @min 1
 * @default 1
 * @text id
 * @desc the element id to fetch (such as item , armor etc)
 * 
 * @param type
 * @desc the item type
 * @type select
 * @default ITEM
 * @option ALL
 * @value 0
 * @option ITEM
 * @value 1
 * @option ARMOR
 * @value 2
 * @option WEAPON
 * @value 3
 * 
 * @param amount
 * @type number
 * @text amount
 * @desc the number of ingredient required
 */

/*~struct~craftingResult:
 * 
 * @param id
 * @type number
 * @max 2000
 * @min 1
 * @default 1
 * @text id
 * @desc the element id to fetch (such as item , armor etc)
 * 
 * @param type
 * @desc the item type
 * @type select
 * @default ITEM
 * @option ALL
 * @value 0
 * @option ITEM
 * @value 1
 * @option ARMOR
 * @value 2
 * @option WEAPON
 * @value 3
 * 
 * @param amount
 * @type number
 * @text amount
 * @desc the number of ingredient required
 */

//=============================================================================
// ** NOTICE **
//-----------------------------------------------------------------------------
// The code below is generated by a compiler, and is not well suited for human
// reading. If you are interested on the source code, please take a look at
// the Github repository for this plugin!
//=============================================================================

this.Gear = this.Gear || {};
this.Gear.CraftingCore = (function (exports) {
    'use strict';

    class Config {
        static init() {
            const rawParams = Gem.ParamManager.find();
            this.PARAMS = Gem.ParamManager.register(this.pluginName, rawParams);
        }
    }
    Config.pluginName = "gear-craftingCore";

    (function (ItemType) {
        ItemType[ItemType["ALL"] = 0] = "ALL";
        ItemType[ItemType["ITEM"] = 1] = "ITEM";
        ItemType[ItemType["ARMOR"] = 2] = "ARMOR";
        ItemType[ItemType["WEAPON"] = 3] = "WEAPON";
    })(exports.ItemType || (exports.ItemType = {}));

    class Game_Crafting {
        constructor() {
            this.initialize(...arguments);
        }
        initialize(...args) {
            this.buildRecipesList();
        }
        buildRecipesList() {
            this._recipes = Config.PARAMS.recipes;
        }
        inventory() {
            return window.$gameParty.items();
        }
        recipe(id) {
            return this._recipes[id];
        }
        name(id) {
            return this._recipes[id].header.name;
        }
        icon(id) {
            return this._recipes[id].header.iconIndex;
        }
        recipeType(id) {
            return this._recipes[id].header.type;
        }
        conditions(id) {
            return this._recipes[id].conditions;
        }
        condition(id, conditionId) {
            return this._recipes[id].conditions[conditionId];
        }
        results(id) {
            return this._recipes[id].results;
        }
        result(id, resultId) {
            return this._recipes[id].results[resultId];
        }
        canCraft(id, ...args) {
            const { conditions } = this._recipes[id];
            return conditions.every((condition) => {
                return this.inventory().some((item) => {
                    return item.id === condition.id && window.$gameParty.numItems(item) >= condition.amount;
                });
            });
        }
        isItem(id) {
            return this._recipes[id].header.type === exports.ItemType.ITEM;
        }
        isWeapon(id) {
            return this._recipes[id].header.type === exports.ItemType.WEAPON;
        }
        isArmor(id) {
            return this._recipes[id].header.type === exports.ItemType.ARMOR;
        }
        onCraft(id, ...args) {
            const { conditions } = this._recipes[id];
            for (let i = 0; i < conditions.length; i++) {
                const item = this.fetchItemData(this.condition(id, i), conditions[i].id);
                window.$gameParty.loseItem(item, conditions[i].amount, false);
            }
            this.onResults(id);
        }
        onResults(id, ...args) {
            const { results } = this._recipes[id];
            for (let i = 0; i < results.length; i++) {
                const item = this.fetchItemData(this.result(id, i), results[i].id);
                window.$gameParty.gainItem(item, results[i].amount);
            }
            this.onEndCrafting();
        }
        onEndCrafting(...args) {
            console.log("crafting done!");
        }
        fetchItemData(item, id) {
            console.log(item);
            switch (item.type) {
                case exports.ItemType.ITEM:
                    return window.$dataItems[id];
                case exports.ItemType.ARMOR:
                    return window.$dataArmors[id];
                case exports.ItemType.WEAPON:
                    return window.$dataArmors[id];
                default:
                    throw new Error("no such item in the database!");
            }
        }
        findIndexByName(name) {
            let index = 0;
            for (let i = 0; i < this._recipes.length; i++) {
                if (this._recipes[i].header.name === name) {
                    index = i;
                    break;
                }
            }
            return index;
        }
    }

    Config.init();

    exports.Config = Config;
    exports.Game_Crafting = Game_Crafting;

    return exports;

}({}));
//# sourceMappingURL=gear-crafting-core.debug.js.map
