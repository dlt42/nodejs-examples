import {
  BlockCountOptions,
  blockCountOptions,
} from '../../processors/blockifyProcessor';
import { FlagConfig, GrabFlagParams } from './flag';

const blockCountConfig: FlagConfig<BlockCountOptions> = {
  options: blockCountOptions,
  defaultValue: 20,
  type: 'default',
};

export const blockCountFlag: GrabFlagParams<
  BlockCountOptions,
  typeof blockCountConfig
> = {
  config: blockCountConfig,
  description: 'Number of block per row/column (default 20)',
  flag: '--blockCount',
};
