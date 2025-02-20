/*
  This file is part of the extension-reloader@nls1729.

  Copyright (c) 2016-2018 Norman L. Smith

  This extension is free software; you can redistribute it and/or
  modify it under the terms of the GNU General Public License
  as published by the Free Software Foundation; either version 2
  of the License, or (at your option) any later version.

  This extension is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program. If not, see
  < https://www.gnu.org/licenses/old-licenses/gpl-2.0.html >.

  This extension is a derived work of the Gnome Shell.
*/


const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;
const Gio = imports.gi.Gio;
const Config = imports.misc.config;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const DOMAIN = Me.metadata['gettext-domain'];
const Gettext = imports.gettext.domain(DOMAIN);
const _ = Gettext.gettext;
const COMMIT = "Commit:";
const SHORTCUT = 'shortcut';
const LEFT = 'panel-icon-left';
const CENTER = 'panel-icon-center';
const EPVERSION = 'extension-version';
const GSPVERSION = 'shell-version';

function init() {
    imports.gettext.bindtextdomain(DOMAIN, Me.path + "/locale");
}

const ExtensionReloaderPrefsWidget = new GObject.registerClass(
class ExtensionReloaderPrefsWidget extends Gtk.Box {

    _init(params) {
        super._init(params);
        let GioSSS = Gio.SettingsSchemaSource;
        let schema = Me.metadata['settings-schema'];
        let schemaDir = Me.dir.get_child('schemas').get_path();
        let schemaSrc = GioSSS.new_from_directory(schemaDir, GioSSS.get_default(), false);
        let schemaObj = schemaSrc.lookup(schema, true);
        this._settings = new Gio.Settings({settings_schema: schemaObj});
        this._grid = new Gtk.Grid();
        this._grid.margin = 5;
        this._grid.row_spacing = 5;
        this._grid.column_spacing = 5;
        this._grid.set_column_homogeneous(true);
        let btnPosition = _("Button Location");
        this._centerCb = new Gtk.CheckButton({label:_("Center")});
        this._leftRb = new Gtk.RadioButton({label:_("Left")});
        this._rightRb = new Gtk.RadioButton({group:this._leftRb, label:_("Right")});
        let rbGroup = new Gtk.Box({orientation:Gtk.Orientation.VERTICAL, homogeneous:false,
            margin_left:4, margin_top:2, margin_bottom:2, margin_right:4});
        rbGroup.add(this._centerCb);
        rbGroup.add(this._leftRb);
        rbGroup.add(this._rightRb);;
        let version = '[ v' + this._settings.get_string(EPVERSION) +
            ' GS ' + this._settings.get_string(GSPVERSION) + ' ]';
        this._linkBtn = new Gtk.LinkButton({uri: Me.metadata['url'], label: _("Website")});
        let left = this._settings.get_boolean(LEFT);
        let center = this._settings.get_boolean(CENTER);
        this._leftRb.connect('toggled', (b) => {
            if(b.get_active())
                this._settings.set_boolean(LEFT, true);
            else
                this._settings.set_boolean(LEFT, false);
        });
        this._rightRb.connect('toggled', (b) => {
            if(b.get_active())
                this._settings.set_boolean(LEFT, false);
            else
                this._settings.set_boolean(LEFT, true);
        });
        this._centerCb.connect('toggled', (b) => {
            if(b.get_active()) {
                this._settings.set_boolean(CENTER, true);
            } else {
                this._settings.set_boolean(CENTER, false);
            }
        });
        this._leftRb.set_active(left);
        this._rightRb.set_active(!left);
        this._centerCb.set_active(center);
        this._grid.attach(new Gtk.Label({ label: btnPosition, wrap: true, xalign: 0.5 }), 0,  8, 7, 1);
        this._grid.attach(rbGroup, 3, 10, 1, 3);
        this._grid.attach(new Gtk.Label({ label: version, wrap: true, xalign: 0.5 }), 0, 18, 7, 1);
        this._grid.attach(new Gtk.Label({ label: COMMIT, wrap: true, xalign: 0.5 }), 0, 20, 7, 1);
        this._grid.attach(this._linkBtn, 3, 22, 1, 1);
        this.add(this._grid);
    }
});

function buildPrefsWidget() {
    let widget = new ExtensionReloaderPrefsWidget();
    widget.show_all();
    return widget;
}

