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
import { sharpProcessorOperation } from '../operations/sharpProcessorOperation copy';

try {
  const output = grabStringFlag(outputFlag);
  const input = grabStringFlag(inputFlag);
  const threshold = grabRangedNumericFlag(thresholdFlag);
  sharpProcessorOperation<SplitifyParams>(
    {
      input,
      output,
      threshold,
    },
    splitifyProcessor,
  );
} catch (e) {
  console.error(getErrorMessage(e));
  console.error(JSON.stringify(process.argv));
}
