import useGlobalState from '@hook/globalState';
import accessFactory from '@/access';
import type { PropsWithChildren } from 'react';
import { useMemo } from 'react';
import { AccessContext } from '@hook/useAccess';

function AccessProvider({ children }: PropsWithChildren) {
  const { initialState } = useGlobalState();
  const access = useMemo(() => accessFactory(initialState), [initialState]);

  return <AccessContext.Provider value={access}>{children}</AccessContext.Provider>;
}

export default AccessProvider;
