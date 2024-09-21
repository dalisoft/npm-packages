export interface ISegment {
  name: string;
  segment: boolean;
  position: number;
  size: number;
  last: boolean;
}

export interface ISegmentSlice {
  segments: ISegment[];
  filled: ISegment[];
  length: number;
}

/**
 * Parses route string into segments and parses it
 * @param path A path to parse
 * @example
 * ```ts
 * segmentsSlice('/foo/bar').segments
 * // [{name: 'foo', segment: false, size: 3, last: false}, {name: 'bar', segment: false, size: 3, last: true}]
 * ```
 */
function segmentsSlice(path: string, compact: boolean): ISegmentSlice;

export = segmentsSlice;
