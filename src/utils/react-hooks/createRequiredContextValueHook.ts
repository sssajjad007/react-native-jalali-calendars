import {Context, useContext} from 'react';

const createRequiredContextValueHook = <T>(
  context: Context<T>,
  hookName: string,
  providerName: string,
) => {
  return () => {
    const value = useContext(context);
    if (value === undefined) {
      throw new Error(
        `${hookName} must be called from within ${providerName}!`,
      );
    }
    return value;
  };
};

export default createRequiredContextValueHook;
