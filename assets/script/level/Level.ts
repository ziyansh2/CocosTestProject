import { _decorator, Component, Node, BoxCollider, Vec3, v3, macro, randomRange, RigidBody} from 'cc';
import { Actor } from '../actor/Actor';
import { ActorManager } from './ActorManager';
const { ccclass, property } = _decorator;

@ccclass('Level')
export class Level extends Component {

    @property(BoxCollider)
    spawnCollider: BoxCollider = null;

    spawnPos: Vec3 = v3();
    baseHp: number = 100;
    count: number = 10;

    start() {
        //1. load resource
        ActorManager.instance.init(() => {
            //2. logic of level (spawn enemies, paremeters)
            this.schedule(() => {
                for (let i = 0; i < this.count; i++) {
                    this.randomSpawn();
                }
            }, 10, macro.REPEAT_FOREVER, 1.0);

            this.schedule(() => {
                this.baseHp *= 1.2;
            }, 20, macro.REPEAT_FOREVER, 1.0);
        });
    }

    randomSpawn() {
        this.spawnPos.x = randomRange(
            -this.spawnCollider.size.x,
            this.spawnCollider.size.x);
        this.spawnPos.z = randomRange(
            -this.spawnCollider.size.z,
            this.spawnCollider.size.z);

        this.doSpawn(this.spawnPos);
    }

    doSpawn(spawnPoint: Vec3) {
        let node = ActorManager.instance.createEnemy();
        node.worldPosition = spawnPoint;

        let actor = node.getComponent(Actor);
        actor.actorProperty.maxHp = this.baseHp;
        actor.actorProperty.hp = this.baseHp;

        let scale = randomRange(1.0, 2.0);
        node.setWorldScale(scale, scale, scale);

        let rigidbody = node.getComponent(RigidBody);
        rigidbody.mass = scale;
    }

}

