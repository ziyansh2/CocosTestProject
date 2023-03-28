import { EventTarget, math } from "cc";
import { PlayerPreference } from "./PlayerPreference";

const BGM_VOLUME_KEY = 'bgmVolume';
const BGM_SFX_KEY = 'sfxVolume';

export class Setting extends EventTarget {

    private static _instance: Setting = null;
    static get instance(): Setting {
        if (this._instance == null)
            this._instance = new Setting();

        return this._instance;
    }


    private _bgmVolume: number = 1.0;
    private _sfxVolume: number = 1.0;

    set bgmVolume(value: number) {
        this._bgmVolume = math.clamp01(value);
        PlayerPreference.setFloat(BGM_VOLUME_KEY, value);

        //Send event
        this.emit('onBgmVolumeChanged', this._bgmVolume);
    }

    get bgmVolume(): number {
        return this._bgmVolume;
    }

    set sfxVolume(value: number) {
        this._sfxVolume = math.clamp01(value);
        PlayerPreference.setFloat(BGM_SFX_KEY, value);

        //Send event
        this.emit('onSfxVolumeChanged', this._sfxVolume);
    }

    get sfxVolume(): number {
        return this._sfxVolume;
    }

    load() {
        this._bgmVolume = PlayerPreference.getFloat(BGM_VOLUME_KEY);
        this._sfxVolume = PlayerPreference.getFloat(BGM_SFX_KEY);
    }

}