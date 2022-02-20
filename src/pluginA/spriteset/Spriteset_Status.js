import {Sprite} from "rmmz";
import {PARAMS} from "../Config";

class Spriteset_Status extends Sprite {

    constructor() {
        super();
        /**
         *
         * @type {Game_Actor}
         * @private
         */
        this._actor = null;
        this._params = PARAMS.status.profile;
        this.refresh();
    }

    setActor(actor){
        if(this._actor !== actor){
            this._actor = actor;
            this.refresh();
        }
    }

    refresh(){
        const actor = this._actor;
        this.drawActorStory();
        this.drawActorName();
    }
    create(){
     //   this.drawProfileBackground();
        this.createActorName();
        this.createActorNickname();
        this.createActorProfile();
    }

    createActorName(){
        this._actorName = new Sprite();
        this._actorName.bitmap = new Bitmap(Graphics.width,Graphics.height);
        this.addChild(this._actorName);
    }

    createActorNickname(){
        this._actorNickname = new Sprite();
        this._actorNickname.bitmap = new Bitmap(Graphics.width,Graphics.height);
        this.addChild(this._actorNickname);
    }

    createActorProfile(){
        // in this case use a window set to transparent as a dummy for text
        const rect = this.profileWindowRect();
        this._profileWindow = new Window_Help(rect);
        this._profileWindow.opacity = 0;
        this.addChild(this._profileWindow);
    }

    drawActorName(){
        const {x,y,maxWidth,lineHeight, align} = this._params.name;

        const bitmap = this._actorName.bitmap;
        bitmap.fontFace = $gameSystem.mainFontFace();
        bitmap.outlineColor = "black";
        bitmap.outlineWidth = 8;
        bitmap.fontSize = 72;
        bitmap.drawText(this._actor.name(),x,y,maxWidth,lineHeight,align);
    }


    drawActorStory(){
        this._profileWindow.setText(this._actor.profile());
    }

    profileWindowRect(){
        const ww = Graphics.boxWidth;
        const wh = this.profileHeight();
        const wx = 0;
        const wy = this.mainAreaBottom() - wh;
        return new Rectangle(wx, wy, ww, wh);
    };

}