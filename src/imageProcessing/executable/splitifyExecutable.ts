/* eslint-disable no-console */
import { getErrorMessage } from './executable';
import { grabStringFlag, grabRangedNumericFlag } from './flags/flag';
import { outputFlag } from './flags/outputFlag';
import { inputFlag } from './flags/inputFlag';
import { thresholdFlag1, thresholdFlag2 } from './flags/thresholdFlag';
import {
  SplitifyParams,
  splitifyProcessor,
} from '../processors/splitifyProcessor';
import { modeFlag } from './flags/modeFlag';
import { sharpHandler } from '../handlers/sharpHandler';

try {
  sharpHandler<SplitifyParams>({
    input: grabStringFlag(inputFlag),
    output: grabStringFlag(outputFlag),
    t1: grabRangedNumericFlag(thresholdFlag1),
    t2: grabRangedNumericFlag(thresholdFlag2),
    processor: splitifyProcessor,
    mode: grabStringFlag(modeFlag),
  });
} catch (e) {
  console.error(getErrorMessage(e));
  console.error(JSON.stringify(process.argv));
}
