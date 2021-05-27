// eslint-disable-next-line node/no-unsupported-features/es-syntax
import { ParsedUrlQuery } from 'querystring';

interface IParseOptions {
  enableParser: boolean;
}

declare function parse(
  str: string,
  delimiter?: '&' | ';',
  options?: IParseOptions
): ParsedUrlQuery | null;

export = parse;
