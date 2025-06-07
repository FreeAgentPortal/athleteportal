'use client';
import React, { useState } from 'react';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useInterfaceStore } from '@/state/interface';
import { default as themeOverride } from "@/styles/theme.json";
import { ConfigProvider } from 'antd';

function ReactQueryProvider({ children }: React.PropsWithChildren) {
  const { addAlert } = useInterfaceStore.getState();
  const [client] = useState(
    new QueryClient({
      queryCache: new QueryCache({
        onError: (error) => {
          console.log(error);
          addAlert({
            type: 'info',
            message: error instanceof Error ? error.message : 'An unknown error occurred',
            duration: 5000,
          });
        },
      }),
    })
  );

  return (
    <QueryClientProvider client={client}>
      <ConfigProvider theme={{ ...themeOverride }}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default ReactQueryProvider;
