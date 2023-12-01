import { ModeOptions, modeOptions } from '../../processors/processor';
import { FlagConfig, GrabFlagParams } from './flag';

const modeConfig: FlagConfig<ModeOptions> = {
  options: modeOptions,
  defaultValue: 'col',
  type: 'default',
};

export const modeFlag: GrabFlagParams<ModeOptions, typeof modeConfig> = {
  config: modeConfig,
  description: `Colour mode for the output, 'col' (color - default) or 'bw' (black and white)`,
  flag: '--mode',
};
