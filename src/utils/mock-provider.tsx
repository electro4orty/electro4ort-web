import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

export default function MockProvider({ children }: React.PropsWithChildren) {
  return (
    <MemoryRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <QueryClientProvider client={new QueryClient()}>
        {children}
      </QueryClientProvider>
    </MemoryRouter>
  );
}
