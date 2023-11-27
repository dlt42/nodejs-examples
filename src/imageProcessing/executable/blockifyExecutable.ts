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
  pixelHandler<BlockifyParams>({
    mode: grabStringFlag(modeFlag),
    output: grabStringFlag(outputFlag),
    input: grabStringFlag(inputFlag),
    blockCount: grabNumericFlag(blockCountFlag),
    fillAlpha: false,
    processor: blockifyProcessor,
  });
} catch (e) {
  console.log(getErrorMessage(e));
  console.log(JSON.stringify(process.argv));
}
