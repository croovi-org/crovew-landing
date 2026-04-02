import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "CroVew",
  description: "CroVew landing page",
  icons: {
    icon: [{ url: "/assets/crovew-logo-cropped.png", type: "image/png" }],
    shortcut: ["/assets/crovew-logo-cropped.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
