import { Pool, Node, Prefab, resources, instantiate, randomRangeInt, director, Animation, SkeletalAnimationState } from "cc";
import { Actor } from "../actor/Actor";
import { StateDefine } from "../actor/StateDefine";
import { Events } from "../events/Events";

export class ActorManager {

    private static _instance: ActorManager = null;
    static get instance(): ActorManager {
        if (this._instance == null) {
            this._instance = new ActorManager();
        }
        return this._instance;
    }

    playerActor: Actor = null;

    enemies: Array<Node> =[];
    enemyPool: Pool<Node> = null;

    root: Node = null;

    init(onComplete: () => void) {
        this.root = director.getScene().getChildByName("EnemyRoot");

        resources.loadDir("actor/enemy", Prefab, (err: Error, prefabs: Prefab[]) => {
            if (err) {
                throw err;
            }

            this.enemyPool = new Pool<Node>(
                (): Node => {
                    let prefab = prefabs[randomRangeInt(0, prefabs.length)];
                    let node = instantiate(prefab);
                    this.root.addChild(node);
                    node.active = false;
                    return node;
                }, 10 * prefabs.length,
                (node: Node) => {
                    node.removeFromParent();
                }
            )
        })

        onComplete();
    }

    destory() {
        this.enemyPool.destroy();
        this.enemies = [];
    }

    createEnemy(): Node {
        let node = this.enemyPool.alloc();
        node.active = true;
        this.enemies.push(node);
        node.on(Events.OnDie, this.onEnemyDie, this);

        console.log(this.enemies.length);

        return node;
    }

    onEnemyDie(node: Node) {
        const index = this.enemies.indexOf(node);
        this.enemies.splice(index, 1);

        let actor = node.getComponent(Actor);
        actor.skeletalAnimation.on(Animation.EventType.FINISHED,
            (type: Animation.EventType, state: SkeletalAnimationState) => {
                if (state.name == StateDefine.Die) {
                    this.enemyPool.free(node);
                    node.active = false;
                }

                //TODO: die animation
        })
    }

    get randomEnemy() {
        return this.enemies[randomRangeInt(0, this.enemies.length)];
    }

}