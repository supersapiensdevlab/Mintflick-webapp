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
    <html lang="en" className="scroll-smooth">
      <WalletProviderContextContainer>
        <UserContextContainer>
          <ToastContextContainer>
            <TopNavigation />
            <body>{children}</body>
            <BottomNavigation active={1} />
          </ToastContextContainer>
        </UserContextContainer>
      </WalletProviderContextContainer>
    </html>
  );
}
