function parse(
  path: string
): (
  pathname: string,
  params?: Record<string, string>
) => Record<string, string>;

export = parse;
