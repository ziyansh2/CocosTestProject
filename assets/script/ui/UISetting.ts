import { _decorator, Component, Node, Slider, ProgressBar } from 'cc';
import { Setting } from '../config/Setting';
const { ccclass, property } = _decorator;

@ccclass('UISetting')
export class UISetting extends Component {

    sliderBgmVolume: Slider = null;
    progressbarBgmVolume: ProgressBar = null;

    sliderSfxVolume: Slider = null;
    progressbarSfxVolume: ProgressBar = null;

    start() {
        this.sliderBgmVolume = this.node.getChildByName('Bgm').getComponent(Slider);
        this.progressbarBgmVolume = this.node.getChildByPath('Bgm/ProgressBar').getComponent(ProgressBar);
        this.sliderBgmVolume.node.on('slide', this.onBgmVolumeChanged, this);


        this.sliderSfxVolume = this.node.getChildByName('Sfx').getComponent(Slider);
        this.progressbarSfxVolume = this.node.getChildByPath('Sfx/ProgressBar').getComponent(ProgressBar);
        this.sliderSfxVolume.node.on('slide', this.onSfxVolumeChanged, this);
    }

    update(deltaTime: number) {
        
    }

    onBgmVolumeChanged(value: Slider) {
        this.progressbarBgmVolume.progress = value.progress;
        Setting.instance.bgmVolume = value.progress;
    }

    onSfxVolumeChanged(value: Slider) {
        this.progressbarSfxVolume.progress = value.progress;
        Setting.instance.sfxVolume = value.progress;
    }

}

