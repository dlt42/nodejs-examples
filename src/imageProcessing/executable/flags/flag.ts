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

const getFlagError = ({ flag, message, description }: GetFlagErrorParams) => {
  return new Error(`Flag ${flag} : ${message} : ${description}`);
};

type ReturnType<T, C extends FlagConfig<T>> = C extends Required<T> | Default<T>
  ? T
  : T | undefined;

const grabFlag = <T, C extends FlagConfig<T>>({
  config,
  description,
  flag,
  prepareValue,
  validateValue,
}: Flag<T, C>): ReturnType<T, C> => {
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
    return undefined as ReturnType<T, C>;
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

export type GrabFlagParams<T, C extends FlagConfig<T>> = Omit<
  Flag<T, C>,
  'prepareValue' | 'validateValue'
>;

export const grabStringFlag = <T, C extends FlagConfig<T>>(
  params: GrabFlagParams<T, C>,
): ReturnType<T, C> =>
  grabFlag<T, C>({
    ...params,
    prepareValue: (value: string) => value as T,
  });

export const grabNumericFlag = <T, C extends FlagConfig<T>>(
  params: GrabFlagParams<T, C>,
): ReturnType<T, C> =>
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
): ReturnType<T, C> =>
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
            message: 'flag specified but value is greater than max',
            description,
          });
        if (params.config.min !== undefined && value < params.config.min)
          throw getFlagError({
            flag,
            message: 'flag specified but value is lesser than min',
            description,
          });
      }
      return true;
    },
  });
