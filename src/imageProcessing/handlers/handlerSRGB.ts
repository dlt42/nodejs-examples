import sharp from 'sharp';
import { PixelProcessorParam } from '../processors/processor';
import { checkFile } from './handler';
import { Config } from '../operations/operation';

export type Channel = 'red' | 'green' | 'blue' | 'alpha';

export const handlerSRGB = async <T extends object>(
  params: Config<T> & PixelProcessorParam<T>,
): Promise<void> => {
  const { input, output, processor } = params;

  const channelBufferArray: Buffer[] = new Array<Buffer>(4);

  // Load the image and extract the raw data
  const raw = await sharp(input).ensureAlpha().raw();

  // Get the image dimensions for subsequent calculations
  const { width, height } = await raw.metadata();
  if (width === undefined || height === undefined)
    throw Error('Unable to determine image dimensions');

  // Process each channel in the raw image data
  const channelArray: Channel[] = ['red', 'green', 'blue', 'alpha'];
  await Promise.all(
    channelArray.map(async (currentChannel, channelIndex) => {
      // Get the buffer for the current channel
      const { data: bufferData } = await raw
        .extractChannel(currentChannel)
        .toBuffer({ resolveWithObject: true });

      // Convert the buffer data for more type safe processing
      // Uint8ClampedArray clamps values between 0 and 255 and doesn't create a copy of the data in the passed ArrayBuffer
      // Instead it changes the passed ArrayBuffer so that both it and the Uint8ClampedArray point to the same memory location.
      const pixelArray = new Uint8ClampedArray(bufferData.buffer);

      // Process the channel data
      await processor({
        pixelArray,
        height,
        width,
        type: 'pixel',
        currentChannel,
        ...params,
      });

      // Store the buffer data
      // Could use Buffer.from(pixelArray) instead but they're both the same thing
      channelBufferArray[channelIndex] = bufferData;
    }),
  );

  // Check the output  and delete the file if it exists
  checkFile(output);

  // Prepare the metadata for recombining the channel buffers
  const options = {
    raw: {
      width: width,
      height: height,
      channels: 1 as const,
    },
  };

  // Recombine the channel buffers and output the result as a PNG
  await sharp(channelBufferArray[0], options)
    .joinChannel(channelBufferArray[1], options)
    .joinChannel(channelBufferArray[2], options)
    .joinChannel(channelBufferArray[3], options)
    .toColourspace('srgb')
    .toFormat('png')
    .toFile(output);
};
