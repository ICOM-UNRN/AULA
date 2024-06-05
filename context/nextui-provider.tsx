'use client';

import { NextUIProvider } from '@nextui-org/react';

export function NextUIProviderContext({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
