import './globals.css';
import WalletProviderContextContainer from '@/contexts/walletProviderContext';
import UserContextContainer from '@/contexts/userContext';
import ToastContextContainer from '@/contexts/toastContext';
import BottomNavigation from '@/components/organisms/BottomNavigation';
import TopNavigation from '@/components/organisms/TopNavigation';
import Sidebar from '@/components/organisms/Sidebar';

export const metadata = {
  title: 'Mintflick',
  description: 'Next-gen socialmedia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className='font-Gilroy scrollbar-none'>
      <body>
        <WalletProviderContextContainer>
          <UserContextContainer>
            <ToastContextContainer>
              <TopNavigation />
              <div className='flex justify-center h-full mx-auto w-fit'>
                <Sidebar />
                {children}
              </div>
              <BottomNavigation />
            </ToastContextContainer>
          </UserContextContainer>
        </WalletProviderContextContainer>
      </body>
    </html>
  );
}
