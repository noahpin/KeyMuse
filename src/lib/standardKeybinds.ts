import { deleteSelection, nudgeSelectedCaps, projectAction, selectAll, toolStore } from "$lib";
import { keybindManager, KeyCombo, Keybind } from "./keybindManager";

let standardKeybinds: Keybind[] = [];

export function initializeStandardKeybinds() {
    standardKeybinds.push(new Keybind("select_all", new KeyCombo("A", true), selectAll));
    standardKeybinds.push(new Keybind("escape", new KeyCombo("escape"), ()=> {toolStore.set("select")}))
    standardKeybinds.push(new Keybind("tool_placement", new KeyCombo("c"), ()=> {toolStore.set("placement")}))
    standardKeybinds.push(new Keybind("tool_rotate", new KeyCombo("r"), ()=> {toolStore.set("rotate")}))
    standardKeybinds.push(new Keybind("tool_translate", new KeyCombo("t"), ()=> {toolStore.set("translate")}))
    standardKeybinds.push(new Keybind("action_home", new KeyCombo("h"), ()=> {projectAction.set("home")}))
    standardKeybinds.push(new Keybind("action_delete", new KeyCombo("delete"), ()=> {deleteSelection}))
    standardKeybinds.push(new Keybind("nudge", new KeyCombo(["arrowup", "arrowdown", "arrowleft", "arrowright"]), nudgeSelectedCaps))

    keybindManager.setKeybinds(standardKeybinds);
}