

class Window_InnConfirmationTitle extends Window_Base {

    constructor() {
        super(...arguments);
    }

    initialize(rect) {
        super.initialize(rect);
        this.text = "";
    }

    setText(text){
        this.text = text;
        this.refresh();
    }

    refresh(){
        this.contents.clear();
        this.drawText(this.text,0,0, this.width, 'center');
    }
}
export {Window_InnConfirmationTitle}