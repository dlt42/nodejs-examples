import { FlagConfig, GrabFlagParams } from '../flag';

const bandOptions = [2, 4, 6, 8, 10, 12, 14] as const;

type BandOptions = (typeof bandOptions)[number];

const bandConfig: FlagConfig<BandOptions> = {
  options: bandOptions,
  defaultValue: 4,
};

export const bandFlag: GrabFlagParams<BandOptions, typeof bandConfig> = {
  config: bandConfig,
  description: 'Thickness of bands (default 4)',
  flag: '--band',
};
