// 添加 Node.js 类型声明
declare namespace NodeJS {
  interface Process {
    versions: {
      node: string;
    };
  }
}

declare const process: NodeJS.Process;

// 添加小程序相关的类型声明
declare const wx: {
  getSystemInfo: Function;
};

declare const my: {
  getSystemInfo: Function;
};

declare const dd: {
  getSystemInfo: Function;
};

declare namespace process {
  namespace env {
    const TARO_ENV: string | undefined;
  }
}

export const ENV = {
  isWeb: typeof window !== 'undefined',
  isNode: typeof process !== 'undefined' && !!process.versions?.node,
  isWeapp: typeof wx !== 'undefined' && !!wx.getSystemInfo,
  isAlipay: typeof my !== 'undefined' && !!my.getSystemInfo,
  isDingTalk: typeof dd !== 'undefined' && !!dd.getSystemInfo,
  isTaro: typeof process !== 'undefined' && process.env.TARO_ENV !== undefined,
};

export const getPlatform = () => {
  if (ENV.isWeapp) return 'weapp';
  if (ENV.isAlipay) return 'alipay';
  if (ENV.isDingTalk) return 'dingtalk';
  if (ENV.isWeb) return 'web';
  if (ENV.isNode) return 'node';
  return 'unknown';
};
