import { _decorator, Component, Node, Prefab, Pool, director, instantiate } from 'cc';
import { Events } from '../events/Events';
import { Projectile } from './Projectile';
const { ccclass, property } = _decorator;

@ccclass('ProjectileEmitter')
export class ProjectileEmitter extends Component {

    @property(Prefab)
    arrowPrefab: Prefab = null;

    pool: Pool<Node> = null;

    start() {
        this.pool = new Pool(
            () => {
                return instantiate(this.arrowPrefab);
            }, 5, (node: Node) => {
                node.removeFromParent();
            }
        );

    }

    onDestroy() {
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
        projectile.node.active = false;
        this.pool.free(projectile.node);
    }

}

