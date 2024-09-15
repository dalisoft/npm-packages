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

function segmentsSlice(path: string): ISegmentSlice;

export = segmentsSlice;
