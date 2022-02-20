//=============================================================================
// Gemstone Engine Plugins - Core Engine
// Gemstone.js
//=============================================================================



/*:
 * @target MZ
 * @plugindesc the core plugins who power all the gems plugins
 * @author Nio Kasgami
 *
 * @param openDevTools
 * @desc Open the dev tools on the scene startup
 * @type boolean
 * @default false
 * @on yes
 * @off no
 *
 * @help
 *
 * licenses :
 * the gemstone is under the
 *
 * @url
 */


/**
 *
 * @namespace Gem
 */
var Gem = Gem || {};

Gem.version = 1.0;

Gem.Alias = {};
/*

Window_Message.prototype.processCharacter = function (textState) {
    const c = textState.text[textState.index++];
    if (c.charCodeAt(0) < 0x20) {
        this.flushTextState(textState);
        this.processControlCharacter(textState, c);
    } else {
        textState.buffer += c;
    }
    this.startWait(10);
};*/


//=============================================================================
// Gem.ParamManager
//=============================================================================

/**
 * the class who handle parameters and parse it
 * @class ParamManager
 * @memberof Gem
 */
Gem.ParamManager = class {

    constructor() {
        throw new Error("This is a static class");
    }

    /**
     * init the Gemstone parameters
     * @private
     * @static
     */
    static init() {
        const rawParams = this.find();
        const params = this.register("Gemstone", rawParams);
        if (params.openDevTools) {
            //  SceneManager.showDevTools();
        }
        SceneManager.showDevTools();
    }

    /**
     * Register a plugin parameters under it's namespace and parse it
     * it will return it's value
     * @param {string} namespace the plugin namespace
     * @param {string} rawParams the raw params to parse
     * @returns {*} - the parsed parameters
     */
    static register(namespace, rawParams) {
        if (Gem.ParamManager.parameters.hasOwnProperty(namespace)) {
            throw new Error("the plugin " + namespace + " already exist in this context!");
        }
        let parsedParams = this.parse(rawParams);
        Gem.ParamManager.parameters[namespace] = parsedParams;
        return Gem.ParamManager.parameters[namespace]
    }

    /**
     * return the current active script parameters
     *
     * @static
     * @return {string}
     */
    static find() {
        const currentScript = document.currentScript.src.match(/.+\/(.+)\.js/)[1];
        return PluginManager.parameters(currentScript);
    }

    /**
     * check if the registered plugin exists in the current context
     * It's usage is for when you want to check if a registered plugins exists
     *
     * @static
     * @param {string} namespace - the plugin parameters namespace
     * @return {boolean} true if the plugin exist in this context
     */
    static exists(namespace) {
        return Gem.ParamManager.parameters.hasOwnProperty(namespace);
    }

    /**
     * check if a plugin name is valid
     * it's mainly used to make sure base plugin are named correctly.
     * @static
     * @param {string} name
     */
    static checkPluginValidity(name) {
        // method by InVictor
        const currentScript = document.currentScript.src.match(/.+\/(.+)\.js/)[1];
        if (currentScript !== `${name}.js`) {
            throw new Error(`Plugin ${currentScript} should be named ${name + ".js"}`);
        }
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
                    }
                    catch (e) {
                        return value
                    }
                })
            }
            catch (e) {
                return object
            }
        }

        return parseParameters(JSON.stringify(parameters))
    }
}

Gem.ParamManager.parameters = {};
Gem.ParamManager.init();
//=============================================================================
// Gem.Utils
//=============================================================================

/**
 * Utils class used across the gem plugins
 */
