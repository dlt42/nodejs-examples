import { handlerSRGB } from '../handlers/handlerSRGB';
import { BandifyConfig, BandifyParams, bandify } from '../processors/bandify';

export const bandifySRGB = async ({
  input,
  output,
  fillAlpha = false,
  params = { band: 2 },
}: BandifyConfig): Promise<void> => {
  handlerSRGB<BandifyParams>({
    input,
    output,
    fillAlpha,
    params,
    processor: bandify,
  });
};
