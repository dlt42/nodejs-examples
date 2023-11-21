import { BlockifyParams, blockify } from '../processors/blockify';
import { handlerBW } from '../handlers/handlerBW';

export const blockifyBW = async ({
  inputFilename,
  outputFilename,
  params = { split: 20 },
}: {
  inputFilename: string;
  outputFilename: string;
  params?: BlockifyParams;
}): Promise<void> => {
  handlerBW({
    inputFilename,
    outputFilename,
    processor: blockify,
    params,
  });
};
