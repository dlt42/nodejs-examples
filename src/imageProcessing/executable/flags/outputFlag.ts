import { FlagConfig, GrabFlagParams } from './flag';

const outputConfig: FlagConfig<string> = {
  type: 'required',
};

export const outputFlag: GrabFlagParams<string, typeof outputConfig> = {
  config: outputConfig,
  description: 'Output filename for saving processed image',
  flag: '--output',
};
