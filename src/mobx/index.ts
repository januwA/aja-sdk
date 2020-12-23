import { AnyObject } from "~src/interfaces";

let _subscriber: any;

export function autorun(subscriber: Function) {
  _subscriber = subscriber;
  _subscriber();
  _subscriber = null;
}

/**
 * 每个属性，每个元素都是一个发布者
 */
class Observer {
  private _list: Function[] = []; // 订阅者

  private get _last() {
    if (!this._list.length) return null;
    return this._list[this._list.length - 1];
  }

  // 添加订阅者
  add() {
    if (this._last !== _subscriber && _subscriber) {
      this._list.push(_subscriber);
    }
  }

  // 属性更改后，通知订阅者
  publish() {
    this._list.forEach((it) => it());
  }
}

export interface Iobservable {
  (value: AnyObject): AnyObject;
  value(value: string | number | null): { value: any };
}

/**
 *
 * ```ts
 * const proxy = observable({ name: "ajanuw" });
 * autorun(() => {
 *   console.log(proxy.name);
 * });
 * proxy.name = "Ajanuw";
 * ```
 * @param data
 */
export const observable: Iobservable = function observable(data: AnyObject) {
  const o: Map<string, Observer> = new Map();

  for (const key in data) {
    const value = data[key];
    // 递归代理{}和[]
    if (typeof value === "object" && value !== null) {
      data[key] = observable(value);
    }
    o.set(key, new Observer());
  }

  /**
   * 递归获取
   * @param target
   * @param key
   */
  function getOwnPropertyDescriptor(
    target: AnyObject,
    key: any
  ): PropertyDescriptor | undefined {
    if (!(key in target)) return;
    const des = Object.getOwnPropertyDescriptor(target, key);
    if (des) return des;
    return getOwnPropertyDescriptor(Object.getPrototypeOf(target), key);
  }

  const proxy: AnyObject = new Proxy(data, {
    get(target: AnyObject, key: string) {
      // 访问时添加订阅者
      if (_subscriber) o.get(key)?.add();

      // 绑定函数this
      const des = getOwnPropertyDescriptor(target, key);

      if (des?.value && typeof des.value === "function") {
        return des.value.bind(proxy);
      }

      if (des?.get) {
        return des.get.call(proxy);
      }

      return target[key];
    },

    set(target: AnyObject, key: string, value: any) {
      if (value === target[key]) return false;

      const des = getOwnPropertyDescriptor(target, key);
      if (des?.set) {
        des.set.call(proxy, value);
      } else {
        target[key] = value;
      }

      // 值改变后通知所有订阅者
      o.get(key)?.publish();
      return true;
    },
  });

  return proxy;
};

observable.value = function value<T>(value: T) {
  return observable({ value: value }) as { value: T };
};

/**
 * 将所有enumerable=false的属性，转为true
 * @param cls 
 */
export function class2Object(cls: AnyObject): AnyObject {
  const r: AnyObject = {};
  const proto = Object.getPrototypeOf(cls);
  for (const key in cls) r[key] = cls[key];

  const propDes = Object.getOwnPropertyDescriptors(proto);
  for (const key in propDes) {
    const des = propDes[key];
    if (des?.value) {
      Object.defineProperty(r, key, {
        value: des.value,
        enumerable: true,
        configurable: true,
        writable: true,
      });
    }
    if (des?.get) {
      Object.defineProperty(r, key, {
        get: des.get,
        enumerable: true,
        configurable: true,
      });
    }
    if (des?.set) {
      Object.defineProperty(r, key, {
        set: des.set,
        enumerable: true,
        configurable: true,
      });
    }
  }

  Object.setPrototypeOf(r, proto);
  return r;
}

export function extendObservable(
  proxy: AnyObject,
  obj: AnyObject,
  isClass: boolean = false
): AnyObject {
  if (isClass) obj = class2Object(obj);

  // 只能映射enumerable=true的属性
  for (const key in obj) {
    const des = Object.getOwnPropertyDescriptor(obj, key);
    if (des?.value) {
      proxy[key] = des.value;
    }

    if (des?.get) {
      Object.defineProperty(proxy, key, {
        get: des.get,
      });
    }

    if (des?.set) {
      Object.defineProperty(proxy, key, {
        set: des.set,
      });
    }
  }
  return proxy;
}
