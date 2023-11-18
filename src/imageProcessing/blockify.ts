import sharp from 'sharp';

export const blockify = async (
  inputFilename: string,
  outputFilename: string,
  colourspace: string,
) => {
  const { data, info } = await sharp(inputFilename)
    .ensureAlpha()
    .toColourspace(colourspace)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const pixelArray = new Uint8ClampedArray(data.buffer);
  const { width, height, channels } = info;
  const blockWidth = width / 10;
  const blockHeight = height / 10;
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
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