Gem.Utils = class {

    constructor() {
        throw new Error("This is a static class!");
    }

    /**
     * get the mouse position and return a point.
     *
     * @static
     * @returns {Point}
     */
    static getMousePosition() {
        return Gem.Utils.mouseCoords;
    }

    static updateMousePos(x, y) {
        Gem.Utils.mouseCoords.x = x;
        Gem.Utils.mouseCoords.y = y;
    }
    /**
     * convert integer to an rgb string.
     * @param {number} r - the color red
     * @param {number} g - the color green
     * @param {number} b - the color blue
     */
    static convertToRGB(r, g, b) {
        return `rbg(${r},${g},${b})`;
    }

    /**
     * convert rpg maker list to an key string map
     * It must contain an keyword 'Key'
     * @param {{key: string}[]} array - the array to convert
     * @returns {Object} return the converted parameters.
     */
    static convertListToMap(array) {
        var object = {};
        for (let i = 0; i < array.length; i++) {
            if (!array[i].hasOwnProperty("key")) {
                throw new Error("Your parameter list struct does not contain the property 'key'.");
            }
            let key = array[i].key;
            object[key] = array[i];
            // we delete this from the obj since we don't need useless code
            delete object[key].key;
        }
        return object;
    }

    /**
     * Load a custom dir for bitmaps
     * @param {string} dir - the dir location
     * @param {string} filename - the filename to load
     * @returns {Bitmap}
     */
    static loadCustom(dir, filename) {
        return ImageManager.loadBitmap(`img/${dir}/`, filename);
    }
    /**
     * @author Wano / Trico
     * @license proprietary
     *  @static
     *  @usage This function is used to inject/overwrite original class methods and variables..
     *  @param classObject The class or newable function that you want to inject/overwrite a variable/method into.
     *  @param prototypeName The variable/method name you want to overwrite/inject code into.
     *  @param prototype The new variable/method you want to inject/overwrite.
     *  @param staticType Sets rather this is a static method/variable or a non static method/variable (NOTE: Both a static and non static variable/method can exist at the same time with the same name.) (DEFAULT: false)
     *  @param overwrite (METHODS ONLY) Should call original method's code or overwrite original method. (DEFAULT: false)
     *  @param loadBefore (METHODS ONLY) Should original method's code be executed before or after your code (NOTE: This is obviously disabled if param overwrite is set to true.) (DEFAULT: true)
     */
    static inject(classObject, prototypeName, prototype, staticType = false, overwrite = false, loadBefore = true) {
        let TheAnyPrototype = prototype; //force any type, system will not accept otherwise!
        if (!staticType) {
            let classPrototype = classObject.prototype[prototypeName];
            if (classPrototype instanceof Function) {
                if (overwrite) {
                    classObject.prototype[prototypeName] = function (...args) {
                        this.super = (...arggs) => { classPrototype.call(this, ...arggs); };
                        return TheAnyPrototype.call(this, ...args);
                    };
                }
                else if (loadBefore) {
                    classObject.prototype[prototypeName] = function (...args) {
                        let result = classPrototype.call(this, ...args);
                        this.super = (...arggs) => { classPrototype.call(this, ...arggs); };
                        this.callResult = result;
                        return TheAnyPrototype.call(this, ...args);
                    };
                }
                else {
                    classObject.prototype[prototypeName] = function (...args) {
                        this.super = (...arggs) => { classPrototype.call(this, ...arggs); };
                        TheAnyPrototype.call(this, ...args);
                        return classPrototype.call(this, ...args);
                    };
                }
            }
            else {
                classObject.prototype[prototypeName] = prototype;
            }
        }
        else {
            let classAnyObject = classObject; //force any type, system will not accept otherwise!
            let classMethod = classAnyObject[prototypeName];
            if (classMethod instanceof Function) {
                if (overwrite) {
                    classAnyObject[prototypeName] = function (...args) {
                        this.super = (...arggs) => { classMethod.call(this, ...arggs); };
                        return TheAnyPrototype.call(this, ...args);
                    };
                }
                else if (loadBefore) {
                    classAnyObject[prototypeName] = function (...args) {
                        let result = classMethod.call(this, ...args);
                        this.super = (...arggs) => { classMethod.call(this, ...arggs); };
                        this.callResult = result;
                        return TheAnyPrototype.call(this, ...args);
                    };
                }
                else {
                    classAnyObject[prototypeName] = function (...args) {
                        this.super = (...arggs) => { classMethod.call(this, ...arggs); };
                        TheAnyPrototype.call(this, ...args);
                        return classMethod.call(this, ...args);
                    };
                }
            }
            else {
                classAnyObject[prototypeName] = prototype;
            }
        }
    }

}

Gem.Utils.mouseCoords = new Point(0, 0);

//=============================================================================
// Gem.Particles
//=============================================================================

Gem.Particles = class extends PIXI.Container {

    constructor() {
        super();
    }
}

//=============================================================================
// Scene_Base
//=============================================================================
Gem.Alias.A2 = Scene_Base.prototype.create;
Scene_Base.prototype.create = function () {
    Gem.Alias.A2.call(this);
    if (this.isMouseCoordinatesNeeded()) {
        this.createCoordinatesSprites();
    }
};

Scene_Base.prototype.isMouseCoordinatesNeeded = function () {
    return false
};


Scene_Base.prototype.createCoordinatesSprites = function () {
    this._mouseCoords = new Sprite(new Bitmap(Graphics.width, Graphics.height));
    const coords = Gem.Utils.getMousePosition();
    const text = `x: ${coords.x}, y: ${coords.y}`;
    const bitmap = this._mouseCoords.bitmap;
    bitmap.fontFace = $gameSystem.mainFontFace();
    bitmap.outlineColor = "black";
    bitmap.outlineWidth = 8;
    bitmap.fontSize = 30;
    bitmap.drawText(text, 753, 576, 48, 48, "center");
};

Scene_Base.prototype.updateCoordinate = function () {
    const coords = Gem.Utils.getMousePosition();
    const text = `x: ${coords.x}, y: ${coords.y}`;
    const bitmap = this._mouseCoords.bitmap;
    bitmap.fontFace = $gameSystem.mainFontFace;
    bitmap.outlineColor = "black";
    bitmap.outlineWidth = 8;
    bitmap.fontSize = 30;
    bitmap.clear();
    bitmap.drawText(text, 753, 576, 48, 48, "center");
};

