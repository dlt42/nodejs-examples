import sharp from 'sharp';
import fs from 'fs';
import { blockify } from './blockify';

type Channel = 'red' | 'green' | 'blue' | 'alpha';
type ChannelCount = 1 | 2 | 3 | 4;

export const blockifySRGB = async ({
  inputFilename,
  outputFilename,
  fillAlpha = false,
  split = 20,
}: {
  inputFilename: string;
  outputFilename: string;
  fillAlpha?: boolean;
  split?: number;
}): Promise<void> => {
  const channelBufferArray: Buffer[] = new Array<Buffer>(4);

  // Load the image and extract the raw data
  const raw = await sharp(inputFilename).ensureAlpha().raw();

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

      // Convert the buffer data for processing
      const pixelArray = new Uint8ClampedArray(bufferData.buffer);

      // If the current channel is Alpha then fill it so there is no transparency
      if (fillAlpha && currentChannel === 'alpha') {
        pixelArray.fill(255);

        // Store the buffer data
        channelBufferArray[channelIndex] = Buffer.from(pixelArray);
        return;
      }

      blockify({
        bufferData,
        height,
        split,
        width,
      });

      // Store the buffer data
      channelBufferArray[channelIndex] = Buffer.from(pixelArray);
    }),
  );

  // If the output file already exists delete it
  if (fs.existsSync(outputFilename) && fs.statSync(outputFilename).isFile())
    fs.unlinkSync(outputFilename);

  // Prepare the metadata for recombining the channel buffers
  const dataChannelCount: ChannelCount = 1;
  const options = {
    raw: {
      width: width,
      height: height,
      channels: dataChannelCount,
    },
  };

  // Recombine the channel buffers and output the result as a PNG
  await sharp(channelBufferArray[0], options)
    .joinChannel(channelBufferArray[1], options)
    .joinChannel(channelBufferArray[2], options)
    .joinChannel(channelBufferArray[3], options)
    .toColourspace('srgb')
    .toFormat('png')
    .toFile(outputFilename);
};
