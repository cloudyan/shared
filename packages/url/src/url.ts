import Taro from '@tarojs/taro';
import pageMap from './pageMap';

console.log('pageMap', pageMap);

function goMiniPage(pageName, pageQuery: any = {}) {
  const pagePath = pageMap.allPages[pageName] || pageName;
  const isTabPage = !!pageMap.tabPages[pageName];

  const { replace, back, delta, ...query } = pageQuery;
  let type = replace ? 'replace' : '';
  delete pageQuery.replace;
  delete pageQuery.back;

  if (isTabPage) {
    type = 'switch';
  }

  if (!pagePath) {
    return;
  }

  const queryString = stringify(query);
  switch (type) {
    case 'replace':
      Taro.redirectTo({
        url: `/${pagePath}?${queryString}`,
      });
      break;
    case 'switch':
      // switchTab 不支持 query
      Taro.switchTab({
        url: `/${pagePath}`,
      });
      break;
    default:
      Taro.navigateTo({
        url: `/${pagePath}?${queryString}`,
      });
      break;
  }
}

function goWebviewPage(pageFullUrl, forwardType) {
  // 如果缺失域名，拼接域名
  if (!pageFullUrl.startsWith('http')) {
    console.error(pageFullUrl, 'h5链接必须是以 https 开头的完整链接');
    return;
    // pageFullUrl = getDomainFullUrl(pageFullUrl);
  }

  goMiniApp('webviewpage', {
    url: encodeURIComponent(pageFullUrl),
    forwardType,
  });
}

function goMiniApp(pageName: string, pageQuery: any = {}) {
  Taro.navigateToMiniProgram({
    appId: pageMap.allPages[pageName],
    path: pageName,
    // envVersion: 'develop',
    extraData: {
      ...pageQuery,
    },
  });
}

function getDomainFullUrl(url: string) {
  const domain = 'https://www.baidu.com';
  return `${domain}${url}`;
}

function getUrlType(url: string = '') {
  if (pageMap.allPages[url]) {
    return 'mini';
  }
  if (pageMap.allPagesFullPath[url]) {
    return 'mini';
  }
  if (url.startsWith('http')) {
    return 'webview';
  }
  // if (pageName.startsWith('xcx://')) {
  //   // 跳转其他小程序
  //   return 'miniApp';
  // }
  return 'other';
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
  const pageType = getUrlType(url); // h5 开头的

  const groups = getUrlRegex(url);
  const { schema, hostname, port, pathname, search, hash } = groups;
  const query = parseQuery(search || '');
  Object.assign(query, appendQuery);

  const queryStr = stringify(query);
  // const fullUrl = urlfix(url, queryStr);

  return {
    pageType,
    schema,
    hostname,
    port,
    pathname,
    search,
    hash,
    query,
    queryStr,
    pageName: '',
    // fullUrl: '',
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

const router = {
  forward(url: string, pageQuery: any = {}) {
    const pageObj = parseUrl(url, pageQuery);

    switch (pageObj.pageType) {
      case 'mini':
        goMiniPage(url, pageQuery);
        break;
      case 'webview':
        goWebviewPage(url, pageQuery);
        break;
      default:
        // do nothing
        break;
    }
  },
  back(delta = 1) {
    if (delta < getCurrentPages().length) {
      Taro.navigateBack({
        delta,
      });
    } else {
      // go home
      goMiniPage(pageMap.homePage, {});
    }
  },
};

export default router;
