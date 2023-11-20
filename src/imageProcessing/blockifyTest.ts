import { blockifyBW } from './blockifyBW';
import { blockifySRGB } from './blockifySRGB';

blockifyBW({
  inputFilename: 'input.png',
  outputFilename: 'output_b-w_blockify.png',
});
blockifySRGB({
  inputFilename: 'input.png',
  outputFilename: 'output_srgb_blockify.png',
  fillAlpha: false,
  split: 30,
});
