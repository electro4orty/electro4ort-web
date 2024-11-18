import { Suspense } from 'react';
import AppProvider from './app-provider';

export default function App() {
  return (
    <Suspense>
      <AppProvider />
    </Suspense>
  );
}
