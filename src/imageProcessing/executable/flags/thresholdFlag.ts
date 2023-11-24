import { FlagConfig, GrabFlagParams } from './flag';

const thresholdConfig: FlagConfig<number> = {
  min: 0,
  max: 255,
};

export const thresholdFlag: GrabFlagParams<number, typeof thresholdConfig> = {
  config: thresholdConfig,
  description: 'Threshold for conversion',
  flag: '--threshold',
};
