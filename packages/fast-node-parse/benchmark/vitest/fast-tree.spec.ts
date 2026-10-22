import { describe, expect, it } from 'vitest';
import { FastTree } from '../fast-tree.ts';

const createTree = () => {
  const tree = new FastTree();

  tree.insert('GET', '/users', { descriptor: () => 'static-users' });
  tree.insert('GET', '/users/:id', {
    descriptor: ({ params: { id } }) => `dynamic-${id}`
  });
  tree.insert('POST', '/users/:id', {
    descriptor: ({ params: { id } }) => `post-${id}`
  });
  tree.insert('GET', '/assets/*', {
    descriptor: ({ params: { '*': value } }) => `wildcard-${value}`
  });
  tree.insert('GET', '/users/:id/profile', {
    descriptor: ({ params: { id } }) => `profile-${id}`
  });

  return tree;
};

describe('FastTree', () => {
  it('matches registered static routes', () => {
    const tree = createTree();

    expect(tree.match('GET', '/users')).toBe(true);
    expect(tree.match('GET', '/users/123')).toBe(true);
    expect(tree.match('GET', '/assets/logo.svg')).toBe(true);
  });

  it('rejects non registered routes', () => {
    const tree = createTree();

    expect(tree.match('GET', '/unknown')).toBe(false);
    expect(tree.match('DELETE', '/users/1')).toBe(false);
    expect(tree.match('GET', '/users/123/unknown')).toBe(false);
  });

  it('executes descriptor for lookup', () => {
    const tree = createTree();

    expect(tree.lookup('GET', '/users')).toBe('static-users');
    expect(tree.lookup('GET', '/users/42')).toBe('dynamic-42');
    expect(tree.lookup('GET', '/users/42/profile')).toBe('profile-42');
    expect(tree.lookup('GET', '/assets/icons/edit.svg')).toBe(
      'wildcard-icons/edit.svg'
    );
  });

  it('parses params without executing descriptor', () => {
    const tree = createTree();

    expect(tree.parse('GET', '/users')).toEqual({});
    expect(tree.parse('GET', '/users/99')).toEqual({ id: '99' });
    expect(tree.parse('GET', '/assets/css/styles.css')).toEqual({
      '*': 'css/styles.css'
    });
    expect(tree.parse('DELETE', '/users/1')).toBe(false);
  });

  it('prefers static routes over dynamic ones', () => {
    const tree = new FastTree();

    tree.insert('GET', '/foo/bar', { descriptor: () => 'static' });
    tree.insert('GET', '/foo/:id', {
      descriptor: ({ params: { id } }) => `dynamic-${id}`
    });

    expect(tree.lookup('GET', '/foo/bar')).toBe('static');
  });

  it('handles method isolation', () => {
    const tree = createTree();

    expect(tree.lookup('POST', '/users/55')).toBe('post-55');
    expect(tree.lookup('DELETE', '/users/55')).toBe(false);
  });
});
