import {Alias, DIRECTORY, PARAMS} from "./Config";
import {Helper} from "../gear/Helper";
import {SpriteLayer} from "../gear/SpriteLayer";


Alias.a01 = Scene_Status.prototype.initialize;
Scene_Status.prototype.initialize = function(){
    Alias.a01.call(this);
    this._params = PARAMS.status;
};

// override the create function has we re-doing the whole Scene anyway
Scene_Status.prototype.create = function (){
    Scene_MenuBase.prototype.create.call(this);
    this.createBackground();
    this.createActor();
};

Scene_Status.prototype.createBackground = function (){
    this._backgroundLayer = new SpriteLayer(this._params.background, DIRECTORY.status);
    this.addChild(this._backgroundLayer);
};

Scene_Status.prototype.createActor = function (){
    const {actor} = this._params;

    this._character = new Sprite();
    this._character.bitmap = Helper.loadCustomDir(DIRECTORY, this.actor().name());
    this._character.pivot.x = actor.pivot.x;
    this._character.pivot.y = actor.pivot.y;
    this._character.x = actor.x;
    this._character.y = actor.y;
    this.addChild(this._character);
};

Scene_Status.prototype.update = function(){
    Scene_MenuBase.prototype.update.call(this);

};
Scene_Status.prototype.refreshActor = function (){
    this._character.bitmap = Helper.loadCustomDir(DIRECTORY, this.actor().name());
};
