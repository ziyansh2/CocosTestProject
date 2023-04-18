import { director, instantiate, Node, ParticleSystem, Prefab, resources, Vec3 } from "cc";
import { Pools } from "../util/Pools";

export class EffectManager {

    private static _instance: EffectManager;

    static get instance(): EffectManager{
        if (this._instance == null)
            this._instance = new EffectManager();

        return this._instance;
    }

    pools: Pools<string, Node> = new Pools();
    root: Node = null;

    init(onComplete: () => void) {
        this.root = director.getScene().getChildByName("EffectRoot");

        resources.loadDir('effect/prefab', Prefab, (err: Error, prefabs: Prefab[]) => {

            for (let prefab of prefabs) {
                this.pools.newPool(prefab.name, (): Node => {
                    let node = instantiate(prefab);
                    this.root.addChild(node);
                    node.active = false;
                    return node;
                }, 10, (node: Node) => {
                    node.removeFromParent();
                });
            }

            onComplete();
        })
    }

    destory() {
        this.pools.destroyAll();
    }

    play(key: string, position: Vec3) {
        let node = this.pools.allocc(key);
        node.worldPosition = position;
        node.active = true;

        let particleSystem = node.getComponent(ParticleSystem);
        particleSystem.play();

        particleSystem.schedule(() => {
            this.pools.free(key, node);
            node.active = false;
        }, particleSystem.duration)
    }

}