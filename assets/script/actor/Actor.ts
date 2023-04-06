import { _decorator, Component, Node, SkeletalAnimation, RigidBody, Collider, v3, CCFloat, Vec3 } from 'cc';
import { MathUtil } from '../util/MathUtil';
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

    input: Vec3 = v3();

    start() {
        this.rigidbody = this.node.getComponent(RigidBody);
        this.collider = this.node.getComponent(Collider);
    }

    update(deltaTime: number) {
        switch (this.currState) {
            case StateDefine.Run:
                // rigidbody -> set velocity
                // transform -> set position
                this.doRotate();
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
        if (this.currState == destState)
            return;

        if (this.currState == StateDefine.Die) 
            return;

        if (this.currState == StateDefine.Hit) {
            if (destState == StateDefine.Die || destState == StateDefine.Hit)
                return;
        }

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

}

