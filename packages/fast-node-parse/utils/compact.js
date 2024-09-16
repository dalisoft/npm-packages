// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable import-x/prefer-default-export */
import { Node } from '../src/node.js';

/**
 * Compacts Node tree by using special method
 * @class Compactify
 */
export class Compactify extends Node {
  /**
   * Compiles node tree into compact nodes
   * by combining them into single or small sizes
   * @param {string[]} copyProps Props to be copied
   * @method
   * @memberof Compactify
   */
  optimize(copyProps = []) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let node = this;
    let next;

    if (this.segment === '/') {
      this.segment = '';
      this.rootNode = false;
    }

    // biome-ignore lint/suspicious/noAssignInExpressions: It is efficient
    while ((next = node.next)) {
      if (node.static && next.static) {
        node.segment += `/${next.segment}`;
        node.length += next.length;

        for (let i = 0, len = copyProps.length; i < len; i++) {
          const prop = copyProps[i];

          node[prop] = next[prop];
        }

        node.next = next.next;
      } else {
        node = next;
      }
    }

    if (!this.next) {
      this.staticify();
    }

    return this;
  }

  /**
   * @param {string} path
   */
  parse(path) {
    return this.next ? super.parse(path) : false;
  }

  /**
   * @param {string} path
   */
  lookup(path) {
    return this.next ? super.lookup(path) : this;
  }

  /**
   * @private
   */
  staticify() {
    this.match = (/** @type {string} */ pathname) => {
      const path1 = this.segment;

      return (
        path1 === pathname ||
        `${path1}/` === pathname ||
        path1 === `${pathname}/`
      );
    };
  }
}
