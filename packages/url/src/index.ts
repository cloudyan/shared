
interface UrlQuery {
  [key: string]: any
}

export function parseUrl(url: string = '', appendQuery: UrlQuery = {}) {
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
}

export function stringify(query: UrlQuery = {}): string {
  const result: string[] = [];
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

export function parseQuery(queryStr: string = '', appendQuery: UrlQuery = {}) {
  const query = {};
  if (!queryStr) return query;
  queryStr.split('&').forEach((part) => {
    if (!part) return;
    const [k, v] = part.split('=');
    query[decodeURIComponent(k)] = decodeURIComponent(v || '');
  });
  return {...query, ...appendQuery};
}

function encode(str = ''): string {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');
}

function urlfix(url = '', queryStr = '') {
  let fixUrl = url;
  if (queryStr) {
    fixUrl = url + (url.indexOf('?') === -1 ? '?' : '&') + queryStr;
  }
  return fixUrl;
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

function getUrlRegex(url: string = '') {
  // 定义正则表达式的各个部分，不使用命名捕获组
  const schemaPart = '([a-z][a-z0-9+\\-.]*):';
  const hostnamePart = '(\\/\\/([^\\/\\?#:]+)?)?';
  const portPart = '(?::(\\d+))?';
  const pathnamePart = '((\\/)?[^?#]*)?';
  const searchPart = '(?:\\?([^#]*))?';
  const hashPart = '(?:#(.*))?';
  const regexPattern = `^(?:${schemaPart})?${hostnamePart}${portPart}${pathnamePart}${searchPart}${hashPart}$`;
  const urlRegex = new RegExp(regexPattern, 'i');

  const pathRegexPattern = `^(?:${schemaPart})?${hostnamePart}${portPart}${pathnamePart}$`
  const queryRegexPattern = `^${searchPart}${hashPart}$`;

  const pathRegex = new RegExp(pathRegexPattern, 'i');
  const queryRegex = new RegExp(queryRegexPattern, 'i');

  const urlArr = url.split('?');
  const [pathPart = '', queryPart = ''] = urlArr;
  const pathMatch: any = pathPart.match(pathRegex) || [];
  const queryPatch: any = ('?' + queryPart).match(queryRegex) || [];

  // 通过数组索引访问捕获的值
  return {
    schema: pathMatch[1] || '',
    hostname: pathMatch[3] || '', // 注意索引的调整
    port: pathMatch[4] || '',
    pathname: pathMatch[5] || '',
    search: queryPatch[1] || '',
    hash: queryPatch[2] || '',
  };
}
