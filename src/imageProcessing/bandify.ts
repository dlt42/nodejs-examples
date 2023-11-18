import sharp from 'sharp';

export const bandify = async (
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
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (x % 2 === 0) pixelArray[x + width * y] = 0;
    }
  }
  await sharp(pixelArray, { raw: { width, height, channels } })
    .toFormat('png')
    .toFile(outputFilename);
};
