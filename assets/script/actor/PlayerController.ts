import { _decorator, Component, Node, math, Vec3, v3 } from 'cc';
import { VirtualInput } from '../input/VirtualInput';
import { MathUtil } from '../util/MathUtil';
import { Actor } from './Actor';
import { ActorProperty } from './ActorProperty';
import { ProjectileEmitter } from './ProjectileEmitter';
import { StateDefine } from './StateDefine';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('PlayerController')
@requireComponent(Actor)
export class PlayerController extends Component {

    actor: Actor = null;

    @property(Node)
    arrowString: Node = null;

    private _splitAngle: number[] = [0];

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
        const arrowStartPos = this.arrowString.worldPosition;
        let arrowForward: Vec3 = v3();

        for (let i = 0; i < this.actor.actorProperty.projectileCount; i++) {
            MathUtil.rotateAround(arrowForward, this.node.forward, Vec3.UP, this._splitAngle[i])

            let projectile = this.node.getComponent(ProjectileEmitter).create();
            projectile.node.forward = arrowForward;
        }
    }

    set projectileCount(count: number) {
        this._splitAngle = [];
        const rad = math.toRadian(10);
        const isOdd = (count % 2) != 0;

        const len = Math.floor(count / 2);

        for (let i = 0; i < len; i++) {
            this._splitAngle.push( rad * (i + 1));
            this._splitAngle.push(-rad * (i + 1));
        }

        if (isOdd) {
            this._splitAngle.push(0);
        }
    }

}

