import { _decorator, Component, Node, Layout, Prefab, resources, instantiate, Sprite, SpriteFrame, Pool } from 'cc';
const { ccclass, property, requireComponent } = _decorator;

const replace = new Map();
replace.set('/', 'Slash');

@ccclass('UIImageLabel')
@requireComponent(Layout)
export class UIImageLabel extends Component {

    @property(Prefab)
    numberPrefab: Prefab = null;

    numberPool: Pool<Node> = null;

    private _string: string = '';
    get string(): string {
        return this._string;
    }
    set string(value: string) {
        if (this._string == value)
            return;

        this._string = value;
        this.resetString();
    }

    start() {
        this.numberPool = new Pool((): Node => {
            let node = instantiate(this.numberPrefab);
            this.node.addChild(node);
            node.active = false;
            return node;
        }, 5, (node: Node) => {
            node.removeFromParent();
        });

        this.string = "/123+";
    }

    onDestroy() {
        this.numberPool.destroy();
    }

    update(deltaTime: number) {
        
    }

    resetString() {
        this.clearString();

        let dir = 'ui/number/';
        resources.loadDir(dir, () => {
            for (let i = 0; i < this.string.length; i++) {
                const char = this.string[i];

                let str = char.toString();
                if (replace.has(str)) {
                    str = replace.get(str);
                }

                let path = dir + str + '/spriteFrame';
                let spriteFrame = resources.get(path, SpriteFrame);

                const spriteNode = this.numberPool.alloc();
                let sprite = spriteNode.getComponent(Sprite);
                sprite.spriteFrame = spriteFrame;
                spriteNode.setSiblingIndex(i);
                spriteNode.active = true;
            }
        });
    }


    clearString() {
        for (let child of this.node.children) {
            this.numberPool.free(child);
            child.active = false;
        }
    }

}

