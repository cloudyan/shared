# URL 解析模块

## 设计目标

1. 跨端兼容
   - 支持浏览器环境
   - 支持 Node.js 环境
   - 支持小程序环境

2. 功能完整
   - 支持标准 URL 解析
   - 支持相对路径解析
   - 支持查询参数处理
   - 支持 URL 拼接和修改

3. 健壮性
   - 完善的错误处理
   - 边界情况处理
   - 安全性考虑

## 模块划分

### 1. types.ts - 类型定义
```typescript
// URL 查询参数类型
interface UrlQuery {
  [key: string]: string | number | boolean | object | null;
}

// URL 解析结果类型
interface ParsedUrl {
  schema: string;    // 协议
  hostname: string;  // 主机名
  port: string;      // 端口
  pathname: string;  // 路径
  search: string;    // 查询字符串
  hash: string;      // 哈希值
  query: UrlQuery;   // 解析后的查询参数
  queryStr: string;  // 格式化的查询字符串
  fullUrl: string;   // 完整 URL
  originUrl: string; // 原始 URL
}
```

### 2. utils.ts - 工具函数
```typescript
// URL 正则表达式配置
const URL_REGEX = {
  SCHEMA: '([a-z][a-z0-9+\\-.]*):',
  HOSTNAME: '(\\/\\/([^\\/\\?#:]+)?)?',
  PORT: '(?::(\\d+))?',
  PATHNAME: '((\\/)?[^?#]*)?',
  SEARCH: '(?:\\?([^#]*))?',
  HASH: '(?:#(.*))?'
};

// URL 安全配置
const URL_CONFIG = {
  MAX_LENGTH: 8192,
  INVALID_CHARS: /[\s<>\\{}|^`]/g,
};
```

定义正则表达式的各个部分，不使用命名捕获组，包括

1. 标准网址：https://example.com:8080/path?query=1#hash
2. 相对路径：/path/to/resource?query=1
3. 协议相关 URL：//example.com/path
4. 简单路径：path/to/resource
5. 查询字符串：?key=value
6. 哈希片段：#section1

分别提取出 URL 的各个组成部分，便于后续处理和使用。


```js
// URL 协议部分: 匹配如 http:、https:、ftp: 等
// ([a-z][a-z0-9+\-.]*)  捕获以小写字母开头，后跟字母/数字/+/-/. 的协议名
// : 后面跟着冒号
const schemaPart = '([a-z][a-z0-9+\\-.]*):';

// URL 主机名部分: 匹配如 //example.com、//localhost 等
// \/\/ 匹配双斜杠
// ([^\/\?#:]+)? 可选的主机名，不包含 /?#: 这些特殊字符
const hostnamePart = '(\\/\\/([^\\/\\?#:]+)?)?';

// URL 端口部分: 匹配如 :8080、:3000 等
// (?:...)  非捕获组
// :(\d+)? 可选的端口号，以冒号开头后跟数字
const portPart = '(?::(\\d+))?';

// URL 路径部分: 匹配如 /path/to/resource
// ((\\/)?)  可选的开头斜杠
// [^?#]* 匹配除了 ? 和 # 之外的任意字符
const pathnamePart = '((\\/)?[^?#]*)?';

// URL 查询参数部分: 匹配如 ?key=value&key2=value2
// (?:\?([^#]*))? 可选的查询参数，以 ? 开头，直到 # 之前的所有字符
const searchPart = '(?:\\?([^#]*))?';

// URL 哈希部分: 匹配如 #section1
// (?:#(.*))? 可选的哈希值，以 # 开头的所有字符
const hashPart = '(?:#(.*))?';
```

### 3. index.ts - 核心功能
- parseUrl: URL 解析主函数
- stringify: 查询参数序列化
- urlfix: URL 修复和规范化

## 设计理由

1. **模块拆分原则**
   - types.ts: 集中类型定义，便于维护和复用
   - utils.ts: 抽离工具函数，提高代码复用性
   - index.ts: 聚焦核心逻辑，保持代码清晰

2. **正则表达式设计**
   - 分段设计：便于维护和理解
   - 非捕获组：提高性能
   - 可选匹配：增加灵活性

3. **安全性考虑**
   - URL 长度限制：防止 DoS 攻击
   - 字符过滤：防止 XSS 攻击
   - 错误处理：防止程序崩溃

4. **性能优化**
   - 正则表达式缓存
   - 结果缓存
   - 延迟计算

## 使用示例

```typescript
// 基本用法
const result = parseUrl('https://example.com:8080/path?query=1#hash');

// 添加查询参数
const url = parseUrl('https://example.com', { newParam: 'value' });

// URL 修复
const fixed = urlfix('example.com/path', 'param=value');
```

## 测试用例分类

1. 标准 URL
   - 完整 URL
   - 带端口的 URL
   - 带认证的 URL

2. 相对路径
   - 绝对路径
   - 相对路径
   - 空路径

3. 查询参数
   - 单个参数
   - 多个参数
   - 特殊字符
   - 重复参数

4. 边界情况
   - 空字符串
   - 非法字符
   - 超长 URL
   - 畸形 URL

## 后续优化方向

1. 缓存优化
   - 添加 LRU 缓存
   - 优化缓存策略

2. 功能扩展
   - URL 校验增强
   - 参数编码优化
   - 批量处理支持

3. 性能优化
   - 正则表达式优化
   - 内存使用优化
   - 运行效率提升

