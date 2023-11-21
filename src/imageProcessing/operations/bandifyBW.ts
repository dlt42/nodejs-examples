import { BandifyParams, bandify } from '../processors/bandify';
import { handlerBW } from '../handlers/handlerBW';

export const bandifyBW = async ({
  inputFilename,
  outputFilename,
  params = { bandWidth: 2 },
}: {
  inputFilename: string;
  outputFilename: string;
  params?: BandifyParams;
}): Promise<void> => {
  handlerBW<BandifyParams>({
    inputFilename,
    outputFilename,
    processor: bandify,
    params,
  });
};
