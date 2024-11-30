// URL 正则表达式配置，不使用命名捕获组
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
export const PATH_REGEX = new RegExp(pathRegexPattern, 'i');
export const QUERY_REGEX = new RegExp(queryRegexPattern, 'i');

// URL 安全配置
export const URL_CONFIG = {
  // 1. 长度限制
  MAX_LENGTH: 8192,

  // 2. 端口号验证(1-65535)
  PORT_REGEX: /^([1-9]\d{0,4})$/,

  // 3. 安全的字符集配置
  SAFE_CHARS: /^[a-zA-Z0-9\-._~:/?#\[\]@!$&'()*+,;=%]*$/,

  // 4. 只过滤真正危险的字符
  // <> - 防止 XSS 攻击
  // {} - 防止 JSON 注入
  // 不再过滤空白字符,因为它们应该被URL编码处理
  INVALID_CHARS: /[<>{}]/g,

  // <> - 防止 XSS 攻击
  // {} - 防止 JSON 解析错误
  // ^` - 防止命令注入
  // \n\r\t - 换行、回车、制表符(URL 编码会自动处理这些字符)
  // INVALID_CHARS: /[\s<>\\{}|^`]/g,

  // 增加 hostname 验证
  // HOSTNAME_REGEX: /^[a-zA-Z0-9]([a-zA-Z0-9\-\.]*[a-zA-Z0-9])?$/,
};

// URL 格式验证函数
export function isValidUrl(url: string): boolean {
  try {
    // 1. 长度检查
    // 修改为更宽松的长度限制，设置为 8KB (8192 字符)
    // 这是一个相对安全的值，能够适应大多数服务器的限制
    if (url.length > URL_CONFIG.MAX_LENGTH) {
      console.warn(`URL length exceeds limit(${URL_CONFIG.MAX_LENGTH} characters)`);
      // throw new URLParseError('URL exceeds maximum length', url);
      return false;
    }

    // 2. 检查危险字符
    if (URL_CONFIG.INVALID_CHARS.test(url)) {
      console.warn('URL contains dangerous characters');
      return false;
    }

    // 3. 检查URL字符集
    // 注意:这里允许%开头的编码字符
    // if (!URL_CONFIG.SAFE_CHARS.test(url)) {
    //   console.warn('URL contains invalid characters');
    //   // throw new URLParseError('URL contains invalid characters', url);
    //   return false;
    // }

    // 4. 检查端口号(如果有)
    const portMatch = url.match(/:(\d+)/);
    if (portMatch) {
      const port = parseInt(portMatch[1]);
      if (port < 1 || port > 65535) {
        console.warn('Invalid port number');
        return false;
      }
    }

    return true;
  } catch (error) {
    // if (error instanceof URLParseError) {
    //   throw error; // 重新抛出 URLParseError
    // }
    console.error('URL validation error:', error);
    return false;
  }
}

export function encode(str: any = ''): string {
  if (str === null || str === undefined) return '';
  // 确保转换为字符串
  const strValue = String(str);
  return encodeURIComponent(strValue)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');
}

// 正则表达式超时保护
export function safeRegexMatch(regex: RegExp, str: string) {
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
