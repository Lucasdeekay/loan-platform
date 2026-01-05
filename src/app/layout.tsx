import "./globals.css";

export const metadata = {
  title: "Loan Platform",
  description: "A platform to manage and track loans efficiently.",
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
