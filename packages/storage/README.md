# 存储模块

## 概述

存储模块提供统一的跨端存储 API，支持 Web 和小程序环境。通过该模块，开发者可以方便地进行数据的存储、获取、删除和清空操作。

## 安装

```bash
npm install @shared/storage
```

## API 参考

### `createStorage()`

工厂函数，用于创建存储实例。

#### 返回值

- `Storage` 实例：根据当前环境返回 WebStorage 或 MiniStorage 实现。

### `Storage` 接口

#### `get(key: string): Promise<any>`

获取存储项。

- **参数**:
  - `key`: 存储项的键名。
- **返回**: 存储项的值。

#### `set(key: string, value: any): Promise<void>`

设置存储项。

- **参数**:
  - `key`: 存储项的键名。
  - `value`: 存储项的值。
- **返回**: 无。

#### `remove(key: string): Promise<void>`

移除存储项。

- **参数**:
  - `key`: 存储项的键名。
- **返回**: 无。

#### `clear(): Promise<void>`

清空所有存储项。

- **返回**: 无。

## 使用示例

```typescript
import { createStorage } from '@shared/storage';

const storage = createStorage();

async function demo() {
  await storage.set('key', 'value'); // 设置存储项
  const value = await storage.get('key'); // 获取存储项
  console.log(value); // 输出存储项
  await storage.remove('key'); // 移除存储项
  await storage.clear(); // 清空所有存储项
}

demo();
```
