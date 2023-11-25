/* eslint-disable no-console */
import { getErrorMessage } from './executable';
import { grabStringFlag, grabNumericFlag } from './flags/flag';
import { blockCountFlag } from './flags/blockCountFlag';
import { outputFlag } from './flags/outputFlag';
import { inputFlag } from './flags/inputFlag';
import { modeFlag } from './flags/modeFlag';
import {
  BlockifyParams,
  blockifyProcessor,
} from '../processors/blockifyProcessor';
import { pixelHandler } from '../handlers/pixelHandler';

try {
  const mode = grabStringFlag(modeFlag);
  const output = grabStringFlag(outputFlag);
  const input = grabStringFlag(inputFlag);
  const blockCount = grabNumericFlag(blockCountFlag);

  pixelHandler<BlockifyParams>({
    input,
    output,
    blockCount,
    mode,
    fillAlpha: false,
    processor: blockifyProcessor,
  });
} catch (e) {
  console.log(getErrorMessage(e));
  console.log(JSON.stringify(process.argv));
}
