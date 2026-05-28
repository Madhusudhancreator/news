import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ReactNode } from 'react';

interface HomeLayoutProps {
  children: ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="pb-16 sm:pb-0">{children}</main>
      <Footer />
    </>
  );
};

export default HomeLayout;
