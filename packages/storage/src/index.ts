import { ENV } from '@shared/env';

// 添加小程序类型声明
declare const wx: {
  getStorage: (options: {
    key: string;
    success: (res: { data: any }) => void;
    fail: (error: any) => void;
  }) => void;
  setStorage: (options: {
    key: string;
    data: any;
    success?: () => void;
    fail?: (error: any) => void;
  }) => void;
  removeStorage: (options: {
    key: string;
    success?: () => void;
    fail?: (error: any) => void;
  }) => void;
  clearStorage: (options?: {
    success?: () => void;
    fail?: (error: any) => void;
  }) => void;
};

interface Storage {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

// Web 存储
class WebStorage implements Storage {
  async get(key: string) {
    return JSON.parse(localStorage.getItem(key) || 'null');
  }
  async set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  async remove(key: string) {
    localStorage.removeItem(key);
  }
  async clear() {
    localStorage.clear();
  }
}

// 小程序存储
class MiniStorage implements Storage {
  async get(key: string) {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key,
        success: res => resolve(res.data),
        fail: reject
      });
    });
  }

  async set(key: string, value: any) {
    return new Promise<void>((resolve, reject) => {
      wx.setStorage({
        key,
        data: value,
        success: () => resolve(),
        fail: reject
      });
    });
  }

  async remove(key: string) {
    return new Promise<void>((resolve, reject) => {
      wx.removeStorage({
        key,
        success: () => resolve(),
        fail: reject
      });
    });
  }

  async clear() {
    return new Promise<void>((resolve, reject) => {
      wx.clearStorage({
        success: () => resolve(),
        fail: reject
      });
    });
  }
}

// 工厂函数
export const createStorage = (): Storage => {
  if (ENV.isWeapp) return new MiniStorage();
  return new WebStorage();
};
