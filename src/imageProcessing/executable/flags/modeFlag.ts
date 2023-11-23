import { FlagConfig, GrabFlagParams } from '../flag';

const modeOptions = ['bw', 'col'] as const;

type ModeOptions = (typeof modeOptions)[number];

const modeConfig: FlagConfig<ModeOptions> = {
  options: modeOptions,
  defaultValue: 'col',
};

export const modeFlag: GrabFlagParams<ModeOptions, typeof modeConfig> = {
  config: modeConfig,
  description: `Colour mode for the output, 'col' (color - default) or 'bw' (black and white)`,
  flag: '--mode',
};
