import sharp from 'sharp';

export const blockifyBW = async ({
  inputFilename,
  outputFilename,
}: {
  inputFilename: string;
  outputFilename: string;
}) => {
  const { data, info } = await sharp(inputFilename)
    .ensureAlpha()
    .toColourspace('b-w')
    .raw()
    .toBuffer({ resolveWithObject: true });
  const pixelArray = new Uint8ClampedArray(data.buffer);
  const { width, height, channels } = info;
  const split = 20;
  const blockWidth = width / split;
  const blockHeight = height / split;
  for (let x = 0; x < split; x++) {
    for (let y = 0; y < split; y++) {
      const sx = x * blockWidth;
      const sy = y * blockHeight;
      const ex = (x + 1) * blockWidth;
      const ey = (y + 1) * blockHeight;
      let sum = 0;
      for (let iy = sy; iy < ey; iy++)
        sum += pixelArray
          .slice(sx + width * iy, ex + width * iy)
          .reduce((prev, current) => prev + current, 0);
      const average = sum / (blockWidth * blockHeight);
      for (let iy = sy; iy < ey; iy++)
        pixelArray.fill(average, sx + width * iy, ex + width * iy);
    }
  }
  await sharp(pixelArray, { raw: { width, height, channels } })
    .toFormat('png')
    .toFile(outputFilename);
};
