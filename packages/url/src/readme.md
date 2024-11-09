# url

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
