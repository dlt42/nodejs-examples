import { bandifyBW } from '../operations/bandifyBW';
import { bandifySRGB } from '../operations/bandifySRGB';

bandifyBW({
  inputFilename: 'input.png',
  outputFilename: 'output_b-w_bandify_4.png',
  params: { bandWidth: 4 },
});
bandifyBW({
  inputFilename: 'input.png',
  outputFilename: 'output_b-w_bandify_6.png',
  params: { bandWidth: 6 },
});
bandifyBW({
  inputFilename: 'input.png',
  outputFilename: 'output_b-w_bandify_16.png',
  params: { bandWidth: 16 },
});

bandifySRGB({
  inputFilename: 'input.png',
  outputFilename: 'output_srgb_bandify_4.png',
  params: { bandWidth: 4 },
});
bandifySRGB({
  inputFilename: 'input.png',
  outputFilename: 'output_srgb_bandify_6.png',
  params: { bandWidth: 6 },
});
bandifySRGB({
  inputFilename: 'input.png',
  outputFilename: 'output_srgb_bandify_16.png',
  fillAlpha: true,
  params: { bandWidth: 16 },
});
