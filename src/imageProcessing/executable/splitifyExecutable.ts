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
import { modeFlag } from './flags/modeFlag';

try {
  sharpHandler<SplitifyParams>({
    input: grabStringFlag(inputFlag),
    output: grabStringFlag(outputFlag),
    threshold: grabRangedNumericFlag(thresholdFlag),
    processor: splitifyProcessor,
    mode: grabStringFlag(modeFlag),
  });
} catch (e) {
  console.error(getErrorMessage(e));
  console.error(JSON.stringify(process.argv));
}
