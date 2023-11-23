import { FlagConfig, GrabFlagParams } from '../flag';

const splitOptions = [2, 4, 6, 8, 10, 20, 30, 40, 50, 60, 70] as const;

type SplitOptions = (typeof splitOptions)[number];

const splitConfig: FlagConfig<SplitOptions> = {
  options: splitOptions,
  defaultValue: 20,
};

export const splitFlag: GrabFlagParams<SplitOptions, typeof splitConfig> = {
  config: splitConfig,
  description: 'Number of rows/columns (default 20)',
  flag: '--split',
};
