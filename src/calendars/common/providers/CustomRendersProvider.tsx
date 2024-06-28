import React, {createContext, memo, PropsWithChildren} from 'react';
import {useMemoObject} from '@rozhkov/react-useful-hooks';
import {createRequiredContextValueHook} from '@utils/react-hooks';
import type {FDay} from '@utils/day';

export type RenderDay = (data: {
  isSecondary: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isToday: boolean;
  day: FDay;
  onPress: () => void;
}) => React.ReactNode;

export type RenderMonthHeaderTitle = (data: {
  title: string;
  year: number;
  month: number;
}) => React.ReactNode;

type CustomRendersVal = {
  renderDay: RenderDay | undefined;
  renderMonthHeaderTitle: RenderMonthHeaderTitle | undefined;
};

const CustomRendersContext = createContext<CustomRendersVal | undefined>(
  undefined,
);

type CustomRendersProviderProps = PropsWithChildren<{
  renderDay: RenderDay | undefined;
  renderMonthHeaderTitle: RenderMonthHeaderTitle | undefined;
}>;

const CustomRendersProvider = (props: CustomRendersProviderProps) => {
  const {renderMonthHeaderTitle, renderDay, children} = props;

  const result = useMemoObject<CustomRendersVal>({
    renderDay,
    renderMonthHeaderTitle,
  });

  return <CustomRendersContext.Provider value={result} children={children} />;
};

export default memo(CustomRendersProvider);

export const useCustomRenders = createRequiredContextValueHook(
  CustomRendersContext,
  'useCustomRenders',
  'CustomRendersProvider',
);
