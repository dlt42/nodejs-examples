/* eslint-disable no-console */
import { getErrorMessage } from './executable';
import { grabStringFlag, grabRangedNumericFlag } from './flags/flag';
import { outputFlag } from './flags/outputFlag';
import { inputFlag } from './flags/inputFlag';
import { thresholdFlag } from './flags/thresholdFlag';
import {
  SplitifyParams,
  splitifyProcessor,
} from '../processors/splitifyProcessor';
import { sharpHandler } from '../handlers/sharpHandler';

try {
  const output = grabStringFlag(outputFlag);
  const input = grabStringFlag(inputFlag);
  const threshold = grabRangedNumericFlag(thresholdFlag);

  sharpHandler<SplitifyParams>({
    input,
    output,
    threshold,
    processor: splitifyProcessor,
    mode: 'col',
  });
} catch (e) {
  console.error(getErrorMessage(e));
  console.error(JSON.stringify(process.argv));
}
