# @deepjs/url

[![NPM version](https://img.shields.io/npm/v/@deepjs/url.svg?style=flat)](https://npmjs.com/package/@deepjs/url)
[![NPM downloads](http://img.shields.io/npm/dm/@deepjs/url.svg?style=flat)](https://npmjs.com/package/@deepjs/url)

## Design

提供跨平台的 URL 功能，针对任意的字符串进行解析，映射为 url 对象

提取 路径、query 参数，以及附加合并 query 参数等

```js
// URL 对象
// protocol: "https:"
// hostname: "baidu.com"
// port: "3000"
// pathname: "/aaa/bbb"
// search: "?id=123"
// hash: "#top"
// href: "https://baidu.com:3000/aaa/bbb?id=123#top"
// host: "baidu.com:3000"
// origin: "https://baidu.com:3000"
// password: ""

// groups
// schema: "https"
// hostname: "baidu.com"
// port: "3000"
// pathname: "/aaa/bbb"
// search: "id=123"
// hash: "top"

```

## Options

TODO

## LICENSE

MIT
