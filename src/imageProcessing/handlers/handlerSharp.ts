import sharp from 'sharp';
import { SharpProcessorParam } from '../processors/processor';
import { checkFile } from './handler';
import { Config } from '../operations/operation';

export const handlerSharp = async <T extends object>(
  params: Config<T> & SharpProcessorParam<T>,
): Promise<void> => {
  const { input, output, processor } = params;
  // Load the image and extract the raw data
  const sharpInstance = await sharp(input).ensureAlpha().raw();

  // Get the dimensions
  const { height, width } = await sharpInstance.metadata();
  if (!height || !width) {
    throw Error('Dimensions could not be determined');
  }

  // Process the data
  const sharpResult = await processor({
    type: 'sharp',
    sharp: sharpInstance,
    height,
    width,
    ...params,
  });

  // Check the output filename and delete the file if it exists
  checkFile(output);

  // Output the result as a PNG
  await sharpResult.toFormat('png').toFile(output);
};
