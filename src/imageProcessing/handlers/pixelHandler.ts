import sharp, { Sharp } from 'sharp';
import {
  PixelProcessorParam,
  PixelProcessorParams,
  Processor,
} from '../processors/processor';
import { checkFile } from './handlers';
import { Channel, SrgbChannels } from '../shared';

export const pixelHandler = async <T extends object>(
  params: PixelProcessorParam<T>,
): Promise<void> => {
  const { input, output, processor, mode } = params;

  // Check the output filename and delete the file if it exists
  checkFile(output);

  // Load the image and extract the raw data
  const raw = await Promise.resolve(sharp(input))
    .then((s) => s.ensureAlpha(0))
    .then((s) =>
      mode === 'bw' ? s.toColourspace('b-w') : s.toColourspace('srgb'),
    )
    .then((s) => s.raw());

  // Get the dimensions
  const { width, height } = await raw.metadata();

  if (!height || !width) {
    throw Error('Dimensions could not be determined');
  }

  // Prepare the metadata for recombining the channel buffers
  const options = {
    raw: {
      width: width,
      height: height,
      channels: 1 as const,
    },
  };

  const processorParams = {
    height,
    params,
    processor,
    width,
  };

  if (mode === 'bw') {
    const bufferData = await callProcessor({
      ...processorParams,
      raw,
      currentChannel: null,
    });

    // Output the result as a PNG
    await sharp(bufferData, options).toFormat('png').toFile(output);
  } else {
    const channelBufferArray: Buffer[] = new Array<Buffer>(4);

    // Process each channel in the raw image data
    await Promise.all(
      SrgbChannels.map(async (currentChannel, channelIndex) => {
        channelBufferArray[channelIndex] = await callProcessor({
          ...processorParams,
          raw: raw.extractChannel(currentChannel),
          currentChannel,
        });
      }),
    );

    // Recombine the channel buffers and output the result as a PNG
    let result = await sharp(channelBufferArray[0], options);
    for (let i = 1; i < channelBufferArray.length; i++) {
      result = await result.joinChannel(channelBufferArray[i], options);
    }
    await result.toFormat('png').toFile(output);
  }
};

const callProcessor = async <T extends object>({
  height,
  params,
  processor,
  raw,
  width,
  currentChannel,
}: {
  raw: Sharp;
  height: number;
  width: number;
  params: PixelProcessorParam<T>;
  processor: Processor<T, PixelProcessorParams>;
  currentChannel: Channel | null;
}) => {
  const { data: bufferData } = await raw.toBuffer({
    resolveWithObject: true,
  });

  // Convert the buffer data for more type safe processing
  // Uint8ClampedArray clamps values between 0 and 255 and doesn't create a copy of the data in the passed ArrayBuffer
  // Instead it changes the passed ArrayBuffer so that both it and the Uint8ClampedArray point to the same memory location.
  const pixelArray = new Uint8ClampedArray(bufferData.buffer);

  // Process the data
  await processor({
    type: 'pixel',
    pixelArray,
    currentChannel,
    height,
    width,
    ...params,
  });

  return bufferData;
};
