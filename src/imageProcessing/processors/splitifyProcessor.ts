import { SharpProcessor } from './processor';

export type SplitifyParams = {
  threshold: number;
};

export const splitifyProcessor: SharpProcessor<SplitifyParams> = async ({
  sharp,
  threshold,
}) => {
  const sharpResult = await sharp.threshold(threshold);
  return sharpResult;
};
