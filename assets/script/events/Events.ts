import { Event } from "cc";

export enum Events {
    OnDie = 'onDie',
    OnHurt = 'onHurt',
    OnKill = 'onKill',
    OnPlayerUpgrade = 'onPlayerUpgrad',
    OnExpGain = 'onExpGain',
    OnProjectileDead = 'onProjectileDead'
}

export class CustomEventData extends Event {
    static TYPE: string;


}