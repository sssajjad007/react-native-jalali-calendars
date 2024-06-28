import React, {createContext, PropsWithChildren, useMemo} from 'react';
import dayjs, {ConfigType} from 'dayjs';
import {createRequiredContextValueHook} from '@utils/react-hooks';
import {jalaliMonths} from '@utils/persian';

type DayjsLocale = string | ILocale;
export type Locale = DayjsLocale;

type LocaleVal = {
  localedDayjs: (config?: ConfigType) => dayjs.Dayjs;
  weekDays: string[];
  months: string[];
  weekStart: number;
};

const LocaleContext = createContext<LocaleVal | undefined>(undefined);

type LocaleProviderProps = PropsWithChildren<{
  locale: Locale | undefined;
}>;

const LocaleProvider = ({locale, children}: LocaleProviderProps) => {
  const localedDayjs = useMemo<(config?: ConfigType) => dayjs.Dayjs>(() => {
    return locale !== undefined
      ? (config?: ConfigType) => dayjs(config).locale(locale)
      : dayjs;
  }, [locale]);
  const result = useMemo<LocaleVal>(() => {
    const localeData = localedDayjs().localeData();
    return {
      localedDayjs,
      months: locale === 'fa' ? jalaliMonths : localeData.months(),
      weekDays: localeData.weekdaysMin(),
      weekStart: localeData.firstDayOfWeek(),
    };
  }, [locale, localedDayjs]);

  return <LocaleContext.Provider value={result} children={children} />;
};

export default LocaleProvider;

export const useLocale = createRequiredContextValueHook(
  LocaleContext,
  'useLocale',
  'LocaleProvider',
);

export const useLocaledDayjs = () => {
  return useLocale().localedDayjs;
};

export type LDayjs = ReturnType<typeof useLocaledDayjs>;
