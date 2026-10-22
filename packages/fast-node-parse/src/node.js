/**
 * It is maybe looks like **binary tree**
 * but it is different algorithm was made
 * to solve the walking on routers linearly
 * so it should fast on any size of route
 *
 * @type {import('./node').Node}
 * @implements {import('./node').Node}
 */
export class Node {
  constructor(segment) {
    this.next = undefined;
    this.position = 0;

    this.segment = segment;
    this.static = !/[<>{}:*]/.test(segment);
    this.length = this.static ? segment.length : 2;

    // This need for routers, otherwise you can modify it
    // or remove it, add something, do whatever you want
    this.key = this.static
      ? undefined
      : segment === '*'
        ? '*'
        : segment.charAt(0) === ':'
          ? segment.substring(1)
          : segment;
    this.value = undefined;
  }

  push(node) {
    node.position = this.position + this.length;

    this.next = node;

    return this;
  }

  match(path) {
    let i = -1;
    let node = this.next;
    let position;

    while (node) {
      position = node.position;

      if (node.static) {
        i = path.indexOf(node.segment, position);
      } else {
        i = path.indexOf('/', position + 1);
      }

      if (i === -1 || i < position) {
        return false;
      }

      node = node.next;
    }

    return true;
  }

  parse(path) {
    let i = -1;
    let node = this.next;
    let position;
    let params;

    while (node) {
      position = node.position;
      const IS_LAST_NODE = !node.next;

      if (node.static) {
        i = path.indexOf(node.segment, position);
      } else {
        i = path.indexOf('/', position + 1);
      }

      if (i === -1 || i < position) {
        return false;
      }

      if (!node.static) {
        if (!params) {
          params = {};
        }

        if (node.key) {
          params[node.key] = IS_LAST_NODE
            ? path.substring(i + 1)
            : path.substring(position + 1, i);
        }
      }

      node = node.next;
    }

    return params;
  }

  lookup(path) {
    let i = -1;
    let node = this.next;
    let position;

    while (node.next) {
      position = node.position;

      if (node.static) {
        i = path.indexOf(node.segment, position);
      } else {
        i = path.indexOf('/', position + 1);
      }

      if (i === -1 || i < position) {
        return false;
      }

      node = node.next;
    }

    position = node.position;
    if (node.static) {
      i = path.indexOf(node.segment, position);
    } else {
      i = path.indexOf('/', position + 1);
    }

    if (i === -1 || i < position) {
      return false;
    }

    return node;
  }
}
