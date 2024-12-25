// import { describe, expect, it, test } from 'vitest';
import { parseUrl } from '../src/index';

// const testCases = [
//   // 标准 HTTP(S) URLs
//   'https://baidu.com:3000/aaa/bbb?id=123#top',
//   'http://localhost:3000/abc?id=123',
//   'http://172.16.0.74:3000/abc?userId=123',

//   // 相对路径
//   'baseinfo',
//   'pages/login/index',
//   '/pages/login/index',

//   // 自定义协议
//   'xcx://platformapi?path=%2Fpage%2Findex%3FxdLoginToken%3Dxxx%26fromAppId%3D123',
//   'itms-apps://',
//   'market://',

//   // 查询参数
//   '?a=1&b=2',
//   '/abc?a=1&b=2',
//   '?a=1&b=2#top'
// ]

// examples
const testCases = [
  {
    url: 'https://baidu.com:3000/aaa/bbb?id=123#top',
    expected: {
      originUrl: 'https://baidu.com:3000/aaa/bbb?id=123#top',
      "fullUrl": "https://baidu.com:3000/aaa/bbb?id=123#top",
      "hash": "top",
      "hostname": "baidu.com",
      "pathname": "/aaa/bbb",
      "port": "3000",
      "query": {
        "id": "123",
      },
      "queryStr": "id=123",
      "schema": "https",
      "search": "id=123",
    },
  },
  {
    url: 'http://localhost:3000/abc?id=123',
    expected: {
      originUrl: 'http://localhost:3000/abc?id=123',
      "fullUrl": "http://localhost:3000/abc?id=123",
      "hash": "",
      "hostname": "localhost",
      "pathname": "/abc",
      "port": "3000",
      "query": {
        "id": "123",
      },
      "queryStr": "id=123",
      "schema": "http",
      "search": "id=123",
    },
  },
  {
    url: 'http://172.16.0.74:3000/abc?userId=123',
    expected: {
      originUrl: 'http://172.16.0.74:3000/abc?userId=123',
      "fullUrl": "http://172.16.0.74:3000/abc?userId=123",
      "hash": "",
      "hostname": "172.16.0.74",
      "pathname": "/abc",
      "port": "3000",
      "query": {
        "userId": "123",
      },
      "queryStr": "userId=123",
      "schema": "http",
      "search": "userId=123",
    },
  },
  {
    url: 'baseinfo',
    expected: {
      originUrl: 'baseinfo',
      "fullUrl": "/baseinfo",
      "hash": "",
      "hostname": "",
      "pathname": "baseinfo",
      "port": "",
      "query": {},
      "queryStr": "",
      "schema": "",
      "search": "",
    },
  },
  {
    url: 'pages/login/index',
    expected: {
      originUrl: 'pages/login/index',
      "fullUrl": "/pages/login/index",
      "hash": "",
      "hostname": "",
      "pathname": "pages/login/index",
      "port": "",
      "query": {},
      "queryStr": "",
      "schema": "",
      "search": "",
    },
  },
  {
    url: '/pages/login/index',
    expected: {
      originUrl: '/pages/login/index',
      "fullUrl": "/pages/login/index",
      "hash": "",
      "hostname": "",
      "pathname": "/pages/login/index",
      "port": "",
      "query": {},
      "queryStr": "",
      "schema": "",
      "search": "",
    },
  },
  {
    url: `xcx://platformapi?path=${encodeURIComponent('/page/index?xdLoginToken=xxx&fromAppId=123')}`,
    expected: {
      originUrl: `xcx://platformapi?path=${encodeURIComponent('/page/index?xdLoginToken=xxx&fromAppId=123')}`,
      "fullUrl": `xcx://platformapi?path=${encodeURIComponent('/page/index?xdLoginToken=xxx&fromAppId=123')}`,
      "hash": "",
      "hostname": "platformapi",
      "pathname": "",
      "port": "",
      "query": {
        "path": "/page/index?xdLoginToken=xxx&fromAppId=123",
      },
      "queryStr": "path=%2Fpage%2Findex%3FxdLoginToken%3Dxxx%26fromAppId%3D123",
      "schema": "xcx",
      "search": "path=%2Fpage%2Findex%3FxdLoginToken%3Dxxx%26fromAppId%3D123",
    },
  },
  {
    url: `/page/index?xdLoginToken=xxx&fromAppId=123`,
    expected: {
      "fullUrl": "/page/index?xdLoginToken=xxx&fromAppId=123",
      "hash": "",
      "hostname": "",
      "originUrl": "/page/index?xdLoginToken=xxx&fromAppId=123",
      "pathname": "/page/index",
      "port": "",
      "query": {
        "fromAppId": "123",
        "xdLoginToken": "xxx",
      },
      "queryStr": "xdLoginToken=xxx&fromAppId=123",
      "schema": "",
      "search": "xdLoginToken=xxx&fromAppId=123",
    }
  },
  {
    url: `?a=1&b=2`,
    expected: {
      originUrl: `?a=1&b=2`,
      "fullUrl": "?a=1&b=2",
      "hash": "",
      "hostname": "",
      "pathname": "",
      "port": "",
      "query": {
        a: "1",
        b: "2",
      },
      "queryStr": "a=1&b=2",
      "schema": "",
      "search": "a=1&b=2",
    },
  },
  {
    url: `/abc?a=1&b=2`,
    expected: {
      originUrl: `/abc?a=1&b=2`,
      "fullUrl": "/abc?a=1&b=2",
      "hash": "",
      "hostname": "",
      "pathname": "/abc",
      "port": "",
      "query": {
        a: "1",
        b: "2",
      },
      "queryStr": "a=1&b=2",
      "schema": "",
      "search": "a=1&b=2",
    },
  },
  {
    url: `?a=1&b=2#top`,
    expected: {
      originUrl: `?a=1&b=2#top`,
      "fullUrl": "?a=1&b=2#top",
      "hash": "top",
      "hostname": "",
      "pathname": "",
      "port": "",
      "query": {
        a: "1",
        b: "2",
      },
      "queryStr": "a=1&b=2",
      "schema": "",
      "search": "a=1&b=2",
    },
  },
  {
    url: `itms-apps://`,
    expected: {
      originUrl: `itms-apps://`,
      "fullUrl": "itms-apps://",
      "hash": "",
      "hostname": "",
      "pathname": "",
      "port": "",
      "query": {},
      "queryStr": "",
      "schema": "itms-apps",
      "search": "",
    },
  },
  {
    url: `itms-apps://abc?id=123`,
    expected: {
      originUrl: `itms-apps://abc?id=123`,
      "fullUrl": "itms-apps://abc?id=123",
      "hash": "",
      "hostname": "abc",
      "pathname": "",
      "port": "",
      "query": {
        id: "123",
      },
      "queryStr": "id=123",
      "schema": "itms-apps",
      "search": "id=123",
    },
  },
  {
    url: `market://`,
    expected: {
      originUrl: `market://`,
      "fullUrl": "market://",
      "hash": "",
      "hostname": "",
      "pathname": "",
      "port": "",
      "query": {},
      "queryStr": "",
      "schema": "market",
      "search": "",
    },
  },
  {
    url: `itms-apps://itunes.apple.com/app/id1478276004`,
    expected: {
      originUrl: `itms-apps://itunes.apple.com/app/id1478276004`,
      "fullUrl": "itms-apps://itunes.apple.com/app/id1478276004",
      "hash": "",
      "hostname": "itunes.apple.com",
      "pathname": "/app/id1478276004",
      "port": "",
      "query": {

      },
      "queryStr": "",
      "schema": "itms-apps",
      "search": "",
    },
  },
  {
    url: `market://details?id=com.zaxd.loan`,
    expected: {
      originUrl: `market://details?id=com.zaxd.loan`,
      "fullUrl": "market://details?id=com.zaxd.loan",
      "hash": "",
      "hostname": "details",
      "pathname": "",
      "port": "",
      "query": {
        id: "com.zaxd.loan",
      },
      "queryStr": "id=com.zaxd.loan",
      "schema": "market",
      "search": "id=com.zaxd.loan",
    },
  },
]

