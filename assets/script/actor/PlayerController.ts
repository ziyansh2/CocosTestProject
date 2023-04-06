import { _decorator, Component, Node } from 'cc';
import { VirtualInput } from '../input/VirtualInput';
import { Actor } from './Actor';
import { StateDefine } from './StateDefine';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('PlayerController')
@requireComponent(Actor)
export class PlayerController extends Component {

    actor: Actor = null;

    start() {
        this.actor = this.node.getComponent(Actor);

        this.node.on('onFrameAttackLoose', this.onFrameAttackLoose, this);
    }

    update(deltaTime: number) {
        this.actor.input.x = VirtualInput.horizontal;
        this.actor.input.z = -VirtualInput.vertical;

        if (this.actor.input.length() > 0) {
            this.actor.changeState(StateDefine.Run);
        } else {
            this.actor.changeState(StateDefine.Idle);
        }
    }

    onFrameAttackLoose() {

    }

}

