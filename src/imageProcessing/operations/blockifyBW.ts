import { BlockifyConfig, blockify } from '../processors/blockify';
import { handlerBW } from '../handlers/handlerBW';

export const blockifyBW = async ({
  input,
  output,
  params = { split: 20 },
}: BlockifyConfig): Promise<void> => {
  handlerBW({
    input,
    output,
    processor: blockify,
    params,
  });
};
