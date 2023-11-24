import { handlerSharp } from '../handlers/handlerSharp';
import { Processor, SharpProcessorParams } from '../processors/processor';
import { Config } from './operation';

export const sharpProcessorOperation = async <T extends object>(
  params: Config<T>,
  processor: Processor<T, SharpProcessorParams>,
): Promise<void> => {
  handlerSharp<T>({ ...params, processor });
};
