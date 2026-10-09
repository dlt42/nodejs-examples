type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

type Options<T> = IsUnion<T> extends true ? Readonly<T[]> : never;

type NumericAny<T> = IsUnion<T> extends true
  ? never
  : T extends number
  ? number
  : never;

type FlagConfigBase<T> = {
  options?: Options<T>;
  min?: NumericAny<T>;
  max?: NumericAny<T>;
};

type Required<T> = FlagConfigBase<T> & {
  type: 'required';
};

type Optional<T> = FlagConfigBase<T> & {
  type: 'optional';
};

type Default<T> = FlagConfigBase<T> & {
  type: 'default';
  defaultValue: T | undefined;
};

export type FlagConfig<T> = Required<T> | Optional<T> | Default<T>;

type Flag<T, C extends FlagConfig<T>> = {
  config: C;
  flag: string;
  description: string;
  prepareValue: (value: string) => T;
  validateValue?: (value: T) => void;
};

type GetFlagErrorParams = {
  flag: string;
  message: string;
  description: string;
};

type GrabFlagReturnType<T, C extends FlagConfig<T>> = C extends
  | Required<T>
  | Default<T>
  ? T
  : T | undefined;

export type GrabFlagParams<T, C extends FlagConfig<T>> = Omit<
  Flag<T, C>,
  'prepareValue' | 'validateValue'
>;

const getFlagError = ({ flag, message, description }: GetFlagErrorParams) => {
  return new Error(`Flag ${flag} : ${message} : ${description}`);
};

const grabFlag = <T, C extends FlagConfig<T>>({
  config,
  description,
  flag,
  prepareValue,
  validateValue,
}: Flag<T, C>): GrabFlagReturnType<T, C> => {
  const { options } = config;
  const flagIndex = process.argv.indexOf(flag);
  const valueIndex = flagIndex + 1;

  if (flagIndex < 0) {
    if (config.type === 'required') {
      throw getFlagError({
        flag,
        message: 'flag not specified and is required',
        description,
      });
    }
    if (config.type === 'default' && config.defaultValue !== undefined) {
      return config.defaultValue;
    }
    return undefined as GrabFlagReturnType<T, C>;
  }

  if (flagIndex !== process.argv.lastIndexOf(flag))
    throw getFlagError({
      flag,
      message: 'flag specified multiple times',
      description,
    });

  if (valueIndex >= process.argv.length)
    throw getFlagError({
      flag,
      message: 'flag specified but value not found',
      description,
    });

  const flagValue = process.argv[valueIndex].trim();
  const noValue = flagValue.startsWith('--');
  if (noValue) {
    throw getFlagError({
      flag,
      message: 'flag specified but value not specified',
      description,
    });
  }

  const value = prepareValue(flagValue);
  if (options !== undefined && !options.includes(value)) {
    throw getFlagError({
      flag,
      message: 'flag specified but value not valid',
      description,
    });
  }
  if (validateValue) {
    validateValue(value);
  }
  return value;
};

export const grabStringFlag = <T, C extends FlagConfig<T>>(
  params: GrabFlagParams<T, C>,
): GrabFlagReturnType<T, C> =>
  grabFlag<T, C>({
    ...params,
    prepareValue: (value: string) => value as T,
  });

export const grabNumericFlag = <T, C extends FlagConfig<T>>(
  params: GrabFlagParams<T, C>,
): GrabFlagReturnType<T, C> =>
  grabFlag<T, C>({
    ...params,
    prepareValue: (flagValue: string) => {
      if (Number.isNaN(flagValue)) {
        const { flag, description } = params;
        throw getFlagError({
          flag,
          message: 'flag specified but value not a number',
          description,
        });
      }
      return Number.parseInt(flagValue) as T;
    },
  });

export const grabRangedNumericFlag = <T, C extends FlagConfig<T>>(
  params: GrabFlagParams<T, C>,
): GrabFlagReturnType<T, C> =>
  grabFlag<T, C>({
    ...params,
    prepareValue: (flagValue: string) => {
      if (Number.isNaN(flagValue)) {
        const { flag, description } = params;
        throw getFlagError({
          flag,
          message: 'flag specified but value not a number',
          description,
        });
      }
      return Number.parseInt(flagValue) as T;
    },
    validateValue: (value: T) => {
      const { flag, description } = params;
      if (typeof value === 'number') {
        if (params.config.max !== undefined && value > params.config.max)
          throw getFlagError({
            flag,
            message: `flag specified but value is greater than max (${params.config.max})`,
            description,
          });
        if (params.config.min !== undefined && value < params.config.min)
          throw getFlagError({
            flag,
            message: `flag specified but value is lower than min (${params.config.min})`,
            description,
          });
      }
      return true;
    },
  });

export const grabRangedNumericSeriesFlag = <
  T extends number[],
  C extends FlagConfig<T>,
>(
  params: GrabFlagParams<T, C>,
): GrabFlagReturnType<T, C> =>
  grabFlag<T, C>({
    ...params,
    prepareValue: (flagValue: string) => {
      const { flag, description } = params;
      const parts = flagValue.split(',');
      if (parts.length % 2 !== 0) {
        throw getFlagError({
          flag,
          message: 'flag specified but value is not a csv of even length',
          description,
        });
      }
      if (parts.some((part) => Number.isNaN(part))) {
        throw getFlagError({
          flag,
          message:
            'flag specified but not all of the csv elements are a number',
          description,
        });
      }
      return parts.map((part) => Number.parseInt(part)) as T;
    },
    validateValue: (value: T) => {
      const { flag, description } = params;
      if (Array.isArray(value) && typeof value[0] === 'number') {
        value.forEach((current) => {
          if (params.config.max !== undefined && current > params.config.max)
            throw getFlagError({
              flag,
              message: `flag specified but not all csv values are less than or equal to max (${params.config.max})`,
              description,
            });
          if (params.config.min !== undefined && current < params.config.min)
            throw getFlagError({
              flag,
              message: `flag specified but not all csv values are greater than or equal to min (${params.config.min})`,
              description,
            });
        });
      }
      return true;
    },
  });
