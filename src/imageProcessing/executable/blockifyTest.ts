/* eslint-disable no-console */
import { getErrorMessage } from '../handlers/utils';
import { grabStringFlag, grabNumericFlag } from './flag';
import { blockifyBW } from '../operations/blockifyBW';
import { blockifySRGB } from '../operations/blockifySRGB';
import { splitFlag } from './flags/splitFlag';
import { outputFlag } from './flags/outputFlag';
import { inputFlag } from './flags/inputFlag';
import { modeFlag } from './flags/modeFlag';

try {
  const mode = grabStringFlag(modeFlag);
  const output = grabStringFlag(outputFlag);
  const input = grabStringFlag(inputFlag);
  const split = grabNumericFlag(splitFlag);

  const params = {
    input,
    output,
    params: {
      split,
    },
  };
  if (mode === 'bw') blockifyBW(params);
  if (mode === 'col') blockifySRGB(params);
} catch (e) {
  console.log(getErrorMessage(e));
  console.log(JSON.stringify(process.argv));
}
