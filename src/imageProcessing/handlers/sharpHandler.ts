import sharp from 'sharp';
import { SharpProcessorParam } from '../processors/processor';
import { checkFile } from './handlers';

export const sharpHandler = async <T extends object>(
  params: SharpProcessorParam<T>,
): Promise<void> => {
  const { input, output, processor, mode } = params;

  // Check the output filename and delete the file if it exists
  checkFile(output);

  // Load the image and extract the raw data
  const raw = await Promise.resolve(sharp(input))
    .then((s) => s.ensureAlpha())
    .then((s) =>
      mode === 'bw' ? s.toColourspace('b-w') : s.toColourspace('srgb'),
    )
    .then((s) => s.raw());

  // Get the dimensions
  const { width, height } = await raw.metadata();

  if (!height || !width) {
    throw Error('Dimensions could not be determined');
  }

  // Process the data
  const sharpResult = await processor({
    type: 'sharp',
    sharp: raw,
    height,
    width,
    ...params,
  });

  // Output the result as a PNG
  await sharpResult.toFormat('png').toFile(output);
};
