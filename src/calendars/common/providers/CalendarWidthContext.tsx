import {createContext} from 'react';
import {createRequiredContextValueHook} from '@utils/react-hooks';

const CalendarWidthContext = createContext<number | undefined>(undefined);

export default CalendarWidthContext;

export const useCalendarWidth = createRequiredContextValueHook(
  CalendarWidthContext,
  'useCalendarWidth',
  'CalendarWidthContext.Provider',
);
