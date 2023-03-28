import { _decorator, Component, Node, CCFloat, input, Input, EventTouch, v3, Vec3, math } from 'cc';
import { VirtualInput } from '../input/VirtualInput';
const { ccclass, property } = _decorator;

@ccclass('UIJoystick')
export class UIJoystick extends Component {

    @property(Node)
    stickBg: Node = null;

    @property(Node)
    thumbnail: Node = null;

    @property({ type: CCFloat} )
    radius: number = 0;

    initPostion: Vec3 = v3();

    start() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchRelease, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchRelease, this);

        this.initPostion = this.stickBg.getWorldPosition();
    }


    update(deltaTime: number) {
        
    }


    onTouchStart(eventTouch: EventTouch) {
        let x = eventTouch.touch.getUILocationX();
        let y = eventTouch.touch.getUILocationY();

        this.stickBg.setWorldPosition(x, y, 0);
    }


    onTouchMove(eventTouch: EventTouch) {
        let x = eventTouch.touch.getUILocationX();
        let y = eventTouch.touch.getUILocationY();

        let worldPostion = v3(x, y, 0);
        let localPosition = v3();

        this.stickBg.inverseTransformPoint(localPosition, worldPostion);
        let len = localPosition.length();
        localPosition.normalize();

        localPosition.multiplyScalar(math.clamp(len, 0, this.radius));

        this.thumbnail.setPosition(localPosition);

        VirtualInput.horizontal = this.thumbnail.position.x / this.radius;
        VirtualInput.vertical = this.thumbnail.position.y / this.radius;
    }


    onTouchRelease() {
        this.stickBg.setWorldPosition(this.initPostion);
        this.thumbnail.setPosition(Vec3.ZERO);

        VirtualInput.horizontal = 0;
        VirtualInput.vertical = 0;
    }

}

