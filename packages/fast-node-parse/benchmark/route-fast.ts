import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { HttpMethod } from './types';

interface IRouteParsedPath {
  kind: 'param' | 'wildcard' | 'static';
  key: string | number;
  size: number;
  offset: number;
}
interface IRouteNode extends IRouteParsedPath {
  root: boolean;
  last: boolean;
  next: Array<IRouteNode>;
  prev: IRouteNode | null;
}

const isSameNode = (node1: IRouteNode, node2: IRouteNode) => {
  return (
    node1.key === node2.key &&
    node1.size === node2.size &&
    node1.offset === node2.offset &&
    node1.kind === node2.kind
  );
};

class Route<Descriptor> {
  static classifyPath = (path: string): IRouteParsedPath['kind'] => {
    return path.indexOf('*') !== -1
      ? 'wildcard'
      : path.indexOf(':') !== -1
        ? 'param'
        : 'static';
  };
  static parsePath = (path: string) => {
    const paths = path.split('/').filter(Boolean);
    let wildcardIndex = 0;

    return paths
      .map((path): IRouteParsedPath => {
        switch (path.charAt(0)) {
          case ':': {
            return {
              key: path.substring(1),
              kind: 'param',
              offset: 0,
              size: 2
            };
          }
          case '*': {
            return {
              key: wildcardIndex++,
              kind: 'wildcard',
              offset: 0,
              size: 2
            };
          }
          default: {
            return {
              key: path,
              kind: 'static',
              offset: 0,
              size: path.length
            };
          }
        }
      })
      .map(
        (parsed, index, self): IRouteParsedPath => ({
          ...parsed,
          offset: self[index - 1]?.size ?? 0
        })
      )
      .map(
        (parsed, index, self): IRouteParsedPath => ({
          ...parsed,
          offset: (self[index - 1]?.offset ?? 0) + 1 + parsed.offset
        })
      )
      .map(
        (parsed): IRouteNode => ({
          ...parsed,
          last: false,
          next: [],
          prev: null,
          root: false
        })
      )
      .reduce((prev, current) => {
        if (prev) {
          prev.next.push(current);
          prev.last = false;
        }

        current.prev = prev;
        current.last = true;

        return current;
      });
  };
  routes: {
    static_routes: Record<string, Partial<Record<HttpMethod, Descriptor[]>>>;
    dynamic_routes: Record<string, IRouteNode>;
  };
  constructor() {
    this.routes = {
      dynamic_routes: {
        '/': {
          key: '/',
          kind: 'static',
          last: false,
          next: [],
          offset: 0,
          prev: null,
          root: true,
          size: 1
        }
      },
      static_routes: {}
    };
  }

  insert(method: HttpMethod, path: string, descriptor: Descriptor) {
    const classifiedPath = Route.classifyPath(path);

    switch (classifiedPath) {
      case 'static': {
        if (!this.routes.static_routes[path]) {
          this.routes.static_routes[path] = {
            [method as HttpMethod]: [] as Descriptor[]
          };
        } else if (!this.routes.static_routes[path][method]) {
          this.routes.static_routes[path][method] = [] as Descriptor[];
        }

        const routes = this.routes.static_routes[path][method];

        if (routes) {
          routes.push(descriptor);
        }

        break;
      }
      case 'param':
      case 'wildcard': {
        const root = this.routes.dynamic_routes['/'];
        const tree = Route.parsePath(path);
        const next = root;
        const track = tree;

        console.log('entry', tree);

        break;
      }
    }
  }
}

const _route = new Route<{
  handlers: Array<(params?: Record<string, unknown>) => void>;
}>();

_route.insert('GET', '/foo', { handlers: [() => console.log('its GET /foo')] });
_route.insert('GET', '/foo/:id', {
  handlers: [() => console.log('its GET /foo/:id')]
});
_route.insert('GET', '/foo/bar', {
  handlers: [() => console.log('its GET /foo/bar')]
});
_route.insert('GET', '/foo/:id/user', {
  handlers: [() => console.log('its GET /foo/:id/user')]
});
_route.insert('GET', '/foo/:id/user/:flow', {
  handlers: [() => console.log('its GET /foo/:id/user/:flow')]
});
_route.insert('GET', '/foo/:id/bar/*', {
  handlers: [() => console.log('its GET /foo/:id/bar/*')]
});
_route.insert('GET', '/foo/*/settings', {
  handlers: [() => console.log('its GET /foo/*/settings')]
});
_route.insert('POST', '/foo/bar', {
  handlers: [() => console.log('its POST /foo/bar')]
});
_route.insert('POST', '/fax/:docId', {
  handlers: [() => console.log('its POST /fax/:docId')]
});
_route.insert('POST', '/foo/baz', {
  handlers: [() => console.log('its POST /foo/baz')]
});
_route.insert('POST', '/foo/baz/user', {
  handlers: [() => console.log('its POST /foo/baz/user')]
});

describe('static routes', () => {
  it('/foo', () => {
    assert.partialDeepStrictEqual(_route.routes.static_routes, {
      '/foo': {
        GET: [
          {
            handlers: [
              _route.routes.static_routes['/foo']?.GET?.[0]?.handlers[0]
            ]
          }
        ]
      }
    });
  });
  it('/foo/bar', () => {
    assert.partialDeepStrictEqual(_route.routes.static_routes, {
      '/foo/bar': {
        GET: [
          {
            handlers: [
              _route.routes.static_routes['/foo/bar']?.GET?.[0]?.handlers[0]
            ]
          }
        ],
        POST: [
          {
            handlers: [
              _route.routes.static_routes['/foo/bar']?.POST?.[0]?.handlers[0]
            ]
          }
        ]
      }
    });
  });
  it('/foo/baz', () => {
    assert.partialDeepStrictEqual(_route.routes.static_routes, {
      '/foo/baz': {
        POST: [
          {
            handlers: [
              _route.routes.static_routes['/foo/baz']?.POST?.[0]?.handlers[0]
            ]
          }
        ]
      }
    });
  });
  it('/foo/baz/user', () => {
    assert.partialDeepStrictEqual(_route.routes.static_routes, {
      '/foo/baz/user': {
        POST: [
          {
            handlers: [
              _route.routes.static_routes['/foo/baz/user']?.POST?.[0]
                ?.handlers[0]
            ]
          }
        ]
      }
    });
  });
});
describe('param router', () => {
  it('/foo/:id', () => {
    assert.partialDeepStrictEqual(_route.routes.dynamic_routes, {
      '/': {
        ..._route.routes.dynamic_routes['/'],
        next: Route.parsePath('/foo/:id')
      }
    });
  });
});
