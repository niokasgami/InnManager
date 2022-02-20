import {Helper} from "../gear/Helper";


export const pluginName = "gear-inn-manager";

const rawParams = Helper.find();

/**
 *
 * @type {InnParameters}
 */
export const PARAMS = Helper.parse(rawParams);
