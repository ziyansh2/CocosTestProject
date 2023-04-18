import { _decorator, Component, Node, math, Vec3, v3, randomRange, log, input } from 'cc';
import { Events } from '../events/Events';
import { VirtualInput } from '../input/VirtualInput';
import { ActorManager } from '../level/ActorManager';
import { AudioManager } from '../level/AudioManager';
import { MathUtil } from '../util/MathUtil';
import { Actor } from './Actor';
import { ActorProperty } from './ActorProperty';
import { ProjectileEmitter } from './ProjectileEmitter';
import { StateDefine } from './StateDefine';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('PlayerController')
@requireComponent(Actor)
export class PlayerController extends Component {

    @property(Node)
    arrowString: Node = null;

    actor: Actor = null;
    projectileEmitter: ProjectileEmitter = null;
    private _splitAngle: number[] = [0];

    start() {
        this.actor = this.node.getComponent(Actor);
        this.projectileEmitter = this.node.getComponent(ProjectileEmitter);

        this.node.on('onFrameAttackLoose', this.onFrameAttackLoose, this);
        ActorManager.instance.playerActor = this.actor;
        this.node.on(Events.OnKill, this.onKill, this);
    }

    onDestroy() {
        ActorManager.instance.playerActor = null;
    }

    update(deltaTime: number) {
        this.actor.input.x = VirtualInput.horizontal;
        this.actor.input.z = -VirtualInput.vertical;

        if (this.actor.input.length() > 0) {
            this.actor.changeState(StateDefine.Run);
        } else {
            let enemy = this.getNearEnemy();
            if (enemy == null) {
                this.actor.changeState(StateDefine.Idle);
            } else {
                Vec3.subtract(this.actor.input, enemy.worldPosition, this.node.worldPosition);
                this.actor.input.y = 0;
                this.actor.input.normalize();

                //this.actor.changeState(StateDefine.Attack);
            }
        }
    }

    onFrameAttackLoose() {
        const arrowStartPos = this.arrowString.worldPosition;
        let arrowForward: Vec3 = v3();

        for (let i = 0; i < this.actor.actorProperty.projectileCount; i++) {
            MathUtil.rotateAround(arrowForward, this.node.forward, Vec3.UP, this._splitAngle[i])

            let projectile = this.projectileEmitter.create();
            projectile.node.worldPosition = arrowStartPos;
            projectile.node.forward = arrowForward;

            projectile.startTime = 0;
            projectile.projectileProperty.penetration = this.actor.actorProperty.penetration;

            const willchase = randomRange(0, 100) < this.actor.actorProperty.chaseRate;
            if (willchase) {
                projectile.target = ActorManager.instance.randomEnemy;
            }

            projectile.host = this.node;
        }

        AudioManager.instance.playShootSfx();
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

    getNearEnemy(): Node {
        let minDistance = 9999;
        let minNode: Node = null;

        for (let enemy of ActorManager.instance.enemies) {
            let distance = Vec3.distance(this.node.worldPosition, enemy.worldPosition);
            if (distance < minDistance) {
                minDistance = distance;
                minNode = enemy;
            }
        }

        if (minDistance > 3)
            return null;

        return minNode;
    }

    onKill() {
        let property = this.actor.actorProperty;
        property.exp += 10;
        if (property.exp >= property.maxExp) {
            property.maxExp *= 1.2;
            property.exp = 0;
            property.level++;

            this.node.emit(Events.OnPlayerUpgrade, property.level);
        }

        this.node.emit(Events.OnExpGain, property.exp, property.maxExp);
    }

}

