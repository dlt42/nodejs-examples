import { Processor } from './processor';

export type BandifyParams = {
  bandWidth: number;
};

export const bandify: Processor<BandifyParams> = ({
  width,
  height,
  bandWidth,
  bufferData,
}: {
  height: number;
  width: number;
  bandWidth: number;
  bufferData: Buffer;
}) => {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (x % bandWidth >= bandWidth / 2) bufferData.set([0], x + width * y); // pixelArray[x + width * y] = 0;
    }
  }
};
