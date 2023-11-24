import {
  BandifyParams,
  bandifyProcessor,
} from '../processors/bandifyProcessor';
import { handlerSRGB } from '../handlers/handlerSRGB';
import { Config } from './operation';
import { handlerBW } from '../handlers/handlerBW';

export const bandifyOperation = async (
  params: Config<BandifyParams>,
): Promise<void> => {
  switch (params.mode) {
    case 'col':
      handlerSRGB<BandifyParams>({
        ...params,
        processor: bandifyProcessor,
      });
      break;
    case 'bw':
      handlerBW<BandifyParams>({
        ...params,
        processor: bandifyProcessor,
      });
      break;
  }
};
