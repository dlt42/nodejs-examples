import { PixelProcessor } from './processor';

export const splitOptions = [2, 4, 6, 8, 10, 20, 30, 40, 50, 60, 70] as const;

export type SplitOptions = (typeof splitOptions)[number];

export type BlockifyParams = {
  split: SplitOptions;
  fillAlpha: boolean;
};

export const blockifyProcessor: PixelProcessor<BlockifyParams> = ({
  width,
  height,
  split,
  pixelArray,
  fillAlpha,
  currentChannel,
}) => {
  // If configured via the parameters and the current channel is Alpha then fill it so there is no transparency
  if (fillAlpha && currentChannel === 'alpha') {
    pixelArray.fill(255);
    return;
  }

  // Calculate the dimensions of each block
  const blockWidth = Math.ceil(width / split);
  const blockHeight = Math.ceil(height / split);
  const blockLength = blockWidth * blockHeight;

  // Iterate through the blocks to be processed
  for (let x = 0; x < split; x++) {
    // Determine the left and right coordinates of the current block
    const sx = x * blockWidth;
    let ex = (x + 1) * blockWidth;

    if (ex > width) {
      ex = width;
      if (sx >= ex) {
        continue;
      }
    }

    for (let y = 0; y < split; y++) {
      // Determine the top and bottom coordinates of the current block
      const sy = y * blockHeight;
      let ey = (y + 1) * blockHeight;

      if (ey > height) {
        ey = height;
        if (sy >= ey) {
          continue;
        }
      }

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
    }
  }
};