Gem.Alias.A4 = Scene_Base.prototype.start;
Scene_Base.prototype.start = function () {
    if (this.isMouseCoordinatesNeeded()) {
        this.addChild(this._mouseCoords);
        this.updateCoordinate();
    }
    Gem.Alias.A4.call(this);
};
Gem.Alias.A1 = Scene_Base.prototype.update;
Scene_Base.prototype.update = function () {
    Gem.Alias.A1.call(this);
    if (TouchInput.isMoved() && this.isMouseCoordinatesNeeded()) {
        this.updateCoordinate();
    }
};

Gem.Alias.A3 = TouchInput._onMouseMove;
TouchInput._onMouseMove = function (event) {
    Gem.Alias.A3.call(this, event);
    const coords = new Point(Graphics.pageToCanvasX(event.pageX), Graphics.pageToCanvasY(event.pageY));
    Gem.Utils.updateMousePos(coords.x, coords.y);
};

// =======================================================================
//  Enabling the coordinates on other classes
//  not all the scenes are added since peoples can add themself.
//  Most class will have it.
// =======================================================================

Scene_Title.prototype.isMouseCoordinatesNeeded = function () {
    return true;
};

Scene_MenuBase.prototype.isMouseCoordinatesNeeded = function () {
    return true;
};

Scene_Map.prototype.isMouseCoordinatesNeeded = function () {
    return true;
};

//=============================================================================
// Cyclone Patcher
//=============================================================================
(function () {
    class EmptyClass {
    }

    window.Patcher = class Patcher {
        static _descriptorIsProperty(descriptor) {
            return descriptor.get || descriptor.set || !descriptor.value || typeof descriptor.value !== 'function';
        }

        static _getAllClassDescriptors(classObj, usePrototype = false) {
            if (classObj === Object) {
                return {};
            }

            const descriptors = Object.getOwnPropertyDescriptors(usePrototype ? classObj.prototype : classObj);
            let parentDescriptors = {};
            if (classObj.prototype) {
                const parentClass = Object.getPrototypeOf(classObj.prototype).constructor;
                if (parentClass !== Object) {
                    parentDescriptors = this._getAllClassDescriptors(parentClass, usePrototype);
                }
            }

            return Object.assign({}, parentDescriptors, descriptors);
        }

        static _assignDescriptor(receiver, giver, descriptor, descriptorName, autoRename = false) {
            if (this._descriptorIsProperty(descriptor)) {
                if (descriptor.get || descriptor.set) {
                    Object.defineProperty(receiver, descriptorName, {
                        get: descriptor.get,
                        set: descriptor.set,
                        enumerable: descriptor.enumerable,
                        configurable: descriptor.configurable,
                    });
                } else {
                    Object.defineProperty(receiver, descriptorName, {
                        value: descriptor.value,
                        enumerable: descriptor.enumerable,
                        configurable: descriptor.configurable,
                    });
                }
            } else {
                let newName = descriptorName;
                if (autoRename) {
                    while (newName in receiver) {
                        newName = `_${newName}`;
                    }
                }

                receiver[newName] = giver[descriptorName];
            }
        }

        static _applyPatch(baseClass, patchClass, $super, ignoredNames, usePrototype = false) {
            const baseMethods = this._getAllClassDescriptors(baseClass, usePrototype);

            const baseClassOrPrototype = usePrototype ? baseClass.prototype : baseClass;
            const patchClassOrPrototype = usePrototype ? patchClass.prototype : patchClass;
            const descriptors = Object.getOwnPropertyDescriptors(patchClassOrPrototype);
            let anyOverride = false;

            for (const methodName in descriptors) {
                if (ignoredNames.includes(methodName)) {
                    continue;
                }

                if (methodName in baseMethods) {
                    anyOverride = true;
                    const baseDescriptor = baseMethods[methodName];
                    this._assignDescriptor($super, baseClassOrPrototype, baseDescriptor, methodName, true);
                }

                const descriptor = descriptors[methodName];
                this._assignDescriptor(baseClassOrPrototype, patchClassOrPrototype, descriptor, methodName);
            }

            return anyOverride;
        }

        static patchClass(baseClass, patchFn) {
            const $super = {};
            const $prototype = {};
            const $dynamicSuper = {};
            const patchClass = patchFn($dynamicSuper, $prototype);

            if (typeof patchClass !== 'function') {
                throw new Error(`Invalid class patch for ${baseClass.name}`); //`
            }

            const ignoredStaticNames = Object.getOwnPropertyNames(EmptyClass);
            const ignoredNames = Object.getOwnPropertyNames(EmptyClass.prototype);
            const anyStaticOverride = this._applyPatch(baseClass, patchClass, $super, ignoredStaticNames);
            const anyNonStaticOverride = this._applyPatch(baseClass, patchClass, $prototype, ignoredNames, true);

            if (anyStaticOverride) {
                const descriptors = Object.getOwnPropertyDescriptors($super);
                for (const descriptorName in descriptors) {
                    this._assignDescriptor($dynamicSuper, $super, descriptors[descriptorName], descriptorName);
                }

                if (anyNonStaticOverride) {
                    $dynamicSuper.$prototype = $prototype;
                }
            } else {
                Object.assign($dynamicSuper, $prototype);
            }

            return $dynamicSuper;
        }
    };
})();


//=============================================================================
// END OF FILE
//=============================================================================