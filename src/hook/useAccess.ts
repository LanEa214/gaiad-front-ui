import { useContext } from 'react';

import type accessFactory from '@/access';
import { createContext } from 'react';

type ContextType = ReturnType<typeof accessFactory>;

export const AccessContext = createContext<ContextType | null>(null);

export default function useAccess() {
  const access = useContext(AccessContext);
  return access;
}
