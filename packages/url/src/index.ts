// parseUrl 测试用例

//  ✓ 正确解析 URL: https://baidu.com:3000/aaa/bbb?id=123#top
//  ✓ 正确解析 URL: http://localhost:3000/abc?id=123
//  ✓ 正确解析 URL: http://172.16.0.74:3000/abc?userId=123
//  ✓ 正确解析 URL: baseinfo
//  ✓ 正确解析 URL: pages/login/index
//  ✓ 正确解析 URL: /pages/login/index
//  ✓ 正确解析 URL: xcx://platformapi?path=%2Fpage%2Findex%3FxdLoginToken%3Dxxx%26fromAppId%3D123
//  ✓ 正确解析 URL: /page/index?xdLoginToken=xxx&fromAppId=123
//  ✓ 正确解析 URL: ?a=1&b=2
//  ✓ 正确解析 URL: /abc?a=1&b=2
//  ✓ 正确解析 URL: ?a=1&b=2#top
//  ✓ 正确解析 URL: itms-apps://
//  ✓ 正确解析 URL: itms-apps://abc?id=123
//  ✓ 正确解析 URL: market://
//  ✓ 正确解析 URL: itms-apps://itunes.apple.com/app/id1478276004
//  ✓ 正确解析 URL: market://details?id=com.zaxd.loan


interface UrlQuery {
  [key: string]: string | number | boolean | object | null;
}

// 定义正则表达式的各个部分，不使用命名捕获组
const URL_REGEX = {
  SCHEMA: '([a-z][a-z0-9+\\-.]*):',
  HOSTNAME: '(\\/\\/([^\\/\\?#:]+)?)?',
  PORT: '(?::(\\d+))?',
  PATHNAME: '((\\/)?[^?#]*)?',
  SEARCH: '(?:\\?([^#]*))?',
  HASH: '(?:#(.*))?'
};

const pathRegexPattern = `^(?:${URL_REGEX.SCHEMA})?${URL_REGEX.HOSTNAME}${URL_REGEX.PORT}${URL_REGEX.PATHNAME}$`
const queryRegexPattern = `^${URL_REGEX.SEARCH}${URL_REGEX.HASH}$`;

// 缓存正则表达式实例
const PATH_REGEX = new RegExp(pathRegexPattern, 'i');
const QUERY_REGEX = new RegExp(queryRegexPattern, 'i');

// 正则表达式超时保护
function safeRegexMatch(regex: RegExp, str: string) {
  try {
    const startTime = Date.now();
    const result = str.match(regex);

    // 如果匹配时间超过 100ms，记录警告
    if (Date.now() - startTime > 100) {
      console.warn('Regex matching took too long:', regex);
    }

    return result;
  } catch (error) {
    console.error('Regex matching error:', error);
    return null;
  }
}

function getUrlRegex(url: string = '') {
  const urlArr = url.split('?');
  const [pathPart = '', queryPart = ''] = urlArr;

  // 使用安全的正则匹配
  const pathMatch = safeRegexMatch(PATH_REGEX, pathPart) || [];
  const queryPatch = safeRegexMatch(QUERY_REGEX, '?' + queryPart) || [];

  return {
    schema: pathMatch[1] || '',
    hostname: pathMatch[3] || '',
    port: pathMatch[4] || '',
    pathname: pathMatch[5] || '',
    search: queryPatch[1] || '',
    hash: queryPatch[2] || '',
  };
}

// 建议添加更多类型定义
interface ParsedUrl {
  schema: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  query: UrlQuery;
  queryStr: string;
  fullUrl: string;
  originUrl: string;
}

interface UrlRegexResult {
  schema: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
}

