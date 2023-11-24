type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

type Options<T> = IsUnion<T> extends true ? Readonly<T[]> : never;

export type FlagConfig<T> = {
  options?: Options<T>;
  defaultValue?: T;
};

type Flag<T, C extends FlagConfig<T>> = {
  config: C;
  flag: string;
  description: string;
  prepareValue: (value: string) => T;
};

type GetFlagErrorParams = {
  flag: string;
  message: string;
  description: string;
};

const getFlagError = ({ flag, message, description }: GetFlagErrorParams) => {
  return new Error(`Flag ${flag} : ${message} : ${description}`);
};

const grabFlag = <T, C extends FlagConfig<T>>({
  config,
  description,
  flag,
  prepareValue,
}: Flag<T, C>): T => {
  const { defaultValue, options } = config;
  const flagIndex = process.argv.indexOf(flag);
  const valueIndex = flagIndex + 1;

  if (flagIndex < 0) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw getFlagError({
      flag,
      message: 'flag not specified and no default',
      description,
    });
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

  return value;
};

export type GrabFlagParams<T, C extends FlagConfig<T>> = Omit<
  Flag<T, C>,
  'prepareValue'
>;

export const grabStringFlag = <T, C extends FlagConfig<T>>(
  params: GrabFlagParams<T, C>,
): T =>
  grabFlag<T, C>({
    ...params,
    prepareValue: (value: string) => value as T,
  });

export const grabNumericFlag = <T, C extends FlagConfig<T>>(
  params: GrabFlagParams<T, C>,
): T =>
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