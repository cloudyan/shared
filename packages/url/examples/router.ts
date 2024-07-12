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


// 跳转 url 解析
// xcx://platformapi?path=encodeURIComponent(/page/index?xdLoginToken=&fromAppId=)
// https:// 开头
// itms-apps://, market:// 仅在抖音使用
// toMain 微信小程序跳转主包
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
