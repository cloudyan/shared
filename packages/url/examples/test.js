import { parseUrl } from '../dist/cjs'

const testCases = [
  'https://baidu.com:3000/aaa/bbb?id=123#top',
  'http://localhost:3000/abc?id=123',
  'http://172.16.0.74:3000/abc?userId=123',
  'baseinfo',
  'pages/login/index',
  '/pages/login/index',
  `xcx://platformapi?path=${encodeURIComponent('/page/index?xdLoginToken=xxx&fromAppId=123')}`,
  `itms-apps://`,
  `itms-apps://abc?id=123`,
  `market://`,
  `?a=1&b=2`,
  `a=1&b=2`,
  `?a=1&b=2#top`,
]

testCases.forEach(url => {
  let urlObj = parseUrl(url);
  console.log(JSON.stringify(urlObj, null, 2));
})
