import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/pages/HomePage';
import { CartDrawer } from '@/components/cart/CartDrawer';

export default function App() {
  return (
    <Layout>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a0d10',
            color: '#fff8f0',
            border: '1px solid #f97316',
            fontFamily: 'DM Sans, system-ui, sans-serif',
          },
          success: {
            iconTheme: { primary: '#f97316', secondary: '#fff8f0' },
          },
        }}
      />
      <CartDrawer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Layout>
  );
}
