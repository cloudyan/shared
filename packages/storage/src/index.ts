import { WebStorage } from "./drivers/WebStorage";

/**
 * 存储模块接口
 * 提供统一的存储 API，支持 Web 和小程序环境
 */

// 存储项接口
export interface StorageItem {
  key: string; // 存储项的键名
  value: any; // 存储项的值
  expiresAt?: number; // 可选的过期时间戳
  sizeLimit?: number; // 可选的大小限制
}

// 存储模块接口
export interface Storage {
  get(key: string): Promise<StorageItem | null>; // 获取存储项
  set(item: StorageItem): Promise<void>; // 设置存储项
  remove(key: string): Promise<void>; // 移除存储项
  clear(): Promise<void>; // 清空存储
}

// 配置接口
export interface StorageConfig {
  type: 'web' | 'mini' | 'taro' | 'uni'; // 存储类型
  customStorage?: Storage; // 可选的自定义存储实现
}

// 工厂函数
export class CreateStorage {
  private storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage; // 通过构造函数注入存储实现
  }

  async get(key: string) {
    await this.storage.get(key);
  }

  async set(item: StorageItem) {
    await this.storage.set(item);
  }

  async remove(key: string) {
    return await this.storage.remove(key);
  }

  async clear() {
    return await this.storage.clear();
  }
}

const storage = new CreateStorage(new WebStorage());

async function demo() {
  const item: StorageItem = {
    key: 'key',
    value: 'value',
    expiresAt: Date.now() + 1000 * 60 * 5, // 5分钟后过期
    sizeLimit: 1024 // 限制大小为1024字节
  };
  await storage.set(item); // 设置存储项
  const value = await storage.get('key'); // 获取存储项
  console.log(value); // 输出存储项
  await storage.remove('key'); // 移除存储项
  await storage.clear(); // 清空所有存储项
}

// 调用示例
demo();
