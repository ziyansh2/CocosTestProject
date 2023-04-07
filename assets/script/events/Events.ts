import { Event } from "cc";

export enum Events {
    OnDie = 'onDie',
    OnProjectileDead = 'onProjectileDead'
}

export class CustomEventData extends Event {
    static TYPE: string;


}