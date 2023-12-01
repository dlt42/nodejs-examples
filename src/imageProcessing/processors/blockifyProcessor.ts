import { PixelProcessorParams, Processor } from './processor';

export const blockCountOptions = [
  2, 4, 6, 8, 10, 20, 30, 40, 50, 60, 70,
] as const;

export type BlockCountOptions = (typeof blockCountOptions)[number];

export type BlockifyParams = {
  blockCount: BlockCountOptions;
  fillAlpha: boolean;
};

type AxisRanges = {
  sx: number;
  ex: number;
  sy: number;
  ey: number;
};

type Range = {
  start: number;
  end: number;
};

type IterateBlockAxisCallback = (params: Range) => void;

const iterateBlockAxis = (
  blockCount: number,
  blockLength: number,
  length: number,
  callback: IterateBlockAxisCallback,
) => {
  for (let i = 0; i < blockCount; i++) {
    // Determine the start and end coordinates for an axis of the current block
    const start = i * blockLength;
    let end = (i + 1) * blockLength;

    if (end > length) {
      end = length;
      if (start >= end) {
        continue;
      }
    }
    callback({ start, end });
  }
};

export const blockifyProcessor: Processor<
  BlockifyParams,
  PixelProcessorParams
> = ({ width, height, blockCount, pixelArray, fillAlpha, currentChannel }) => {
  // If configured via the parameters and the current channel is Alpha then fill it so there is no transparency
  if (fillAlpha && currentChannel === 'alpha') {
    pixelArray.fill(255);
    return;
  }

  // Calculate the dimensions of each block
  const blockWidth = Math.ceil(width / blockCount);
  const blockHeight = Math.ceil(height / blockCount);
  const blockLength = blockWidth * blockHeight;

  const calculateAverage = ({ sx, ex, sy, ey }: AxisRanges) => {
    // Calculate the average value for the current block
    let sum = 0;
    const subArrays = [];
    for (let iy = sy; iy < ey; iy++) {
      const subArray = pixelArray.subarray(sx + width * iy, ex + width * iy);
      sum += subArray.reduce((prev, current) => prev + current, 0);
      subArrays.push(subArray);
    }

    // Fill the block with the average value
    const average = sum / blockLength;
    subArrays.forEach((subArray) => subArray.fill(average));
  };

  // Iterate through the blocks to be processed
  iterateBlockAxis(blockCount, blockWidth, width, ({ start: sx, end: ex }) =>
    iterateBlockAxis(
      blockCount,
      blockHeight,
      height,
      ({ start: sy, end: ey }) => calculateAverage({ sx, ex, sy, ey }),
    ),
  );
};
