import { BlockifyParams, blockify } from '../processors/blockify';
import { handlerSRGB } from '../handlers/handlerSRGB';

export const blockifySRGB = async ({
  inputFilename,
  outputFilename,
  fillAlpha = false,
  params,
}: {
  inputFilename: string;
  outputFilename: string;
  fillAlpha?: boolean;
  params: BlockifyParams;
}): Promise<void> => {
  handlerSRGB({
    inputFilename,
    outputFilename,
    fillAlpha,
    params,
    processor: blockify,
  });
};
