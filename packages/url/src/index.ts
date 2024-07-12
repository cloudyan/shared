

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
  const groups = match?.groups || {};
  return {
    schema: groups.schema || '',
    hostname: groups.hostname || '', // 注意索引的调整
    port: groups.port || '',
    pathname: groups.pathname || '',
    search: groups.search || '',
    hash: groups.hash || '',
  }
}

function getUrlRegex (urlStr: string = '') {
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

function stringify(query: Record<string, any>): string {
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

function parseUrl(url, appendQuery = {}) {
  // 不使用 protocol 改为自定义判断
  // const pageType = getUrlType(url); // h5 开头的

  const groups = getUrlRegex(url);
  const { schema, hostname, port, pathname, search, hash } = groups;
  const query = parseQuery(search || '');
  Object.assign(query, appendQuery);

  const queryStr = stringify(query);

  const tempSchema = schema ? schema + '://' : '';
  const host = [hostname, port].join(':');
  const path = '/' + pathname.replace(/^\//, '');
  const fullUrl = urlfix(tempSchema + host + path, queryStr);

  return {
    // pageType,
    schema,
    hostname,
    port,
    pathname,
    search,
    hash,
    query,
    queryStr,
    fullUrl,
    // pageName: '',
  }
}

