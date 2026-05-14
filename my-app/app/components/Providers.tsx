'use client';

import { SettingsProvider } from '@/app/context/SettingsContext';
import { BreadcrumbProvider } from '@/app/context/BreadCrumbContext';
import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <BreadcrumbProvider>
        {children}
      </BreadcrumbProvider>
    </SettingsProvider>
  );
}