export class Window_InnResult extends Window_Selectable {
  constructor (rect) {
    super(rect);
    super.initialize(rect);
    this._beforeSleepData = [];
  }

  update () {
    super.update();
  }

  setMembersBeforeSleep(data) {
    this._membersBeforeSleep = data;
    this.refresh();
  }

  drawResults() {
    let x = 0;
    let y = 0;
    for (const [index, oldActor] of this._membersBeforeSleep.entries()) {
      const currentActor = $gameParty.members()[index]
      const hpGained = currentActor.hp - oldActor.hp
      this.drawText(`${currentActor.name()} gained ${hpGained}`, x, y, this.width, "left");
      y += 25
    }
  }

  refresh () {
    this.contents.clear();
    this.drawResults();
  }
}
