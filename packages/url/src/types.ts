export interface UrlQuery {
  [key: string]: string | number | boolean | object | null;
}

export interface ParsedUrl {
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

export interface UrlRegexResult {
  schema: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
}

export class URLParseError extends Error {
  constructor(message: string, public originalUrl: string) {
    super(message);
    this.name = 'URLParseError';
  }
}