describe('parseUrl 解析', () => {
  // 所有测试用例
  console.log('testCases', testCases.map(item => item.url));
  testCases.forEach(({ url, expected }) => {
    it(`正确解析 URL: ${url}`, () => {
      const result = parseUrl(url);
      expect(result).toEqual(expected);
      // expect(result.fullUrl).toEqual(expected.originUrl);
    });
  });
})

describe('URL 解析边界情况', () => {
  test('处理空值', () => {
    expect(() => parseUrl(null as any)).toThrow(TypeError);
    expect(() => parseUrl(undefined as any)).toThrow(TypeError);
    expect(parseUrl('')).toBeTruthy();
  });

  test('处理非法字符', () => {
    expect(() => parseUrl('http://example.com/<script>')).toThrow();
    // expect(() => parseUrl('http://example.com/\n')).toThrow();
  });

  test('处理特殊查询参数', () => {
    const result = parseUrl('http://example.com/?key=value=with=equals');
    expect(result.query.key).toBe('value=with=equals');
  });

  test('处理超长 URL', () => {
    // 8192 字符以内的 URL 应该可以正常解析
    const normalUrl = 'http://example.com/' + 'a'.repeat(8000);
    expect(() => parseUrl(normalUrl)).not.toThrow();

    // 超过 8192 字符的 URL 应该抛出错误
    const longUrl = 'http://example.com/' + 'a'.repeat(8193);
    expect(() => parseUrl(longUrl)).toThrow();
  });

  // IPv6 测试
  // test('解析 IPv6 地址', () => {
  //   const result = parseUrl('http://[2001:db8::1]:8080/path?q=1');
  //   expect(result.hostname).toBe('[2001:db8::1]');
  //   expect(result.port).toBe('8080');
  // });

  // 数组参数测试(暂不支持)
  // test('解析数组类型查询参数', () => {
  //   const result = parseUrl('http://example.com?ids[]=1&ids[]=2');
  //   expect(result.query.ids).toEqual(['1', '2']);
  // });

  // 重复参数测试
  test('处理重复的查询参数', () => {
    const result = parseUrl('http://example.com?key=1&key=2');
    expect(result.query.key).toBe('2'); // 后面的值覆盖前面的
  });

  // URL 编码测试
  test('处理特殊字符编码', () => {
    const result = parseUrl('http://example.com?q=%20%2B%3D');
    expect(result.query.q).toBe(' +=');
  });

  test('允许正常URL字符', () => {
    expect(() => parseUrl('http://example.com/path')).not.toThrow();
    expect(() => parseUrl('https://sub.example.com:8080/path?q=1#hash')).not.toThrow();
  });

  test('拒绝危险字符', () => {
    // 只测试真正的危险字符
    expect(() => parseUrl('http://example.com/<script>')).toThrow();
    expect(() => parseUrl('http://example.com/{}')).toThrow();
  });

  test('允许URL编码的特殊字符', () => {
    // 包括空白字符的编码
    expect(() => parseUrl('http://example.com/%20')).not.toThrow(); // 空格
    expect(() => parseUrl('http://example.com/%0A')).not.toThrow(); // 换行
    expect(() => parseUrl('http://example.com/%0D')).not.toThrow(); // 回车
    expect(() => parseUrl('http://example.com/path?q=%3D')).not.toThrow(); // =
  });

  test('验证端口号范围', () => {
    expect(() => parseUrl('http://example.com:0')).toThrow();
    expect(() => parseUrl('http://example.com:65536')).toThrow();
    expect(() => parseUrl('http://example.com:8080')).not.toThrow();
  });
})