// 添加 URL 格式验证函数
function isValidUrl(url: string): boolean {
  try {
    // 修改为更宽松的长度限制，设置为 8KB (8192 字符)
    // 这是一个相对安全的值，能够适应大多数服务器的限制
    if (url.length > 8192) {
      console.warn('URL length exceeds recommended limit (8192 characters)');
      return false;
    }

    // 检查是否包含非法字符
    const invalidChars = /[\s<>\\{}|^`]/g;
    if (invalidChars.test(url)) return false;

    return true;
  } catch {
    return false;
  }
}

export function parseUrl(url: string, appendQuery: UrlQuery = {}): ParsedUrl {
  // 修改入参校验逻辑
  if (url === null || url === undefined) {
    throw new TypeError('URL must be a string, not null or undefined');
  }

  if (typeof url !== 'string') {
    throw new TypeError('URL must be a string');
  }

  if (!isValidUrl(url)) {
    throw new Error('Invalid URL format');
  }

  // 增加 try-catch 错误处理
  try {
    url = url.replace(/\?/g, '&').replace('&', '?');
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
    const hostArr: string[] = [];
    if (hostname) hostArr.push(hostname);
    if (port) hostArr.push(port);
    const host = hostArr.join(':');

    // 计算 path
    let path = '';
    if (pathname) {
      path = '/' + pathname.replace(/^\//, '');
    }
    // 完整路径
    let fullUrl = urlfix(tempSchema + host + path, queryStr);

    if (hash) {
      fullUrl += '#' + hash;
    }

    return {
      schema,
      hostname,
      port,
      pathname,
      search,
      hash,
      query,
      queryStr,
      fullUrl,
      originUrl: url,
    }
  } catch (error) {
    console.error('URL parsing error:', error);
    throw error;
  }
}

export function urlfix(url = '', queryStr = '') {
  // 处理边界情况
  if (!url && !queryStr) return '';

  let fixUrl = url;
  if (queryStr) {
    // 处理 URL 中多余的 ? 和 & 符号
    const hasQuery = url.includes('?');
    const connector = hasQuery ?
      (url.endsWith('?') || url.endsWith('&') ? '' : '&') :
      '?';

    fixUrl = url + (queryStr ? connector + queryStr : '');
  }

  // 规范化 URL
  return fixUrl.replace(/([?&])&+/g, '$1');
}

export function stringify(query: UrlQuery = {}): string {
  if (!query || typeof query !== 'object') return '';

  return Object.entries(query)
    .filter(([key, value]) => {
      // 过滤掉无效的 key 和 value
      return key && value !== undefined && value !== null;
    })
    .map(([key, value]) => {
      try {
        if (typeof value === 'object') {
          return `${encode(key)}=${encode(JSON.stringify(value))}`;
        }
        return `${encode(key)}=${encode(value)}`;
      } catch (error) {
        console.warn(`Failed to stringify query parameter: ${key}`, error);
        return '';
      }
    })
    .filter(Boolean) // 过滤掉空字符串
    .join('&');
}

export function parseQuery(queryStr: string = '', appendQuery: UrlQuery = {}) {
  const query: UrlQuery = {};
  if (!queryStr) return {...query, ...appendQuery};

  try {
    const parts = queryStr.split('&');
    for (const part of parts) {
      if (!part) continue; // 跳过当前迭代

      try {
        const [k, ...vParts] = part.split('=');
        // 修复值中包含 = 的情况
        const v = vParts.join('=');

        // 键名验证
        if (!k) continue;
        const key = decodeURIComponent(k);

        // 值处理
        let value = '';
        if (v) {
          try {
            value = decodeURIComponent(v);
          } catch (e) {
            // 解码失败时使用原始值
            value = v;
            console.warn(`Failed to decode query value: ${v}`, e);
          }
        }

        query[key] = value;
      } catch (e) {
        console.warn(`Failed to parse query part: ${part}`, e);
        continue;
      }
    }
  } catch (error) {
    console.error('Query parsing error:', error);
    return {...query, ...appendQuery};
  }

  return {...query, ...appendQuery};
}

function encode(str: any = ''): string {
  if (str === null || str === undefined) return '';
  // 确保转换为字符串
  const strValue = String(str);
  return encodeURIComponent(strValue)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');
}


function getUrlRegexGroups(url: string = '') {
  // 解析 path 部分
  const schemaPart = '(?<schema>[a-z][a-z0-9+\\-.]*):';
  // const protocolSeparator = '(?<sepatator>\\/\\/)?';
  const hostnamePart = '(\/\/(?<hostname>[^\\/\\?#:]+)?)?';
  const portPart = '(?::(?<port>\\d+))?';
  const pathnamePart = '(?<pathname>(\\/)?[^?#]*)?';

  // 解析 query 部分
  const searchPart = '(?:\\?(?<search>[^#]*))?';
  const hashPart = '(?:#(?<hash>.*))?';

  const pathRegexPattern = `^(?:${schemaPart})?${hostnamePart}${portPart}${pathnamePart}$`
  const queryRegexPattern = `^${searchPart}${hashPart}$`;

  const pathRegex = new RegExp(pathRegexPattern, 'i');
  const queryRegex = new RegExp(queryRegexPattern, 'i');

  // 使用 ? 分隔 url
  const urlArr = url.split('?');
  const [pathPart = '', queryPart = ''] = urlArr;
  const pathMatch: any = pathPart.match(pathRegex) || [];
  const queryPatch: any = ('?' + queryPart).match(queryRegex) || [];

  const groups = { ...(pathMatch?.groups || {}), ...(queryPatch?.groups || {}) };
  console.log('groups', groups);
  return {
    schema: groups.schema || '',
    hostname: groups.hostname || '', // 注意索引的调整
    port: groups.port || '',
    pathname: groups.pathname || '',
    search: groups.search || '',
    hash: groups.hash || '',
  }
}

// 添加错误类型
class URLParseError extends Error {
  constructor(message: string, public originalUrl: string) {
    super(message);
    this.name = 'URLParseError';
  }
}
