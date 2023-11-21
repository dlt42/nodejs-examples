import { handlerSRGB } from '../handlers/handlerSRGB';
import { BandifyParams, bandify } from '../processors/bandify';

export const bandifySRGB = async ({
  inputFilename,
  outputFilename,
  fillAlpha = false,
  params = { bandWidth: 2 },
}: {
  inputFilename: string;
  outputFilename: string;
  fillAlpha?: boolean;
  params?: BandifyParams;
}): Promise<void> => {
  handlerSRGB<BandifyParams>({
    inputFilename,
    outputFilename,
    fillAlpha,
    params,
    processor: bandify,
  });
};
