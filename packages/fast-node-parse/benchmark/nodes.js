import { Node } from '../src/node.js';
import { Compactify } from '../utils/compact.js';

export class CallbackNode extends Node {
  /**
   * @type {import('./types').HttpMethod}
   */
  method;

  /**
   * @type {(params: Record<string, string>) => Record<string, string>}
   */
  callback;

  /**
   *
   * @param {import('./types').HttpMethod} method
   * @param {(params: Record<string, string>) => Record<string, string>} handler
   * @param {string} segment
   */
  constructor(method, handler, segment) {
    super(segment);

    this.method = method;
    this.callback = handler;
  }
}
export class RootNode extends Compactify {
  /**
   *
   * @param {import('./types').HttpMethod} method
   * @param {string} path
   */
  lookup(method, path) {
    const result = super.lookup(path);

    if (!result) {
      return false;
    }

    if (result.method === method) {
      return result.callback(this.parse(path));
    }

    return false;
  }
}
