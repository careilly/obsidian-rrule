import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

import { datetime, RRule, RRuleSet, rrulestr,Weekday } from 'rrule';

// Remember to rename these classes and interfaces!

interface obsidianRRuleSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: obsidianRRuleSettings = {
	mySetting: 'default'
}

export default class obsidianRRule extends Plugin {
	settings: obsidianRRuleSettings;

  between(rule: string,startdate: string,starttime: string, sy: number, sm: number, sd: number,ey:number, em:number, ed: number) {
    let dtrule = 'DTSTART:'+startdate+'T'+starttime+'00Z\n'+rule
    var rules = rrulestr(dtrule)
    return rules.between(datetime(sy, sm, sd,0,0), datetime(ey, em, ed,23,59),true);
  }

  recurringbetween(daysOfWeek: number[],startRecur: string,endRecur: string, sy: number, sm: number, sd: number,ey:number, em:number, ed: number) {
    let s = startRecur.split('-')
    let e = endRecur.split('-')
    const rule = new RRule({
      freq: RRule.WEEKLY,
      byweekday: daysOfWeek,
      dtstart: datetime(parseInt(s[0]),parseInt(s[1]), parseInt(s[2])),
      until: datetime(parseInt(e[0]),parseInt(e[1]), parseInt(e[2])),
    })
    console.log(rule.toText())
    return rule.between(datetime(sy, sm, sd,0,0), datetime(ey, em, ed,23,59),true);
  }
	async onload() {
		//await this.loadSettings();

		//this.addCommand({
			//id: 'open-sample-modal-simple',
			//name: 'Open sample modal (simple)',
			//callback: () => {
				//new SampleModal(this.app).open();
			//}
		//});
		// This adds an editor command that can perform some operation on the current editor instance
		//this.addCommand({
			//id: 'sample-editor-command',
			//name: 'Sample editor command',
			//editorCallback: (editor: Editor, view: MarkdownView) => {
				//console.log(editor.getSelection());
				//editor.replaceSelection('Sample Editor Command');
			//}
		//});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		//this.addCommand({
			//id: 'open-sample-modal-complex',
			//name: 'Open sample modal (complex)',
			//checkCallback: (checking: boolean) => {
				//// Conditions to check
				//const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				//if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					//if (!checking) {
						//new SampleModal(this.app).open();
					//}

					// This command will only show up in Command Palette when the check function returns true
					//return true;
				//}
			//}
		//});

		// This adds a settings tab so the user can configure various aspects of the plugin
		//this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: obsidianRRule;


	constructor(app: App, plugin: obsidianRRule) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
