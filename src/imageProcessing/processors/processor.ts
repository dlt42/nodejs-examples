type ProcessorParams = {
  height: number;
  bufferData: Buffer;
  width: number;
};

export type Processor<T extends object> = (params: ProcessorParams & T) => void;
