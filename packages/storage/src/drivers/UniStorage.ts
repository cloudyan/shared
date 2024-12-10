import { StorageItem } from '../index';

declare const uni: {
  getStorage: (options: { key: string; success: (res: { data: any }) => void; fail: (error: any) => void; }) => void;
  setStorage: (options: { key: string; data: any; success?: () => void; fail?: (error: any) => void; }) => void;
  removeStorage: (options: { key: string; success?: () => void; fail?: (error: any) => void; }) => void;
  clearStorage: (options?: { success?: () => void; fail?: (error: any) => void; }) => void;
};

export class UniStorage {
  async get(key: string): Promise<StorageItem | null> {
    return new Promise((resolve, reject) => {
      uni.getStorage({
        key,
        success: res => {
          const item = res.data;
          if (item && (item.expiresAt === undefined || item.expiresAt > Date.now())) {
            resolve(item); // 返回未过期的存储项
          } else {
            resolve(null); // 返回 null 表示存储项不存在或已过期
          }
        },
        fail: reject // 处理错误
      });
    });
  }

  async set(item: StorageItem): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (item.sizeLimit && JSON.stringify(item.value).length > item.sizeLimit) {
        reject(new Error(`Storage item exceeds size limit of ${item.sizeLimit} bytes.`));
        return;
      }
      uni.setStorage({
        key: item.key,
        data: item,
        success: () => resolve(), // 成功设置存储项
        fail: reject // 处理错误
      });
    });
  }

  async remove(key: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      uni.removeStorage({
        key,
        success: () => resolve(), // 成功移除存储项
        fail: reject // 处理错误
      });
    });
  }

  async clear(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      uni.clearStorage({
        success: () => resolve(), // 成功清空存储
        fail: reject // 处理错误
      });
    });
  }
}
