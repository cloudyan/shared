// 类型判断
export const isString = (val: unknown): val is string => typeof val === 'string';
export const isNumber = (val: unknown): val is number => typeof val === 'number';
export const isBoolean = (val: unknown): val is boolean => typeof val === 'boolean';
export const isObject = (val: unknown): val is object => val !== null && typeof val === 'object';
export const isArray = Array.isArray;
export const isFunction = (val: unknown): val is Function => typeof val === 'function';

// 数据处理
export const deepClone = <T extends Record<string, any>>(obj: T): T => {
  if (!isObject(obj)) return obj;
  const clone: Record<string, any> = Array.isArray(obj) ? [] : {};
  Object.keys(obj).forEach(key => {
    clone[key] = deepClone(obj[key]);
  });
  return clone as T;
};

// 通用工具
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type AnyFunction = (...args: any[]) => any;

export const debounce = <T extends AnyFunction>(fn: T, wait: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
};
