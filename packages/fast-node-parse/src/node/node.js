/**
 * @type {import('./node')}
 * @implements {import('./node')}
 */
class Node {
  constructor(segment, length) {
    this.next = undefined;
    this.position = 0;
    this.last = true;

    this.segment = segment;
    this.static = !/[<>{}:*]/.test(segment);
    this.length = this.static ? segment.length : length ?? 2;
    this.fixed_length = typeof length === 'number' || this.static;

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

    this.last = false;
    node.last = true;

    this.next = node;

    return this;
  }

  match(path) {
    let i = -1;
    let node = this;

    while (node) {
      if (node.static) {
        i = path.indexOf(node.segment, node.position);
      } else if (node.fixed_length) {
        i = i + node.length;
      } else {
        i = path.indexOf('/', node.position + 1);
      }

      if (i === -1 || i < node.position) {
        return false;
      }

      node = node.next;
    }

    return true;
  }

  parse(path) {
    let i = -1;
    let node = this;
    let params;

    while (node) {
      if (node.static) {
        i = path.indexOf(node.segment, node.position);
      } else if (node.fixed_length) {
        i = i + node.length;
      } else {
        i = path.indexOf('/', node.position + 1);
      }

      if (i === -1 || i < node.position) {
        return false;
      }

      if (!node.static) {
        if (!params) {
          params = {};
        }

        if (node.key) {
          params[node.key] = node.last
            ? path.substring(i + 1)
            : path.substring(node.position + 1, i);
        }
      }

      node = node.next;
    }

    return params;
  }

  lookup(path) {
    let i = -1;
    let node = this;

    while (node) {
      if (node.static) {
        i = path.indexOf(node.segment, node.position);
      } else if (node.fixed_length) {
        i = i + node.length;
      } else {
        i = path.indexOf('/', node.position + 1);
      }

      if (i === -1 || i < node.position) {
        console.log({ i }, node);
        return false;
      }

      if (node.last) {
        return node;
      }

      node = node.next;
    }

    return false;
  }
}
/*
const root = new Node('/');
const foo = new Node('foo');
const id = new Node(':id', 3);

root.push(foo);
foo.push(id);

console.log(
  root.match('/foo/123'),
  root.parse('/foo/123'),
  root.lookup('/foo/123')
);*/

module.exports = Node;
