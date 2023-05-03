import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
