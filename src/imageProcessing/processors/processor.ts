import { Sharp } from 'sharp';
export type Channel = 'red' | 'green' | 'blue' | 'alpha';

export const modeOptions = ['bw', 'col'] as const;

export type ModeOptions = (typeof modeOptions)[number];

export type Processor<T extends object, P extends ProcessorParams> = (
  params: P & {
    height: number;
    width: number;
  } & T,
) => P extends PixelProcessorParams ? void : Promise<Sharp>;

export type Config<T extends object, P extends ProcessorParams> = {
  input: string;
  output: string;
  mode: ModeOptions;
  processor: Processor<T, P>;
} & T;

export type PixelProcessorParams = {
  type: 'pixel';
  pixelArray: Uint8ClampedArray;
  currentChannel: Channel | null;
};

export type SharpProcessorParams = {
  type: 'sharp';
  sharp: Sharp;
};

export type PixelProcessorParam<T extends object> = Config<
  T,
  PixelProcessorParams
>;

export type SharpProcessorParam<T extends object> = Config<
  T,
  SharpProcessorParams
>;

export type ProcessorParams = PixelProcessorParams | SharpProcessorParams;
