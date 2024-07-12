
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

import Taro from '@tarojs/taro';
import sceneList from './scene';
import pageMap from './pageMap';

console.log('pageMap', pageMap);

export const sceneNavigateTo = (scene: String) => {
  Taro.navigateTo({
    url: sceneList[scene],
  });
};

function geoMiniPath(url) {
  let pageName = ''
  let pagePath = ''
  if (url.startsWith('/') && !url.startsWith('//')) {
    pagePath = url.replace(/^\//, '') // 替换首位的 /
  }
  if (pageMap.allPages[url]) {
    pageName = url
    pagePath = pageMap.allPages[url]
  } else if (pageMap.allPagesFullPath[url]) {
    pageName = pageMap.allPagesFullPath[url]
  }
  const isTabPage = !!pageMap.tabPages[pageName];
  return {
    isTabPage,
    pagePath: pagePath,
  };
}

function goMiniPage(pageName, pageQuery: any = {}) {
  const { pagePath, isTabPage } = geoMiniPath(pageName)

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

  const queryStr = stringify(query);
  switch (type) {
    case 'replace':
      Taro.redirectTo({
        url: `/${urlfix(pagePath, queryStr)}`,
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
        url: `/${urlfix(pagePath, queryStr)}`,
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
  if (url.startsWith('/') && !url.startsWith('//')) {
    url = url.replace(/^\//, '') // 替换首位的 /
  }
  if (pageMap.allPages[url]) {
    return 'mini';
  }
  if (pageMap.allPagesFullPath[url]) {
    return 'mini';
  }
  if (url.startsWith('http')) {
    return 'webview';
  }
  if (url.startsWith('xcx://')) {
    return 'xcx';
  }
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

function encode(str = ''): string {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');
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

function urlfix(url = '', queryStr = '') {
  let fixUrl = url;
  if (queryStr) {
    fixUrl = url + (url.indexOf('?') === -1 ? '?' : '&') + queryStr;
  }
  return fixUrl;
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
  const fullUrl = urlfix(tempSchema + host + path, queryStr);

  return {
    schema: schema || '',
    hostname: hostname || '',
    port: port || '',
    pathname: pathname || '',
    hash: hash || '',
    query,
    queryStr,
    fullUrl,
    // search,
  }
}

const router = {
  forward(url: string, pageQuery: any = {}) {
    let pageType = getUrlType(url);

    if (pageType === 'xcx') {
      const urlObj = parseUrl(url, pageQuery);
      const query: any = urlObj.query;
      url = query.path || '';
      pageType = getUrlType(url || '');
    }

    switch (pageType) {
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
