export interface AnyObject extends Object {
  [key: string]: any;
}

export interface Type<T> extends Function {
  new (...args: any[]): T;
}
