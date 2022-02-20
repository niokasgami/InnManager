import {ImageManager} from "rmmz";

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
        return ImageManager.loadBitmap(`img/${directory}/`, filename);
    }

}
export {Helper}