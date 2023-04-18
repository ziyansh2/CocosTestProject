import { _decorator, Component, Node, CCFloat, Collider, ICollisionEvent, v3, Vec3, math } from 'cc';
import { Events } from '../events/Events';
import { AudioManager } from '../level/AudioManager';
import { EffectManager } from '../level/EffectManager';
import { ResourceDefine } from '../resource/ResourceDefine';
import { MathUtil } from '../util/MathUtil';
import { ProjectileProperty } from './ProjectileProperty';
const { ccclass, property } = _decorator;

let tempPosition = v3();
let forward = v3();

@ccclass('Projectile')
export class Projectile extends Component {

    @property(CCFloat)
    linearSpeed: number = 3;

    @property(CCFloat)
    angularSpeed: number = 180;

    host: Node = null;

    projectileProperty: ProjectileProperty = new ProjectileProperty();

    collider: Collider = null;

    target: Node = null;

    startTime: number = 0;

    start() {
        this.collider = this.node.getComponent(Collider);
        this.collider.on("onTriggerEnter", this.onTriggerEnter, this);
    }

    onDestroy() {

    }

    update(deltaTime: number) {
        this.startTime += deltaTime;
        if (this.startTime > this.projectileProperty.lifeTime) {
            this.node.emit(Events.OnProjectileDead, this);
            return;
        }

        // move and tracking
        if (this.target != null) {

            Vec3.subtract(tempPosition, this.target.worldPosition, this.node.worldPosition);
            tempPosition.normalize();

            const angle = math.toRadian(this.angularSpeed) * deltaTime;
            MathUtil.rotateToward(forward, this.node.forward, tempPosition, angle);
            this.node.forward = forward;
        }

        // position = currentPosition + speed * time
        Vec3.scaleAndAdd(
            tempPosition,
            this.node.worldPosition,
            this.node.forward, this.linearSpeed * deltaTime);
        this.node.worldPosition = tempPosition;
    }

    onTriggerEnter(event: ICollisionEvent) {
        this.projectileProperty.penetration--;

        if (this.projectileProperty.penetration <= 0) {
            this.node.emit(Events.OnProjectileDead, this);
        }

        EffectManager.instance.play(
            ResourceDefine.EffExplore,
            event.otherCollider.node.worldPosition);

        AudioManager.instance.playHitSfx();
    }

}

