import { AnyObject, Type } from "~src/interfaces";

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

  // 通知订阅者
  publish() {
    this._list.forEach((it) => it());
  }
}

export interface Iobservable {
  (value: AnyObject): AnyObject;

  value(value: string | number | null): { value: any };

  cls<T extends AnyObject>(cls: Type<T>, create?: (cls: Type<T>) => T): T;
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

  const proxy = new Proxy(data, {
    // 访问时添加订阅者
    get(target: AnyObject, key: string) {
      if (_subscriber) o.get(key)?.add();
      return target[key];
    },

    // 改变时通知所有订阅者
    set(target: AnyObject, key: string, value: any) {
      if (value === target[key]) return false;
      target[key] = value;
      o.get(key)?.publish();
      return true;
    },
  });

  for (const key in data) {
    const des = Object.getOwnPropertyDescriptor(data, key);

    if (des?.value && typeof des.value === "function") {
      data[key] = des.value.bind(proxy);
    }

    // 绑定getter的this
    if (des?.get) {
      Object.defineProperty(proxy, key, {
        get: des.get?.bind(proxy),
        configurable: des.configurable,
        enumerable: des.configurable,
      });
    }

    // 绑定setter的this
    if (des?.set) {
      Object.defineProperty(proxy, key, {
        set: des.set?.bind(proxy),
        configurable: des.configurable,
        enumerable: des.configurable,
      });
    }
  }

  return proxy;
};

observable.value = function value<T>(value: T) {
  return observable({ value: value }) as { value: T };
};

observable.cls = function cls<T>(
  value: Type<T>,
  create?: (cls: Type<T>) => T
): T {
  const context = create ? create(value) : new value();

  const data: AnyObject = {};
  for (const key in context) {
    data[key] = context[key];
  }

  // 获取原型
  const proto = Object.getPrototypeOf(context);

  // 确保 instanceof 不会改变
  Object.setPrototypeOf(data, proto);

  // 获取原型上的属性
  const protoNames = Object.getOwnPropertyNames(proto);

  // 将原型上的属性全部拷贝到data上去
  for (const key of protoNames) {
    const des = Object.getOwnPropertyDescriptor(proto, key);
    if (des?.value) {
      data[key] = des.value;
    }

    if (des?.get) {
      Object.defineProperty(data, key, {
        get: des.get,
        enumerable: true,
        configurable: true,
      });
    }

    if (des?.set) {
      Object.defineProperty(data, key, {
        set: des.set,
        enumerable: true,
        configurable: true,
      });
    }
  }

  return observable(data) as T;
};
