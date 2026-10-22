# GOAL

## Task goal

I need fast route matching for backend inspired by Radix Tree.

[Full source](./node.js) available. It is basic and works for single route. Need expand functionality for multi-route match.

## Requirements

- Only 1 loop (`while`, `for`) are allowed inside walk method (`lookup`, `match`, `parse`)
- Use `next` and `children` property to access next `Node`
- Previous `Node` access avoid to memory and CPU effiency

## Example

### `/foo/bar/:id` -> `foo/bar/xyz`

```txt
NodeRoot (`/`)
  key: `/`
  next: null,
  static: true
  children: NodeRoot(`/bar`)
      key: `/bar`
      next: null
      static: true
      children: NodeRoot(`/:id`)
          key: `id`
          next: null
          static: false
          children: null
          value: `xyz`
```

And if we add `/foo/baz`, tree changing look like below:

```txt
Node (`/`)
  key: `/`
  next: null,
  static: true
  children: Node(`/bar`)
      key: `/bar`
      next: Node(`/baz`)
        key: `baz`
        next: null,
        static: true
        children: null
      static: true
      children: Node(`/:id`)
          key: `id`
          next: null
          static: false
          children: null
          value: `xyz`
```
