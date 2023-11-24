import { SplitOptions, splitOptions } from '../../processors/blockifyProcessor';
import { FlagConfig, GrabFlagParams } from './flag';

const splitConfig: FlagConfig<SplitOptions> = {
  options: splitOptions,
  defaultValue: 20,
};

export const splitFlag: GrabFlagParams<SplitOptions, typeof splitConfig> = {
  config: splitConfig,
  description: 'Number of rows/columns (default 20)',
  flag: '--split',
};
