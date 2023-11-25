import { PixelProcessorParams, Processor } from './processor';

export const bandOptions = [2, 4, 6, 8, 10, 12, 14] as const;

export type BandOptions = (typeof bandOptions)[number];

export type BandifyParams = {
  band: BandOptions;
};

export const bandifyProcessor: Processor<
  BandifyParams,
  PixelProcessorParams
> = ({ width, height, band, pixelArray }) => {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (x % band >= band / 2) pixelArray.set([0], x + width * y);
    }
  }
};
