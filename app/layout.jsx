import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import Providers from '@/context/Provider';
import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Quizonnet',
  description: 'Search and access past question',
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Providers>
          <div className="light">
            <div className="gradient" />
          </div>
          <main className="app">
            <Toaster />
            <Nav />
            {children}
            <Footer />
          </main>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
