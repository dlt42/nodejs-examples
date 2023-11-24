import { handlerBW } from '../handlers/handlerBW';
import { handlerSRGB } from '../handlers/handlerSRGB';
import { PixelProcessorParams, Processor } from '../processors/processor';
import { Config } from './operation';

export const pixelProcessorOperation = async <T extends object>(
  params: Config<T>,
  processor: Processor<T, PixelProcessorParams>,
): Promise<void> => {
  switch (params.mode) {
    case 'col':
      handlerSRGB<T>({ ...params, processor });
      break;
    case 'bw':
      handlerBW<T>({
        ...params,
        processor,
      });
      break;
  }
};
