import {
  BlockifyParams,
  blockifyProcessor,
} from '../processors/blockifyProcessor';
import { handlerSRGB } from '../handlers/handlerSRGB';
import { Config } from './operation';
import { handlerBW } from '../handlers/handlerBW';

export const blockifyOperation = async (
  params: Config<BlockifyParams>,
): Promise<void> => {
  switch (params.mode) {
    case 'col':
      handlerSRGB<BlockifyParams>({
        ...params,
        processor: blockifyProcessor,
      });
      break;
    case 'bw':
      handlerBW<BlockifyParams>({
        ...params,
        processor: blockifyProcessor,
      });
      break;
  }
};
