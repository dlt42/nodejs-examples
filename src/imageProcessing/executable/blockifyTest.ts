import { blockifyBW } from '../operations/blockifyBW';
import { blockifySRGB } from '../operations/blockifySRGB';

blockifyBW({
  inputFilename: 'input.png',
  outputFilename: 'output_b-w_blockify.png',
  params: {
    split: 80,
  },
});
blockifySRGB({
  inputFilename: 'input.png',
  outputFilename: 'output_srgb_blockify.png',
  fillAlpha: false,
  params: {
    split: 80,
  },
});
