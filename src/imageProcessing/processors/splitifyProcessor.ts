import { deepCopy } from 'deep-copy-ts';
import { Processor, SharpProcessorParams } from './processor';
import { BwChannels, SrgbChannels } from '../shared';
import sharp from 'sharp';

export type SplitifyParams = {
  t1: number;
  t2?: number;
};

export const splitifyProcessor: Processor<
  SplitifyParams,
  SharpProcessorParams
> = async ({ raw, width, height, t1, t2, mode }) => {
  let low = t1;
  let high = t2;
  if (high !== undefined && low > high) {
    const temp = low;
    low = high;
    high = temp;
  }
  const channels = mode === 'bw' ? BwChannels : SrgbChannels;
  const channelCopyBufferArray: Buffer[] = new Array<Buffer>();
  const channelCopyIntArray: Uint8ClampedArray[] =
    new Array<Uint8ClampedArray>();
  const length = channels.length;
  for (let i = 0; i < length; i++) {
    const { data: bufferData } = await raw
      .extractChannel(channels[i])
      .toBuffer({
        resolveWithObject: true,
      });
    channelCopyBufferArray[i] = deepCopy(bufferData);
    channelCopyIntArray[i] = new Uint8ClampedArray(channelCopyBufferArray[i]);
  }

  for (let i = 0; i < width * height; i++) {
    const total = channelCopyIntArray.reduce(
      (total, current, index) =>
        index < length - 1 ? total + current[i] : total,
      0,
    );
    const average = total / (length - 1);
    const isOutside = average <= low || (high !== undefined && average >= high);
    channelCopyBufferArray[length - 1].set([isOutside ? 0 : 255], i);
  }
  const options = {
    raw: {
      width: width,
      height: height,
      channels: 1 as const,
    },
  };
  let result = await sharp(channelCopyBufferArray[0], options);
  for (let i = 1; i < length; i++) {
    result = await result.joinChannel(channelCopyBufferArray[i], options);
  }
  return await result;
};
