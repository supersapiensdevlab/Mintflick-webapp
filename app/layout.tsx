import "./globals.css";
import WalletProviderContextContainer from "@/contexts/walletProviderContext";
import UserContextContainer from "@/contexts/userContext";
import ToastContextContainer from "@/contexts/toastContext";
import BottomNavigation from "@/components/organisms/BottomNavigation";
import TopNavigation from "@/components/organisms/TopNavigation";

export const metadata = {
  title: "Mintflick",
  description: "Next-gen socialmedia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="font-Gilroy scrollbar-none">
      <body>
        <WalletProviderContextContainer>
          <UserContextContainer>
            <ToastContextContainer>
              <TopNavigation />
              {children} <BottomNavigation />
            </ToastContextContainer>
          </UserContextContainer>
        </WalletProviderContextContainer>
      </body>
    </html>
  );
}
