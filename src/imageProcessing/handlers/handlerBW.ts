import sharp from 'sharp';
import fs from 'fs';
import { Processor } from '../processors/processor';

export const handlerBW = async <T extends object>({
  inputFilename,
  outputFilename,
  params,
  processor,
}: {
  inputFilename: string;
  outputFilename: string;
  params: T;
  processor: Processor<T>;
}): Promise<void> => {
  // Load the image and extract the raw data
  const { data: bufferData, info } = await sharp(inputFilename)
    .ensureAlpha()
    .toColourspace('b-w')
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Get the dimensions
  const { width, height, channels } = info;
  processor({
    bufferData,
    height,
    width,
    ...params,
  });

  // If the output file already exists delete it
  if (fs.existsSync(outputFilename) && fs.statSync(outputFilename).isFile())
    fs.unlinkSync(outputFilename);

  // Output the result as a PNG
  await sharp(bufferData, { raw: { width, height, channels } })
    .toFormat('png')
    .toFile(outputFilename);
};
