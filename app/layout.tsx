import ToastContainer from "@/components/molecules/ToastContainer";

import "./globals.css";
import WalletProviderContextContainer from "@/contexts/walletProviderContext";
import UserContextContainer from "@/contexts/userContext";
import ToastContextContainer from "@/contexts/toastContext";

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
    <html lang="en">
      <WalletProviderContextContainer>
        <UserContextContainer>
          <ToastContextContainer>
            <body>{children}</body>
          </ToastContextContainer>
        </UserContextContainer>
      </WalletProviderContextContainer>
    </html>
  );
}
