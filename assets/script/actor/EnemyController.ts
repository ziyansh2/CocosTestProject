import { _decorator, Component, Node } from 'cc';
import { Actor } from './Actor';
const { ccclass, property, requireComponent} = _decorator;

@ccclass('EnemyController')
@requireComponent(Actor)
export class EnemyController extends Component {

    actor: Actor = null;

    start() {
        this.actor = this.node.getComponent(Actor);

        this.node.on('onFrameAttack', this.onFrameAttack, this);
    }

    update(deltaTime: number) {
        
    }

    onFrameAttack() {

    }

}

