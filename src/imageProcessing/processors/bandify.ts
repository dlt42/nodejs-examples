import { Processor } from './processor';

export type BandifyParams = {
  band: number;
};

export type BandifyConfig = {
  input: string;
  output: string;
  fillAlpha?: boolean;
  params?: BandifyParams;
};

export const bandify: Processor<BandifyParams> = ({
  width,
  height,
  band,
  pixelArray,
}) => {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (x % band >= band / 2) pixelArray.set([0], x + width * y);
    }
  }
};
