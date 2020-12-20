import { autorun, observable } from "../src/mobx";

describe("test observable", () => {
  it("test main", () => {
    const proxy = observable({ name: "ajanuw" });
    let value;
    autorun(() => {
      value = proxy.name;
    });
    proxy.name = "Ajanuw";
    expect(value).toBe(proxy.name);
  });

  it("test object", () => {
    const proxy = observable({ name: { x: "ajanuw" } });
    let value;
    autorun(() => {
      value = proxy.name.x;
    });
    proxy.name.x = "Ajanuw";
    expect(value).toBe(proxy.name.x);
  });

  it("test array 1", () => {
    const proxy = observable({ name: ["ajanuw"] });
    let value;
    autorun(() => {
      value = proxy.name[0];
    });
    proxy.name[0] = "Ajanuw";
    expect(value).toBe(proxy.name[0]);
  });

  it("test array 2", () => {
    const proxy = observable(["ajanuw"]);
    let value;
    autorun(() => {
      value = proxy[0];
    });
    proxy[0] = "Ajanuw";
    expect(value).toBe(proxy[0]);
  });

  it("test fucntion this pointer", () => {
    const proxy = observable({
      name: "ajanuw",
      change: function () {
        this.name = "Ajanuw";
      },
    });
    const change = proxy.change;
    change();
    expect(proxy.name).toBe("Ajanuw");
  });

  it("test setter", () => {
    const proxy = observable({
      name: "ajanuw",
      get message() {
        return "hello " + this.name;
      },
      set message(value) {
        this.name = value;
      },
    });

    let value;
    let count = 0;
    autorun(() => {
      count++;
      value = proxy.name;
    });
    proxy.message = "world";
    expect(proxy.name).toBe(value);
    expect(proxy.message).toBe("hello world");
    expect(count).toBe(2);
  });
});

describe("test observable.value", () => {
  it("test mobx", () => {
    const proxy = observable.value("ajanuw");
    let value;
    autorun(() => {
      value = proxy.value;
    });
    proxy.value = "Ajanuw";
    expect(value).toBe(proxy.value);
  });
});

describe("test observable.cls", () => {
  it("test class", () => {
    class User {
      name: string = "suou";
      change() {
        this.name = "Ajanuw";
      }
    }

    const proxy = observable.cls<User>(User);
    let value;
    autorun(() => {
      value = proxy.name;
    });
    const c = proxy.change;
    c();
    expect(value).toBe("Ajanuw");
  });

  it("test class getter", () => {
    class User {
      name: string = "suou";
      change() {
        expect(this instanceof User).toBe(true);
        this.name = "Ajanuw";
      }
      get message() {
        expect(this instanceof User).toBe(true);
        return "hello " + this.name;
      }
    }

    const proxy = observable.cls<User>(User);
    let value;
    let count = 0;
    autorun(() => {
      count++;
      value = proxy.message;
    });
    const c = proxy.change;
    c();
    expect(value).toBe("hello Ajanuw");
    expect(count).toBe(2);
  });
});

describe("test autorun", () => {
  it("test function", () => {
    const proxy = observable({
      name: "ajanuw",
    });
    function myName() {
      proxy.name = "suou";
      return proxy.name;
    }
    let value;
    autorun(() => {
      value = myName();
    });
    expect(value).toBe("suou");
  });

  it("test function this", () => {
    const proxy = observable({
      name: "ajanuw",
      get myName() {
        return this.name;
      },
    });
    let value;
    autorun(() => {
      value = proxy.myName;
    });
    proxy.name = "suou";
    expect(value).toBe("suou");
  });
});
