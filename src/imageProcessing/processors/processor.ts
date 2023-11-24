import { Sharp } from 'sharp';
import { Channel } from '../handlers/handlerSRGB';

type ProcessorBaseParams = {
  height: number;
  width: number;
};

export type PixelProcessorParams = ProcessorBaseParams & {
  type: 'pixel';
  pixelArray: Uint8ClampedArray;
  currentChannel: Channel | null;
};

export type SharpProcessorParams = ProcessorBaseParams & {
  type: 'sharp';
  sharp: Sharp;
};

type ProcessorParams = PixelProcessorParams | SharpProcessorParams;

type Processor<T extends object, P extends ProcessorParams> = (
  params: T & P,
) => P extends PixelProcessorParams ? void : Promise<Sharp>;

export type SharpProcessor<T extends object> = Processor<
  T,
  SharpProcessorParams
>;

export type PixelProcessor<T extends object> = Processor<
  T,
  PixelProcessorParams
>;

export type PixelProcessorParam<T extends object> = {
  processor: Processor<T, PixelProcessorParams>;
};

export type SharpProcessorParam<T extends object> = {
  processor: Processor<T, SharpProcessorParams>;
};
