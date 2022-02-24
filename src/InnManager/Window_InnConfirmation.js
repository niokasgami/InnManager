

class Window_InnConfirmation extends Window_HorzCommand {

    constructor() {
        super(...arguments);
    }

    initialize(rect) {
        super.initialize(rect);
    }

    maxCols() {
        return 2;
    }

    makeCommandList() {
        this.addCommand("Yes","yes",true);
        this.addCommand("No","no", true);
    }
}
export {Window_InnConfirmation}