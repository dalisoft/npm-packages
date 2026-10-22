export class Wired {
  #references = [];

  #index = 0;

  constructor() {
    this.hashmap = new Map();
    this.dynamic = [];
    this.wildcard = [];
  }

  handleMap(method, path, callback) {
    const paths = path.split('/').map((_path) => ({
      dynamic: [':', '<', '{'].includes(_path.charAt(0)),
      static: !(_path === '*' && [':', '<', '{'].includes(_path.charAt(0))),
      wildcard: _path === '*'
    }));
    const refIndex = this.#index;

    const ref = { callback, method, path, refIndex };
    const response = { method, path };

    if (paths.find((route) => route.wildcard)) {
      this.wildcard.push(ref);

      response.kind = 'wildcard';
      response.priority = 3;
      response.ref = ref;
    } else if (paths.find((route) => route.dynamic)) {
      this.dynamic.push(ref);

      response.kind = 'dynamic';
      response.priority = 2;
      response.ref = ref;
    } else if (!this.hashmap.has(`${method}_${path}`)) {
      this.hashmap.set(`${method}_${path}`, callback);

      response.kind = 'static';
      response.priority = 1;
    }

    this.#index++;

    return response;
  }

  add(method, path, callback) {
    this.#references.push(this.handleMap(method, path, callback));

    return this;
  }

  has(method, path) {
    // TODO: implement full working solution
    return this.hashmap.has(`${method}_${path}`);
  }

  lookup(method, path) {
    if (this.has(`${method}_${path}`)) {
      return this.hashmap.get(`${method}_${path}`);
    }
    return null;
  }
}

const w = new Wired();
w.add('GET', '/foo', () => {});
w.add('GET', '/foo/bar', () => {});
w.add('GET', '/foo/:id', () => {});
w.add('GET', '/foo/<id>', () => {});
w.add('GET', '/foo/*/bar', () => {});
w.add('GET', '/foo/bar/*', () => {});
