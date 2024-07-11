
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
