const Lang = imports.lang;
const Clutter = imports.gi.Clutter;
const St = imports.gi.St;

const Main = imports.ui.main;
const SwitcherPopup = imports.ui.switcherPopup;
const AltTab = imports.ui.altTab;

function appSwitcherPopup_allocateNew(actor, box, flags) {
    let childBox = new Clutter.ActorBox();
    let primary = Main.layoutManager.currentMonitor;

    let leftPadding = this.actor.get_theme_node().get_padding(St.Side.LEFT);
    let rightPadding = this.actor.get_theme_node().get_padding(St.Side.RIGHT);
    let hPadding = leftPadding + rightPadding;

    // Allocate the switcherList
    // We select a size based on an icon size that does not overflow the screen
    let [childMinHeight, childNaturalHeight] = this._switcherList.actor.get_preferred_height(primary.width - hPadding);
    let [childMinWidth, childNaturalWidth] = this._switcherList.actor.get_preferred_width(childNaturalHeight);
    childBox.x1 = Math.max(primary.x + leftPadding, primary.x + Math.floor((primary.width - childNaturalWidth) / 2));
    childBox.x2 = Math.min(primary.x + primary.width - rightPadding, childBox.x1 + childNaturalWidth);
    childBox.y1 = primary.y + Math.floor((primary.height - childNaturalHeight) / 2);
    childBox.y2 = childBox.y1 + childNaturalHeight;
    this._switcherList.actor.allocate(childBox, flags);


    // Allocate the thumbnails
    // We try to avoid overflowing the screen so we base the resulting size on
    // those calculations
    if (this._thumbnails) {
        let childBox = this._switcherList.actor.get_allocation_box();
        //let primary = Main.layoutManager.primaryMonitor;
        let primary = Main.layoutManager.currentMonitor;

        let leftPadding = this.actor.get_theme_node().get_padding(St.Side.LEFT);
        let rightPadding = this.actor.get_theme_node().get_padding(St.Side.RIGHT);
        let bottomPadding = this.actor.get_theme_node().get_padding(St.Side.BOTTOM);
        let hPadding = leftPadding + rightPadding;

        let icon = this._items[this._selectedIndex].actor;
        let [posX, posY] = icon.get_transformed_position();
        let thumbnailCenter = posX + icon.width / 2;
        let [childMinWidth, childNaturalWidth] = this._thumbnails.actor.get_preferred_width(-1);
        childBox.x1 = Math.max(primary.x + leftPadding, Math.floor(thumbnailCenter - childNaturalWidth / 2));
        if (childBox.x1 + childNaturalWidth > primary.x + primary.width - hPadding) {
            let offset = childBox.x1 + childNaturalWidth - primary.width + hPadding;
            childBox.x1 = Math.max(primary.x + leftPadding, childBox.x1 - offset - hPadding);
        }

        let spacing = this.actor.get_theme_node().get_length('spacing');

        childBox.x2 = childBox.x1 +  childNaturalWidth;
        if (childBox.x2 > primary.x + primary.width - rightPadding)
            childBox.x2 = primary.x + primary.width - rightPadding;
        childBox.y1 = this._switcherList.actor.allocation.y2 + spacing;
        this._thumbnails.addClones(primary.y + primary.height - bottomPadding - childBox.y1);
        let [childMinHeight, childNaturalHeight] = this._thumbnails.actor.get_preferred_height(-1);
        childBox.y2 = childBox.y1 + childNaturalHeight;
        this._thumbnails.actor.allocate(childBox, flags);
    }
}

function _getPreferredWidthNew(actor, forHeight, alloc) {
    let primary = Main.layoutManager.currentMonitor;

    alloc.min_size = primary.width;
    alloc.natural_size = primary.width;
}

function _getPreferredHeightNew (actor, forWidth, alloc) {
    let primary = Main.layoutManager.currentMonitor;

    alloc.min_size = primary.height;
    alloc.natural_size = primary.height;
}


function _allocateNew(actor, box, flags) {
    let childBox = new Clutter.ActorBox();
    //let primary = Main.layoutManager.primaryMonitor;
    let primary = Main.layoutManager.currentMonitor;

    let leftPadding = this.actor.get_theme_node().get_padding(St.Side.LEFT);
    let rightPadding = this.actor.get_theme_node().get_padding(St.Side.RIGHT);
    let hPadding = leftPadding + rightPadding;

    // Allocate the switcherList
    // We select a size based on an icon size that does not overflow the screen
    let [childMinHeight, childNaturalHeight] = this._switcherList.actor.get_preferred_height(primary.width - hPadding);
    let [childMinWidth, childNaturalWidth] = this._switcherList.actor.get_preferred_width(childNaturalHeight);
    childBox.x1 = Math.max(primary.x + leftPadding, primary.x + Math.floor((primary.width - childNaturalWidth) / 2));
    childBox.x2 = Math.min(primary.x + primary.width - rightPadding, childBox.x1 + childNaturalWidth);
    childBox.y1 = primary.y + Math.floor((primary.height - childNaturalHeight) / 2);
    childBox.y2 = childBox.y1 + childNaturalHeight;
    this._switcherList.actor.allocate(childBox, flags);
}

let _allocateOrigin;
let _getPreferredWidthOrigin;
let _getPreferredHeightOrigin;
let appSwitcherPopup_allocateOrigin;

function init() {
    _allocateOrigin = SwitcherPopup.SwitcherPopup._allocate;
    _getPreferredWidthOrigin = SwitcherPopup.SwitcherPopup._getPreferredWidth;
    _getPreferredHeightOrigin = SwitcherPopup.SwitcherPopup._getPreferredHeight;

    appSwitcherPopup_allocateOrigin = AltTab.AppSwitcherPopup._allocate;
}

function enable() {
    SwitcherPopup.SwitcherPopup.prototype._allocate = _allocateNew;
    SwitcherPopup.SwitcherPopup.prototype._getPreferredWidth = _getPreferredWidthNew;
    SwitcherPopup.SwitcherPopup.prototype._getPreferredHeight = _getPreferredHeightNew;

    AltTab.AppSwitcherPopup.prototype._allocate = appSwitcherPopup_allocateNew;
}

function disable() {
    SwitcherPopup.SwitcherPopup.prototype._allocate = _allocateOrigin;
    SwitcherPopup.SwitcherPopup.prototype._getPreferredWidth = _getPreferredWidthOrigin;
    SwitcherPopup.SwitcherPopup.prototype._getPreferredHeight = _getPreferredHeightOrigin;

    AltTab.AppSwitcherPopup.prototype._allocate = appSwitcherPopup_allocateOrigin;
}
