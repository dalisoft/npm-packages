import Node from '../src/node/node.js';
import Compactify from '../src/utils/compact.js';

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
   * @param {number} length
   */
  constructor(method, handler, segment, length) {
    super(segment, length);

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
