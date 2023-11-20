import sharp from 'sharp';
import fs from 'fs';
import { blockify } from './blockify';

export const blockifyBW = async ({
  inputFilename,
  outputFilename,
  split = 20,
}: {
  inputFilename: string;
  outputFilename: string;
  split?: number;
}): Promise<void> => {
  // Load the image and extract the raw data
  const { data: bufferData, info } = await sharp(inputFilename)
    .ensureAlpha()
    .toColourspace('b-w')
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Convert the buffer data for processing
  const pixelArray = new Uint8ClampedArray(bufferData.buffer);

  // Calculate the dimensions of each block
  const { width, height, channels } = info;

  blockify({
    bufferData,
    height,
    split,
    width,
  });

  // If the output file already exists delete it
  if (fs.existsSync(outputFilename) && fs.statSync(outputFilename).isFile())
    fs.unlinkSync(outputFilename);

  // Output the result as a PNG
  await sharp(pixelArray, { raw: { width, height, channels } })
    .toFormat('png')
    .toFile(outputFilename);
};
