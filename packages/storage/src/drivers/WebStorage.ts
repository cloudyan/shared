import { StorageItem } from '../index';

export class WebStorage {
  async get(key: string): Promise<StorageItem | null> {
    const item = JSON.parse(localStorage.getItem(key) || 'null');
    if (item && (item.expiresAt === undefined || item.expiresAt > Date.now())) {
      return item; // 返回未过期的存储项
    }
    return null; // 返回 null 表示存储项不存在或已过期
  }

  async set(item: StorageItem): Promise<void> {
    if (item.sizeLimit && JSON.stringify(item.value).length > item.sizeLimit) {
      throw new Error(`Storage item exceeds size limit of ${item.sizeLimit} bytes.`);
    }
    localStorage.setItem(item.key, JSON.stringify(item)); // 设置存储项
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(key); // 移除存储项
  }

  async clear(): Promise<void> {
    localStorage.clear(); // 清空存储
  }
}
