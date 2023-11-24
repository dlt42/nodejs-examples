/* eslint-disable no-console */
import { getErrorMessage } from './executable';
import { grabStringFlag, grabNumericFlag } from './flags/flag';
import { splitFlag } from './flags/splitFlag';
import { outputFlag } from './flags/outputFlag';
import { inputFlag } from './flags/inputFlag';
import { modeFlag } from './flags/modeFlag';
import {
  BlockifyParams,
  blockifyProcessor,
} from '../processors/blockifyProcessor';
import { pixelProcessorOperation } from '../operations/pixelProcessorOperation';

try {
  const mode = grabStringFlag(modeFlag);
  const output = grabStringFlag(outputFlag);
  const input = grabStringFlag(inputFlag);
  const split = grabNumericFlag(splitFlag);
  pixelProcessorOperation<BlockifyParams>(
    {
      input,
      output,
      split,
      mode,
      fillAlpha: false,
    },
    blockifyProcessor,
  );
} catch (e) {
  console.log(getErrorMessage(e));
  console.log(JSON.stringify(process.argv));
}
