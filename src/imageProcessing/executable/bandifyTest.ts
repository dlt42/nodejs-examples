/* eslint-disable no-console */
import { getErrorMessage } from '../handlers/utils';
import { grabStringFlag, grabNumericFlag } from './flag';
import { bandifyBW } from '../operations/bandifyBW';
import { bandifySRGB } from '../operations/bandifySRGB';
import { bandFlag } from './flags/bandFlag';
import { outputFlag } from './flags/outputFlag';
import { inputFlag } from './flags/inputFlag';
import { modeFlag } from './flags/modeFlag';

try {
  const mode = grabStringFlag(modeFlag);
  const output = grabStringFlag(outputFlag);
  const input = grabStringFlag(inputFlag);
  const band = grabNumericFlag(bandFlag);

  const params = {
    input,
    output,
    params: {
      band,
    },
  };
  if (mode === 'bw') bandifyBW(params);
  if (mode === 'col') bandifySRGB(params);
} catch (e) {
  console.error(getErrorMessage(e));
  console.error(JSON.stringify(process.argv));
}
