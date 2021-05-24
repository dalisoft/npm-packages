// eslint-disable-next-line node/no-unsupported-features/es-syntax
import { ParsedUrlQuery } from 'querystring';

declare function parse(str: string): ParsedUrlQuery | null;

export = parse;
