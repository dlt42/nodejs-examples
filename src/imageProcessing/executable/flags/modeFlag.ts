import { ModeOptions, modeOptions } from '../../operations/operation';
import { FlagConfig, GrabFlagParams } from './flag';

const modeConfig: FlagConfig<ModeOptions> = {
  options: modeOptions,
  defaultValue: 'col',
};

export const modeFlag: GrabFlagParams<ModeOptions, typeof modeConfig> = {
  config: modeConfig,
  description: `Colour mode for the output, 'col' (color - default) or 'bw' (black and white)`,
  flag: '--mode',
};
