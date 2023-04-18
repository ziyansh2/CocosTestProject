import { AudioSource, director, instantiate, Prefab, resources, Node, AudioClip } from "cc";
import { Setting } from "../config/Setting";
import { ResourceDefine } from "../resource/ResourceDefine";

export class AudioManager {

    private static _instance: AudioManager;

    static get instance(): AudioManager {
        if (this._instance == null)
            this._instance = new AudioManager();

        return this._instance;
    }

    bgm: AudioSource = null;
    sfx: AudioSource = null;

    shootClip: AudioClip = null;
    hitClip: AudioClip = null;

    root: Node = null;

    init() {
        this.root = director.getScene().getChildByName('SoundRoot');

        resources.load(ResourceDefine.Bgm, Prefab, (err: Error, prefab: Prefab) => {
            let node = instantiate(prefab);
            this.root.addChild(node);
            this.bgm = node.getComponent(AudioSource);
            this.bgm.volume = Setting.instance.bgmVolume;
        });

        resources.load(ResourceDefine.Sfx, Prefab, (err: Error, prefab: Prefab) => {
            let node = instantiate(prefab);
            this.root.addChild(node);
            this.sfx = node.getComponent(AudioSource);
        });

        resources.load(ResourceDefine.HitClip, AudioClip, (err: Error, clip: AudioClip) => {
            this.hitClip = clip;
        });
        resources.load(ResourceDefine.ShootClip, AudioClip, (err: Error, clip: AudioClip) => {
            this.shootClip = clip;
        });
    }

    destroy() {

    }

    playSfx(clip: AudioClip) {
        this.sfx.volume = Setting.instance.sfxVolume;
        this.sfx.playOneShot(clip);
    }

    playHitSfx() {
        this.playSfx(this.hitClip);
    }

    playShootSfx() {
        this.playSfx(this.shootClip);
    }

}