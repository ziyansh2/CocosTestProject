import { _decorator, Component, Node, Button, director, resources } from 'cc';
import { DialogDef, UIManager } from './UIManager';
const { ccclass, property } = _decorator;

@ccclass('UIGame')
export class UIGame extends Component {
    start() {
        //Can only find the children in the next level
        let btnExit = this.node.getChildByName('Layout').getChildByName('BtnExit');
        btnExit.on(Button.EventType.CLICK, this.onBtnExitClicked, this);

        let btnSetting = this.node.getChildByName('Layout').getChildByName('BtnSetting');
        btnSetting.on(Button.EventType.CLICK, this.onBtnSettingClicked, this);

        let btnPause = this.node.getChildByName('Layout').getChildByName('BtnPause');
        btnPause.on(Button.EventType.CLICK, this.onBtnPauseClicked, this);
    }

    update(deltaTime: number) {
        
    }


    onBtnExitClicked() {
        console.log('Exit clicked');

        //Does not work in the new version
        //resources.releaseUnusedAssets();
        director.loadScene('startup');
    }

    onBtnSettingClicked() {
        console.log('Setting clicked');

        UIManager.instance.openDialog(DialogDef.UISetting);
    }

    onBtnPauseClicked() {
        console.log('Pause clicked');

        if (director.isPaused)
            director.resume();
        else
            director.pause();
    }


}

