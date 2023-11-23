import { BandifyConfig, BandifyParams, bandify } from '../processors/bandify';
import { handlerBW } from '../handlers/handlerBW';

export const bandifyBW = async ({
  input,
  output,
  params = { band: 2 },
}: BandifyConfig): Promise<void> => {
  handlerBW<BandifyParams>({
    input,
    output,
    processor: bandify,
    params,
  });
};
