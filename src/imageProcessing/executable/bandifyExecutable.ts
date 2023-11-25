/* eslint-disable no-console */
import { getErrorMessage } from './executable';
import { grabStringFlag, grabNumericFlag } from './flags/flag';
import { bandFlag } from './flags/bandFlag';
import { outputFlag } from './flags/outputFlag';
import { inputFlag } from './flags/inputFlag';
import { modeFlag } from './flags/modeFlag';
import {
  BandifyParams,
  bandifyProcessor,
} from '../processors/bandifyProcessor';
import { pixelHandler } from '../handlers/pixelHandler';

try {
  const mode = grabStringFlag(modeFlag);
  const output = grabStringFlag(outputFlag);
  const input = grabStringFlag(inputFlag);
  const band = grabNumericFlag(bandFlag);

  pixelHandler<BandifyParams>({
    input,
    output,
    band,
    mode,
    processor: bandifyProcessor,
  });
} catch (e) {
  console.error(getErrorMessage(e));
  console.error(JSON.stringify(process.argv));
}
