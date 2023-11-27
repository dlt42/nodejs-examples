import { Processor, SharpProcessorParams } from './processor';

export type SplitifyParams = {
  threshold: number;
};

export const splitifyProcessor: Processor<
  SplitifyParams,
  SharpProcessorParams
> = async ({ sharp, threshold }) => {
  const sharpResult = await sharp.threshold(threshold);

  // WIP

  return sharpResult;
};
