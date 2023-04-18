﻿import { _decorator, Pool } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Pools')
export class Pools<TKey, TValue> {

    pools: Map<TKey, Pool<TValue>> = new Map();

    pool(key: TKey): Pool<TValue> {
        return this.pools.get(key)!;
    }

    newPool(key: TKey, ctor: () => TValue, elementsPerBatch: number, dtor?: (obj: TValue) => void) {
        let pool = new Pool<TValue>(ctor, elementsPerBatch, dtor);
        this.pools.set(key, pool);
    }

    free(key: TKey, node: TValue){
        this.pool(key).free(node);
    }

    allocc(key: TKey): TValue {
        return this.pool(key).alloc();
    }

    destroy(key: TKey) {
        this.pool(key).destroy();
    }

    destroyAll() {
        for (let pool of this.pools.values()) {
            pool.destroy();
        }

        this.pools.clear();
    }
}

