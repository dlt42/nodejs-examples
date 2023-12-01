import { BandOptions, bandOptions } from '../../processors/bandifyProcessor';
import { FlagConfig, GrabFlagParams } from './flag';

const bandConfig: FlagConfig<BandOptions> = {
  options: bandOptions,
  defaultValue: 4,
  type: 'default',
};

export const bandFlag: GrabFlagParams<BandOptions, typeof bandConfig> = {
  config: bandConfig,
  description: 'Thickness of bands (default 4)',
  flag: '--band',
};
