import React from 'react';
import { Toaster } from 'react-hot-toast';
import { SortingVisualizer } from './components/SortingVisualizer';

function App() {
  return (
    <>
      <SortingVisualizer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
          },
          success: {
            duration: 2000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 3000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}

export default App;