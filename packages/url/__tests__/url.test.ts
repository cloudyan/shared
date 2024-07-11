import { test, expect, describe, it } from 'vitest'
import { Url } from '../src/url';

test('url 解析', () => {
  const urlObj = Url('/api/users') || {};

  console.log(urlObj);

  expect(urlObj.pathname).toBe('/api/users');  // pathname
  expect(urlObj.query).toEqual({});  // query
  expect(urlObj.queryStr).toBe('');  // queryStr
  expect(urlObj.hash).toBe('');  // hash
  expect(urlObj.url).toBe('/api/users');  // url
  expect(urlObj.host).toBe('');  // host
  expect(urlObj.hostname).toBe('');  // hostname
  expect(urlObj.origin).toBe('');  // origin
  expect(urlObj.href).toBe('/api/users');  // href
  expect(urlObj.search).toBe('');  // search
  expect(urlObj.schema).toBe('');  // schema // 附加

})

