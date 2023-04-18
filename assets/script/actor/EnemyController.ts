import { _decorator, Component, Node, Vec3, v3, randomRange, macro, CCFloat, game, Enum } from 'cc';
import { ActorManager } from '../level/ActorManager';
import { MathUtil } from '../util/MathUtil';
import { Actor } from './Actor';
import { Career } from './ActorProperty';
import { ProjectileEmitter } from './ProjectileEmitter';
import { StateDefine } from './StateDefine';
const { ccclass, property, requireComponent} = _decorator;

@ccclass('EnemyController')
@requireComponent(Actor)
export class EnemyController extends Component {

    @property(Node)
    projectileStartNode: Node = null;

    @property(CCFloat)
    attackRange: number = 0.5;

    @property(CCFloat)
    attackInterval: number = 5;

    @property({ type: Enum(Career)})
    career: Career = Career.Melee;

    actor: Actor = null;
    projectileEmitter: ProjectileEmitter = null;

    lastAttackTime: number = 0;

    start() {
        this.actor = this.node.getComponent(Actor);

        if (this.career == Career.Range)
            this.projectileEmitter = this.node.getComponent(ProjectileEmitter);

        this.node.on('onFrameAttack', this.onFrameAttack, this);

        this.schedule(this.executeAI, 2.0, macro.REPEAT_FOREVER, 1.0);
    }

    executeAI() {
        let target = ActorManager.instance.playerActor;

        if (target == null)
            return;

        if (target.currState == StateDefine.Die)
            return;

        if (this.actor.currState == StateDefine.Die || this.actor.currState == StateDefine.Hit)
            return;


        Vec3.subtract(this.actor.input, target.node.worldPosition, this.node.worldPosition);
        this.actor.input.y = 0;
        this.actor.input.normalize();

        const distance = Vec3.distance(this.node.worldPosition, target.node.worldPosition);
        if (distance > this.attackRange) {
            this.actor.changeState(StateDefine.Run);
            return;
        } 

        if (game.totalTime - this.lastAttackTime > this.attackInterval) {
            this.actor.changeState(StateDefine.Attack);
            this.lastAttackTime = game.totalTime;
            return;
        }

        this.actor.input.set(0, 0, 0);
        this.actor.changeState(StateDefine.Idle);
    }

    onFrameAttack() {
        let target = ActorManager.instance.playerActor;
        if (target == null)
            return;

        if (target.currState == StateDefine.Die)
            return;

        let hurtDirection = v3();
        Vec3.subtract(hurtDirection, target.node.worldPosition, this.node.worldPosition);
        let distance = hurtDirection.length();

        hurtDirection.y = 0;
        hurtDirection.normalize();

        if (this.career == Career.Melee) {
            if (distance < this.attackRange) {
                const angle = Vec3.angle(hurtDirection, this.node.forward);
                if (angle < Math.PI)
                    target.hurt(5, hurtDirection, this.node);
            }
        } else {
            let projectile = this.projectileEmitter.create();
            projectile.node.worldPosition = this.projectileStartNode.worldPosition;
            projectile.node.forward = hurtDirection;
            projectile.projectileProperty.penetration = this.actor.actorProperty.penetration;
            projectile.startTime = 0;
            projectile.host = this.node;
        }
    }

}

