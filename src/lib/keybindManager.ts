import { readable } from "svelte/store";

export class Keybind {
	keybindId: string;
	keyCombo: KeyCombo;
	callback: Function;
	constructor(keybindId: string, keyCombo: KeyCombo, callback: Function) {
		this.keybindId = keybindId;
		this.keyCombo = keyCombo;
		this.callback = callback;
	}
}

export class KeyCombo {
	mainKey: string | string[];
	control: boolean;
	shift: boolean;
	alt: boolean;

	constructor(
		mainKey: string | string[],
		control: boolean = false,
		shift: boolean = false,
		alt: boolean = false
	) {
		if (typeof mainKey == "string") this.mainKey = mainKey.toUpperCase();
		else this.mainKey = mainKey.map((k) => k.toUpperCase());
		this.control = control;
		this.shift = shift;
		this.alt = alt;
	}

	generateComboString() {
		let prefix = "";
		if (this.control) prefix += "CTRL+";
		if (this.shift) prefix += "SHIFT+";
		if (this.alt) prefix += "ALT+";
		if (typeof this.mainKey == "string") {
			return prefix + this.mainKey;
		} else {
			let combos: string[] = [];
			this.mainKey.forEach((k) => {
				combos.push(prefix + k);
			});
			return combos;
		}
	}

	compareKeyCombo(combo: KeyCombo): boolean {
		let selfString = typeof this.mainKey == "string";
		let compString = typeof combo.mainKey == "string";
		let found = false;
		if (selfString && compString) {
			found = combo.mainKey == this.mainKey;
		} else if (selfString && typeof combo.mainKey != "string") {
			combo.mainKey.forEach((kc) => {
				if (kc == this.mainKey) found = true;
			});
		} else if (
			typeof this.mainKey != "string" &&
			typeof combo.mainKey == "string"
		) {
			this.mainKey.forEach((kc) => {
				if (kc == combo.mainKey) found = true;
			});
		} else if (
			typeof combo.mainKey != "string" &&
			typeof this.mainKey != "string"
		) {
			this.mainKey.forEach((kc) => {
				if (typeof combo.mainKey == "string") return false;
				combo.mainKey.forEach((cmb) => {
					if (kc == cmb) found = true;
				});
			});
		}

		return found;
	}
}

export class KeybindManager {
	keybinds: Keybind[];
	constructor() {
		this.keybinds = [];
	}

	setKeybinds(keybinds: Keybind[]) {
		this.keybinds = keybinds;
	}

	callKeybind(keyCombo: KeyCombo, e: KeyboardEvent) {
		this.keybinds.forEach((bind: Keybind) => {
			if (keyCombo.compareKeyCombo(bind.keyCombo)) {
				bind.callback(e);
			}
		});
	}
}

export const keybindManager = new KeybindManager();

export function onKeyDown(e: KeyboardEvent) {
	let combo = keyComboFromEvent(e);
	keybindManager.callKeybind(combo, e);
}

function keyComboFromEvent(e: KeyboardEvent): KeyCombo {
	let key = e.key.toUpperCase();
	return new KeyCombo(key, e.ctrlKey, e.shiftKey, e.altKey);
}
