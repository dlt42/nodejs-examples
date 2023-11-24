import sharp from 'sharp';
import { PixelProcessorParam } from '../processors/processor';
import { checkFile } from './handler';
import { Config } from '../operations/operation';

export const handlerBW = async <T extends object>(
  params: Config<T> & PixelProcessorParam<T>,
): Promise<void> => {
  const { input, output, processor } = params;
  // Load the image, convert to black and white, and extract the raw data
  const { data: bufferData, info } = await sharp(input)
    .ensureAlpha()
    .toColourspace('b-w')
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Convert the buffer data for more type safe processing
  // Uint8ClampedArray clamps values between 0 and 255 and doesn't create a copy of the data in the passed ArrayBuffer
  // Instead it changes the passed ArrayBuffer so that both it and the Uint8ClampedArray point to the same memory location.
  const pixelArray = new Uint8ClampedArray(bufferData.buffer);

  // Get the dimensions
  const { width, height, channels } = info;

  // Process the data
  await processor({
    type: 'pixel',
    pixelArray,
    currentChannel: null,
    height,
    width,
    ...params,
  });

  // Check the output filename and delete the file if it exists
  checkFile(output);

  // Output the result as a PNG
  await sharp(bufferData, { raw: { width, height, channels } })
    .toFormat('png')
    .toFile(output);
};
