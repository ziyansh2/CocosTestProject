import { _decorator, Component, Node, Button, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIStartup')
export class UIStartup extends Component {
    start() {
        let btn = this.node.getChildByName('Button');
        btn.on(Button.EventType.CLICK, this.onBtnStartupClicked, this);
    }

    update(deltaTime: number) {
        
    }


    onBtnStartupClicked() {
        console.log('Start clicked');
        director.loadScene('game');
    }

}

