export class ActorProperty {

    projectileCount: number = 1;

    penetration: number = 0;

    chaseRate: number = 0;

    maxHp: number = 100;

    hp: number = this.maxHp;

    attack: number = 10;

    maxExp: number = 100;

    exp: number = 0;

    level: number = 1;

}

export enum Career {
    Melee,
    Range,
}

