import {createContext, useContext} from 'react';
import type {DotData} from '../providers/MarkedDaysProvider';

const DotsContext = createContext<ReadonlyArray<DotData>>([]);

export default DotsContext;

export const useDots = () => useContext(DotsContext);
