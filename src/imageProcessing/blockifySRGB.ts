import sharp from 'sharp';
import fs from 'fs';

type Channel = 'red' | 'green' | 'blue' | 'alpha';
type ChannelCount = 1 | 2 | 3 | 4;

export const blockifySRGB = async ({
  inputFilename,
  outputFilename,
  fillAlpha = false,
}: {
  inputFilename: string;
  outputFilename: string;
  fillAlpha?: boolean;
}): Promise<void> => {
  const split = 20;
  const channelBufferArray: Buffer[] = new Array<Buffer>(4);

  // Load the image and extract the raw data
  const raw = await sharp(inputFilename).ensureAlpha().raw();

  // Get the image dimensions for subsequent calculations
  const { width, height } = await raw.metadata();
  if (width === undefined || height === undefined)
    throw Error('Unable to determine image dimensions');

  // Calculate the dimensions of each block
  const blockWidth = Math.floor(width / split);
  const blockHeight = Math.floor(height / split);
  const blockLength = blockWidth * blockHeight;

  // Process each channel in the raw image data
  const channelArray: Channel[] = ['red', 'green', 'blue', 'alpha'];
  await Promise.all(
    channelArray.map(async (currentChannel, channelIndex) => {
      // Get the buffer for the current channel
      const { data: channelBufferData } = await raw
        .extractChannel(currentChannel)
        .toBuffer({ resolveWithObject: true });

      // Convert the buffer data for processing
      const pixelArray = new Uint8ClampedArray(channelBufferData.buffer);

      // If the current channel is Alpha then fill it so there is no transparency
      if (fillAlpha && currentChannel === 'alpha') {
        pixelArray.fill(255);

        // Store the buffer data
        channelBufferArray[channelIndex] = Buffer.from(pixelArray);
        return;
      }

      // Iterate through the blocks to be processed
      for (let x = 0; x < split; x++) {
        for (let y = 0; y < split; y++) {
          // Determine the top left and bottom right coordinates of the current block
          const sx = x * blockWidth;
          const sy = y * blockHeight;
          const ex = (x + 1) * blockWidth;
          const ey = (y + 1) * blockHeight;

          // Calculate the average value for the current block
          let sum = 0;
          const subArrays = [];
          for (let iy = sy; iy < ey; iy++) {
            const subArray = channelBufferData.subarray(
              sx + width * iy,
              ex + width * iy,
            );
            sum += subArray.reduce((prev, current) => prev + current, 0);
            subArrays.push(subArray);
          }

          // Fill the block with the average value
          const average = sum / blockLength;
          subArrays.forEach((subArray) => subArray.fill(average));
        }
      }

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
