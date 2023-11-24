/* eslint-disable no-console */
import { getErrorMessage } from './executable';
import { grabStringFlag, grabNumericFlag } from './flags/flag';
import { blockifyOperation } from '../operations/blockifyOperation';
import { splitFlag } from './flags/splitFlag';
import { outputFlag } from './flags/outputFlag';
import { inputFlag } from './flags/inputFlag';
import { modeFlag } from './flags/modeFlag';

try {
  const mode = grabStringFlag(modeFlag);
  const output = grabStringFlag(outputFlag);
  const input = grabStringFlag(inputFlag);
  const split = grabNumericFlag(splitFlag);
  blockifyOperation({
    input,
    output,
    split,
    mode,
    fillAlpha: false,
  });
} catch (e) {
  console.log(getErrorMessage(e));
  console.log(JSON.stringify(process.argv));
}
