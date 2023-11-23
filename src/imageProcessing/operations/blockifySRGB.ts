import { BlockifyConfig, blockify } from '../processors/blockify';
import { handlerSRGB } from '../handlers/handlerSRGB';

export const blockifySRGB = async ({
  input,
  output,
  fillAlpha,
  params = { split: 20 },
}: BlockifyConfig): Promise<void> => {
  handlerSRGB({
    input,
    output,
    fillAlpha,
    params,
    processor: blockify,
  });
};
