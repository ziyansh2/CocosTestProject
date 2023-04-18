import { _decorator, Component, Node, SkeletalAnimation, RigidBody, Collider, v3, CCFloat, Vec3, ICollisionEvent, PhysicsSystem, AnimationComponent } from 'cc';
import { Events } from '../events/Events';
import { MathUtil } from '../util/MathUtil';
import { ActorProperty } from './ActorProperty';
import { Projectile } from './Projectile';
import { StateDefine } from './StateDefine';
const { ccclass, property } = _decorator;

let tempVelocity = v3();

@ccclass('Actor')
export class Actor extends Component {

    currState: StateDefine = StateDefine.Idle;
    rigidbody: RigidBody = null;
    collider: Collider = null;

    @property(SkeletalAnimation)
    skeletalAnimation: SkeletalAnimation = null;

    @property(CCFloat)
    linearSpeed: number = 1.0;

    @property(CCFloat)
    angularSpeed: number = 10;

    actorProperty: ActorProperty = new ActorProperty();
    input: Vec3 = v3();

    start() {
        this.rigidbody = this.node.getComponent(RigidBody);
        this.collider = this.node.getComponent(Collider);
        this.collider.on('onTriggerEnter', this.onTriggerEnter, this);
        this.skeletalAnimation.getState(StateDefine.Hit).on(AnimationComponent.EventType.FINISHED, this.HitEnd, this);
    }

    HitEnd() {
        this.changeState(StateDefine.Idle);
    }


    update(deltaTime: number) {
        this.doRotate();

        switch (this.currState) {
            case StateDefine.Run:
                // rigidbody -> set velocity
                // transform -> set position
                this.doMove();
                break;
        }
    }

    doRotate() {
        const angle = MathUtil.signAngle(this.node.forward, this.input, Vec3.UP);

        tempVelocity.x = 0;
        tempVelocity.y = angle * this.angularSpeed;
        tempVelocity.z = 0;

        this.rigidbody.setAngularVelocity(tempVelocity);
    }

    doMove() {
        //Speed = direction(node.forward) * basicSpeed * controllerInput
        const speed = this.input.length() * this.linearSpeed;

        //Have to override all elements since it is global
        tempVelocity.x = this.node.forward.x * speed;
        tempVelocity.y = 0;
        tempVelocity.z = this.node.forward.z * speed;

        this.rigidbody.setLinearVelocity(tempVelocity);
    }

    stopMove() {
        this.rigidbody.setLinearVelocity(Vec3.ZERO);
    }

    changeState(destState: StateDefine) {
        if (this.currState == destState && destState != StateDefine.Hit)
            return;

        if (this.currState == StateDefine.Die) 
            return;

        if (destState != StateDefine.Run) {
            this.stopMove();
        }

        this.updateState(destState, 0.3);
    }

    respawn() {
        this.updateState(StateDefine.Idle, 0.3);
    }

    updateState(destState: StateDefine, blendTime) {
        this.currState = destState;
        this.skeletalAnimation.crossFade(this.currState, blendTime);
        //No blend
        //this.skeletalAnimation.play(this.currState);
    }

    onTriggerEnter(event: ICollisionEvent) {
        if (event.otherCollider.getGroup() == PhysicsSystem.PhysicsGroup.DEFAULT)
            return;

        const projectile = event.otherCollider.getComponent(Projectile);
        if (projectile.host == null)
            return;

        const hostActor = projectile.host.getComponent(Actor);

        let hurtDirection = v3();
        Vec3.subtract(hurtDirection, this.node.worldPosition, projectile.node.worldPosition);
        hurtDirection.normalize();

        this.hurt(hostActor.actorProperty.attack, hurtDirection, projectile.host);
    }

    hurt(damage: number, hurtDirection: Vec3, hurtSrc: Node) {
        if (this.currState == StateDefine.Die) {
            return;
        }

        this.actorProperty.hp -= damage;
        this.node.emit(Events.OnHurt, this.actorProperty.hp / this.actorProperty.maxHp);
        if (this.actorProperty.hp <= 0)
        {
            this.onDie();
            hurtSrc.emit(Events.OnKill, this);
        }
        else
        {
            this.changeState(StateDefine.Hit);
        }
        
        hurtDirection.multiplyScalar(2.0);
        this.rigidbody.applyImpulse(hurtDirection);
    }

    onDie() {
        this.changeState(StateDefine.Die);
        this.node.emit(Events.OnDie, this.node);
    }

}

