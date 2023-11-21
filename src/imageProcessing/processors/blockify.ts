import { Processor } from './processor';

export type BlockifyParams = {
  split: number;
};

export const blockify: Processor<BlockifyParams> = ({
  width,
  height,
  split,
  bufferData,
}: {
  height: number;
  width: number;
  split: number;
  bufferData: Buffer;
}) => {
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
        const subArray = bufferData.subarray(sx + width * iy, ex + width * iy);
        sum += subArray.reduce((prev, current) => prev + current, 0);
        subArrays.push(subArray);
      }

      // Fill the block with the average value
      const average = sum / blockLength;
      subArrays.forEach((subArray) => subArray.fill(average));
    }
  }
};
