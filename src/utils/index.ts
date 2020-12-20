const objectTag = "[object Object]";
const arrayTag = "[object Array]";
const stringTag = "[object String]";
const numberTag = "[object Number]";
const undefinedTag = "[object Undefined]";
const nullTag = "[object Null]";

function dataTag(data: any): string {
  return Object.prototype.toString.call(data);
}

export function toArray<T>(iterable: Iterable<T> | ArrayLike<T>): T[] {
  if (!iterable) return [];
  if (Array.from) {
    return Array.from<T>(iterable);
  } else {
    return Array.prototype.slice.call(iterable) as T[];
  }
}

/**
 * 查找[key]的值，如果不存在，请添加一个新值
 *
 * 返回与[key]关联的值（如果有）。 否则，调用[ifAbsent]获取新值，将[key]关联到该值，然后返回新值。
 *
 * @param cache
 * @param key
 * @param ifAbsent
 */
export function putIfAbsent<K, V>(
  cache: Map<K, V>,
  key: K,
  ifAbsent?: () => V
) {
  if (cache.has(key)) return cache.get(key) as V;

  if (key && ifAbsent) {
    return cache.set(key, ifAbsent()).get(key) as V;
  }
  throw `putIfAbsent: not find [${key}]!`;
}

export function numberp(data: any) {
  return (
    typeof data === "number" &&
    dataTag(data) === numberTag &&
    Number.isFinite(data) &&
    data < Number.MAX_VALUE &&
    data > Number.MIN_VALUE
  );
}

export function objectp(data: any): boolean {
  return dataTag(data) === objectTag;
}

export function arrayp(data: any): data is any[] {
  return Array.isArray ? Array.isArray(data) : dataTag(data) === arrayTag;
}

export function nullp(data: any): data is null {
  return dataTag(data) === nullTag;
}

export function undefinedp(data: any): data is undefined {
  return data === undefined || dataTag(data) === undefinedTag;
}

export function elementNodep(node: any): node is HTMLElement {
  if (!node.nodeType) return false;
  return node.nodeType === Node.ELEMENT_NODE;
}

// 模板节点 template
export function fragmentNodep(
  node: ChildNode | HTMLElement
): node is HTMLFrameElement {
  return node.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
}

export function textNodep(node: ChildNode | HTMLElement): boolean {
  return node.nodeType === Node.TEXT_NODE;
}
/**
 * * <template> 模板节点
 * @param node
 */
export function templatep(node: HTMLElement): node is HTMLTemplateElement {
  return node.nodeName === "TEMPLATE";
}

export function inputp(node: Node): node is HTMLInputElement {
  return node.nodeName === "INPUT";
}
export function textareap(node: Node): node is HTMLTextAreaElement {
  return node.nodeName === "TEXTAREA";
}

export function selectp(node: Node): node is HTMLSelectElement {
  return node.nodeName === "SELECT";
}

export function checkboxp(node: Node): node is HTMLInputElement {
  return inputp(node) && node.type === "checkbox";
}

export function radiop(node: Node): node is HTMLInputElement {
  return inputp(node) && node.type === "radio";
}

export function formp(node: Node): node is HTMLFormElement {
  return node.nodeName === "FORM";
}
