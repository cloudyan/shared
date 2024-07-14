import { test, expect, describe, it } from 'vitest'
import { parseUrl } from '../src/index';

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
    url: '/api/users',
    expected: {
      originUrl: '/api/users',
      fullUrl: "/api/users",
      schema: "",
      hash: "",
      hostname: "",
      pathname: "/api/users",
      port: "",
      query: { },
      queryStr: "",
      search: "",
    },
  },
]

describe('parseUrl 解析', () => {
  testCases.forEach(({ url, expected }) => {
    it(`正确解析 URL: ${url}`, () => {
      const result = parseUrl(url);
      expect(result).toEqual(expected);
    });
  });
})

