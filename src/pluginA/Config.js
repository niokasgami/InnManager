import {Helper} from "../gear/Helper";




export const pluginName = "gear-scene-status";

const rawParams = Helper.find();

/**
 *
 * @type {PluginParameters}
 */
export const PARAMS = Helper.parse(rawParams);

export let Alias = {};

export const DIRECTORY = {
    status: "menu/status"
};
/**
 * the bitmap type
 */
export const BITMAP_TYPE = Object.freeze({
    SINGLE: 0,
    ANIMATED: 1,
    TILLING: 2
});

