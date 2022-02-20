import {PARAMS} from "./Config";


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
export {InnManager}