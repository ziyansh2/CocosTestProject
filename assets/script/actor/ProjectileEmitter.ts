import { _decorator, Component, Node, Prefab, Pool, director, instantiate } from 'cc';
import { Events } from '../events/Events';
import { Projectile } from './Projectile';
const { ccclass, property } = _decorator;

@ccclass('ProjectileEmitter')
export class ProjectileEmitter extends Component {

    @property(Prefab)
    arrowPrefab: Prefab = null;

    pool: Pool<Node> = null;
    root: Node = null;

    start() {
        this.root = director.getScene().getChildByName("ProjectileRoot");

        this.pool = new Pool(
            () => {
                let node = instantiate(this.arrowPrefab);
                node.active = false;
                this.root.addChild(node);
                return node;
            }, 5, (node: Node) => {
                node.removeFromParent();
            }
        );
    }

    onDestroy() {
        if(this.pool != null)
            this.pool.destroy();
    }

    create(): Projectile {
        let node = this.pool.alloc();
        if (node.parent == null) {
            director.getScene().addChild(node);
        }

        let projectile = node.getComponent(Projectile);
        node.once(Events.OnProjectileDead, this.onProjectileDead, this);
        node.active = true;

        return projectile;
    }

    onProjectileDead(projectile: Projectile) {
        projectile.host = null;
        projectile.node.active = false;
        this.pool.free(projectile.node);
    }

}

