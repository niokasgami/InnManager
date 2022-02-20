/*:
 * @target MZ
 * @plugindesc the js file that containn all the actions for the InnManager
 * @author Nio Kasgami
 * @base gear-inn-manager
 * @orderAfter gear-inn-manager
 * @help
 * this plugin is an add-on section for you to write your inn / room actions
 * please put this below the gear-inn-manager plugin
 *
 * ==========================================================================
 *  + concept
 * --------------------------------------------------------------------------
 *  the inns is built from an amount of rooms and each of those rooms will
 *  do a different type of action that you set.
 *
 *  what is an action?
 *      an action is a lambda function that is registered under
 *      a namespace that you can execute when you use a room.
 *      action can be virtually anything you want as long the action is coded
 *      somewhere and of course not bounded to a specific scene.
 *      best example would be moving an event into a map while you are not
 *      currently in the map scene.
 *
 * ==========================================================================
 *  + registering an action
 * --------------------------------------------------------------------------
 *  registering an custom action for a room is actually quite easy
 *  however, it will require at least a minimal knowledge about JS
 *  and the MZ code API. It was designed to work like plugin commands
 *
 *  to register a Room Action, you simply open the js file and add an extra
 *  action between the anonymous function like this :
 *     + this.Gear.Inn.InnManager.registerAction("myAction" (args) => {});
 *  or you simply can also shorten it using the const variable 'inn'
 *
 *  + understanding the register command :
 *     put quite simply the call is  composed of :
 *     + an action name which is used to fetch action when calling it
 *     + a function with a parameter args which is the body of the action
 *     + the argument args will always be an array
 *
 *  + example :
 *   inn.registerAction("my action",(args) =>{
 *      const myIntValue = args[0];
 *   });
 *
 *  There's plenty of example below to understand how to use it!
 *
 * ==========================================================================
 *  + executing an action
 * --------------------------------------------------------------------------
 *  Executing an action in the InnManager is actually handled by the scene
 *  itself so u wouldn't need to execute an action yourself. Although,
 *  in the case you might need to do so (like when chaining action) here's
 *  the call :
 *      + this.Gear.Inn.InnManager.executeAction("actionName",args);
 *  remember you can always shorten it!
 *
 *  so as said above you use the action name to call it, and you provide
 *  the arguments so the call can work. Do remember that args is always
 *  an array and that some actions don't require any args at all!
 *
 * ==========================================================================
 *  + chaining an action
 * --------------------------------------------------------------------------
 *  By the spirit of lambda, the InnManager is able to actually not only
 *  register and execute an action but also able to chain them!
 *  if you have an existing action but want to extend on it.
 *  then it's 100% viable to chain them!
 *  how to chain them:
 *   inn.registerAction("my action",(args) =>{
 *      const myIntValue = args[0];
 *      const newargs = [args[2]];
 *      inn.executeAction("percentHeal",newargs);
 *   });
 *
 * It's simple as that! any action can be called inside another action
 * just remember if your action has args to adjust your args array in
 * consequence in the plugin manager
 *
 */

(() => {
    const inn = this.Gear.Inn.InnManager;

    /**
     * Show an basic example without any usage of arguments
     */
    inn.registerAction("full-heal", () => {
        const party = $gameParty.members();
        for (const actor of party) {
            actor.setHp(actor.mhp);
            actor.setMp(actor.mhp);
        }
    });

    /**
     * show an example of an action that use Arguments
     * and also heal for a percentage of your health
     */
    inn.registerAction("percent-heal", (args) => {
        const percent = args[0];
        console.log(percent);
        const party = $gameParty.members();
        for (const actor of party) {
            const value = Math.round(percent * actor.mhp / 100);
            actor.gainHp(value);
        }
    });

    /**
     * in this situation we show that we can add extra state
     * and chain an existing action
     */
    inn.registerAction("give-status", (args) => {
        const state = args[0];
        const party = $gameParty.members();
        for (const actor of party) {
            actor.addState(state);
        }
        inn.executeAction("full-heal", []);
    });

    /**
     * another example for a specific amount of health can be also negative
     */
    inn.registerAction("specific-heal",(args)=> {
        const heal = args[0];
        const party = $gameParty.members();
        for(const actor of party){
            actor.gainHp(heal);
        }
    });


})();