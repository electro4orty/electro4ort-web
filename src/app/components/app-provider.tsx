import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from '../config/router';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider } from '@/components/ui/sidebar';

const queryClient = new QueryClient();

export default function AppProvider() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          <Toaster />
          <RouterProvider
            router={router}
            future={{
              v7_startTransition: true,
            }}
          />
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
