import { FlagConfig, GrabFlagParams } from './flag';

const inputConfig: FlagConfig<string> = {
  type: 'required',
};

export const inputFlag: GrabFlagParams<string, typeof inputConfig> = {
  config: inputConfig,
  description: 'Input filename for saving processed image',
  flag: '--input',
};
