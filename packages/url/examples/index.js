
// 解析URL的正则表达式，不使用命名捕获组以提高兼容性
// var regex = /^(?:([a-z][a-z0-9+\-.]*):)?\/\/([^\/\?#:]+)(?::(\d+))?(\/[^?#]*)?(?:\?([^#]*))?(?:#(.*))?$/i;

function getUrlRegexGroups () {
  const schemaPart = '(?<schema>[a-z][a-z0-9+\\-.]*):';
  // const protocolSeparator = '(?<sepatator>\\/\\/)?';
  const hostnamePart = '(\/\/(?<hostname>[^\\/\\?#:]+)?)?';
  const portPart = '(?::(?<port>\\d+))?';
  const pathnamePart = '(?<pathname>(\\/)?[^?#]*)?';
  const searchPart = '(?:\\?(?<search>[^#]*))?';
  const hashPart = '(?:#(?<hash>.*))?';
  const regexPattern = `^(?:${schemaPart})?${hostnamePart}${portPart}${pathnamePart}${searchPart}${hashPart}$`;
  const urlRegex = new RegExp(regexPattern, 'i');

  return urlRegex;
}

function getUrlRegex () {
  // 定义正则表达式的各个部分，不使用命名捕获组
  const schemaPart = '([a-z][a-z0-9+\\-.]*):';
  const hostnamePart = '(\\/\\/([^\\/\\?#:]+)?)?';
  const portPart = '(?::(\\d+))?';
  const pathnamePart = '((\\/)?[^?#]*)?';
  const searchPart = '(?:\\?([^#]*))?';
  const hashPart = '(?:#(.*))?';
  const regexPattern = `^(?:${schemaPart})?${hostnamePart}${portPart}${pathnamePart}${searchPart}${hashPart}$`;
  const urlRegex = new RegExp(regexPattern, 'i');

  const match = urlStr.match(urlRegex) || [];
  // 通过数组索引访问捕获的值
  return {
    schema: match[1] || '',
    hostname: match[3] || '', // 注意索引的调整
    port: match[4] || '',
    pathname: match[5] || '',
    search: match[6] || '',
    hash: match[7] || '',
  };
}

function urlParse(url, appendQuery = {}) {
  // 不使用 protocol 改为自定义判断
  const pageType = getUrlType(url); // h5 开头的

  const urlRegex = getUrlRegexGroups();
  const match = urlStr.match(urlRegex);
  const { schema, hostname, port, pathname, search, hash } = match.groups;
  const query = parseQuery(search || '');
  Object.assign(query, appendQuery);

  const queryStr = stringify(query);
  const fullUrl = urlfix(url, queryStr);

  return {
    pageType,
    schema,
    hostname,
    port,
    pathname,
    // search,
    hash,
    query,
    queryStr: stringify(query),
    pageName: '',
    fullUrl: '',
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
  try {
    console.log(JSON.stringify(urlParse(item), null, 2));
  }catch(err) {
    console.log(err)
  }
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
export function urlfix(url = '', queryStr = '') {
  let fixUrl = url;
  if (queryStr) {
    fixUrl = url + (url.indexOf('?') === -1 ? '?' : '&') + queryStr;
  }
  return fixUrl;
}

// 链接类型判断规则
const types = {
  // miniapp: /^miniapp:\/\//i, // 外部小程序跳转
  // mini: /^pages\//i, // 支持小程序
  xcx: /^xcx:\/\//i, // 自定义 schema
  mini: /^([A-Za-z0-9])+([-|_]([a-z0-9]+)){0,3}$/i, // 小程序 pageName
  // mini2: /^(\/?pages)(\/([A-Za-z0-9])+([-|_]([a-z0-9]+)){0,3}){1,3}$/i, // 小程序 pageName
  // h5my: /(\.dev|\.beta)?\.xxx\.com/i,
  // h5my2: env.baseUrl,
  // h5auth: /(\.dev|\.beta)?\.xxx\.com/i,
  h5: /^(https|http):\/\//i,
  tel: /^tel:/i, // 手机号，h5用a标签写，不走事件，小程序走事件
  script: /^javascript\:([\w|\d]*)\(\'(.*?)\'\)/, // 自定义脚本 领优惠券
};



// 链接类型判断
// export function getUrlType(url = '') {
//   if (types['miniapp'].test(url)) return 'miniapp';
//   // if (types['mini'].test(url)) return 'mini'; // 小程序链接格式
//   url = url.split('?')[0];
//   if (types['mini'].test(url)) return 'mini';
//   if (types['mini2'].test(url)) return 'mini';
//   if (types['h5my'].test(url)) return 'h5my'; // h5my 会做映射处理
//   if (url.indexOf(types['h5my2']) === 0) return 'h5my';
//   if (types['h5auth'].test(url)) return 'h5auth'; // auth h5 会做授权逻辑处理，
//   if (types['h5'].test(url)) return 'h5';  // 其他 H5 不做处理，直接 webview打开 url
//   if (types['tel'].test(url)) return 'tel';
//   if (types['script'].test(url)) return 'script';
//   return 'other';
// }


const allFullPathPages = {}
function getUrlType(url = '') {
  if (url.startsWith('xcx://')) return 'xcx';
  if (allFullPathPages[url]) return 'mini';
  if (url.startsWith('http')) return 'h5';
  return 'other';
}
