/* eslint-disable no-console */
import { getErrorMessage } from './executable';
import { grabStringFlag, grabNumericFlag } from './flags/flag';
import { bandifyOperation } from '../operations/bandifyOperation';
import { bandFlag } from './flags/bandFlag';
import { outputFlag } from './flags/outputFlag';
import { inputFlag } from './flags/inputFlag';
import { modeFlag } from './flags/modeFlag';

try {
  const mode = grabStringFlag(modeFlag);
  const output = grabStringFlag(outputFlag);
  const input = grabStringFlag(inputFlag);
  const band = grabNumericFlag(bandFlag);
  bandifyOperation({
    input,
    output,
    band,
    mode,
  });
} catch (e) {
  console.error(getErrorMessage(e));
  console.error(JSON.stringify(process.argv));
}
