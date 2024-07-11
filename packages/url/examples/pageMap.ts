
// taro 路由配置
import appConfig from '@/app.config';

function getPageName(path: string = '') {
  const pathArr = path.split('/').reverse()
  return (pathArr[1] || pathArr[0] || '').toLowerCase();
}

function mapPagesToObject() {
  const allPages: Record<string, string> = {};
  const { pages = [], subPackages = [], tabBar = {} } = appConfig;

  pages.forEach(item => {
    const pageName = getPageName(item);
    if (pageName) {
      allPages[pageName] = item;
    }
  });

  subPackages.forEach(pkg => {
    const pkgName = pkg.root;
    pkg.pages.forEach(item => {
      const pageName = getPageName(item);
      if (pageName) {
        allPages[pageName] = `${pkgName}/${item}`;
      }
    });
  }, {});

  const allPagesFullPath = {}
  Object.entries(allPages).forEach(([key, value]) => {
    allPagesFullPath[value] = key
  });

  const tabBarList = tabBar.list || []
  const tabPages = tabBarList.reduce((obj, item) => {
    const pageName = getPageName(item.pagePath);
    if (pageName) {
      obj[pageName] = item.pagePath;
    }
    return obj;
  }, {});

  return {
    homePage: pages[0],
    allPages,
    tabPages,
    allPagesFullPath,
  }
}

const appPages = mapPagesToObject();

console.log('appPages', appPages);

export default appPages;
