import { Event } from "cc";

export enum Events {
    OnDie = 'onDie',

}

export class CustomEventData extends Event {
    static TYPE: string;


}