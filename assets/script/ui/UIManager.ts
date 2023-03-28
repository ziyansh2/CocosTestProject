import { find, instantiate, Node, Prefab, resources } from "cc";

export enum DialogDef {
    UISetting = 'UISetting',
    UISkillUpgrade = 'UISkillUpgrade'
}

export class UIManager {

    uiRoot: Node = null;
    panels: Map<string, Node> = new Map();


    private static _instance: UIManager = null;
    static get instance(): UIManager {
        if (this._instance == null)
            this._instance = new UIManager();

        return this._instance;
    }


    private bringToTop(uiObj: Node) {
        const index = uiObj.parent.children.length - 1;
        uiObj.setSiblingIndex(index);
    }


    openPanel(name: string, bringToTop: boolean = true) {
        if (this.uiRoot == null)
            this.uiRoot = find("UIRoot");

        if (this.panels.has(name)) {
            let panel = this.panels.get(name);
            panel.active = true;

            if (bringToTop) 
                this.bringToTop(panel);

            return;
        }

        resources.load('ui/prefab/' + name, Prefab, (err: Error, data: Prefab) => {
            let panel = instantiate(data);
            this.panels.set(name, panel);
            this.uiRoot.addChild(panel);

            if (bringToTop)
                this.bringToTop(panel);
        });
    }


    closePanel(name: string, destroy: boolean = false) {
        if (!this.panels.has(name))
            return;

        let panel = this.panels.get(name);
        if (destroy) {
            this.panels.delete(name);
            panel.removeFromParent();
        } else {
            panel.active = false;
        }
    }


    openDialog(name: string) {
        for (let dialogDef in DialogDef) {
            if (dialogDef == name)
                this.openPanel(name);
            else
                this.closePanel(name);
        }
    }


    closeDialog(destory: boolean = false) {
        for (let dialogDef in DialogDef) {
            this.closePanel(dialogDef, destory);
        }
    }

}