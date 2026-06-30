import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import Layout from './components/Layout';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppProvider';

function App() {
  return (
    <AppProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Toaster position="bottom-center" toastOptions={{ className: 'font-sans' }} />
        <Layout>
          <div className="App">
            <AppRouter />
          </div>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}
export default App;
