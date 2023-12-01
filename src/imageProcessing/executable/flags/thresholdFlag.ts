import { FlagConfig, GrabFlagParams } from './flag';

const thresholdConfigRequired: FlagConfig<number> = {
  min: 0,
  max: 255,
  type: 'required',
};

const thresholdConfig: FlagConfig<number> = {
  min: 0,
  max: 255,
  type: 'optional',
};

export const thresholdFlag1: GrabFlagParams<
  number,
  typeof thresholdConfigRequired
> = {
  config: thresholdConfigRequired,
  description: 'Threshold 1 for conversion',
  flag: '--t1',
};

export const thresholdFlag2: GrabFlagParams<number, typeof thresholdConfig> = {
  config: thresholdConfig,
  description: 'Threshold 2 for conversion',
  flag: '--t2',
};
