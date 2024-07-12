
// 解析URL的正则表达式，不使用命名捕获组以提高兼容性
// var regex = /^(?:([a-z][a-z0-9+\-.]*):)?\/\/([^\/\?#:]+)(?::(\d+))?(\/[^?#]*)?(?:\?([^#]*))?(?:#(.*))?$/i;

const allFullPathPages = {}
function getUrlType(url = '') {
  if (url.startsWith('xcx://')) return 'xcx';
  if (allFullPathPages[url]) return 'mini';
  if (url.startsWith('http')) return 'h5';
  return 'other';
}

function getUrlRegexGroups (url = '') {
  const schemaPart = '(?<schema>[a-z][a-z0-9+\\-.]*):';
  // const protocolSeparator = '(?<sepatator>\\/\\/)?';
  const hostnamePart = '(\/\/(?<hostname>[^\\/\\?#:]+)?)?';
  const portPart = '(?::(?<port>\\d+))?';
  const pathnamePart = '(?<pathname>(\\/)?[^?#]*)?';
  const searchPart = '(?:\\?(?<search>[^#]*))?';
  const hashPart = '(?:#(?<hash>.*))?';
  const regexPattern = `^(?:${schemaPart})?${hostnamePart}${portPart}${pathnamePart}${searchPart}${hashPart}$`;
  const urlRegex = new RegExp(regexPattern, 'i');

  const match = url.match(urlRegex) || [];
  const groups = match.groups || {};
  return {
    schema: groups.schema,
    hostname: groups.hostname, // 注意索引的调整
    port: groups.port,
    pathname: groups.pathname,
    search: groups.search,
    hash: groups.hash,
  }
}

function getUrlRegex (url = '') {
  // 定义正则表达式的各个部分，不使用命名捕获组
  const schemaPart = '([a-z][a-z0-9+\\-.]*):';
  const hostnamePart = '(\\/\\/([^\\/\\?#:]+)?)?';
  const portPart = '(?::(\\d+))?';
  const pathnamePart = '((\\/)?[^?#]*)?';
  const searchPart = '(?:\\?([^#]*))?';
  const hashPart = '(?:#(.*))?';
  const regexPattern = `^(?:${schemaPart})?${hostnamePart}${portPart}${pathnamePart}${searchPart}${hashPart}$`;
  const urlRegex = new RegExp(regexPattern, 'i');

  const match = url.match(urlRegex) || [];
  // 通过数组索引访问捕获的值
  return {
    schema: match[1],
    hostname: match[3], // 注意索引的调整
    port: match[4],
    pathname: match[5],
    search: match[6],
    hash: match[7],
  };
}

function parseUrl(url, appendQuery = {}) {
  // 不使用 protocol 改为自定义判断
  const pageType = getUrlType(url); // h5 开头的

  // const groups = getUrlRegexGroups(url);
  const groups = getUrlRegex(url);
  const {
    schema,
    hostname,
    port,
    pathname = '',
    search,
    hash,
  } = groups;
  const query = parseQuery(search || '');
  Object.assign(query, appendQuery);

  const queryStr = stringify(query);
  const tempSchema = schema ? schema + '://' : '';

  // 计算 host
  const hostArr = [];
  if (hostname) hostArr.push(hostname);
  if (port) hostArr.push(port);
  const host = hostArr.join(':');

  // 计算 path
  let path = '';
  if (pathname) {
    path = '/' + pathname.replace(/^\//, '');
  }
  // 完整路径
  const fullUrl = urlfix(tempSchema + host + path, queryStr);

  return {
    // pageType,
    schema: schema || '',
    hostname: hostname || '',
    port: port || '',
    pathname: pathname || '',
    hash: hash || '',
    query,
    queryStr,
    fullUrl,
    // search,
    // pageName: '',
  }
}

// examples
const arr = [
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

arr.forEach(item => {
  let urlObj = parseUrl(item);
  if (urlObj.pageType === 'xcx') {
    urlObj = parseUrl(urlObj.query?.path || '');
  }
  console.log(JSON.stringify(urlObj, null, 2));
})

// 跳转 url 解析
// xcx://platformapi?path=encodeURIComponent(/page/index?xdLoginToken=&fromAppId=)
// https:// 开头
// itms-apps://, market:// 仅在抖音使用
// toMain 微信小程序跳转主包

function parseQuery(queryStr = '', appendQuery = {}) {
  const query = {};
  if (!queryStr) return query;
  queryStr.split('&').forEach((part) => {
    if (!part) return;
    const [k, v] = part.split('=');
    query[decodeURIComponent(k)] = decodeURIComponent(v || '');
  });
  return {...query, ...appendQuery};
}


function stringify(query = {}) {
  const result = [];
  Object.entries(query).forEach(([key, value]) => {
    // 以下 value 值，会被过滤
    if (![undefined].includes(value)) {
      if (typeof value === 'object') {
        result.push(`${encode(key)}=${encode(JSON.stringify(value))}`);
      } else {
        result.push(`${encode(key)}=${encode(value)}`);
      }
    }
  });
  return result.join('&');
}

function encode(str = '') {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');
}

/**
 * 间隔 url
 *
 * @export
 * @param {*} url 传入 url 参数
 * @param {string} [queryStr=''] 传入 queryStr 参数
 * @returns { string } 返回拼接的 url
 */
function urlfix(url = '', queryStr = '') {
  let fixUrl = url;
  if (queryStr) {
    fixUrl = url + (url.indexOf('?') === -1 ? '?' : '&') + queryStr;
  }
  return fixUrl;
}




