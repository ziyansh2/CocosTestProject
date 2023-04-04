import { _decorator, Component, Node, SkeletalAnimation, RigidBody, Collider } from 'cc';
import { StateDefine } from './StateDefine';
const { ccclass, property } = _decorator;

@ccclass('Acotor')
export class Acotor extends Component {

    currState: StateDefine = StateDefine.Idle;
    rigidbody: RigidBody = null;
    collider: Collider = null;

    @property(SkeletalAnimation)
    skeletalAnimation: SkeletalAnimation = null;

    start() {
        this.rigidbody = this.node.getComponent(RigidBody);
        this.collider = this.node.getComponent(Collider);
    }

    update(deltaTime: number) {
        switch (this.currState) {
            case StateDefine.Run:
                // rigidbody -> set velocity
                // transform -> set position
                break;
        }
    }

    changeState(destState: StateDefine) {
        if (this.currState == StateDefine.Die) 
            return;

        if (this.currState == StateDefine.Hit) {
            if (destState == StateDefine.Die || destState == StateDefine.Hit)
                return;
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

