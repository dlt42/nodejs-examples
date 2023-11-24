export const modeOptions = ['bw', 'col'] as const;

export type ModeOptions = (typeof modeOptions)[number];

export type Config<T> = {
  input: string;
  output: string;
  mode: ModeOptions;
} & T;
