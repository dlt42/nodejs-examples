type ProcessorParams = {
  height: number;
  pixelArray: Uint8ClampedArray;
  width: number;
};

export type Processor<T extends object> = (params: ProcessorParams & T) => void;
